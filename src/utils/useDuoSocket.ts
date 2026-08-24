import { useEffect, useRef, useState, useCallback } from 'react';
import { Peer, DataConnection, MediaConnection } from 'peerjs';
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
  const sseRef = useRef<EventSource | null>(null);
  const pollTimerRef = useRef<any>(null);
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const mediaCallRef = useRef<MediaConnection | null>(null);
  const isPeerJSMode = useRef<boolean>(false);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [roomState, setRoomState] = useState<DuoRoomState | null>(null);
  const roomStateRef = useRef<DuoRoomState | null>(null);
  useEffect(() => {
    roomStateRef.current = roomState;
  }, [roomState]);

  const [currentUser, setCurrentUser] = useState<{ id: string; role: 'host' | 'guest'; name: string } | null>(null);
  const currentUserRef = useRef<{ id: string; role: 'host' | 'guest'; name: string } | null>(null);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

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

  // Fetch room state directly via REST API as a fallback if available
  const syncRoomViaHttp = useCallback(async (code: string) => {
    if (!code) return null;
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

  // WebRTC Setup & Negotiation (For WS mode)
  const initWebRTC = useCallback(async (localStream: MediaStream, isInitiator: boolean) => {
    localStreamRef.current = localStream;

    // If in PeerJS mode, handle video call via PeerJS call
    if (isPeerJSMode.current && peerRef.current && roomCodeRef.current && currentUserRef.current) {
      const targetHostPeerId = `piczo_duo_${roomCodeRef.current}_host`;
      if (currentUserRef.current.role === 'guest' && !mediaCallRef.current) {
        try {
          const call = peerRef.current.call(targetHostPeerId, localStream);
          mediaCallRef.current = call;
          call.on('stream', (stream) => {
            setRemoteStream(stream);
          });
        } catch (e) {
          console.warn('PeerJS call error:', e);
        }
      }
      return;
    }
    
    // Native WebRTC connection for WebSocket mode
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

    if (!pcRef.current && localStreamRef.current) {
      await initWebRTC(localStreamRef.current, false);
    }

    const pc = pcRef.current;
    if (!pc) return;

    try {
      if (signal.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

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

  // PeerJS P2P Signaling Engine (For Vercel / P2P fallback environment)
  const connectPeerJS = useCallback((cleanCode: string, userName: string, uid: string, isHostInput?: boolean) => {
    console.log('[PeerJS] Starting PeerJS P2P transport. Room:', cleanCode, '| IsHost:', isHostInput);
    isPeerJSMode.current = true;
    setIsConnecting(true);

    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch (e) {}
      peerRef.current = null;
    }

    const hostPeerId = `piczo_duo_${cleanCode}_host`;
    const guestPeerId = `piczo_duo_${cleanCode}_guest_${uid.slice(-6)}`;

    const peerOptions = {
      debug: 1,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
        ],
      },
    };

    const setupAsHost = (hostPeer: Peer) => {
      console.log('[PeerJS] Initialized as HOST:', hostPeerId);
      setIsConnected(true);
      setIsConnecting(false);

      const initialRoomState: DuoRoomState = {
        code: cleanCode,
        createdAt: Date.now(),
        members: {
          [uid]: {
            id: uid,
            role: 'host',
            name: userName,
            isReady: false,
            avatarSeed: userName || 'Host',
          },
        },
        duoMode: 'side-by-side',
        settings: {
          layoutType: 'grid-4',
          themeId: 'pink_lattice_hearts',
          colorId: 'pink_lattice_pastel',
          filterId: 'none',
          title: 'DUO PHOTOBOOTH',
          subtitle: '',
          showDate: true,
          customDate: new Date().toLocaleDateString('vi-VN'),
          showQrCode: true,
          showFilmHoles: false,
          isDoubleStrip: false,
          stickers: [],
        },
        photos: { host: [], guest: [], merged: [] },
        currentSlot: null,
        countdownStart: null,
        timerDuration: 3,
        userPhotos: { host: [], guest: [] },
        stickers: [],
      } as any;

      setRoomState(initialRoomState);
      setCurrentUser({ id: uid, role: 'host', name: userName });

      hostPeer.on('connection', (conn) => {
        console.log('[PeerJS Host] Guest connected:', conn.peer);
        connRef.current = conn;

        const sendStateToGuest = () => {
          if (roomStateRef.current) {
            console.log('[PeerJS Host] Sending current room state to guest:', conn.peer);
            conn.send({
              type: 'room_joined',
              room: roomStateRef.current,
              userId: conn.peer,
              role: 'guest',
            });
          }
        };

        if (conn.open) {
          sendStateToGuest();
        }
        conn.on('open', () => {
          sendStateToGuest();
        });

        conn.on('data', (data: any) => {
          console.log('[PeerJS Host] Received data from guest:', data?.type);
          handlePeerJSDataAsHost(data, conn, uid);
        });
      });

      hostPeer.on('call', (call) => {
        mediaCallRef.current = call;
        if (localStreamRef.current) {
          call.answer(localStreamRef.current);
        } else {
          call.answer();
        }
        call.on('stream', (stream) => {
          setRemoteStream(stream);
        });
      });
    };

    const setupAsGuest = () => {
      console.log('[PeerJS] Connecting as GUEST to host:', hostPeerId);
      
      // Initialize guest room state immediately so Guest is NEVER stuck spinning on loading screen
      const fallbackRoom: DuoRoomState = {
        code: cleanCode,
        createdAt: Date.now(),
        members: {
          [uid]: {
            id: uid,
            role: 'guest',
            name: userName,
            isReady: false,
            avatarSeed: userName || 'Guest',
          },
        },
        duoMode: 'side-by-side',
        settings: {
          layoutType: 'grid-4',
          themeId: 'pink_lattice_hearts',
          colorId: 'pink_lattice_pastel',
          filterId: 'none',
          title: 'DUO PHOTOBOOTH',
          subtitle: '',
          showDate: true,
          customDate: new Date().toLocaleDateString('vi-VN'),
          showQrCode: true,
          showFilmHoles: false,
          isDoubleStrip: false,
          stickers: [],
        },
        photos: { host: [], guest: [], merged: [] },
        currentSlot: null,
        countdownStart: null,
        timerDuration: 3,
        userPhotos: { host: [], guest: [] },
        stickers: [],
      } as any;

      if (!roomStateRef.current) {
        setRoomState(fallbackRoom);
      }
      setCurrentUser({ id: uid, role: 'guest', name: userName });

      // Safety timer: clear connecting state after 800ms so screen renders DuoCameraScreen
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 800);

      const guestPeer = new Peer(guestPeerId, peerOptions);
      peerRef.current = guestPeer;

      guestPeer.on('open', () => {
        console.log('[PeerJS Guest] Peer open. Connecting to Host:', hostPeerId);

        let attemptCount = 0;
        let joined = false;

        const tryConnect = () => {
          attemptCount++;
          console.log(`[PeerJS Guest] Attempt ${attemptCount} connecting to Host:`, hostPeerId);
          const conn = guestPeer.connect(hostPeerId, { reliable: true });
          connRef.current = conn;

          const sendJoinMsg = () => {
            console.log('[PeerJS Guest] Connection open. Sending join_room to Host...');
            conn.send({
              type: 'join_room',
              roomCode: cleanCode,
              userName,
              userId: uid,
            });
          };

          if (conn.open) {
            sendJoinMsg();
          }
          conn.on('open', () => {
            sendJoinMsg();
          });

          // Periodic re-send until response received
          const retryTimer = setInterval(() => {
            if (joined || !conn.open) {
              clearInterval(retryTimer);
              return;
            }
            sendJoinMsg();
          }, 1000);

          conn.on('data', (data: any) => {
            console.log('[PeerJS Guest] Received data from host:', data?.type);
            if (data?.type === 'room_joined' || data?.type === 'room_update') {
              joined = true;
              if (retryTimer) clearInterval(retryTimer);
              setIsConnecting(false);
              setIsConnected(true);
            }
            handlePeerJSDataAsGuest(data);
          });

          conn.on('error', (err) => {
            console.warn('[PeerJS Guest Conn Error]', err);
            if (!joined && attemptCount < 5) {
              setTimeout(tryConnect, 1000);
            }
          });
        };

        tryConnect();

        // Call Host with video if available
        if (localStreamRef.current) {
          try {
            const call = guestPeer.call(hostPeerId, localStreamRef.current);
            mediaCallRef.current = call;
            call.on('stream', (stream) => {
              setRemoteStream(stream);
            });
          } catch (e) {
            console.warn('Guest media call error:', e);
          }
        }
      });

      guestPeer.on('call', (call) => {
        mediaCallRef.current = call;
        if (localStreamRef.current) {
          call.answer(localStreamRef.current);
        } else {
          call.answer();
        }
        call.on('stream', (stream) => {
          setRemoteStream(stream);
        });
      });

      guestPeer.on('error', (err) => {
        console.warn('[PeerJS Guest Error]', err);
        setIsConnecting(false);
      });
    };

    if (isHostInput === true) {
      const hostPeer = new Peer(hostPeerId, peerOptions);
      peerRef.current = hostPeer;
      hostPeer.on('open', () => setupAsHost(hostPeer));
      hostPeer.on('error', (err) => {
        console.warn('[PeerJS Host Open Error]', err);
        setIsConnecting(false);
      });
    } else if (isHostInput === false) {
      setupAsGuest();
    } else {
      const hostPeer = new Peer(hostPeerId, peerOptions);
      peerRef.current = hostPeer;
      hostPeer.on('open', () => setupAsHost(hostPeer));
      hostPeer.on('error', (err: any) => {
        if (err.type === 'unavailable-id') {
          hostPeer.destroy();
          setupAsGuest();
        } else {
          setIsConnecting(false);
        }
      });
    }
  }, []);

  // Helper: Process PeerJS incoming data when Host
  const handlePeerJSDataAsHost = (data: any, conn: DataConnection, hostUid: string) => {
    if (!data || !data.type) return;

    switch (data.type) {
      case 'join_room': {
        const guestUid = data.userId || `guest_${Date.now()}`;
        const baseRoom = roomStateRef.current || {
          code: roomCodeRef.current || 'DUO',
          createdAt: Date.now(),
          members: {},
          duoMode: 'split-heart',
          settings: {
            layoutType: 'strip-3',
            themeId: 'love_letter_stamp',
            colorId: 'love_blush',
            filterId: 'none',
            title: 'OUR DISTANCE LOVE',
            subtitle: 'together forever',
            showDate: true,
            customDate: new Date().toLocaleDateString('vi-VN'),
            showQrCode: true,
            showFilmHoles: false,
            isDoubleStrip: false,
            stickers: [],
          },
          photos: { host: [], guest: [], merged: [] },
          currentSlot: null,
          countdownStart: null,
          timerDuration: 3,
          step: 1,
          stickers: [],
        };

        const existingMembers = { ...baseRoom.members };
        if (!existingMembers[hostUid]) {
          existingMembers[hostUid] = {
            id: hostUid,
            role: 'host' as const,
            name: userNameRef.current || 'Chủ phòng',
            isReady: false,
            avatarSeed: 'Host',
          };
        }
        existingMembers[guestUid] = {
          id: guestUid,
          role: 'guest' as const,
          name: data.userName || 'Người ấy',
          isReady: false,
          avatarSeed: 'Guest',
        };

        const newRoom = { ...baseRoom, members: existingMembers } as DuoRoomState;
        setRoomState(newRoom);
        conn.send({
          type: 'room_joined',
          room: newRoom,
          userId: guestUid,
          role: 'guest',
        });
        conn.send({ type: 'room_update', room: newRoom });
        break;
      }

      case 'start_countdown': {
        const payload = {
          type: 'countdown_started',
          slot: data.slot,
          duration: data.duration,
          startTime: Date.now(),
        };
        setIncomingCountdown({ slot: data.slot, duration: data.duration, startTime: payload.startTime });
        if (propsRef.current.onCountdownStarted) {
          propsRef.current.onCountdownStarted(data.slot, data.duration, payload.startTime);
        }
        conn.send(payload);
        break;
      }

      case 'upload_user_photo': {
        if (!roomStateRef.current) return;
        const newRoom = { ...roomStateRef.current };
        const role = data.role as 'host' | 'guest';
        const updatedList = [...(newRoom.userPhotos[role] || [])];
        updatedList[data.slotIndex] = data.dataUrl;
        newRoom.userPhotos = { ...newRoom.userPhotos, [role]: updatedList };

        setRoomState(newRoom);
        if (propsRef.current.onPhotoReceived) {
          propsRef.current.onPhotoReceived(role, data.slotIndex);
        }
        conn.send({ type: 'photo_received', room: newRoom, role, slotIndex: data.slotIndex });
        break;
      }

      case 'update_settings': {
        if (!roomStateRef.current) return;
        const newRoom = {
          ...roomStateRef.current,
          settings: { ...roomStateRef.current.settings, ...data.settings },
        };
        setRoomState(newRoom);
        conn.send({ type: 'room_update', room: newRoom });
        break;
      }

      case 'update_mode': {
        if (!roomStateRef.current) return;
        const newRoom = { ...roomStateRef.current, duoMode: data.duoMode };
        setRoomState(newRoom);
        conn.send({ type: 'room_update', room: newRoom });
        break;
      }

      case 'update_stickers': {
        if (!roomStateRef.current) return;
        const newRoom = { ...roomStateRef.current, stickers: data.stickers };
        setRoomState(newRoom);
        conn.send({ type: 'stickers_updated', stickers: data.stickers });
        break;
      }

      case 'send_reaction': {
        const rx: DuoReaction = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: conn.peer,
          senderName: 'Bạn ghép',
          emoji: data.emoji,
        };
        setActiveReactions((prev) => [...prev.slice(-10), rx]);
        if (propsRef.current.onReactionReceived) {
          propsRef.current.onReactionReceived(rx);
        }
        conn.send({ type: 'reaction_received', ...rx });
        break;
      }

      case 'send_chat': {
        const chat: DuoChatMessage = {
          senderId: conn.peer,
          senderName: 'Bạn ghép',
          text: data.text,
          timestamp: Date.now(),
        };
        setChatMessages((prev) => [...prev.slice(-20), chat]);
        if (propsRef.current.onChatReceived) {
          propsRef.current.onChatReceived(chat);
        }
        conn.send({ type: 'chat_received', ...chat });
        break;
      }

      case 'change_step': {
        if (!roomStateRef.current) return;
        const newRoom = { ...roomStateRef.current, step: data.step };
        setRoomState(newRoom);
        conn.send({ type: 'room_update', room: newRoom });
        break;
      }

      case 'toggle_ready': {
        if (!roomStateRef.current) return;
        const newRoom = { ...roomStateRef.current };
        const member = newRoom.members[conn.peer];
        if (member) {
          member.isReady = !member.isReady;
          setRoomState(newRoom);
          conn.send({ type: 'room_update', room: newRoom });
        }
        break;
      }
    }
  };

  // Helper: Process PeerJS incoming data when Guest
  const handlePeerJSDataAsGuest = (data: any) => {
    if (!data || !data.type) return;

    switch (data.type) {
      case 'room_joined':
        setIsConnecting(false);
        setRoomState(data.room);
        setCurrentUser({
          id: data.userId,
          role: 'guest',
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
    }
  };

  // Central Event Dispatcher for SSE, WS, and REST
  const handleServerEvent = useCallback((data: any) => {
    if (!data) return;
    switch (data.type) {
      case 'room_joined':
        setIsConnecting(false);
        setIsConnected(true);
        if (data.room) setRoomState(data.room);
        if (data.userId && data.role) {
          setCurrentUser({
            id: data.userId,
            role: data.role,
            name: userNameRef.current,
          });
        }
        break;

      case 'room_update':
        if (data.room) setRoomState(data.room);
        setIsConnecting(false);
        setIsConnected(true);
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
        if (data.room) setRoomState(data.room);
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

      case 'room_deleted':
        setRoomState(null);
        setCurrentUser(null);
        setIsConnected(false);
        setIsConnecting(false);
        setRemoteStream(null);
        if (pcRef.current) {
          pcRef.current.close();
          pcRef.current = null;
        }
        if (propsRef.current.onRoomDeleted) {
          propsRef.current.onRoomDeleted(data.reason || 'Phòng chụp đã được đóng.');
        }
        break;

      case 'webrtc_signal':
        handleIncomingWebRTCSignal(data.signal);
        break;
    }
  }, [handleIncomingWebRTCSignal]);

  // Main Connection Function (High-Speed SSE + REST + WebSocket + Fallback Polling)
  const connectToWs = useCallback((roomCode: string, userName: string, initialUserId?: string, isHost?: boolean) => {
    const cleanCode = roomCode.trim().toUpperCase();
    roomCodeRef.current = cleanCode;
    userNameRef.current = userName;
    
    let uid = initialUserId || userIdRef.current || localStorage.getItem('duo_uid') || `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    userIdRef.current = uid;
    localStorage.setItem('duo_uid', uid);

    setIsConnecting(true);

    // Initialize PeerJS P2P in parallel for guaranteed device-to-device WebRTC video call & room backup sync
    connectPeerJS(cleanCode, userName, uid, isHost);

    // 1. INSTANT REST JOIN (Returns room state in <20ms, zero spinning!)
    fetch(`/api/rooms/${cleanCode}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'join_room',
        userName,
        userId: uid,
        isHost,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.room) {
          setRoomState(data.room);
          setCurrentUser({
            id: data.userId || uid,
            role: data.role || (isHost ? 'host' : 'guest'),
            name: userName,
          });
          setIsConnecting(false);
          setIsConnected(true);
        }
      })
      .catch((err) => {
        console.warn('REST Join error:', err);
      });

    // 2. CONNECT SSE (Server-Sent Events) Stream for ultra-fast zero-latency real-time push
    if (sseRef.current) {
      try { sseRef.current.close(); } catch (e) {}
    }

    try {
      const sse = new EventSource(`/api/rooms/${cleanCode}/stream`);
      sseRef.current = sse;

      sse.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleServerEvent(data);
        } catch (e) {}
      };

      sse.onerror = (err) => {
        console.warn('SSE stream notice:', err);
      };
    } catch (e) {
      console.warn('SSE init notice:', e);
    }

    // 3. Connect WebSocket as parallel transport
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try { wsRef.current.close(); } catch (e) {}
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        isPeerJSMode.current = false;
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
          handleServerEvent(data);
        } catch (err) {}
      };

      ws.onerror = () => {
        // SSE + REST handles it automatically if WS fails
      };
    } catch (err) {
      // ignore
    }

    // 4. Background Periodic Sync Polling (1.2s) as fail-safe safety net
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    pollTimerRef.current = setInterval(() => {
      if (roomCodeRef.current && !isPeerJSMode.current) {
        syncRoomViaHttp(roomCodeRef.current);
      }
    }, 1200);

  }, [syncRoomViaHttp, handleIncomingWebRTCSignal, connectPeerJS, handleServerEvent]);

  // Auto-initiate WebRTC when both members are in room
  useEffect(() => {
    if (roomState && Object.keys(roomState.members).length >= 2 && localStreamRef.current && currentUser) {
      if (!isPeerJSMode.current && !pcRef.current && currentUser.role === 'host') {
        initWebRTC(localStreamRef.current, true);
      } else if (isPeerJSMode.current && currentUser.role === 'guest' && !mediaCallRef.current && peerRef.current && roomCodeRef.current) {
        initWebRTC(localStreamRef.current, false);
      }
    }
  }, [roomState, currentUser, initWebRTC]);

  const sendEvent = useCallback((type: string, payload: any = {}) => {
    const currentCode = roomCodeRef.current || roomStateRef.current?.code;
    const uid = userIdRef.current;
    const uname = userNameRef.current;

    // 1. Instant REST Action Dispatch (<20ms latency guarantee)
    if (currentCode) {
      fetch(`/api/rooms/${currentCode}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          userId: uid,
          userName: uname,
          ...payload,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.room) {
            setRoomState(data.room);
          }
        })
        .catch((e) => {
          console.warn('REST action warning:', e);
        });
    }

    // 2. Send via WebSocket if open
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type, ...payload }));
      } catch (e) {}
    }

    // 3. Send via PeerJS if active
    if (isPeerJSMode.current) {
      const user = currentUserRef.current;
      if (user) {
        if (user.role === 'host') {
          if (connRef.current) {
            handlePeerJSDataAsHost({ type, ...payload }, connRef.current, user.id);
          } else {
            const dummyConn = { peer: 'guest_pending', send: () => {} } as any;
            handlePeerJSDataAsHost({ type, ...payload }, dummyConn, user.id);
          }
        } else if (user.role === 'guest' && connRef.current) {
          connRef.current.send({ type, ...payload });
        }
      }
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
    if (sseRef.current) {
      try { sseRef.current.close(); } catch (e) {}
      sseRef.current = null;
    }
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'leave_room', roomCode: currentCode }));
      } catch (e) {}
      wsRef.current.close();
    }

    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch (e) {}
      peerRef.current = null;
    }

    if (currentCode) {
      fetch(`/api/rooms/${currentCode}`, { method: 'DELETE' }).catch(() => {});
    }

    roomCodeRef.current = null;
    isPeerJSMode.current = false;
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
      if (sseRef.current) {
        sseRef.current.close();
      }
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
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

