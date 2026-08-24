import React from 'react';
import { CapturedPhoto, PhotoboothSettings } from '../types';
import { FRAME_THEMES, FRAME_COLORS, PHOTO_FILTERS, SAMPLE_PHOTOS, LAYOUT_OPTIONS } from '../data/themesAndColors';
import { PhotoStrip } from './PhotoStrip';
import { FrameThemeCard } from './FrameThemeCard';
import { CameraFill, CheckLg } from 'react-bootstrap-icons';
import { LottieIcon } from './LottieIcon';
import { Heart } from 'lucide-react';

interface Step1ConfigProps {
  settings: PhotoboothSettings;
  onUpdateSettings: (updater: Partial<PhotoboothSettings>) => void;
  onStartCapture: () => void;
  onOpenDuoModal?: () => void;
}

export const Step1Config: React.FC<Step1ConfigProps> = ({
  settings,
  onUpdateSettings,
  onStartCapture,
  onOpenDuoModal,
}) => {
  const selectedTheme = FRAME_THEMES.find((t) => t.id === settings.themeId) || FRAME_THEMES[0];
  const selectedColor = FRAME_COLORS.find((c) => c.id === settings.colorId) || FRAME_COLORS[0];
  const selectedFilter = PHOTO_FILTERS.find((f) => f.id === settings.filterId) || PHOTO_FILTERS[0];
  const currentLayout = LAYOUT_OPTIONS.find((l) => l.id === settings.layoutType) || LAYOUT_OPTIONS[0];

  // Dummy sample preview photos for Step 1 (up to 4)
  const previewPhotos: CapturedPhoto[] = SAMPLE_PHOTOS.map((url, i) => ({
    id: `sample-${i}`,
    dataUrl: url,
    timestamp: Date.now(),
    index: i,
  }));

  const photoCount = currentLayout.photoCount;

  // Visual Theme Stickers & Icons
  const themeIcons: Record<string, string> = {
    pink_lattice_hearts: '💕',
    happy_with_you: '🌿',
    grunge_sulfus: '🖤',
    airmail_postcard: '✈️',
    teddy_cozy_check: '🧸',
    wedding_cake: '🕊️',
    cute: '🎀',
    minimal: '🖤',
    vintage: '🎞️',
    party: '🎉',
    korean: '🌙',
    y2k: '⚡',
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Friendly Header Title & Duo Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2 font-['Quicksand']">
            <span>Thiết Kế Khung Xinh</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
              {photoCount} tấm ảnh 📸
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
            Chọn kiểu dáng và màu sắc yêu thích, sau đó bắt đầu chụp ảnh nhé! ✨
          </p>
        </div>

        {/* Duo Booth Quick Trigger Badge */}
        {onOpenDuoModal && (
          <button
            id="btn-open-duo-banner"
            onClick={onOpenDuoModal}
            className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-pink-200 transition-all hover:scale-105 active:scale-95 cursor-pointer text-left font-['Quicksand']"
          >
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-black">
                <span>Chụp Đôi Yêu Xa 💕</span>
                <span className="text-[9px] bg-white text-rose-600 px-1.5 py-0.5 rounded-full uppercase">Realtime</span>
              </div>
              <p className="text-[10px] text-white/90 font-medium">Kết nối 2 máy chụp chung thời gian thực</p>
            </div>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Clean & Cute Customization Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Layout Picker */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-rose-100/80 shadow-[0_4px_20px_rgba(244,114,182,0.03)] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center p-1 shadow-2xs">
                  <LottieIcon name="layout" size={22} />
                </div>
                <span className="font-extrabold text-sm sm:text-base text-neutral-900 font-['Quicksand']">
                  1. Chọn Bố Cục
                </span>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                {currentLayout.photoCount} ảnh
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {LAYOUT_OPTIONS.map((layout) => {
                const isSelected = layout.id === settings.layoutType;
                return (
                  <button
                    key={layout.id}
                    id={`layout-select-${layout.id}`}
                    onClick={() => {
                      onUpdateSettings({
                        layoutType: layout.id,
                        ...(layout.id === 'grid-4' && settings.themeId === 'wedding_cake'
                          ? { title: 'AMIRA & SPENCE', subtitle: 'Our Wedding Day' }
                          : {}),
                      });
                    }}
                    className={`relative p-3.5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md scale-[1.02]'
                        : 'border-rose-100/80 bg-rose-50/20 hover:bg-rose-50/50 hover:border-rose-200 text-neutral-800'
                    }`}
                  >
                    {/* Cute visual frame layout diagram */}
                    <div className="mb-2 w-10 h-10 flex items-center justify-center">
                      {layout.id === 'single-1' ? (
                        <div className="flex items-center justify-center w-6 h-9 p-0.5 rounded-lg border-2 border-current">
                          <div className="bg-current w-full h-full rounded-xs opacity-70" />
                        </div>
                      ) : layout.id === 'strip-2' ? (
                        <div className="flex flex-row gap-1 w-9 h-6 p-0.5 rounded-lg border-2 border-current items-center justify-center">
                          <div className="bg-current flex-1 h-full opacity-70" />
                          <div className="bg-current flex-1 h-full opacity-70" />
                        </div>
                      ) : layout.id === 'grid-4' ? (
                        <div className="grid grid-cols-2 gap-1 w-8 h-8 p-1 rounded-lg border-2 border-current">
                          <div className="bg-current rounded-xs opacity-70" />
                          <div className="bg-current rounded-xs opacity-70" />
                          <div className="bg-current rounded-xs opacity-70" />
                          <div className="bg-current rounded-xs opacity-70" />
                        </div>
                      ) : layout.id === 'grid-4-rect' ? (
                        <div className="grid grid-cols-2 gap-1 w-8 h-10 p-1 rounded-lg border-2 border-current">
                          <div className="bg-current rounded-xs opacity-70" />
                          <div className="bg-current rounded-xs opacity-70" />
                          <div className="bg-current rounded-xs opacity-70" />
                          <div className="bg-current rounded-xs opacity-70" />
                        </div>
                      ) : layout.id === 'strip-3' ? (
                        <div className="flex flex-col gap-1 w-5 h-9 p-0.5 rounded-lg border-2 border-current">
                          <div className="bg-current flex-1 rounded-xs opacity-70" />
                          <div className="bg-current flex-1 rounded-xs opacity-70" />
                          <div className="bg-current flex-1 rounded-xs opacity-70" />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-0.5 w-5 h-9 p-0.5 rounded-lg border-2 border-current">
                          <div className="bg-current flex-1 rounded-xs opacity-70" />
                          <div className="bg-current flex-1 rounded-xs opacity-70" />
                          <div className="bg-current flex-1 rounded-xs opacity-70" />
                          <div className="bg-current flex-1 rounded-xs opacity-70" />
                        </div>
                      )}
                    </div>

                    <span className="font-bold text-xs leading-tight">
                      {layout.name.split(' (')[0]}
                    </span>
                    <span
                      className={`text-[10px] mt-0.5 font-medium ${
                        isSelected ? 'text-white/80' : 'text-neutral-400'
                      }`}
                    >
                      {layout.aspectRatioLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Theme & Sticker Style Picker */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-rose-100/80 shadow-[0_4px_20px_rgba(244,114,182,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-200/60 flex items-center justify-center p-1 shadow-2xs">
                  <LottieIcon name="style" size={22} />
                </div>
                <span className="font-extrabold text-sm sm:text-base text-neutral-900 font-['Quicksand']">
                  2. Phong Cách & Viền Trang Trí
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-500">
                {selectedTheme.name}
              </span>
            </div>

            {/* Sub-section 1: Khung Ảnh Thiết Kế Độc Quyền (Image Overlay Templates) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
                  ✨ Khung Ảnh Nghệ Thuật (Image Frame)
                </span>
                <span className="text-[11px] text-neutral-400">Thiết kế viền ảnh độc quyền</span>
              </div>
              <div
                className={`grid gap-3 sm:gap-4 items-start ${
                  settings.layoutType === 'grid-4'
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
                }`}
              >
                {FRAME_THEMES.filter((t) => t.isImageOverlay).map((theme) => {
                  const isSelected = theme.id === settings.themeId;

                  return (
                    <FrameThemeCard
                      key={theme.id}
                      theme={theme}
                      isSelected={isSelected}
                      layoutType={settings.layoutType}
                      onSelect={() => {
                        onUpdateSettings({
                          themeId: theme.id,
                          ...(theme.hasFixedColor
                            ? { colorId: theme.fixedColorId || 'cream', customColorHex: undefined }
                            : {}),
                        });
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Sub-section 2: Khung Viền Hoạ Tiết & Tự Đổi Màu (Standard Decorative Frames) */}
            <div className="space-y-2 pt-3 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
                  🎨 Khung Viền Trang Trí & Tuỳ Chỉnh Màu
                </span>
                <span className="text-[11px] text-neutral-400">Tự do đổi màu nền & bố cục</span>
              </div>
              <div
                className={`grid gap-3 sm:gap-4 items-start ${
                  settings.layoutType === 'grid-4'
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
                }`}
              >
                {FRAME_THEMES.filter((t) => !t.isImageOverlay).map((theme) => {
                  const isSelected = theme.id === settings.themeId;

                  return (
                    <FrameThemeCard
                      key={theme.id}
                      theme={theme}
                      isSelected={isSelected}
                      layoutType={settings.layoutType}
                      onSelect={() => {
                        onUpdateSettings({
                          themeId: theme.id,
                          ...(theme.hasFixedColor
                            ? { colorId: theme.fixedColorId || 'cream', customColorHex: undefined }
                            : {}),
                          ...(theme.id === 'airmail_postcard'
                            ? {
                                title: 'KATE & JACKSON',
                                subtitle: 'got hitched!',
                                customDate: '1.10.14',
                              }
                            : {}),
                          ...(theme.id === 'teddy_cozy_check'
                            ? {
                                title: 'cozy moments',
                                subtitle: 'love yourself ♡',
                                customDate: '08. 23. 26',
                              }
                            : {}),
                          ...(theme.id === 'wedding_cake'
                            ? {
                                title: 'AMIRA & SPENCE',
                                subtitle: 'Our Wedding Day',
                                customDate: '08. 23. 25',
                              }
                            : {}),
                        });
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Color Palette Swatches */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-rose-100/80 shadow-[0_4px_20px_rgba(244,114,182,0.03)] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center p-1 shadow-2xs">
                  <LottieIcon name="color" size={22} />
                </div>
                <span className="font-extrabold text-sm sm:text-base text-neutral-900 font-['Quicksand']">
                  3. Màu Nền Khung
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-500">
                {selectedColor.name}
              </span>
            </div>

            {selectedTheme.hasFixedColor ? (
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 flex items-center gap-3 text-amber-900 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0 font-bold text-sm">
                  🔒
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold font-['Quicksand'] flex items-center gap-1.5">
                    <span>Màu sắc cố định theo chủ đề "{selectedTheme.name}"</span>
                  </p>
                  <p className="text-[11px] text-amber-700 font-medium">
                    Khung thiết kế này được phối màu đặc biệt. Hãy chọn chủ đề khác nếu bạn muốn tự chọn màu nền nhé!
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-3 pt-1">
                {FRAME_COLORS.map((col) => {
                  const isSelected = col.id === settings.colorId && !settings.customColorHex;
                  return (
                    <button
                      key={col.id}
                      id={`color-select-${col.id}`}
                      onClick={() => onUpdateSettings({ colorId: col.id, customColorHex: undefined })}
                      className="flex flex-col items-center gap-1 group focus:outline-hidden cursor-pointer"
                      title={col.name}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
                          isSelected
                            ? 'scale-110 ring-2 ring-neutral-900 ring-offset-2 border-white shadow-sm'
                            : 'border-black/10 hover:scale-105'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {isSelected && (
                          <CheckLg
                            className="w-4 h-4 font-black"
                            style={{ color: col.textColor }}
                          />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-neutral-500 truncate max-w-[50px]">
                        {col.name.split(' (')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Photo Filter Preset */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-rose-100/80 shadow-[0_4px_20px_rgba(244,114,182,0.03)] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center p-1 shadow-2xs">
                  <LottieIcon name="filter" size={22} />
                </div>
                <span className="font-extrabold text-sm sm:text-base text-neutral-900 font-['Quicksand']">
                  4. Màu Da & Bộ Lọc Xinh
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-500">
                {selectedFilter.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PHOTO_FILTERS.map((f) => {
                const isSelected = f.id === settings.filterId;
                return (
                  <button
                    key={f.id}
                    id={`filter-select-${f.id}`}
                    onClick={() => onUpdateSettings({ filterId: f.id })}
                    className={`py-2.5 px-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white font-bold shadow-xs'
                        : 'border-rose-100 bg-white hover:bg-rose-50/30 text-neutral-700 font-medium'
                    }`}
                  >
                    <span className="text-xs">{f.name}</span>
                    {isSelected && <CheckLg className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Clean & Cute Custom Inscriptions */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-rose-100/80 shadow-[0_4px_20px_rgba(244,114,182,0.03)] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center p-1 shadow-2xs">
                <LottieIcon name="signature" size={22} />
              </div>
              <span className="font-extrabold text-sm sm:text-base text-neutral-900 font-['Quicksand']">
                5. Ký Tên & Ngày Kỷ Niệm (Tùy chọn)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-500 block mb-1">
                  Tiêu đề / Tên cặp đôi
                </label>
                <input
                  id="input-title-text"
                  type="text"
                  value={settings.title}
                  onChange={(e) => onUpdateSettings({ title: e.target.value })}
                  placeholder="VD: AMIRA & SPENCE"
                  maxLength={30}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-rose-50/30 border border-rose-100 text-xs font-semibold text-neutral-900 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-500 block mb-1">
                  Ngày tháng in lên ảnh
                </label>
                <input
                  id="input-date-text"
                  type="text"
                  value={settings.customDate}
                  onChange={(e) => onUpdateSettings({ customDate: e.target.value })}
                  placeholder="VD: 08. 23. 25"
                  maxLength={30}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-rose-50/30 border border-rose-100 text-xs font-semibold text-neutral-900 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-hidden transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Photo Strip Preview & Floating Shutter CTA */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
          <div className="w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-5 border border-rose-100/90 shadow-[0_8px_30px_rgba(244,114,182,0.06)] flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3 px-1">
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                <LottieIcon name="sparkle" size={16} /> Xem Trước
              </span>
              <span className="text-xs font-bold text-neutral-700 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                {currentLayout.name.split(' (')[0]}
              </span>
            </div>

            {/* The Live Photo Strip Preview */}
            <div className="scale-95 sm:scale-100 transition-transform">
              <PhotoStrip
                photos={previewPhotos}
                settings={settings}
                theme={selectedTheme}
                color={selectedColor}
                filter={selectedFilter}
              />
            </div>

            {/* Big Primary Shutter CTA */}
            <div className="w-full mt-6">
              <button
                id="btn-start-capture"
                onClick={onStartCapture}
                className="w-full py-4 px-6 rounded-full bg-neutral-900 hover:bg-black text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LottieIcon name="camera" size={20} />
                </div>
                <span>Bắt Đầu Chụp ({photoCount} Tấm) 📸</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
