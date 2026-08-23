import { useEffect, useRef, useState, useCallback } from 'react';
import { DuoMember, DuoRoomState, PhotoboothSettings, PlacedSticker, DuoReaction, DuoChatMessage, DuoMode } from '../types';

interface UseDuoSocketProps {
  onPhotoReceived?: (role: 'host' | 'guest', slotIndex: number) => void;
  onCountdownStarted?: (slot: number, duration: number, startTime: number) => void;
  onReactionReceived?: (reaction: DuoReaction) => void;
  onChatReceived?: (chat: DuoChatMessage) => void;
  onRoomDeleted?: (reason: string) => void;
}

export function useDuoSocket(props: UseDuoSocketProps = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [roomState, setRoomState] = useState<DuoRoomState | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; role: 'host' | 'guest'; name: string } | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [activeReactions, setActiveReactions] = useState<DuoReaction[]>([]);
  const [chatMessages, setChatMessages] = useState<DuoChatMessage[]>([]);
  const [incomingCountdown, setIncomingCountdown] = useState<{ slot: number; duration: number; startTime: number } | null>(null);

  // Tracking refs for auto-reconnect & stability
  const roomCodeRef = useRef<string | null>(null);
  const userNameRef = useRef<string>('');
  const userIdRef = useRef<string>('');
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);
  const isWebRTCInitiating = useRef<boolean>(false);

  // Sync props in refs to avoid stale callbacks
  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  // Fetch room state directly via REST API as a reliable fallback
  const syncRoomViaHttp = useCallback(async (code: string) => {
    if (!code) return;
    try {
      const res = await fetch(`/api/rooms/${code}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.room) {
          setRoomState(data.room);
          return data.room;
        }
      }
    } catch (e) {
      // ignore network glitch
    }
    return null;
  }, []);

  // WebRTC Setup & Negotiation
  const initWebRTC = useCallback(async (localStream: MediaStream, isInitiator: boolean) => {
    localStreamRef.current = localStream;
    
    // Close existing connection if any
    if (pcRef.current) {
      try {
        pcRef.current.close();
      } catch (e) {}
      pcRef.current = null;
    }

    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
      });
      pcRef.current = pc;

      localStream.getTracks().forEach((track) => {
        try {
          pc.addTrack(track, localStream);
        } catch (e) {}
      });

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'webrtc_signal',
            signal: { candidate: event.candidate },
          }));
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          console.log('WebRTC connection state:', pc.connectionState);
        }
      };

      if (isInitiator && !isWebRTCInitiating.current) {
        isWebRTCInitiating.current = true;
        const offer = await pc.createOffer({
          offerToReceiveAudio: false,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);
        isWebRTCInitiating.current = false;

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'webrtc_signal',
            signal: { sdp: pc.localDescription },
          }));
        }
      }
    } catch (err) {
      console.warn('WebRTC init notice:', err);
      isWebRTCInitiating.current = false;
    }
  }, []);

  const handleIncomingWebRTCSignal = useCallback(async (signal: any) => {
    if (!signal) return;

    // If PC doesn't exist yet and we have a local stream, initialize as receiver
    if (!pcRef.current && localStreamRef.current) {
      await initWebRTC(localStreamRef.current, false);
    }

    const pc = pcRef.current;
    if (!pc) return;

    try {
      if (signal.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

        // Process any queued ICE candidates
        while (iceCandidateQueue.current.length > 0) {
          const candidate = iceCandidateQueue.current.shift();
          if (candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {}
          }
        }

        if (signal.sdp.type === 'offer') {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'webrtc_signal',
              signal: { sdp: pc.localDescription },
            }));
          }
        }
      } else if (signal.candidate) {
        if (pc.remoteDescription && pc.remoteDescription.type) {
          await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        } else {
          iceCandidateQueue.current.push(signal.candidate);
        }
      }
    } catch (err) {
      console.warn('WebRTC signal handling notice:', err);
    }
  }, [initWebRTC]);

  // Main WebSocket Connection Function
  const connectToWs = useCallback((roomCode: string, userName: string, initialUserId?: string) => {
    const cleanCode = roomCode.trim().toUpperCase();
    roomCodeRef.current = cleanCode;
    userNameRef.current = userName;
    
    let uid = initialUserId || userIdRef.current || localStorage.getItem('duo_uid') || `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    userIdRef.current = uid;
    localStorage.setItem('duo_uid', uid);

    setIsConnecting(true);

    // Immediate HTTP sync so UI reflects room instantly
    syncRoomViaHttp(cleanCode);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);

      ws.send(JSON.stringify({
        type: 'join_room',
        roomCode: cleanCode,
        userName,
        userId: uid,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'room_joined':
            setIsConnecting(false);
            setRoomState(data.room);
            setCurrentUser({
              id: data.userId,
              role: data.role,
              name: userNameRef.current,
            });
            break;

          case 'room_update':
            setRoomState(data.room);
            break;

          case 'countdown_started':
            setIncomingCountdown({
              slot: data.slot,
              duration: data.duration,
              startTime: data.startTime,
            });
            if (propsRef.current.onCountdownStarted) {
              propsRef.current.onCountdownStarted(data.slot, data.duration, data.startTime);
            }
            break;

          case 'photo_received':
            if (data.room) {
              setRoomState(data.room);
            }
            if (propsRef.current.onPhotoReceived) {
              propsRef.current.onPhotoReceived(data.role, data.slotIndex);
            }
            break;

          case 'reaction_received': {
            const rx: DuoReaction = {
              id: data.id || `${Date.now()}-${Math.random()}`,
              senderId: data.senderId,
              senderName: data.senderName,
              emoji: data.emoji,
            };
            setActiveReactions((prev) => [...prev.slice(-10), rx]);
            if (propsRef.current.onReactionReceived) {
              propsRef.current.onReactionReceived(rx);
            }
            break;
          }

          case 'chat_received': {
            const chat: DuoChatMessage = {
              senderId: data.senderId,
              senderName: data.senderName,
              text: data.text,
              timestamp: data.timestamp,
            };
            setChatMessages((prev) => [...prev.slice(-20), chat]);
            if (propsRef.current.onChatReceived) {
              propsRef.current.onChatReceived(chat);
            }
            break;
          }

          case 'stickers_updated':
            if (data.stickers) {
              setRoomState((prev) => (prev ? { ...prev, stickers: data.stickers } : null));
            }
            break;

          case 'room_deleted': {
            setRoomState(null);
            setCurrentUser(null);
            setRemoteStream(null);
            if (pcRef.current) {
              pcRef.current.close();
              pcRef.current = null;
            }
            if (propsRef.current.onRoomDeleted) {
              propsRef.current.onRoomDeleted(data.reason || 'Phòng chụp đã được đóng và tự động xoá.');
            }
            break;
          }

          case 'webrtc_signal':
            handleIncomingWebRTCSignal(data.signal);
            break;
        }
      } catch (err) {
        console.error('Error handling WS message:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    ws.onerror = (err) => {
      console.warn('WS connection notice:', err);
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [syncRoomViaHttp, handleIncomingWebRTCSignal]);

  // Background Periodic Polling (Guaranteed state sync every 2.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      if (roomCodeRef.current) {
        syncRoomViaHttp(roomCodeRef.current);
        // If WS dropped, attempt reconnect
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          if (userNameRef.current && roomCodeRef.current) {
            connectToWs(roomCodeRef.current, userNameRef.current, userIdRef.current);
          }
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [syncRoomViaHttp, connectToWs]);

  // Handle Tab Focus & Visibility Change (E.g. user returns from sending link in Messenger/Zalo)
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' && roomCodeRef.current) {
        syncRoomViaHttp(roomCodeRef.current);
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          if (userNameRef.current && roomCodeRef.current) {
            connectToWs(roomCodeRef.current, userNameRef.current, userIdRef.current);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [syncRoomViaHttp, connectToWs]);

  // Auto-initiate WebRTC when both members are in room and localStream is ready
  useEffect(() => {
    if (roomState && Object.keys(roomState.members).length >= 2 && localStreamRef.current && currentUser) {
      if (!pcRef.current && currentUser.role === 'host') {
        initWebRTC(localStreamRef.current, true);
      }
    }
  }, [roomState, currentUser, initWebRTC]);

  const sendEvent = useCallback((type: string, payload: any = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, ...payload }));
    }
  }, []);

  const triggerCountdown = useCallback((slot: number, duration: number = 3) => {
    sendEvent('start_countdown', { slot, duration });
  }, [sendEvent]);

  const uploadPhoto = useCallback((slotIndex: number, dataUrl: string) => {
    if (!currentUser) return;
    sendEvent('upload_user_photo', {
      slotIndex,
      dataUrl,
      role: currentUser.role,
    });
  }, [currentUser, sendEvent]);

  const updateSettings = useCallback((settings: Partial<PhotoboothSettings>) => {
    sendEvent('update_settings', { settings });
  }, [sendEvent]);

  const updateMode = useCallback((duoMode: DuoMode) => {
    sendEvent('update_mode', { duoMode });
  }, [sendEvent]);

  const updateStickers = useCallback((stickers: PlacedSticker[]) => {
    sendEvent('update_stickers', { stickers });
  }, [sendEvent]);

  const sendReaction = useCallback((emoji: string) => {
    sendEvent('send_reaction', { emoji });
  }, [sendEvent]);

  const sendChat = useCallback((text: string) => {
    if (!text.trim()) return;
    sendEvent('send_chat', { text: text.trim() });
  }, [sendEvent]);

  const changeStep = useCallback((step: 1 | 2 | 3) => {
    sendEvent('change_step', { step });
  }, [sendEvent]);

  const toggleReady = useCallback(() => {
    sendEvent('toggle_ready');
  }, [sendEvent]);

  const leaveRoom = useCallback(() => {
    const currentCode = roomCodeRef.current || roomState?.code;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'leave_room', roomCode: currentCode }));
      } catch (e) {}
      wsRef.current.close();
    }

    if (currentCode) {
      fetch(`/api/rooms/${currentCode}`, { method: 'DELETE' }).catch(() => {});
    }

    roomCodeRef.current = null;
    setIsConnecting(false);
    setRoomState(null);
    setCurrentUser(null);
    setRemoteStream(null);
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
  }, [roomState?.code]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    roomState,
    currentUser,
    remoteStream,
    activeReactions,
    chatMessages,
    incomingCountdown,
    connectToWs,
    initWebRTC,
    triggerCountdown,
    uploadPhoto,
    updateSettings,
    updateMode,
    updateStickers,
    sendReaction,
    sendChat,
    changeStep,
    toggleReady,
    leaveRoom,
  };
}
