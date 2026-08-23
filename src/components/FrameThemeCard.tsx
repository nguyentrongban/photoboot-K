import React from 'react';
import { FrameTheme, CapturedPhoto, LayoutType } from '../types';
import { FRAME_COLORS, PHOTO_FILTERS, SAMPLE_PHOTOS } from '../data/themesAndColors';
import { PhotoStrip } from './PhotoStrip';
import { CheckLg } from 'react-bootstrap-icons';

interface FrameThemeCardProps {
  theme: FrameTheme;
  isSelected: boolean;
  onSelect: () => void;
  layoutType?: LayoutType;
}

const sampleCapturedPhotos: CapturedPhoto[] = SAMPLE_PHOTOS.map((url, i) => ({
  id: `sample-${i}`,
  dataUrl: url,
  timestamp: Date.now(),
  index: i,
}));

export const FrameThemeCard: React.FC<FrameThemeCardProps> = ({
  theme,
  isSelected,
  onSelect,
  layoutType = 'grid-4',
}) => {
  // Determine appropriate default background color for previewing this theme
  const getDefaultColor = () => {
    switch (theme.id) {
      case 'wedding_cake':
        return FRAME_COLORS.find((c) => c.id === 'cream') || FRAME_COLORS[0];
      case 'astrology':
        return FRAME_COLORS.find((c) => c.id === 'lavender') || FRAME_COLORS[0];
      case 'vintage_daisy':
        return FRAME_COLORS.find((c) => c.id === 'butter') || FRAME_COLORS[0];
      case 'cozy_winter':
        return FRAME_COLORS.find((c) => c.id === 'blue') || FRAME_COLORS[0];
      case 'cute':
        return FRAME_COLORS.find((c) => c.id === 'pink') || FRAME_COLORS[0];
      case 'vintage':
        return FRAME_COLORS.find((c) => c.id === 'cream') || FRAME_COLORS[0];
      case 'party':
        return FRAME_COLORS.find((c) => c.id === 'butter') || FRAME_COLORS[0];
      case 'korean':
        return FRAME_COLORS.find((c) => c.id === 'lavender') || FRAME_COLORS[0];
      case 'y2k':
        return FRAME_COLORS.find((c) => c.id === 'blue') || FRAME_COLORS[0];
      case 'minimal':
      default:
        return FRAME_COLORS.find((c) => c.id === 'white') || FRAME_COLORS[0];
    }
  };

  const previewColor = getDefaultColor();
  const previewFilter = PHOTO_FILTERS[0];

  return (
    <button
      id={`theme-card-${theme.id}`}
      onClick={onSelect}
      className="group relative flex flex-col items-center justify-start text-center cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-95 w-full focus:outline-none"
    >
      {/* The actual photo frame itself */}
      <div
        className={`relative w-full rounded-xl sm:rounded-2xl transition-all duration-200 ${
          isSelected
            ? 'ring-3 sm:ring-4 ring-rose-500 ring-offset-2 shadow-xl scale-[1.02]'
            : 'shadow-sm hover:shadow-md opacity-90 hover:opacity-100'
        }`}
      >
        <PhotoStrip
          photos={sampleCapturedPhotos}
          settings={{
            themeId: theme.id,
            layoutType: layoutType,
            title: theme.isSpecialArtwork ? undefined : theme.name.split(' (')[0],
            subtitle: undefined,
            showDate: true,
            customDate: '08.23.26',
            skinSmooth: 0,
            isDoubleStrip: false,
            stickers: [],
          }}
          theme={theme}
          color={previewColor}
          filter={previewFilter}
          isInteractive={false}
          className="w-full"
          isMiniPreview={true}
        />

        {/* Selected badge overlay right on top-right corner of the frame */}
        {isSelected && (
          <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 z-20 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-500 text-white border-2 border-white flex items-center justify-center shadow-md animate-in zoom-in-75 duration-150">
            <CheckLg className="w-3 h-3 sm:w-3.5 sm:h-3.5 font-black text-white" />
          </div>
        )}
      </div>

      {/* Clean minimal theme label */}
      <span
        className={`mt-1.5 text-[11px] sm:text-xs font-bold tracking-tight truncate max-w-full font-['Quicksand'] ${
          isSelected ? 'text-rose-600 font-extrabold' : 'text-neutral-600 group-hover:text-neutral-900'
        }`}
      >
        {theme.name.split(' (')[0]}
      </span>
    </button>
  );
};
