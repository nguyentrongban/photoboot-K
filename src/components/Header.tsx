import React, { useState } from 'react';
import { Step } from '../types';
import { VolumeUpFill, VolumeMuteFill, ArrowCounterclockwise } from 'react-bootstrap-icons';
import { getAudioMuted, setAudioMuted } from '../utils/audio';
import { LottieIcon, LottieIconType } from './LottieIcon';
import logoImg from '../assets/images/piczo_camera_logo_1787394527785.jpg';
import { Heart } from 'lucide-react';

interface HeaderProps {
  currentStep: Step;
  onSelectStep: (step: Step) => void;
  canGoToStep2: boolean;
  canGoToStep3: boolean;
  onResetAll: () => void;
  onOpenDuoModal: () => void;
  onOpenBetaModal?: () => void;
  isDuoActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSelectStep,
  canGoToStep2,
  canGoToStep3,
  onResetAll,
  onOpenDuoModal,
  onOpenBetaModal,
  isDuoActive,
}) => {
  const [muted, setMuted] = React.useState(getAudioMuted());

  const toggleAudio = () => {
    const next = !muted;
    setAudioMuted(next);
    setMuted(next);
  };

  const steps: { id: Step; label: string; lottie: LottieIconType; enabled: boolean }[] = [
    {
      id: 1 as Step,
      label: 'Chọn Khung',
      lottie: 'color',
      enabled: true,
    },
    {
      id: 2 as Step,
      label: 'Chụp Ảnh',
      lottie: 'camera',
      enabled: canGoToStep2,
    },
    {
      id: 3 as Step,
      label: 'Trang Trí',
      lottie: 'style',
      enabled: canGoToStep3,
    },
  ];

  const [imgError, setImgError] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-rose-100/60 shadow-[0_2px_12px_rgba(244,114,182,0.04)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-3">
        {/* Cute Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 p-0.5 shadow-xs shadow-pink-200 overflow-hidden flex items-center justify-center">
            {!imgError ? (
              <img
                src={logoImg}
                alt="PicZo Photobooth Logo"
                className="w-full h-full object-cover rounded-xl"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full text-white flex items-center justify-center p-1">
                <LottieIcon name="camera" size={22} />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-neutral-900 font-['Quicksand']">
                PicZo
              </span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-full">
                인생네컷
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block font-medium">
              Chụp ảnh xinh • Lưu giữ kỷ niệm
            </p>
          </div>
        </div>

        {/* Cute Step Pills */}
        <div className="flex items-center bg-white p-1 rounded-full border border-rose-100/80 shadow-2xs">
          {steps.map((step) => {
            const isActive = currentStep === step.id;

            return (
              <button
                key={step.id}
                id={`nav-step-${step.id}`}
                onClick={() => step.enabled && onSelectStep(step.id)}
                disabled={!step.enabled}
                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs scale-[1.02]'
                    : step.enabled
                    ? 'text-neutral-600 hover:text-neutral-900 hover:bg-rose-50/50'
                    : 'text-neutral-300 opacity-40 cursor-not-allowed'
                }`}
              >
                <LottieIcon name={step.lottie} size={18} />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Duo Booth Trigger, Promo Kit & Tools (Audio & Reset) */}
        <div className="flex items-center gap-2">
          {/* Beta Notice Button */}
          {onOpenBetaModal && (
            <button
              id="btn-open-beta-notice"
              onClick={onOpenBetaModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-rose-50/80 hover:bg-rose-100 text-rose-700 border border-rose-200/70 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Thông báo giai đoạn thử nghiệm (Beta)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping hidden xs:inline" />
              <span className="font-['Quicksand']">Beta</span>
            </button>
          )}

          {/* Duo Booth Button */}
          <button
            id="btn-open-duo-booth"
            onClick={onOpenDuoModal}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isDuoActive
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white animate-pulse'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 hover:scale-105 active:scale-95'
            }`}
            title="Mời người yêu hoặc bạn thân chụp ảnh chung từ xa"
          >
            <Heart className={`w-3.5 h-3.5 ${isDuoActive ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'}`} />
            <span className="hidden xs:inline font-['Quicksand']">
              {isDuoActive ? 'Đang Chụp Đôi' : 'Chụp Đôi Từ Xa'}
            </span>
          </button>

          <button
            id="btn-toggle-audio"
            onClick={toggleAudio}
            title={muted ? 'Bật âm thanh đáng yêu' : 'Tắt âm thanh'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              muted
                ? 'text-neutral-400 hover:text-neutral-700 bg-white border border-neutral-200'
                : 'text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            {muted ? <VolumeMuteFill className="w-4 h-4" /> : <VolumeUpFill className="w-4 h-4" />}
          </button>

          {currentStep > 1 && (
            <button
              id="btn-reset-header"
              onClick={onResetAll}
              title="Làm mới từ đầu"
              className="w-9 h-9 rounded-full text-neutral-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-neutral-200 flex items-center justify-center transition-all cursor-pointer"
            >
              <ArrowCounterclockwise className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

