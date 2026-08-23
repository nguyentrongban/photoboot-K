import React, { useState } from 'react';
import { CapturedPhoto, PhotoboothSettings, PlacedSticker } from '../types';
import { FRAME_THEMES, FRAME_COLORS, PHOTO_FILTERS, STICKER_CATEGORIES, LAYOUT_OPTIONS } from '../data/themesAndColors';
import { PhotoStrip } from './PhotoStrip';
import { FrameThemeCard } from './FrameThemeCard';
import { downloadPhotoStrip, copyPhotoToClipboard } from '../utils/canvasExport';
import {
  Download,
  ArrowCounterclockwise,
  Copy,
  Printer,
  CheckLg,
  LayoutSplit,
} from 'react-bootstrap-icons';
import { LottieIcon } from './LottieIcon';
import confetti from 'canvas-confetti';

interface Step3ResultProps {
  photos: CapturedPhoto[];
  settings: PhotoboothSettings;
  onUpdateSettings: (updater: Partial<PhotoboothSettings>) => void;
  onRetake: () => void;
}

export const Step3Result: React.FC<Step3ResultProps> = ({
  photos,
  settings,
  onUpdateSettings,
  onRetake,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportScale, setExportScale] = useState<number>(1.5);
  const [activeTab, setActiveTab] = useState<'stickers' | 'theme' | 'layout' | 'color' | 'filter'>('stickers');
  const [selectedStickerCat, setSelectedStickerCat] = useState<string>('love');
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const selectedTheme = FRAME_THEMES.find((t) => t.id === settings.themeId) || FRAME_THEMES[0];
  const selectedColor = FRAME_COLORS.find((c) => c.id === settings.colorId) || FRAME_COLORS[0];
  const selectedFilter = PHOTO_FILTERS.find((f) => f.id === settings.filterId) || PHOTO_FILTERS[0];
  const currentLayout = LAYOUT_OPTIONS.find((l) => l.id === settings.layoutType) || LAYOUT_OPTIONS[0];

  const currentCategory = STICKER_CATEGORIES.find((c) => c.id === selectedStickerCat) || STICKER_CATEGORIES[0];

  // Handle PNG Download
  const handleDownload = async () => {
    try {
      setIsExporting(true);
      await downloadPhotoStrip({
        photos,
        settings,
        theme: selectedTheme,
        color: selectedColor,
        filter: selectedFilter,
        scale: exportScale,
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Download error', err);
      alert('Không thể xuất ảnh. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Copy to clipboard
  const handleCopy = async () => {
    const success = await copyPhotoToClipboard({
      photos,
      settings,
      theme: selectedTheme,
      color: selectedColor,
      filter: selectedFilter,
      scale: exportScale,
    });
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('Trình duyệt không hỗ trợ sao chép ảnh trực tiếp. Bạn hãy bấm Tải ảnh về máy nhé!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle Add Sticker
  const handleAddSticker = (emoji: string) => {
    const randomX = Math.floor(Math.random() * 55) + 20;
    const randomY = Math.floor(Math.random() * 75) + 12;
    const randomRotation = Math.floor(Math.random() * 30) - 15;

    const newSticker: PlacedSticker = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      emoji,
      x: randomX,
      y: randomY,
      size: 28,
      rotation: randomRotation,
    };

    onUpdateSettings({
      stickers: [...(settings.stickers || []), newSticker],
    });
    setSelectedStickerId(newSticker.id);
  };

  const handleUpdateSticker = (updatedSticker: PlacedSticker) => {
    onUpdateSettings({
      stickers: (settings.stickers || []).map((s) => (s.id === updatedSticker.id ? updatedSticker : s)),
    });
  };

  const handleDropSticker = (emoji: string, xPercent: number, yPercent: number) => {
    const randomRotation = Math.floor(Math.random() * 30) - 15;
    const newSticker: PlacedSticker = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      emoji,
      x: xPercent,
      y: yPercent,
      size: 28,
      rotation: randomRotation,
    };

    onUpdateSettings({
      stickers: [...(settings.stickers || []), newSticker],
    });
    setSelectedStickerId(newSticker.id);
  };

  const handleRemoveSticker = (id: string) => {
    if (selectedStickerId === id) {
      setSelectedStickerId(null);
    }
    onUpdateSettings({
      stickers: (settings.stickers || []).filter((s) => s.id !== id),
    });
  };

  const handleClearAllStickers = () => {
    setSelectedStickerId(null);
    onUpdateSettings({ stickers: [] });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Friendly Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2 font-['Quicksand']">
            <span>Dán Sticker & Lưu Ảnh</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Hoàn thành 💖
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
            Chạm vào sticker bạn thích để dán lên ảnh, sau đó bấm tải ảnh về máy nhé! ✨
          </p>
        </div>

        {/* Double strip toggle if not grid */}
        {settings.layoutType !== 'grid-4' && (
          <button
            id="btn-toggle-double-strip"
            onClick={() => onUpdateSettings({ isDoubleStrip: !settings.isDoubleStrip })}
            className={`text-xs font-bold px-4 py-2 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              settings.isDoubleStrip
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-rose-200 hover:bg-rose-50'
            }`}
          >
            <LayoutSplit className="w-3.5 h-3.5" />
            <span>{settings.isDoubleStrip ? 'In 2 Dải Ảnh Cặp' : '1 Dải Ảnh'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Interactive Photo Strip */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-5 border border-rose-100/90 shadow-[0_8px_30px_rgba(244,114,182,0.04)] flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3 px-1">
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                <LottieIcon name="sparkle" size={16} /> Bản In Sắc Nét (300 DPI)
              </span>
              <span className="text-xs font-bold text-neutral-700 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                {currentLayout.name.split(' (')[0]}
              </span>
            </div>

            {/* Interactive Strip */}
            <div className="scale-95 sm:scale-100 transition-all">
              <PhotoStrip
                photos={photos}
                settings={settings}
                theme={selectedTheme}
                color={selectedColor}
                filter={selectedFilter}
                isInteractive={true}
                selectedStickerId={selectedStickerId}
                onSelectSticker={setSelectedStickerId}
                onUpdateSticker={handleUpdateSticker}
                onRemoveSticker={handleRemoveSticker}
                onDropSticker={handleDropSticker}
              />
            </div>

            <p className="text-[11px] text-neutral-400 font-medium text-center mt-4">
              💡 Kéo sticker để di chuyển, chạm chọn để xoay, chỉnh cỡ hoặc xóa nhé! ✨
            </p>
          </div>
        </div>

        {/* Right Column: Export Actions & Studio Customization Dock */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Action Bar */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 border border-rose-100/80 shadow-[0_4px_20px_rgba(244,114,182,0.03)] space-y-4">
            {/* Resolution/Quality Selector */}
            <div className="bg-rose-50/40 p-3.5 rounded-2xl border border-rose-100/75 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 font-['Quicksand']">
                  <span>📸 Độ nét ảnh tải về</span>
                  {exportScale === 1.0 && <span className="text-[9px] text-neutral-600 bg-neutral-200/70 px-2 py-0.5 rounded-full font-sans font-semibold">Tiêu chuẩn</span>}
                  {exportScale === 1.5 && <span className="text-[9px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-sans font-semibold">Khuyên dùng (1080p+)</span>}
                  {exportScale === 2.0 && <span className="text-[9px] text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full font-sans font-semibold">Siêu sắc nét 4K</span>}
                </p>
                <p className="text-[10px] text-neutral-400 font-medium">
                  {settings.layoutType === 'grid-4' 
                    ? `Độ phân giải thực tế: ${Math.round(900 * exportScale)} x ${Math.round(1100 * exportScale)} px`
                    : `Độ phân giải thực tế: ${settings.isDoubleStrip ? Math.round(1240 * exportScale) : Math.round(600 * exportScale)} x ${settings.layoutType === 'strip-4' ? Math.round(2200 * exportScale) : Math.round(1800 * exportScale)} px`}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-full border border-rose-100/80 shadow-3xs max-w-[280px] w-full sm:w-auto">
                <button
                  id="btn-scale-1x"
                  onClick={() => setExportScale(1.0)}
                  className={`py-1.5 px-3 rounded-full text-[10px] font-bold text-center transition-all cursor-pointer ${
                    exportScale === 1.0
                      ? 'bg-neutral-900 text-white shadow-3xs'
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  Standard
                </button>
                <button
                  id="btn-scale-1.5x"
                  onClick={() => setExportScale(1.5)}
                  className={`py-1.5 px-3 rounded-full text-[10px] font-bold text-center transition-all cursor-pointer ${
                    exportScale === 1.5
                      ? 'bg-neutral-900 text-white shadow-3xs'
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  HD 1080p
                </button>
                <button
                  id="btn-scale-2x"
                  onClick={() => setExportScale(2.0)}
                  className={`py-1.5 px-3 rounded-full text-[10px] font-bold text-center transition-all cursor-pointer ${
                    exportScale === 2.0
                      ? 'bg-neutral-900 text-white shadow-3xs'
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  4K Print
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Primary Download Button */}
              <button
                id="btn-download-png"
                onClick={handleDownload}
                disabled={isExporting}
                className="w-full sm:flex-1 py-4 px-6 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-black hover:to-neutral-900 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-['Quicksand']"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang tạo ảnh xinh...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 text-rose-300" />
                    <span>Lưu Ảnh Về Máy (300 DPI) 💖</span>
                  </>
                )}
              </button>

              {/* Secondary Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="btn-copy-clipboard"
                  onClick={handleCopy}
                  className="flex-1 sm:flex-initial py-3.5 px-4 rounded-full bg-rose-50 hover:bg-rose-100 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-rose-200 cursor-pointer"
                  title="Sao chép ảnh vào bộ nhớ tạm"
                >
                  {copied ? (
                    <>
                      <CheckLg className="w-3.5 h-3.5 text-emerald-600 font-black" />
                      <span className="text-emerald-700">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>

                <button
                  id="btn-print-strip"
                  onClick={handlePrint}
                  className="flex-1 sm:flex-initial py-3.5 px-4 rounded-full bg-rose-50 hover:bg-rose-100 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-rose-200 cursor-pointer"
                  title="In ảnh trực tiếp"
                >
                  <Printer className="w-3.5 h-3.5 text-neutral-600" />
                  <span>In ảnh</span>
                </button>

                <button
                  id="btn-retake-all"
                  onClick={onRetake}
                  className="py-3.5 px-3.5 rounded-full bg-white hover:bg-rose-50 text-neutral-600 hover:text-rose-600 border border-neutral-200 text-xs flex items-center justify-center transition-all cursor-pointer"
                  title="Chụp lại từ đầu"
                >
                  <ArrowCounterclockwise className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Cute Customization Studio Dock */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 border border-rose-100/80 shadow-[0_4px_20px_rgba(244,114,182,0.03)] space-y-4">
            {/* Cute Segmented Control */}
            <div className="grid grid-cols-5 gap-1 bg-rose-50/50 p-1.5 rounded-full border border-rose-100/80">
              <button
                id="tab-btn-stickers"
                onClick={() => setActiveTab('stickers')}
                className={`py-1.5 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'stickers'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <LottieIcon name="sticker" size={18} />
                <span className="hidden sm:inline">Stickers</span>
              </button>

              <button
                id="tab-btn-layout"
                onClick={() => setActiveTab('layout')}
                className={`py-1.5 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'layout'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <LottieIcon name="layout" size={18} />
                <span className="hidden sm:inline">Bố Cục</span>
              </button>

              <button
                id="tab-btn-theme"
                onClick={() => setActiveTab('theme')}
                className={`py-1.5 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'theme'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <LottieIcon name="style" size={18} />
                <span className="hidden sm:inline">Viền</span>
              </button>

              <button
                id="tab-btn-color"
                onClick={() => setActiveTab('color')}
                className={`py-1.5 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'color'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <LottieIcon name="color" size={18} />
                <span className="hidden sm:inline">Màu</span>
              </button>

              <button
                id="tab-btn-filter"
                onClick={() => setActiveTab('filter')}
                className={`py-1.5 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'filter'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <LottieIcon name="filter" size={18} />
                <span className="hidden sm:inline">Lọc Da</span>
              </button>
            </div>

            {/* Tab 1: Cute Categorized Stickers Palette */}
            {activeTab === 'stickers' && (
              <div className="space-y-3">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {STICKER_CATEGORIES.map((cat) => {
                    const isCurrent = cat.id === selectedStickerCat;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedStickerCat(cat.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                          isCurrent
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-white text-neutral-700 border border-rose-100 hover:bg-rose-50'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}

                  {(settings.stickers?.length || 0) > 0 && (
                    <button
                      onClick={handleClearAllStickers}
                      className="ml-auto text-[11px] font-bold text-rose-500 hover:underline cursor-pointer whitespace-nowrap px-2"
                    >
                      Xóa hết ({settings.stickers?.length})
                    </button>
                  )}
                </div>

                {/* Stickers Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 bg-rose-50/30 rounded-2xl border border-rose-100/60">
                  {currentCategory.stickers.map((emoji, idx) => (
                    <button
                      key={idx}
                      draggable="true"
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', emoji);
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                      onClick={() => handleAddSticker(emoji)}
                      className="w-10 h-10 rounded-2xl bg-white hover:bg-rose-50 border border-rose-100 text-xl flex items-center justify-center transition-all hover:scale-115 active:scale-95 hover:rotate-6 shadow-2xs cursor-grab touch-none"
                      title="Chạm hoặc kéo dán lên ảnh"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Layout Switcher */}
            {activeTab === 'layout' && (
              <div className="grid grid-cols-3 gap-2.5">
                {LAYOUT_OPTIONS.map((layout) => {
                  const isSelected = layout.id === settings.layoutType;
                  return (
                    <button
                      key={layout.id}
                      onClick={() => onUpdateSettings({ layoutType: layout.id })}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-rose-100 bg-white hover:bg-rose-50 text-neutral-700'
                      }`}
                    >
                      <span className="font-bold text-xs">{layout.name.split(' (')[0]}</span>
                      <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/70' : 'text-neutral-400'}`}>
                        {layout.aspectRatioLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 3: Theme Switcher */}
            {activeTab === 'theme' && (
              <div
                className={`grid gap-3 sm:gap-4 items-start ${
                  settings.layoutType === 'grid-4'
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
                }`}
              >
                {FRAME_THEMES.map((theme) => {
                  const isSelected = theme.id === settings.themeId;
                  return (
                    <FrameThemeCard
                      key={theme.id}
                      theme={theme}
                      isSelected={isSelected}
                      layoutType={settings.layoutType}
                      onSelect={() =>
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
                        })
                      }
                    />
                  );
                })}
              </div>
            )}

            {/* Tab 4: Color Swatches */}
            {activeTab === 'color' && (
              <>
                {selectedTheme.hasFixedColor ? (
                  <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 flex items-center gap-2.5 text-amber-900 shadow-2xs">
                    <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0 font-bold text-xs">
                      🔒
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold font-['Quicksand'] flex items-center gap-1.5">
                        <span>Màu sắc cố định theo chủ đề "{selectedTheme.name}"</span>
                      </p>
                      <p className="text-[10px] text-amber-700 font-medium">
                        Khung thiết kế này sử dụng màu phối độc quyền. Chọn chủ đề khác nếu bạn muốn thay đổi màu nền nhé!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 sm:grid-cols-9 gap-2.5 pt-1">
                    {FRAME_COLORS.map((col) => {
                      const isSelected = col.id === settings.colorId && !settings.customColorHex;
                      return (
                        <button
                          key={col.id}
                          onClick={() => onUpdateSettings({ colorId: col.id, customColorHex: undefined })}
                          className="flex flex-col items-center gap-1 group cursor-pointer"
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                              isSelected
                                ? 'ring-2 ring-neutral-900 ring-offset-2 border-white scale-105 shadow-sm'
                                : 'border-black/10 hover:scale-105'
                            }`}
                            style={{ backgroundColor: col.hex }}
                          >
                            {isSelected && <CheckLg className="w-3.5 h-3.5 font-black" style={{ color: col.textColor }} />}
                          </div>
                          <span className="text-[9px] font-bold text-neutral-500 truncate max-w-[45px]">
                            {col.name.split(' (')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Tab 5: Filter Switcher */}
            {activeTab === 'filter' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PHOTO_FILTERS.map((f) => {
                    const isSelected = f.id === settings.filterId;
                    return (
                      <button
                        key={f.id}
                        id={`btn-filter-${f.id}`}
                        onClick={() => onUpdateSettings({ filterId: f.id })}
                        className={`py-2 px-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-900 text-white font-bold shadow-xs'
                            : 'border-rose-100 bg-white hover:bg-rose-50 text-neutral-700 font-medium'
                        }`}
                      >
                        <span className="text-xs">{f.name}</span>
                        {isSelected && <CheckLg className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* Skin Smoothing Beauty Slider */}
                <div className="bg-rose-50/30 rounded-2xl p-4 border border-rose-100/60 space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">✨</span>
                      <label htmlFor="skin-smooth-slider" className="text-xs font-bold text-neutral-800 font-['Quicksand']">
                        Độ mịn da tự nhiên
                      </label>
                    </div>
                    <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full font-mono">
                      {(settings.skinSmooth ?? 0) === 0 ? 'Tắt' : `${settings.skinSmooth}%`}
                    </span>
                  </div>

                  <div className="relative flex items-center group">
                    <input
                      id="skin-smooth-slider"
                      type="range"
                      min="0"
                      max="100"
                      value={settings.skinSmooth ?? 0}
                      onChange={(e) => onUpdateSettings({ skinSmooth: parseInt(e.target.value, 10) })}
                      className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-neutral-400 font-medium px-0.5">
                    <span>Nguyên bản (0%)</span>
                    <span className={`transition-all ${(settings.skinSmooth ?? 0) >= 20 && (settings.skinSmooth ?? 0) <= 50 ? 'text-emerald-600 font-bold' : ''}`}>Tự nhiên (30%)</span>
                    <span>Hoàn mỹ (100%)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
