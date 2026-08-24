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
  const sseRef = useRef<EventSource | null>(null);
  const pollTimerRef = useRef<any>(null);

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

  // Fetch room state directly via REST API as a continuous real-time source of truth
  const syncRoomViaHttp = useCallback(async (code: string) => {
    if (!code) return null;
    try {
      const res = await fetch(`/api/rooms/${code}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.room) {
          setRoomState(data.room);

          // Auto-heal membership if current user is missing from server room.members
          const currUser = currentUserRef.current;
          if (currUser && data.room.members && !data.room.members[currUser.id]) {
            fetch(`/api/rooms/${code}/action`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'join_room',
                userName: currUser.name,
                userId: currUser.id,
                isHost: currUser.role === 'host',
              }),
            })
              .then((r) => r.json())
              .then((healData) => {
                if (healData.success && healData.room) {
                  setRoomState(healData.room);
                }
              })
              .catch(() => {});
          }

          return data.room;
        }
      }
    } catch (e) {
      // ignore network glitch
    }
    return null;
  }, []);

  const initWebRTC = useCallback(async (_localStream: MediaStream, _isInitiator: boolean) => {
    // WebRTC P2P disabled in favor of server-authoritative SSE & HTTP live frame streaming
  }, []);

  // Central Event Dispatcher for SSE and REST
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

      case 'live_frame_received':
        if (data.role && data.dataUrl) {
          setRoomState((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              liveFrames: {
                ...(prev as any).liveFrames,
                [data.role]: data.dataUrl,
              },
            } as DuoRoomState;
          });
        }
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
        if (propsRef.current.onRoomDeleted) {
          propsRef.current.onRoomDeleted(data.reason || 'Phòng chụp đã được đóng.');
        }
        break;
    }
  }, []);

  // Main Connection Function (Server-Authoritative SSE + REST + Fallback Polling)
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

    // 1. Synchronously set local user & room state so Duo Studio screen opens INSTANTLY
    setCurrentUser({
      id: uid,
      role,
      name: userName,
    });

    setRoomState((prev) => {
      if (prev && prev.code === cleanCode) {
        return {
          ...prev,
          members: {
            ...prev.members,
            [uid]: {
              id: uid,
              name: userName,
              role,
              isReady: false,
              avatarSeed: role,
            },
          },
        };
      }
      return {
        code: cleanCode,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        members: {
          [uid]: {
            id: uid,
            name: userName,
            role,
            isReady: false,
            avatarSeed: role,
          },
        },
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

    // 2. Perform background REST join
    fetch(`/api/rooms/${cleanCode}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'join_room',
        userName,
        userId: uid,
        isHost: role === 'host',
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.room) {
          setRoomState(data.room);
          if (data.userId && data.role) {
            setCurrentUser({
              id: data.userId,
              role: data.role,
              name: userName,
            });
          }
        }
      })
      .catch((err) => {
        console.warn('REST Join warning:', err);
      });

    // 3. Connect SSE Stream for real-time updates
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

      sse.onerror = () => {
        // SSE network fallback handled by polling
      };
    } catch (e) {}

    // 4. Start background polling (1.0s)
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    pollTimerRef.current = setInterval(() => {
      if (roomCodeRef.current) {
        syncRoomViaHttp(roomCodeRef.current);
      }
    }, 1000);

  }, [syncRoomViaHttp, handleServerEvent]);

  const sendEvent = useCallback((type: string, payload: any = {}) => {
    const currentCode = roomCodeRef.current || roomStateRef.current?.code;
    const uid = userIdRef.current;
    const uname = userNameRef.current;

    // Dispatch REST action to server
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

    if (currentCode) {
      fetch(`/api/rooms/${currentCode}`, { method: 'DELETE' }).catch(() => {});
    }

    roomCodeRef.current = null;
    setIsConnecting(false);
    setRoomState(null);
    setCurrentUser(null);
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
