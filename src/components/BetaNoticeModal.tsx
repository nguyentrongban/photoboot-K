import React, { useState } from 'react';
import { X, Sparkles, Palette, Wrench } from 'lucide-react';
import { playSuccessChime } from '../utils/audio';

interface BetaNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'piczo_beta_notice_v1';

export const BetaNoticeModal: React.FC<BetaNoticeModalProps> = ({ isOpen, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleDismiss = () => {
    playSuccessChime();
    if (dontShowAgain) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          dismissedAt: Date.now(),
        })
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="beta-notice-modal"
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-rose-100 font-['Quicksand'] animate-in zoom-in-95 duration-200"
      >
        {/* Compact Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50 via-pink-50/60 to-white border-b border-rose-100/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-neutral-900 leading-tight">
                  Thông Báo Thử Nghiệm
                </h3>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-extrabold uppercase">
                  Beta
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                PicZo Photobooth Hàn Quốc 📸
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors cursor-pointer border border-neutral-200/60"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Short & Focused Body */}
        <div className="p-4 sm:p-5 space-y-3 bg-[#FAF8F5]/60 text-xs text-neutral-700">
          <p className="text-[13px] text-neutral-600 font-medium leading-relaxed">
            PicZo đang trong <strong>giai đoạn thử nghiệm sớm</strong> để hoàn thiện trải nghiệm tốt nhất cho bạn:
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-white border border-rose-100 flex items-center gap-3 shadow-3xs">
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                <Palette className="w-4 h-4" />
              </div>
              <p className="leading-snug">
                <strong>Khung ảnh & Sticker</strong> đang được vẽ và bổ sung liên tục mỗi ngày.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-rose-100 flex items-center gap-3 shadow-3xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <p className="leading-snug">
                <strong>Một số tính năng mới</strong> đang trong quá trình nâng cấp và tối ưu.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 text-center pt-1">
            Cảm ơn bạn đã ghé trải nghiệm và ủng hộ tụi mình! 💖
          </p>
        </div>

        {/* Compact Footer */}
        <div className="p-3.5 sm:p-4 border-t border-rose-100 bg-white flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-[11px] text-neutral-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-neutral-300 text-rose-500 focus:ring-rose-400 accent-rose-500 cursor-pointer"
            />
            <span>Đã hiểu, không hiện lại hôm nay</span>
          </label>

          <button
            onClick={handleDismiss}
            className="py-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <span>Trải Nghiệm Ngay ✨</span>
          </button>
        </div>
      </div>
    </div>
  );
};
