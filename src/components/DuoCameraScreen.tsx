import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CapturedPhoto, PhotoboothSettings, DuoRoomState, DuoMember, DuoReaction } from '../types';
import { PhotoStrip } from './PhotoStrip';
import { FRAME_THEMES, FRAME_COLORS, PHOTO_FILTERS } from '../data/themesAndColors';
import { playCountdownBeep, playShutterSound, playSuccessChime } from '../utils/audio';
import { mergeDuoPhotos } from '../utils/duoMerge';
import {
  CameraFill,
  ArrowLeftRight,
  ArrowRepeat,
  ExclamationCircleFill,
  ArrowLeft,
  ArrowRight,
  LightningFill,
  Lightning,
  MicFill,
  MicMuteFill,
  ChatDotsFill,
  HeartFill,
  SendFill,
  ShareFill,
  Check,
} from 'react-bootstrap-icons';
import { LottieIcon } from './LottieIcon';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Copy } from 'lucide-react';

const DUO_POSE_SUGGESTIONS = [
  '💖 Bạn giơ tay trái tim bên trái, người ấy giơ tay trái tim bên phải!',
  '😘 Cùng chu môi gửi nụ hôn qua màn hình',
  '👉 Cùng chỉ tay sang hướng của nhau',
  '✌️ Cùng giơ 2 ngón tay chữ V áp sát má',
  '🤭 Một người cười tươi, một người bất ngờ ngơ ngác',
  '🐱 Tạo dáng tai mèo dễ thương cùng nhau',
  '🕶️ Cùng tạo dáng thần thái cực ngầu',
];

const EMOJI_REACTIONS = ['💖', '🌸', '✨', '✌️', '😘', '🐱', '🎀', '🔥'];

interface DuoCameraScreenProps {
  settings: PhotoboothSettings;
  roomState: DuoRoomState;
  currentUser: { id: string; role: 'host' | 'guest'; name: string };
  remoteStream: MediaStream | null;
  activeReactions: DuoReaction[];
  onTriggerCountdown: (slot: number, duration?: number) => void;
  onUploadPhoto: (slotIndex: number, dataUrl: string) => void;
  onSendReaction: (emoji: string) => void;
  onSendChat: (text: string) => void;
  onFinishDuo: (mergedPhotos: CapturedPhoto[]) => void;
  onLeaveRoom: () => void;
  onUpdateSettings: (settings: Partial<PhotoboothSettings>) => void;
  incomingCountdown: { slot: number; duration: number; startTime: number } | null;
  onInitWebRTC?: (localStream: MediaStream, isInitiator: boolean) => void;
}

