import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

interface DuoMember {
  id: string;
  name: string;
  role: 'host' | 'guest';
  isReady: boolean;
  avatarSeed: string;
  ws?: WebSocket;
}

interface DuoRoom {
  code: string;
  createdAt: number;
  lastActivity: number;
  members: Record<string, DuoMember>;
  duoMode: 'split-heart' | 'side-by-side' | 'alternating' | 'cutout';
  settings: any;
  photos: {
    host: Array<{ id: string; dataUrl: string; index: number }>;
    guest: Array<{ id: string; dataUrl: string; index: number }>;
    merged: Array<{ id: string; dataUrl: string; index: number }>;
  };
  currentSlot: number | null;
  countdownStart: number | null;
  timerDuration: number;
  step: 1 | 2 | 3;
  stickers: any[];
  sseClients?: Set<express.Response>;
}

const rooms: Record<string, DuoRoom> = {};

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function broadcastToRoom(roomCode: string, payload: any, excludeWs?: WebSocket) {
  const room = rooms[roomCode];
  if (!room) return;
  const msg = JSON.stringify(payload);

  // 1. Send via WebSocket
  Object.values(room.members).forEach((member) => {
    if (member.ws && member.ws.readyState === WebSocket.OPEN && member.ws !== excludeWs) {
      try {
        member.ws.send(msg);
      } catch (e) {
        // ignore
      }
    }
  });

  // 2. Send via Server-Sent Events (SSE)
  if (room.sseClients) {
    const sseFormatted = `data: ${msg}\n\n`;
    room.sseClients.forEach((res) => {
      try {
        res.write(sseFormatted);
      } catch (e) {
        room.sseClients?.delete(res);
      }
    });
  }
}

function deleteRoom(roomCode: string, reason = 'Phòng đã được đóng và xoá để giải phóng máy chủ.') {
  const room = rooms[roomCode];
  if (!room) return;

  const msg = JSON.stringify({
    type: 'room_deleted',
    roomCode,
    reason,
  });

  Object.values(room.members).forEach((member) => {
    if (member.ws && member.ws.readyState === WebSocket.OPEN) {
      try {
        member.ws.send(msg);
        member.ws.close();
      } catch (e) {
        // ignore
      }
    }
  });

  delete rooms[roomCode];
  console.log(`🗑️ [Duo Room] Room ${roomCode} was completely deleted and memory freed. Active rooms: ${Object.keys(rooms).length}`);
}

