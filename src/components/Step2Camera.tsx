import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CapturedPhoto, PhotoboothSettings } from '../types';
import { PhotoStrip } from './PhotoStrip';
import { playCountdownBeep, playShutterSound, playSuccessChime } from '../utils/audio';
import { FRAME_THEMES, FRAME_COLORS, PHOTO_FILTERS, POSE_SUGGESTIONS } from '../data/themesAndColors';
import {
  CameraFill,
  ArrowLeftRight,
  ArrowRepeat,
  ExclamationCircleFill,
  Upload,
  ArrowLeft,
  ArrowRight,
  LightningFill,
  Lightning,
} from 'react-bootstrap-icons';
import { LottieIcon } from './LottieIcon';
import confetti from 'canvas-confetti';
import { FallbackUpload } from './FallbackUpload';

interface Step2CameraProps {
  settings: PhotoboothSettings;
  photos: CapturedPhoto[];
  onPhotosCaptured: (photos: CapturedPhoto[]) => void;
  onFinishStep2: () => void;
  onBackToStep1: () => void;
}

export const Step2Camera: React.FC<Step2CameraProps> = ({
  settings,
  photos,
  onPhotosCaptured,
  onFinishStep2,
  onBackToStep1,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMirror, setIsMirror] = useState<boolean>(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(3); // 3s or 5s
  const [flashEnabled, setFlashEnabled] = useState<boolean>(true);

  // Auto shooting sequence states
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [currentSlot, setCurrentSlot] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [poseIndex, setPoseIndex] = useState<number>(0);

  // Local photos state during shooting
  const [localPhotos, setLocalPhotos] = useState<CapturedPhoto[]>(photos);

  const selectedTheme = FRAME_THEMES.find((t) => t.id === settings.themeId) || FRAME_THEMES[0];
  const selectedColor = FRAME_COLORS.find((c) => c.id === settings.colorId) || FRAME_COLORS[0];
  const selectedFilter = PHOTO_FILTERS.find((f) => f.id === settings.filterId) || PHOTO_FILTERS[0];

  const targetPhotoCount = settings.layoutType === 'strip-3' ? 3 : 4;
  const hasAllPhotos = localPhotos.filter(Boolean).length === targetPhotoCount;

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
          aspectRatio: { ideal: 4 / 3 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setCameraError('Không thể mở camera. Bạn có thể cho phép quyền camera hoặc tải ảnh từ máy nhé!');
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Cycle cute pose ideas periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setPoseIndex((prev) => (prev + 1) % POSE_SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Capture single frame from webcam
  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (isMirror && facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.95);
  }, [isMirror, facingMode]);

  // Trigger flash effect
  const triggerFlash = () => {
    if (flashEnabled) {
      setIsFlashing(true);
      playShutterSound();
      setTimeout(() => {
        setIsFlashing(false);
      }, 160);
    } else {
      playShutterSound();
    }
  };

  // Start automatic sequence
  const startAutoCaptureSequence = async () => {
    if (isShooting) return;
    setIsShooting(true);

    const capturedList: CapturedPhoto[] = [];
    setLocalPhotos([]);

    for (let slot = 0; slot < targetPhotoCount; slot++) {
      setCurrentSlot(slot);

      for (let sec = timerDuration; sec >= 1; sec--) {
        setCountdown(sec);
        playCountdownBeep(sec);
        await new Promise((res) => setTimeout(res, 1000));
      }

      setCountdown(0);
      triggerFlash();

      const imgData = captureFrame();
      if (imgData) {
        const newPhoto: CapturedPhoto = {
          id: `shot-${Date.now()}-${slot}`,
          dataUrl: imgData,
          timestamp: Date.now(),
          index: slot,
        };
        capturedList.push(newPhoto);
        setLocalPhotos([...capturedList]);
      }

      if (slot < targetPhotoCount - 1) {
        setCountdown(null);
        await new Promise((res) => setTimeout(res, 1200));
      }
    }

    setCountdown(null);
    setCurrentSlot(null);
    setIsShooting(false);

    onPhotosCaptured(capturedList);
    playSuccessChime();

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onFinishStep2();
    }, 1300);
  };

  // Capture single manual shot
  const captureSingleManual = (slotIndex: number) => {
    triggerFlash();
    const imgData = captureFrame();
    if (imgData) {
      const newPhotos = [...localPhotos];
      newPhotos[slotIndex] = {
        id: `manual-${Date.now()}-${slotIndex}`,
        dataUrl: imgData,
        timestamp: Date.now(),
        index: slotIndex,
      };
      setLocalPhotos(newPhotos);
      onPhotosCaptured(newPhotos);
    }
  };

  const handleUploadComplete = (uploaded: CapturedPhoto[]) => {
    setLocalPhotos(uploaded);
    onPhotosCaptured(uploaded);
    setShowUploadModal(false);
    playSuccessChime();
    setTimeout(() => {
      onFinishStep2();
    }, 600);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <button
          id="btn-back-step1"
          onClick={onBackToStep1}
          disabled={isShooting}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-rose-50 text-neutral-700 text-xs font-bold transition-all border border-rose-100 shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Đổi Khung</span>
        </button>

        {/* Cute Pose Suggestion Pill */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-200 text-neutral-800 text-xs font-bold shadow-2xs">
          <LottieIcon name="sparkle" size={16} />
          <span>Gợi ý tạo dáng: {POSE_SUGGESTIONS[poseIndex]}</span>
        </div>

        {/* Photo counter badge */}
        <div className="flex items-center gap-1.5 bg-rose-100/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-800">
          <span>{localPhotos.filter(Boolean).length}/{targetPhotoCount} tấm xinh 🌸</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Camera Viewport & Controls */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Viewport Frame */}
          <div className="relative w-full aspect-[4/3] max-w-2xl rounded-3xl overflow-hidden bg-neutral-950 shadow-xl border-4 border-white flex items-center justify-center">
            {/* Flash Overlay */}
            {isFlashing && (
              <div className="absolute inset-0 z-40 bg-white opacity-95 transition-opacity duration-150 pointer-events-none" />
            )}

            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-all duration-200 ${
                isMirror && facingMode === 'user' ? 'scale-x-[-1]' : ''
              } ${selectedFilter.filterClass}`}
            />

            <canvas ref={canvasRef} className="hidden" />

            {/* Big Countdown Overlay */}
            {countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/5 pointer-events-none animate-in fade-in duration-100">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl sm:text-6xl font-black font-['Quicksand'] text-white/70 backdrop-blur-[2px] bg-white/10 px-6 py-4 rounded-3xl border border-white/20 shadow-xs select-none">
                    {countdown}
                  </span>
                  <p className="text-white/60 text-[11px] sm:text-xs font-bold mt-3 tracking-wide drop-shadow-md bg-neutral-950/30 backdrop-blur-[1px] px-2.5 py-1 rounded-full border border-white/5">
                    📸 Tấm {(currentSlot ?? 0) + 1}/{targetPhotoCount}
                  </p>
                </div>
              </div>
            )}

            {/* Camera Floating Top Pill Toolbar */}
            <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs border border-white/20">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold text-[11px]">Sẵn sàng</span>
              </div>

              {/* Quick Settings Bar */}
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/20 text-white">
                {/* Timer Toggle */}
                <button
                  id="btn-toggle-timer"
                  onClick={() => setTimerDuration(timerDuration === 3 ? 5 : 3)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-xs font-bold"
                  title="Đổi thời gian đếm ngược"
                >
                  <span className="text-[11px]">{timerDuration}s</span>
                </button>

                {/* Flash Toggle */}
                <button
                  id="btn-toggle-flash"
                  onClick={() => setFlashEnabled(!flashEnabled)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-xs"
                  title="Bật/Tắt đèn flash chớp sáng"
                >
                  {flashEnabled ? <LightningFill className="w-4 h-4 text-amber-300" /> : <Lightning className="w-4 h-4 text-white/50" />}
                </button>

                {/* Mirror Toggle */}
                <button
                  id="btn-toggle-mirror"
                  onClick={() => setIsMirror(!isMirror)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-xs ${
                    isMirror ? 'bg-white/30 text-white' : 'text-white/60 hover:bg-white/20'
                  }`}
                  title="Lật gương camera"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>

                {/* Flip Camera Device */}
                <button
                  id="btn-switch-camera"
                  onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-xs"
                  title="Chuyển camera trước/sau"
                >
                  <ArrowRepeat className="w-4 h-4" />
                </button>
              </div>

              {/* Upload fallback button */}
              <button
                id="btn-open-upload-modal"
                onClick={() => setShowUploadModal(true)}
                disabled={isShooting}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                title="Tải ảnh từ điện thoại/máy tính"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>

            {/* Camera Error Message Overlay */}
            {cameraError && (
              <div className="absolute inset-0 z-30 bg-neutral-900/95 text-white flex flex-col items-center justify-center p-6 text-center">
                <ExclamationCircleFill className="w-12 h-12 text-rose-400 mb-2" />
                <h3 className="text-base font-bold">Không thể mở Camera</h3>
                <p className="text-xs text-neutral-300 max-w-xs mt-1 mb-4 leading-relaxed">
                  {cameraError}
                </p>
                <div className="flex gap-2">
                  <button
                    id="btn-retry-camera"
                    onClick={startCamera}
                    className="px-4 py-2 rounded-full bg-white text-neutral-900 font-bold text-xs hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRepeat className="w-3.5 h-3.5" /> Thử lại
                  </button>
                  <button
                    id="btn-upload-fallback-camera"
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Tải ảnh từ máy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cute Camera Shutter & Slot Selector Controls */}
          <div className="w-full max-w-2xl mt-5 bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-rose-100/80 shadow-[0_4px_20px_rgba(244,114,182,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Slot Quick Selector */}
            <div className="flex items-center gap-1.5 bg-rose-50/50 p-1.5 rounded-2xl border border-rose-100/60">
              {Array.from({ length: targetPhotoCount }, (_, idx) => {
                const isShot = Boolean(localPhotos[idx]);
                const isCurrent = currentSlot === idx;

                return (
                  <button
                    key={idx}
                    id={`btn-slot-${idx}`}
                    onClick={() => captureSingleManual(idx)}
                    disabled={isShooting}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-neutral-900 text-white shadow-xs scale-105'
                        : isShot
                        ? 'bg-white text-neutral-900 border border-rose-200 shadow-2xs'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-rose-100/50'
                    }`}
                    title={`Chụp riêng ô #${idx + 1}`}
                  >
                    <span>Ô #{idx + 1}</span>
                    {isShot && <span className="text-[10px] text-emerald-500">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Cute Signature Circular Shutter Trigger */}
            <div className="flex items-center gap-3.5">
              <button
                id="btn-trigger-3shots"
                onClick={startAutoCaptureSequence}
                disabled={isShooting}
                className="group relative flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                title={`Bắt đầu chụp tự động ${targetPhotoCount} tấm`}
              >
                {/* Outer Ring */}
                <div className="w-18 h-18 rounded-full border-4 border-neutral-900 p-1 flex items-center justify-center bg-white shadow-md">
                  {/* Inner Solid Shutter Circle */}
                  <div
                    className={`w-full h-full rounded-full transition-all duration-200 flex items-center justify-center ${
                      isShooting
                        ? 'bg-rose-500 scale-75 animate-pulse'
                        : 'bg-neutral-900 group-hover:scale-95 group-hover:bg-neutral-800'
                    }`}
                  >
                    <CameraFill className="w-6 h-6 text-white" />
                  </div>
                </div>
              </button>

              <div className="text-left">
                <p className="text-xs sm:text-sm font-extrabold text-neutral-900 font-['Quicksand']">
                  {isShooting ? `Đang chụp ô #${(currentSlot ?? 0) + 1}...` : `Chụp Tự Động ${targetPhotoCount} Tấm 📸`}
                </p>
                <p className="text-[11px] text-neutral-500 font-medium">
                  Đếm ngược {timerDuration}s mỗi tấm ảnh
                </p>
              </div>
            </div>

            {/* Next Step Action if All Photos Ready */}
            {hasAllPhotos ? (
              <button
                id="btn-next-step3-top"
                onClick={onFinishStep2}
                className="px-5 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm animate-bounce"
              >
                <span>Trang Trí</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="hidden sm:block text-[11px] text-neutral-400 font-medium">
                Chụp đủ {targetPhotoCount} tấm nhé ✨
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Docked Live Photo Strip Card */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-5 border border-rose-100/80 shadow-[0_8px_30px_rgba(244,114,182,0.04)] flex flex-col items-center sticky top-20">
            <div className="flex items-center justify-between w-full mb-3 px-1">
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                <LottieIcon name="sparkle" size={16} /> Dải Ảnh Của Bạn
              </span>
              <span className="text-xs font-bold text-neutral-700 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                {localPhotos.filter(Boolean).length}/{targetPhotoCount}
              </span>
            </div>

            {/* The Live Photo Strip Preview */}
            <div className="scale-95 sm:scale-100 transition-all">
              <PhotoStrip
                photos={localPhotos}
                settings={settings}
                theme={selectedTheme}
                color={selectedColor}
                filter={selectedFilter}
                highlightSlot={currentSlot}
              />
            </div>

            {/* Advance to Step 3 CTA */}
            {hasAllPhotos && (
              <button
                id="btn-next-step3"
                onClick={onFinishStep2}
                className="w-full mt-5 py-3.5 px-5 rounded-full bg-neutral-900 hover:bg-black text-white font-bold text-sm shadow-md active:scale-[0.98] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Xem Kết Quả & Dán Sticker 🎀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fallback Upload Modal */}
      {showUploadModal && (
        <FallbackUpload
          photoCount={targetPhotoCount}
          onPhotosUploaded={handleUploadComplete}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
};