export const DuoCameraScreen: React.FC<DuoCameraScreenProps> = ({
  settings,
  roomState,
  currentUser,
  remoteStream,
  activeReactions,
  onTriggerCountdown,
  onUploadPhoto,
  onSendReaction,
  onSendChat,
  onFinishDuo,
  onLeaveRoom,
  onUpdateSettings,
  incomingCountdown,
  onInitWebRTC,
}) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [cameraLoading, setCameraLoading] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isMirror, setIsMirror] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(3);
  const [flashEnabled, setFlashEnabled] = useState<boolean>(true);

  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [countdownNum, setCountdownNum] = useState<number | null>(null);
  const [currentSlot, setCurrentSlot] = useState<number | null>(null);
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [poseIndex, setPoseIndex] = useState<number>(0);

  // Chat message state
  const [chatInput, setChatInput] = useState<string>('');
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Merged photos state for live display
  const [mergedPhotos, setMergedPhotos] = useState<CapturedPhoto[]>([]);

  const targetPhotoCount = settings.layoutType === 'strip-3' ? 3 : 4;
  const selectedTheme = FRAME_THEMES.find((t) => t.id === settings.themeId) || FRAME_THEMES[0];
  const selectedColor = FRAME_COLORS.find((c) => c.id === settings.colorId) || FRAME_COLORS[0];
  const selectedFilter = PHOTO_FILTERS.find((f) => f.id === settings.filterId) || PHOTO_FILTERS[0];

  // Members
  const memberList = Object.values(roomState.members);
  const partner = memberList.find((m) => m.id !== currentUser.id);

  // Start Camera with high compatibility for mobile & desktop
  const startCamera = useCallback(async () => {
    setCameraLoading(true);
    setCameraError(null);
    try {
      if (localStream) {
        try {
          localStream.getTracks().forEach((track) => track.stop());
        } catch (e) {}
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });
      } catch (firstErr) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode },
            audio: false,
          });
        } catch (secondErr) {
          // Absolute fallback
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      setLocalStream(stream);
      setCameraLoading(false);
      setCameraError(null);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
        localVideoRef.current.onloadedmetadata = () => {
          localVideoRef.current?.play().catch(() => {});
        };
      }

      if (onInitWebRTC) {
        onInitWebRTC(stream, currentUser.role === 'host');
      }
    } catch (err) {
      console.error('Camera error in DuoCameraScreen:', err);
      setCameraLoading(false);
      setCameraError('Không thể mở camera. Vui lòng nhấn nút bên dưới để cấp quyền camera nhé!');
    }
  }, [facingMode, onInitWebRTC, currentUser.role]);

  useEffect(() => {
    startCamera();
    return () => {
      if (localStream) {
        try {
          localStream.getTracks().forEach((t) => t.stop());
        } catch (e) {}
      }
    };
  }, [facingMode]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
      localVideoRef.current.onloadedmetadata = () => {
        localVideoRef.current?.play().catch(() => {});
      };
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(() => {});
      remoteVideoRef.current.onloadedmetadata = () => {
        remoteVideoRef.current?.play().catch(() => {});
      };
    }
  }, [remoteStream]);

  // Rotate pose ideas
  useEffect(() => {
    const timer = setInterval(() => {
      setPoseIndex((prev) => (prev + 1) % DUO_POSE_SUGGESTIONS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Capture frame from local webcam
  const captureLocalFrame = useCallback((): string | null => {
    const video = localVideoRef.current;
    if (!video || video.videoWidth === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (isMirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.95);
  }, [isMirror]);

  // Flash trigger
  const triggerFlash = () => {
    if (flashEnabled) {
      setIsFlashing(true);
      playShutterSound();
      setTimeout(() => setIsFlashing(false), 160);
    } else {
      playShutterSound();
    }
  };

  // Synchronized countdown execution
  useEffect(() => {
    if (!incomingCountdown) return;
    const { slot, duration, startTime } = incomingCountdown;

    let isCancelled = false;
    setIsShooting(true);
    setCurrentSlot(slot);

    const runCountdown = async () => {
      for (let sec = duration; sec >= 1; sec--) {
        if (isCancelled) return;
        setCountdownNum(sec);
        playCountdownBeep(sec);
        await new Promise((res) => setTimeout(res, 1000));
      }

      if (isCancelled) return;
      setCountdownNum(0);
      triggerFlash();

      // Capture local image and upload to room
      const myFrame = captureLocalFrame();
      if (myFrame) {
        onUploadPhoto(slot, myFrame);
      }

      await new Promise((res) => setTimeout(res, 800));
      if (!isCancelled) {
        setCountdownNum(null);
        setIsShooting(false);
      }
    };

    runCountdown();

    return () => {
      isCancelled = true;
    };
  }, [incomingCountdown, captureLocalFrame, onUploadPhoto]);

  // Auto-merge host and guest photos whenever room state updates
  useEffect(() => {
    let isCancelled = false;

    const mergeAllSlots = async () => {
      const { host = [], guest = [] } = roomState.photos;
      const newMerged: CapturedPhoto[] = [];

      for (let slot = 0; slot < targetPhotoCount; slot++) {
        const photoHost = host[slot]?.dataUrl;
        const photoGuest = guest[slot]?.dataUrl;

        if (photoHost || photoGuest) {
          const mergedUrl = await mergeDuoPhotos(photoHost, photoGuest, roomState.duoMode, slot);
          if (!isCancelled && mergedUrl) {
            newMerged[slot] = {
              id: `merged-slot-${slot}`,
              dataUrl: mergedUrl,
              timestamp: Date.now(),
              index: slot,
            };
          }
        }
      }

      if (!isCancelled) {
        setMergedPhotos(newMerged);
      }
    };

    mergeAllSlots();

    return () => {
      isCancelled = true;
    };
  }, [roomState.photos, roomState.duoMode, targetPhotoCount]);

  // Handle Simultaneous Auto Sequence
  const handleStartAutoSequence = async () => {
    if (isShooting) return;
    onTriggerCountdown(0, timerDuration);
  };

  const handleTriggerSingleSlot = (slotIndex: number) => {
    if (isShooting) return;
    onTriggerCountdown(slotIndex, timerDuration);
  };

  const hasAllPhotos = mergedPhotos.filter(Boolean).length === targetPhotoCount;

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${roomState.code}`;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      onSendChat(chatInput.trim());
      setChatInput('');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 font-['Quicksand']">
      {/* Floating Reactions Banner */}
      <div className="fixed inset-x-0 top-20 pointer-events-none z-50 flex justify-center items-center">
        {activeReactions.map((rx) => (
          <div
            key={rx.id}
            className="text-4xl sm:text-5xl animate-float-up absolute opacity-90 drop-shadow-md select-none"
            style={{
              left: `${45 + (Math.random() * 20 - 10)}%`,
            }}
          >
            {rx.emoji}
          </div>
        ))}
      </div>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-rose-100/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onLeaveRoom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-rose-50 text-neutral-700 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Rời Phòng</span>
          </button>

          <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/60">
            <span className="text-xs font-bold text-rose-900 font-mono tracking-wider">
              MÃ PHÒNG: {roomState.code}
            </span>
            <button
              onClick={handleCopyLink}
              title="Sao chép link mời"
              className="text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Partner Connection Status Pill */}
        <div className="flex items-center gap-2">
          {partner ? (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Đã kết nối với {partner.name} 💕</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 text-amber-900 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 animate-pulse">
              <span>Đang đợi người ấy vào phòng...</span>
              <button
                onClick={handleCopyLink}
                className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer"
              >
                Gửi Link
              </button>
            </div>
          )}
        </div>

        {/* Pose Suggestion Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 text-rose-900 text-xs font-bold">
          <LottieIcon name="sparkle" size={14} />
          <span>{DUO_POSE_SUGGESTIONS[poseIndex]}</span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Dual Webcams + Shutter & Chat */}
        <div className="lg:col-span-8 space-y-4">
          {/* Dual Split Video Stage */}
          <div className="relative rounded-3xl overflow-hidden bg-neutral-950 p-2 sm:p-3 border-4 border-white shadow-xl">
            {/* Flash Effect */}
            {isFlashing && (
              <div className="absolute inset-0 z-40 bg-white opacity-95 transition-opacity pointer-events-none" />
            )}

            {/* Countdown Overlay */}
            {countdownNum !== null && countdownNum > 0 && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/20 pointer-events-none animate-in fade-in">
                <span className="text-6xl sm:text-7xl font-black font-['Quicksand'] text-white/90 backdrop-blur-md bg-white/20 px-8 py-4 rounded-3xl border border-white/30 shadow-lg">
                  {countdownNum}
                </span>
                <p className="text-white text-xs font-bold mt-3 bg-neutral-950/60 px-3 py-1 rounded-full">
                  📸 Đang chụp chung ô #{(currentSlot ?? 0) + 1}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 aspect-[4/3] sm:aspect-[8/3]">
              {/* Local User Box */}
              <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border-2 border-rose-300 flex items-center justify-center min-h-[160px]">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${
                    isMirror && facingMode === 'user' ? 'scale-x-[-1]' : ''
                  } ${selectedFilter.filterClass}`}
                />

                {/* Camera Loading Spinner */}
                {cameraLoading && !cameraError && (
                  <div className="absolute inset-0 bg-neutral-950/80 flex flex-col items-center justify-center text-rose-300 z-10">
                    <div className="w-8 h-8 border-3 border-rose-300 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs font-semibold">Đang mở Camera...</span>
                  </div>
                )}

                {/* Camera Permission / Error Fallback Button */}
                {cameraError && (
                  <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center p-3 text-center z-20 text-white">
                    <CameraFill className="w-8 h-8 text-rose-400 mb-1.5 animate-pulse" />
                    <p className="text-xs font-bold text-neutral-200 leading-snug">{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="mt-2.5 px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <span>📷 Cho phép / Mở lại Camera</span>
                    </button>
                  </div>
                )}

                <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20 z-20">
                  <span className={`w-1.5 h-1.5 rounded-full ${localStream ? 'bg-rose-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{currentUser.name} (Bạn)</span>
                </div>
              </div>

              {/* Remote Partner Box */}
              <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border-2 border-pink-300 flex items-center justify-center">
                {remoteStream ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${selectedFilter.filterClass}`}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-neutral-400">
                    <Heart className="w-10 h-10 text-rose-400 animate-bounce mb-2" />
                    <p className="text-xs sm:text-sm font-bold text-neutral-100">
                      {partner ? `Đang kết nối camera với ${partner.name}...` : 'Đang đợi bạn/người ấy vào phòng...'}
                    </p>
                    <p className="text-[11px] text-neutral-300 mt-1 max-w-xs leading-relaxed">
                      {partner
                        ? 'Vui lòng giữ kết nối trong giây lát...'
                        : 'Gửi mã phòng hoặc link cho người thứ 2 tham gia trên điện thoại/máy tính khác của họ nhé!'}
                    </p>
                    {!partner && (
                      <button
                        onClick={handleCopyLink}
                        className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Đã sao chép link!' : 'Sao chép link gửi bạn bè'}</span>
                      </button>
                    )}
                  </div>
                )}
                <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                  <span className={`w-1.5 h-1.5 rounded-full ${partner ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span>{partner ? partner.name : 'Người ấy (Chưa vào)'}</span>
                </div>
              </div>
            </div>

            {/* Quick In-Booth Action Floating Toolbar */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-white">
              {/* Emoji Reactions Bar */}
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/20">
                {EMOJI_REACTIONS.map((em) => (
                  <button
                    key={em}
                    onClick={() => onSendReaction(em)}
                    className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-sm transition-transform hover:scale-125 cursor-pointer"
                    title={`Thả tim ${em}`}
                  >
                    {em}
                  </button>
                ))}
              </div>

              {/* Camera & Audio Tools */}
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/20">
                <button
                  onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 transition-all cursor-pointer"
                  title="Chuyển camera trước/sau"
                >
                  <ArrowRepeat className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMirror(!isMirror)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isMirror ? 'bg-white/30 text-white' : 'text-white/60 hover:bg-white/20'
                  }`}
                  title="Lật gương camera"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTimerDuration(timerDuration === 3 ? 5 : 3)}
                  className="px-2 py-0.5 rounded-full hover:bg-white/20 text-xs font-bold"
                  title="Đổi thời gian đếm ngược"
                >
                  {timerDuration}s
                </button>
                <button
                  onClick={() => setFlashEnabled(!flashEnabled)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer"
                  title="Bật/Tắt Flash"
                >
                  {flashEnabled ? <LightningFill className="w-3.5 h-3.5 text-amber-300" /> : <Lightning className="w-3.5 h-3.5 text-white/50" />}
                </button>
              </div>
            </div>
          </div>

          {/* Shutter & Slot Trigger Bar */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Slot Quick Selector */}
            <div className="flex items-center gap-1.5 bg-rose-50/50 p-1.5 rounded-2xl border border-rose-100">
              {Array.from({ length: targetPhotoCount }, (_, idx) => {
                const isShot = Boolean(mergedPhotos[idx]);
                const isCurrent = currentSlot === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleTriggerSingleSlot(idx)}
                    disabled={isShooting}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-neutral-900 text-white shadow-xs scale-105'
                        : isShot
                        ? 'bg-white text-neutral-900 border border-rose-200 shadow-2xs'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-rose-100/50'
                    }`}
                  >
                    <span>Ô #{idx + 1}</span>
                    {isShot && <span className="text-emerald-500">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Simultaneous Shutter Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleStartAutoSequence}
                disabled={isShooting}
                className="group relative flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 rounded-full border-4 border-rose-600 p-1 flex items-center justify-center bg-white shadow-md">
                  <div
                    className={`w-full h-full rounded-full transition-all flex items-center justify-center ${
                      isShooting ? 'bg-rose-500 animate-ping' : 'bg-rose-600 group-hover:bg-rose-700'
                    }`}
                  >
                    <CameraFill className="w-6 h-6 text-white" />
                  </div>
                </div>
              </button>

              <div className="text-left">
                <p className="text-sm font-black text-neutral-900">
                  {isShooting ? 'Đang chụp chung...' : 'Chụp Chung Cả Hai 📸'}
                </p>
                <p className="text-[11px] text-neutral-500 font-medium">
                  Đồng bộ đếm ngược {timerDuration}s trên cả 2 máy
                </p>
              </div>
            </div>

            {/* Advance to Step 3 CTA */}
            {hasAllPhotos && (
              <button
                onClick={() => onFinishDuo(mergedPhotos)}
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer animate-bounce"
              >
                <span>Trang Trí Chung 🎀</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* In-Booth Chat Pill Bar */}
          <form onSubmit={handleSendChatMessage} className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-rose-100 shadow-2xs">
            <ChatDotsFill className="w-4 h-4 text-rose-400 ml-2" />
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Nhắn nhanh cho người ấy: 'Chuẩn bị giơ tay trái tim nhé!'..."
              className="flex-1 bg-transparent px-2 text-xs font-medium text-neutral-800 outline-hidden"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <SendFill className="w-3 h-3" />
              <span>Gửi</span>
            </button>
          </form>
        </div>

        {/* Right 4 Cols: Live Photo Strip Preview */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full bg-white/95 backdrop-blur-xl rounded-3xl p-5 border border-rose-100 shadow-sm flex flex-col items-center sticky top-20">
            <div className="flex items-center justify-between w-full mb-3 px-1">
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Dải Ảnh Ghép Đôi
              </span>
              <span className="text-xs font-bold text-neutral-700 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                {mergedPhotos.filter(Boolean).length}/{targetPhotoCount}
              </span>
            </div>

            {/* The Live Photo Strip Preview */}
            <div className="scale-95 sm:scale-100 transition-all">
              <PhotoStrip
                photos={mergedPhotos}
                settings={settings}
                theme={selectedTheme}
                color={selectedColor}
                filter={selectedFilter}
                highlightSlot={currentSlot}
              />
            </div>

            {/* Advance Button */}
            {hasAllPhotos && (
              <button
                onClick={() => onFinishDuo(mergedPhotos)}
                className="w-full mt-4 py-3.5 px-5 rounded-full bg-neutral-900 hover:bg-black text-white font-bold text-sm shadow-md active:scale-[0.98] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Xem Kết Quả & Dán Sticker 🎀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
