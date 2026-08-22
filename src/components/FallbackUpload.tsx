import React, { useRef } from 'react';
import { CapturedPhoto } from '../types';
import { Image as ImageIcon, XLg, CheckLg } from 'react-bootstrap-icons';
import { LottieIcon } from './LottieIcon';
import { SAMPLE_PHOTOS } from '../data/themesAndColors';

interface FallbackUploadProps {
  photoCount?: number;
  onPhotosUploaded: (photos: CapturedPhoto[]) => void;
  onClose: () => void;
}

export const FallbackUpload: React.FC<FallbackUploadProps> = ({
  photoCount = 3,
  onPhotosUploaded,
  onClose,
}) => {
  const [selectedImages, setSelectedImages] = React.useState<string[]>(() =>
    Array(photoCount).fill('')
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImages((prev) => {
          const next = [...prev];
          next[slotIndex] = result;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSample = () => {
    const photos: CapturedPhoto[] = SAMPLE_PHOTOS.slice(0, photoCount).map((url, idx) => ({
      id: `sample-${Date.now()}-${idx}`,
      dataUrl: url,
      timestamp: Date.now(),
      index: idx,
    }));
    onPhotosUploaded(photos);
  };

  const handleConfirm = () => {
    const photos: CapturedPhoto[] = selectedImages.map((img, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      dataUrl: img || SAMPLE_PHOTOS[idx % SAMPLE_PHOTOS.length],
      timestamp: Date.now(),
      index: idx,
    }));
    onPhotosUploaded(photos);
  };

  const hasAtLeastOne = selectedImages.some((img) => img !== '');

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-2xl w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-black/[0.08] relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/[0.05] text-neutral-600 hover:bg-black/[0.1] flex items-center justify-center transition-colors cursor-pointer"
        >
          <XLg className="w-3.5 h-3.5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-3">
            <LottieIcon name="camera" size={32} />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
            Tải Ảnh Từ Thiết Bị
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Chọn {photoCount} bức ảnh để ghép vào khung ảnh Photobooth
          </p>
        </div>

        {/* Upload slots */}
        <div className={`grid gap-3 mb-6 ${photoCount === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
          {Array.from({ length: photoCount }, (_, idx) => {
            const img = selectedImages[idx];
            return (
              <label
                key={idx}
                className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-black/[0.12] hover:border-neutral-900 bg-black/[0.02] hover:bg-black/[0.04] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, idx)}
                />
                {img ? (
                  <>
                    <img
                      src={img}
                      alt={`Ảnh ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                      Đổi ảnh
                    </div>
                  </>
                ) : (
                  <div className="p-2 text-center text-neutral-400">
                    <ImageIcon className="w-5 h-5 mx-auto mb-1 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                    <span className="text-[11px] font-semibold block text-neutral-700">#{idx + 1}</span>
                    <span className="text-[9px] text-neutral-400">Tải ảnh</span>
                  </div>
                )}
              </label>
            );
          })}
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            id="btn-confirm-upload"
            onClick={handleConfirm}
            disabled={!hasAtLeastOne}
            className={`w-full py-3 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              hasAtLeastOne
                ? 'bg-neutral-900 hover:bg-black text-white shadow-sm cursor-pointer active:scale-[0.98]'
                : 'bg-black/[0.06] text-neutral-400 cursor-not-allowed'
            }`}
          >
            <CheckLg className="w-4 h-4 font-bold" />
            <span>Sử Dụng Ảnh Đã Chọn</span>
          </button>

          <button
            id="btn-use-sample"
            onClick={handleUseSample}
            className="w-full py-2.5 rounded-full bg-black/[0.03] hover:bg-black/[0.06] text-neutral-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LottieIcon name="sparkle" size={16} />
            <span>Dùng ảnh mẫu chụp sẵn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