// Clean up stale rooms (older than 4 hours or completely abandoned for > 45 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of Object.entries(rooms)) {
    const isVeryOld = now - room.createdAt > 4 * 60 * 60 * 1000;
    const hasActiveWs = Object.values(room.members).some(
      (m) => m.ws && m.ws.readyState === WebSocket.OPEN
    );
    const isInactiveLong = !hasActiveWs && now - room.lastActivity > 45 * 60 * 1000;

    if (isVeryOld || isInactiveLong) {
      deleteRoom(code, 'Phòng đã hết hạn sau thời gian dài không hoạt động.');
    }
  }
}, 5 * 60 * 1000);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', activeRooms: Object.keys(rooms).length });
  });

  // Create room
  app.post('/api/rooms/create', (req, res) => {
    const { hostName, duoMode = 'split-heart', settings } = req.body;
    let code = generateRoomCode();
    while (rooms[code]) {
      code = generateRoomCode();
    }

    const now = Date.now();
    rooms[code] = {
      code,
      createdAt: now,
      lastActivity: now,
      members: {},
      duoMode: duoMode || 'split-heart',
      settings: settings || {
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
      photos: {
        host: [],
        guest: [],
        merged: [],
      },
      currentSlot: null,
      countdownStart: null,
      timerDuration: 3,
      step: 1,
      stickers: [],
    };

    console.log(`✨ [Duo Room] Created room ${code}. Total active rooms: ${Object.keys(rooms).length}`);

    res.json({
      success: true,
      room: sanitizeRoom(rooms[code]),
    });
  });

  function getOrCreateRoom(code: string): DuoRoom {
    const cleanCode = code.trim().toUpperCase();
    if (!rooms[cleanCode]) {
      const now = Date.now();
      rooms[cleanCode] = {
        code: cleanCode,
        createdAt: now,
        lastActivity: now,
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
        photos: {
          host: [],
          guest: [],
          merged: [],
        },
        currentSlot: null,
        countdownStart: null,
        timerDuration: 3,
        step: 1,
        stickers: [],
      };
    }
    rooms[cleanCode].lastActivity = Date.now();
    return rooms[cleanCode];
  }

  // Get room info
  app.get('/api/rooms/:code', (req, res) => {
    const code = (req.params.code || '').trim().toUpperCase();
    const room = getOrCreateRoom(code);
    res.json({ success: true, room: sanitizeRoom(room) });
  });

  // Server-Sent Events (SSE) Stream Endpoint for ultra-fast zero-latency real-time sync
  app.get('/api/rooms/:code/stream', (req, res) => {
    const code = (req.params.code || '').trim().toUpperCase();
    const room = getOrCreateRoom(code);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    res.write(`data: ${JSON.stringify({ type: 'connected', roomCode: code })}\n\n`);

    if (!room.sseClients) {
      room.sseClients = new Set();
    }
    room.sseClients.add(res);

    req.on('close', () => {
      if (room.sseClients) {
        room.sseClients.delete(res);
      }
    });
  });

  // REST API Actions (Instant HTTP dispatch for 100% reliability)
  app.post('/api/rooms/:code/action', (req, res) => {
    const code = (req.params.code || '').trim().toUpperCase();
    const room = getOrCreateRoom(code);

    room.lastActivity = Date.now();
    const { type, userId, userName, isHost } = req.body;
    const currentUserId = userId || `u_${Date.now()}`;

    if (type === 'join_room') {
      if (!room.members[currentUserId]) {
        const existingMembers = Object.values(room.members);
        const hasHost = existingMembers.some((m) => m.role === 'host');
        
        let role: 'host' | 'guest' = 'guest';
        if (isHost || (!hasHost && existingMembers.length === 0)) {
          role = 'host';
        } else {
          role = 'guest';
        }

        room.members[currentUserId] = {
          id: currentUserId,
          name: userName || (role === 'host' ? 'Chủ phòng' : 'Người ấy'),
          role,
          isReady: false,
          avatarSeed: role,
        };
      } else if (userName) {
        room.members[currentUserId].name = userName;
      }

      broadcastToRoom(code, {
        type: 'room_update',
        room: sanitizeRoom(room),
        event: 'user_joined',
        userName: room.members[currentUserId].name,
      });

      return res.json({
        success: true,
        type: 'room_joined',
        room: sanitizeRoom(room),
        userId: currentUserId,
        role: room.members[currentUserId].role,
      });
    }

    switch (type) {
      case 'toggle_ready': {
        if (currentUserId && room.members[currentUserId]) {
          room.members[currentUserId].isReady = !room.members[currentUserId].isReady;
          broadcastToRoom(code, { type: 'room_update', room: sanitizeRoom(room) });
        }
        break;
      }

      case 'update_mode': {
        if (req.body.duoMode) {
          room.duoMode = req.body.duoMode;
          broadcastToRoom(code, { type: 'room_update', room: sanitizeRoom(room) });
        }
        break;
      }

      case 'update_settings': {
        if (req.body.settings) {
          room.settings = { ...room.settings, ...req.body.settings };
          broadcastToRoom(code, { type: 'room_update', room: sanitizeRoom(room) });
        }
        break;
      }

      case 'change_step': {
        if (req.body.step) {
          room.step = req.body.step;
          broadcastToRoom(code, { type: 'room_update', room: sanitizeRoom(room) });
        }
        break;
      }

      case 'start_countdown': {
        room.currentSlot = req.body.slot ?? 0;
        room.timerDuration = req.body.duration ?? 3;
        room.countdownStart = Date.now();
        broadcastToRoom(code, {
          type: 'countdown_started',
          slot: room.currentSlot,
          duration: room.timerDuration,
          startTime: room.countdownStart,
        });
        break;
      }

      case 'upload_user_photo': {
        const { slotIndex, dataUrl, role } = req.body;
        if (typeof slotIndex === 'number' && dataUrl) {
          const targetList = role === 'guest' ? room.photos.guest : room.photos.host;
          targetList[slotIndex] = {
            id: `duo-${role}-${Date.now()}-${slotIndex}`,
            dataUrl,
            index: slotIndex,
          };

          broadcastToRoom(code, {
            type: 'photo_received',
            role,
            slotIndex,
            room: sanitizeRoom(room),
          });
        }
        break;
      }

      case 'set_merged_photos': {
        if (Array.isArray(req.body.mergedPhotos)) {
          room.photos.merged = req.body.mergedPhotos;
          broadcastToRoom(code, { type: 'room_update', room: sanitizeRoom(room) });
        }
        break;
      }

      case 'update_stickers': {
        if (Array.isArray(req.body.stickers)) {
          room.stickers = req.body.stickers;
          if (room.settings) {
            room.settings.stickers = req.body.stickers;
          }
          broadcastToRoom(code, { type: 'stickers_updated', stickers: room.stickers });
        }
        break;
      }

      case 'send_reaction': {
        broadcastToRoom(code, {
          type: 'reaction_received',
          senderId: currentUserId,
          senderName: room.members[currentUserId]?.name || 'Bạn',
          emoji: req.body.emoji,
          id: Date.now() + Math.random().toString(),
        });
        break;
      }

      case 'send_chat': {
        broadcastToRoom(code, {
          type: 'chat_received',
          senderId: currentUserId,
          senderName: room.members[currentUserId]?.name || 'Bạn',
          text: req.body.text,
          timestamp: Date.now(),
        });
        break;
      }

      case 'leave_room': {
        const uName = room.members[currentUserId]?.name || 'Thành viên';
        deleteRoom(code, `${uName} đã rời phòng. Phòng đã đóng và xoá.`);
        return res.json({ success: true, message: 'Phòng đã được xoá.' });
      }
    }

    return res.json({ success: true, room: sanitizeRoom(room) });
  });

  // Explicitly close & delete room
  app.delete('/api/rooms/:code', (req, res) => {
    const code = (req.params.code || '').trim().toUpperCase();
    if (rooms[code]) {
      deleteRoom(code, 'Phòng đã được chủ phòng giải phóng và xoá.');
      return res.json({ success: true, message: 'Phòng đã được xoá hoàn toàn.' });
    }
    res.json({ success: true, message: 'Phòng không tồn tại hoặc đã được xoá trước đó.' });
  });

  // Attach WebSocket Server
  const wss = new WebSocketServer({ server, path: '/ws' });

  function sanitizeRoom(room: DuoRoom) {
    const safeMembers: Record<string, Omit<DuoMember, 'ws'>> = {};
    for (const [id, m] of Object.entries(room.members)) {
      safeMembers[id] = {
        id: m.id,
        name: m.name,
        role: m.role,
        isReady: m.isReady,
        avatarSeed: m.avatarSeed,
      };
    }
    return {
      code: room.code,
      createdAt: room.createdAt,
      members: safeMembers,
      duoMode: room.duoMode,
      settings: room.settings,
      photos: room.photos,
      currentSlot: room.currentSlot,
      countdownStart: room.countdownStart,
      timerDuration: room.timerDuration,
      step: room.step,
      stickers: room.stickers,
    };
  }

  wss.on('connection', (ws) => {
    let currentRoomCode: string | null = null;
    let currentUserId: string | null = null;

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        const { type, roomCode, userId } = message;

        if (type === 'join_room') {
          const code = (roomCode || '').toUpperCase();
          const room = getOrCreateRoom(code);

          currentRoomCode = code;
          currentUserId = userId || `user-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;

          // Check if already in room or join as guest
          if (!room.members[currentUserId]) {
            const existingMembers = Object.values(room.members);
            const hasHost = existingMembers.some((m) => m.role === 'host');
            
            let role: 'host' | 'guest' = 'guest';
            if (message.isHost || (!hasHost && existingMembers.length === 0)) {
              role = 'host';
            } else {
              role = 'guest';
            }

            room.members[currentUserId] = {
              id: currentUserId,
              name: message.userName || (role === 'host' ? 'Chủ phòng' : 'Người ấy'),
              role,
              isReady: false,
              avatarSeed: role,
              ws,
            };
          } else {
            room.members[currentUserId].ws = ws;
            if (message.userName) {
              room.members[currentUserId].name = message.userName;
            }
          }

          ws.send(JSON.stringify({
            type: 'room_joined',
            room: sanitizeRoom(room),
            userId: currentUserId,
            role: room.members[currentUserId].role,
          }));

          broadcastToRoom(code, {
            type: 'room_update',
            room: sanitizeRoom(room),
            event: 'user_joined',
            userName: room.members[currentUserId].name,
          }, ws);
        }

        if (!currentRoomCode || !rooms[currentRoomCode]) return;
        const room = rooms[currentRoomCode];

        switch (type) {
          case 'toggle_ready': {
            if (currentUserId && room.members[currentUserId]) {
              room.members[currentUserId].isReady = !room.members[currentUserId].isReady;
              broadcastToRoom(currentRoomCode, {
                type: 'room_update',
                room: sanitizeRoom(room),
              });
            }
            break;
          }

          case 'update_mode': {
            if (message.duoMode) {
              room.duoMode = message.duoMode;
              broadcastToRoom(currentRoomCode, {
                type: 'room_update',
                room: sanitizeRoom(room),
              });
            }
            break;
          }

          case 'update_settings': {
            if (message.settings) {
              room.settings = { ...room.settings, ...message.settings };
              broadcastToRoom(currentRoomCode, {
                type: 'room_update',
                room: sanitizeRoom(room),
              });
            }
            break;
          }

          case 'change_step': {
            if (message.step) {
              room.step = message.step;
              broadcastToRoom(currentRoomCode, {
                type: 'room_update',
                room: sanitizeRoom(room),
              });
            }
            break;
          }

          case 'start_countdown': {
            room.currentSlot = message.slot ?? 0;
            room.timerDuration = message.duration ?? 3;
            room.countdownStart = Date.now();
            broadcastToRoom(currentRoomCode, {
              type: 'countdown_started',
              slot: room.currentSlot,
              duration: room.timerDuration,
              startTime: room.countdownStart,
            });
            break;
          }

          case 'upload_user_photo': {
            const { slotIndex, dataUrl, role } = message;
            if (typeof slotIndex === 'number' && dataUrl) {
              const targetList = role === 'guest' ? room.photos.guest : room.photos.host;
              targetList[slotIndex] = {
                id: `duo-${role}-${Date.now()}-${slotIndex}`,
                dataUrl,
                index: slotIndex,
              };

              broadcastToRoom(currentRoomCode, {
                type: 'photo_received',
                role,
                slotIndex,
                room: sanitizeRoom(room),
              });
            }
            break;
          }

          case 'set_merged_photos': {
            if (Array.isArray(message.mergedPhotos)) {
              room.photos.merged = message.mergedPhotos;
              broadcastToRoom(currentRoomCode, {
                type: 'room_update',
                room: sanitizeRoom(room),
              });
            }
            break;
          }

          case 'update_stickers': {
            if (Array.isArray(message.stickers)) {
              room.stickers = message.stickers;
              if (room.settings) {
                room.settings.stickers = message.stickers;
              }
              broadcastToRoom(currentRoomCode, {
                type: 'stickers_updated',
                stickers: room.stickers,
              }, ws);
            }
            break;
          }

          case 'send_reaction': {
            broadcastToRoom(currentRoomCode, {
              type: 'reaction_received',
              senderId: currentUserId,
              senderName: currentUserId ? room.members[currentUserId]?.name : 'Bạn',
              emoji: message.emoji,
              id: Date.now() + Math.random().toString(),
            });
            break;
          }

          case 'send_chat': {
            broadcastToRoom(currentRoomCode, {
              type: 'chat_received',
              senderId: currentUserId,
              senderName: currentUserId ? room.members[currentUserId]?.name : 'Bạn',
              text: message.text,
              timestamp: Date.now(),
            });
            break;
          }

          // Explicit user leaves room -> immediately delete room
          case 'leave_room': {
            const userName = currentUserId ? room.members[currentUserId]?.name : 'Một thành viên';
            deleteRoom(
              currentRoomCode,
              `${userName} đã rời phòng. Phòng chụp đã được đóng và tự động xoá để giải phóng máy chủ.`
            );
            currentRoomCode = null;
            break;
          }

          // WebRTC Signaling Forwarding
          case 'webrtc_signal': {
            broadcastToRoom(currentRoomCode, {
              type: 'webrtc_signal',
              senderId: currentUserId,
              signal: message.signal,
            }, ws);
            break;
          }
        }
      } catch (err) {
        console.error('WS parse error:', err);
      }
    });

    ws.on('close', () => {
      if (currentRoomCode && rooms[currentRoomCode]) {
        const room = rooms[currentRoomCode];
        room.lastActivity = Date.now();
        
        if (currentUserId && room.members[currentUserId]) {
          room.members[currentUserId].ws = undefined;
          const userName = room.members[currentUserId].name;
          console.log(`📡 [Duo Room] User ${userName} (${currentUserId}) disconnected from room ${currentRoomCode}. Keeping room alive.`);
          
          broadcastToRoom(currentRoomCode, {
            type: 'room_update',
            room: sanitizeRoom(room),
            event: 'user_disconnected',
            userName,
          });
        }
        currentRoomCode = null;
      }
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Duo Photobooth Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
