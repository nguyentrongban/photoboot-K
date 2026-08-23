import React, { useState, useEffect } from 'react';
import { Sparkles, X, Info } from 'lucide-react';
import { CapturedPhoto, PhotoboothSettings, Step, DuoMode, PlacedSticker } from './types';
import { Header } from './components/Header';
import { Step1Config } from './components/Step1Config';
import { Step2Camera } from './components/Step2Camera';
import { Step3Result } from './components/Step3Result';
import { SeoContentSection } from './components/SeoContentSection';
import { DuoModal } from './components/DuoModal';
import { PromoKitModal } from './components/PromoKitModal';
import { BetaNoticeModal } from './components/BetaNoticeModal';
import { DuoCameraScreen } from './components/DuoCameraScreen';
import { useDuoSocket } from './utils/useDuoSocket';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const [settings, setSettings] = useState<PhotoboothSettings>({
    layoutType: 'strip-3',
    themeId: 'airmail_postcard',
    colorId: 'airmail_kraft',
    filterId: 'none',
    title: 'KATE & JACKSON',
    subtitle: 'got hitched!',
    showDate: true,
    customDate: '1.10.14',
    showQrCode: true,
    showFilmHoles: false,
    isDoubleStrip: false,
    stickers: [],
    skinSmooth: 30,
    duoMode: 'split-heart',
  });

  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [isDuoModalOpen, setIsDuoModalOpen] = useState<boolean>(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false);
  const [isBetaModalOpen, setIsBetaModalOpen] = useState<boolean>(false);
  const [initialRoomCode, setInitialRoomCode] = useState<string>('');
  const [roomDeletedNotice, setRoomDeletedNotice] = useState<string | null>(null);

  // Duo WebSocket Hook
  const {
    isConnected,
    isConnecting,
    roomState,
    currentUser,
    remoteStream,
    activeReactions,
    incomingCountdown,
    connectToWs,
    initWebRTC,
    triggerCountdown,
    uploadPhoto,
    updateSettings,
    updateStickers,
    sendReaction,
    sendChat,
    changeStep,
    leaveRoom,
  } = useDuoSocket({
    onReactionReceived: () => {},
    onRoomDeleted: (reason) => {
      setRoomDeletedNotice(reason);
      // Clean query params
      if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      setCurrentStep(1);
    },
  });

  // Check URL parameters and check Beta Notice localStorage on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
      setInitialRoomCode(roomParam.toUpperCase());
      setIsDuoModalOpen(true);
    } else {
      // Check if user dismissed beta notice in the last 24 hours
      try {
        const stored = localStorage.getItem('piczo_beta_notice_v1');
        if (stored) {
          const { dismissedAt } = JSON.parse(stored);
          const oneDay = 24 * 60 * 60 * 1000;
          if (Date.now() - dismissedAt > oneDay) {
            setTimeout(() => setIsBetaModalOpen(true), 400);
          }
        } else {
          setTimeout(() => setIsBetaModalOpen(true), 400);
        }
      } catch {
        setTimeout(() => setIsBetaModalOpen(true), 400);
      }
    }
  }, []);

  // Synchronize room settings to local state if roomState changes
  useEffect(() => {
    if (roomState?.settings) {
      setSettings((prev) => ({
        ...prev,
        ...roomState.settings,
        stickers: roomState.stickers || roomState.settings.stickers || prev.stickers,
      }));
    }
  }, [roomState?.settings, roomState?.stickers]);

  const targetPhotoCount = settings.layoutType === 'strip-3' ? 3 : 4;

  const handleUpdateSettings = (updater: Partial<PhotoboothSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updater };
      if (roomState) {
        updateSettings(updater);
      }
      return next;
    });
  };

  const handleStartCapture = () => {
    setCurrentStep(2);
  };

  const handlePhotosCaptured = (captured: CapturedPhoto[]) => {
    setPhotos(captured);
  };

  const handleFinishStep2 = () => {
    setCurrentStep(3);
  };

  const handleRetake = () => {
    setPhotos([]);
    setCurrentStep(2);
  };

  const handleResetAll = () => {
    if (window.confirm('Bạn có muốn làm mới từ đầu không? Toàn bộ ảnh sẽ được tạo mới.')) {
      setPhotos([]);
      setCurrentStep(1);
    }
  };

  // Duo Room Join handler
  const handleJoinDuoRoom = (roomCode: string, userName: string, isHost: boolean, duoMode?: DuoMode) => {
    if (duoMode) {
      setSettings((prev) => ({ ...prev, duoMode }));
    }
    connectToWs(roomCode, userName);
    setIsDuoModalOpen(false);
    setCurrentStep(2); // Jump directly to Camera studio for Duo
  };

  const handleLeaveDuoRoom = () => {
    leaveRoom();
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setRoomDeletedNotice('Bạn đã rời phòng. Phòng chụp đã được đóng và giải phóng hoàn toàn.');
    setCurrentStep(1);
  };

  const handleFinishDuoPhotos = (mergedPhotos: CapturedPhoto[]) => {
    setPhotos(mergedPhotos);
    setCurrentStep(3);
    if (roomState) {
      changeStep(3);
    }
  };

  const canGoToStep2 = true;
  const canGoToStep3 = photos.filter(Boolean).length === targetPhotoCount;
  const isDuoActive = Boolean(roomState && currentUser);
  const partnerName = roomState && currentUser
    ? Object.values(roomState.members).find((m) => m.id !== currentUser.id)?.name
    : undefined;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col selection:bg-rose-200 selection:text-rose-900 font-sans text-neutral-900 antialiased">
      {/* Header */}
      <Header
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        canGoToStep2={canGoToStep2}
        canGoToStep3={canGoToStep3}
        onResetAll={handleResetAll}
        onOpenDuoModal={() => setIsDuoModalOpen(true)}
        onOpenPromoModal={() => setIsPromoModalOpen(true)}
        onOpenBetaModal={() => setIsBetaModalOpen(true)}
        isDuoActive={isDuoActive}
      />

      {/* Main Screen according to Step */}
      <main className="flex-1 flex flex-col justify-start">
        {roomDeletedNotice && (
          <div className="w-full max-w-4xl mx-auto px-4 mt-3 animate-fade-in">
            <div className="flex items-center justify-between gap-3 bg-rose-50/95 border border-rose-200 text-rose-900 px-4 py-3 rounded-2xl shadow-2xs">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                <Info className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{roomDeletedNotice}</span>
              </div>
              <button
                onClick={() => setRoomDeletedNotice(null)}
                className="text-rose-400 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-100/60 transition-all cursor-pointer"
                title="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <Step1Config
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onStartCapture={handleStartCapture}
            onOpenDuoModal={() => setIsDuoModalOpen(true)}
          />
        )}

        {currentStep === 2 && (
          isDuoActive && roomState && currentUser ? (
            <DuoCameraScreen
              settings={settings}
              roomState={roomState}
              currentUser={currentUser}
              remoteStream={remoteStream}
              activeReactions={activeReactions}
              incomingCountdown={incomingCountdown}
              onTriggerCountdown={triggerCountdown}
              onUploadPhoto={uploadPhoto}
              onSendReaction={sendReaction}
              onSendChat={sendChat}
              onFinishDuo={handleFinishDuoPhotos}
              onLeaveRoom={handleLeaveDuoRoom}
              onUpdateSettings={handleUpdateSettings}
              onInitWebRTC={initWebRTC}
            />
          ) : isConnecting ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center font-['Quicksand']">
              <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center mb-4 shadow-sm animate-pulse">
                <Sparkles className="w-8 h-8 text-rose-500 animate-spin" />
              </div>
              <h3 className="text-lg font-black text-neutral-800">Đang kết nối vào phòng chụp đôi...</h3>
              <p className="text-xs text-neutral-500 mt-1">Đang thiết lập phòng và chuẩn bị camera của bạn</p>
            </div>
          ) : (
            <Step2Camera
              settings={settings}
              photos={photos}
              onPhotosCaptured={handlePhotosCaptured}
              onFinishStep2={handleFinishStep2}
              onBackToStep1={() => setCurrentStep(1)}
            />
          )
        )}

        {currentStep === 3 && (
          <Step3Result
            photos={photos}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onRetake={handleRetake}
            isDuoActive={isDuoActive}
            partnerName={partnerName}
            onSyncStickers={isDuoActive ? updateStickers : undefined}
          />
        )}

        {/* Duo Booth Modal Dialog */}
        <DuoModal
          settings={settings}
          isOpen={isDuoModalOpen}
          onClose={() => setIsDuoModalOpen(false)}
          onJoinRoom={handleJoinDuoRoom}
          initialRoomCode={initialRoomCode}
        />

        {/* Promo Marketing Kit Modal Dialog */}
        <PromoKitModal
          isOpen={isPromoModalOpen}
          onClose={() => setIsPromoModalOpen(false)}
        />

        {/* Early Beta Notice Modal Dialog */}
        <BetaNoticeModal
          isOpen={isBetaModalOpen}
          onClose={() => setIsBetaModalOpen(false)}
        />

        {/* SEO Article & FAQ Section for Google Search Engine Indexing */}
        <SeoContentSection />
      </main>

      {/* Premium Minimalist Footer */}
      <footer className="w-full py-6 border-t border-neutral-100 bg-white/80 backdrop-blur-md text-[11px] text-neutral-400 font-['Quicksand']">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:items-start gap-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <p className="font-bold text-neutral-700 text-xs tracking-wide">
                🌸 PicZo Studio
              </p>
              <button
                onClick={() => setIsBetaModalOpen(true)}
                className="px-2 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold border border-rose-200/60 transition-colors cursor-pointer"
                title="Xem thông báo giai đoạn thử nghiệm"
              >
                Beta v1.0 • Đang phát triển ✨
              </button>
            </div>
            <p className="text-neutral-400">
              Chụp ảnh 4 ô vuông & dải dọc phong cách Hàn Quốc • Kết nối chụp đôi từ xa thời gian thực
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-1.5 text-center sm:text-right">
            <p className="text-neutral-400 font-medium">
              © {new Date().getFullYear()} PicZo • Mọi quyền được bảo lưu
            </p>
            <p className="font-semibold text-neutral-600">
              Góp ý & Đề xuất ý tưởng mới:{" "}
              <a 
                href="mailto:nguyentrongban01052003@gmail.com" 
                className="text-rose-500 hover:text-rose-600 transition-colors underline underline-offset-2 decoration-rose-200 hover:decoration-rose-500"
              >
                nguyentrongban01052003@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

