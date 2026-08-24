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
  const sseRef = useRef<EventSource | null>(null);
  const heartbeatTimerRef = useRef<any>(null);

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

  const [remoteStream] = useState<MediaStream | null>(null);
  const [activeReactions, setActiveReactions] = useState<DuoReaction[]>([]);
  const [chatMessages, setChatMessages] = useState<DuoChatMessage[]>([]);
  const [incomingCountdown, setIncomingCountdown] = useState<{ slot: number; duration: number; startTime: number } | null>(null);

  // Tracking refs for auto-reconnect & stability
  const roomCodeRef = useRef<string | null>(null);
  const userNameRef = useRef<string>('');
  const userIdRef = useRef<string>('');

  // Sync props in refs to avoid stale callbacks
  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  // Central Broadcast Sender over WebSocket + REST Fallback
  const broadcastMsg = useCallback((msgObj: any) => {
    const code = roomCodeRef.current;
    const uid = userIdRef.current;
    const fullPayload = {
      ...msgObj,
      roomCode: code,
      userId: uid,
    };
    const raw = JSON.stringify(fullPayload);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(raw);
      } catch (e) {}
    }

    if (code) {
      fetch(`/api/rooms/${code}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: raw,
      }).catch(() => {});
    }
  }, []);

  // Central Event Processor (Handles WebSocket & SSE & REST events)
  const processServerEvent = useCallback((data: any) => {
    if (!data) return;

    switch (data.type) {
      case 'room_joined':
      case 'room_update':
        if (data.room) {
          setRoomState((prev) => {
            if (!prev) return data.room;
            return {
              ...data.room,
              liveFrames: {
                ...(prev.liveFrames || {}),
                ...(data.room.liveFrames || {}),
              },
            };
          });
          setIsConnecting(false);
          setIsConnected(true);
        }
        break;

      case 'live_frame':
      case 'live_frame_received':
        if (data.role && data.dataUrl) {
          setRoomState((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              liveFrames: {
                ...(prev.liveFrames || {}),
                [data.role]: data.dataUrl,
              },
            } as DuoRoomState;
          });
        }
        break;

      case 'start_countdown':
      case 'countdown_started':
        setIncomingCountdown({
          slot: data.slot,
          duration: data.duration || 3,
          startTime: data.startTime || Date.now(),
        });
        if (propsRef.current.onCountdownStarted) {
          propsRef.current.onCountdownStarted(data.slot, data.duration || 3, data.startTime || Date.now());
        }
        break;

      case 'upload_user_photo':
      case 'photo_received':
        if (data.role && typeof data.slotIndex === 'number' && data.dataUrl) {
          setRoomState((prev) => {
            if (!prev) return prev;
            const updatedPhotos = { ...prev.photos };
            const roleList = [...(updatedPhotos[data.role as 'host' | 'guest'] || [])];
            roleList[data.slotIndex] = data.dataUrl;
            updatedPhotos[data.role as 'host' | 'guest'] = roleList;

            return {
              ...prev,
              photos: updatedPhotos,
            };
          });
          if (propsRef.current.onPhotoReceived) {
            propsRef.current.onPhotoReceived(data.role, data.slotIndex);
          }
        }
        break;

      case 'send_reaction':
      case 'reaction_received': {
        const rx: DuoReaction = {
          id: data.id || `${Date.now()}-${Math.random()}`,
          senderId: data.senderId || data.userId,
          senderName: data.senderName || data.userName,
          emoji: data.emoji,
        };
        setActiveReactions((prev) => [...prev.slice(-10), rx]);
        if (propsRef.current.onReactionReceived) {
          propsRef.current.onReactionReceived(rx);
        }
        break;
      }

      case 'send_chat':
      case 'chat_received': {
        const chat: DuoChatMessage = {
          senderId: data.senderId || data.userId,
          senderName: data.senderName || data.userName,
          text: data.text,
          timestamp: data.timestamp || Date.now(),
        };
        setChatMessages((prev) => [...prev.slice(-20), chat]);
        if (propsRef.current.onChatReceived) {
          propsRef.current.onChatReceived(chat);
        }
        break;
      }

      case 'update_stickers':
      case 'stickers_updated':
        if (data.stickers) {
          setRoomState((prev) => (prev ? { ...prev, stickers: data.stickers } : null));
        }
        break;

      case 'update_settings':
        if (data.settings) {
          setRoomState((prev) =>
            prev
              ? {
                  ...prev,
                  settings: { ...prev.settings, ...data.settings },
                }
              : null
          );
        }
        break;

      case 'update_mode':
        if (data.duoMode) {
          setRoomState((prev) => (prev ? { ...prev, duoMode: data.duoMode } : null));
        }
        break;

      case 'change_step':
        if (data.step) {
          setRoomState((prev) => (prev ? { ...prev, step: data.step } : null));
        }
        break;

      case 'toggle_ready':
        if (data.userId) {
          setRoomState((prev) => {
            if (!prev || !prev.members || !prev.members[data.userId]) return prev;
            const target = prev.members[data.userId];
            return {
              ...prev,
              members: {
                ...prev.members,
                [data.userId]: {
                  ...target,
                  isReady: !target.isReady,
                },
              },
            };
          });
        }
        break;

      case 'room_deleted':
        setRoomState(null);
        setCurrentUser(null);
        setIsConnected(false);
        setIsConnecting(false);
        if (propsRef.current.onRoomDeleted) {
          propsRef.current.onRoomDeleted(data.reason || 'Phòng chụp đã được đóng.');
        }
        break;
    }
  }, []);

  // Main Connection Function (Native WebSocket + SSE + 1s HTTP Poll)
  const connectToWs = useCallback((roomCode: string, userName: string, initialUserId?: string, isHost?: boolean) => {
    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode) return;

    roomCodeRef.current = cleanCode;
    userNameRef.current = userName;

    let uid = initialUserId || userIdRef.current;
    if (!uid) {
      if (isHost === false) {
        uid = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      } else {
        uid = localStorage.getItem('duo_uid') || `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      }
    }
    userIdRef.current = uid;
    if (isHost !== false) {
      localStorage.setItem('duo_uid', uid);
    }

    const role: 'host' | 'guest' = isHost === false ? 'guest' : 'host';

    // 1. Instantly set local user & initial room state
    const meObj: DuoMember = {
      id: uid,
      name: userName,
      role,
      isReady: false,
      avatarSeed: role,
    };

    setCurrentUser({ id: uid, role, name: userName });

    setRoomState((prev) => {
      if (prev && prev.code === cleanCode) {
        return {
          ...prev,
          members: { ...prev.members, [uid]: meObj },
        };
      }
      return {
        code: cleanCode,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        members: { [uid]: meObj },
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
      } as DuoRoomState;
    });

    setIsConnecting(false);
    setIsConnected(true);

    // 2. HTTP REST Join call
    const joinPayload = {
      type: 'join_room',
      roomCode: cleanCode,
      userId: uid,
      userName,
      isHost: role === 'host',
    };

    fetch(`/api/rooms/${cleanCode}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(joinPayload),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.room) {
          processServerEvent({ type: 'room_joined', room: data.room });
        }
      })
      .catch((e) => console.log('REST join error:', e));

    // 3. Connect Native WebSocket (/ws)
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) {}
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        ws.send(JSON.stringify(joinPayload));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          processServerEvent(data);
        } catch (e) {}
      };

      ws.onerror = (err) => {
        console.warn('WebSocket warning:', err);
      };

      ws.onclose = () => {
        setIsConnected(false);
      };
    } catch (e) {
      console.warn('WebSocket init exception:', e);
    }

    // 4. Connect SSE Stream (/api/rooms/:code/stream)
    if (sseRef.current) {
      try { sseRef.current.close(); } catch (e) {}
    }

    try {
      const sse = new EventSource(`/api/rooms/${cleanCode}/stream`);
      sseRef.current = sse;

      sse.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          processServerEvent(data);
        } catch (e) {}
      };
    } catch (e) {}

    // 5. High-Frequency 1s HTTP Polling Fallback
    if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    heartbeatTimerRef.current = setInterval(() => {
      fetch(`/api/rooms/${cleanCode}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && data.room) {
            processServerEvent({ type: 'room_update', room: data.room });
          }
        })
        .catch(() => {});
    }, 1000);

  }, [processServerEvent]);

  // Handler functions
  const triggerCountdown = useCallback((slot: number, duration: number = 3) => {
    broadcastMsg({ type: 'start_countdown', slot, duration, startTime: Date.now() });
  }, [broadcastMsg]);

  const uploadPhoto = useCallback((slotIndex: number, dataUrl: string) => {
    if (!currentUser) return;
    broadcastMsg({
      type: 'upload_user_photo',
      slotIndex,
      dataUrl,
      role: currentUser.role,
    });
  }, [currentUser, broadcastMsg]);

  const updateSettings = useCallback((settings: Partial<PhotoboothSettings>) => {
    broadcastMsg({ type: 'update_settings', settings });
  }, [broadcastMsg]);

  const updateMode = useCallback((duoMode: DuoMode) => {
    broadcastMsg({ type: 'update_mode', duoMode });
  }, [broadcastMsg]);

  const updateStickers = useCallback((stickers: PlacedSticker[]) => {
    broadcastMsg({ type: 'update_stickers', stickers });
  }, [broadcastMsg]);

  const sendReaction = useCallback((emoji: string) => {
    if (!currentUser) return;
    broadcastMsg({
      type: 'send_reaction',
      emoji,
      senderId: currentUser.id,
      senderName: currentUser.name,
    });
  }, [currentUser, broadcastMsg]);

  const sendChat = useCallback((text: string) => {
    if (!text.trim() || !currentUser) return;
    broadcastMsg({
      type: 'send_chat',
      text: text.trim(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: Date.now(),
    });
  }, [currentUser, broadcastMsg]);

  const changeStep = useCallback((step: 1 | 2 | 3) => {
    broadcastMsg({ type: 'change_step', step });
  }, [broadcastMsg]);

  const toggleReady = useCallback(() => {
    if (!currentUser) return;
    broadcastMsg({ type: 'toggle_ready', userId: currentUser.id });
  }, [currentUser, broadcastMsg]);

  const leaveRoom = useCallback(() => {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) {}
      wsRef.current = null;
    }
    if (sseRef.current) {
      try { sseRef.current.close(); } catch (e) {}
      sseRef.current = null;
    }
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }

    roomCodeRef.current = null;
    setIsConnecting(false);
    setRoomState(null);
    setCurrentUser(null);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        try { wsRef.current.close(); } catch (e) {}
      }
      if (sseRef.current) {
        try { sseRef.current.close(); } catch (e) {}
      }
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
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
    initWebRTC: async () => {},
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
