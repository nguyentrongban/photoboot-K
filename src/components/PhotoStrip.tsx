import React, { useRef } from 'react';
import { CapturedPhoto, FrameColor, FrameTheme, PhotoboothSettings, PhotoFilter, PlacedSticker } from '../types';
import { Stars } from 'react-bootstrap-icons';
import { DraggableSticker } from './DraggableSticker';

interface PhotoStripProps {
  photos: CapturedPhoto[];
  settings: PhotoboothSettings;
  theme: FrameTheme;
  color: FrameColor;
  filter: PhotoFilter;
  isInteractive?: boolean;
  selectedStickerId?: string | null;
  onSelectSticker?: (id: string | null) => void;
  onUpdateSticker?: (sticker: PlacedSticker) => void;
  onRemoveSticker?: (id: string) => void;
  onDropSticker?: (emoji: string, xPercent: number, yPercent: number) => void;
  highlightSlot?: number | null;
  className?: string;
  isMiniPreview?: boolean;
}

// Dedicated Hand-Drawn SVG Artworks for the Romantic Wedding / Ribbon Cake Theme
const DoveArtwork: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 100 80" className={className || "w-8 h-8"} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 20,45 C 10,40 5,30 15,20 C 25,10 40,15 50,30 C 60,15 80,10 90,25 C 95,35 85,55 70,55 C 60,55 50,65 35,65 C 20,65 15,55 20,45 Z" />
    <path d="M 45,32 C 55,25 70,25 80,35" />
    <path d="M 35,45 C 38,50 45,52 52,48" />
    <circle cx="75" cy="28" r="1.5" fill={color} />
    {/* Olive branch / Ribbon in beak */}
    <path d="M 88,25 C 93,20 98,22 95,28" strokeWidth="2" />
    <path d="M 92,23 C 94,18 97,18 95,22" />
  </svg>
);

const HeartArrowArtwork: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 90 80" className={className || "w-8 h-8"} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 45,65 C 45,65 15,45 15,25 C 15,12 28,8 38,18 C 43,23 45,28 45,28 C 45,28 47,23 52,18 C 62,8 75,12 75,25 C 75,45 45,65 45,65 Z" />
    {/* Arrow pierced through */}
    <path d="M 8,72 L 82,10" strokeWidth="2.5" />
    <path d="M 70,8 L 84,10 L 82,24" strokeWidth="2.5" />
    <path d="M 5,68 L 14,75 L 10,79" strokeWidth="2" />
    <path d="M 42,32 C 45,35 48,35 50,32" strokeWidth="1.5" />
  </svg>
);

const RibbonBowArtwork: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 120 70" className={className || "w-14 h-8"} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Center knot */}
    <ellipse cx="60" cy="28" rx="7" ry="6" />
    {/* Left loop */}
    <path d="M 53,28 C 30,12 15,20 18,34 C 20,44 42,42 54,32" />
    <path d="M 30,22 C 38,28 45,30 53,28" strokeWidth="1.5" />
    {/* Right loop */}
    <path d="M 67,28 C 90,12 105,20 102,34 C 100,44 78,42 66,32" />
    <path d="M 90,22 C 82,28 75,30 67,28" strokeWidth="1.5" />
    {/* Ribbon tails */}
    <path d="M 56,34 C 48,50 35,62 25,66 C 32,60 38,55 42,46 L 54,33" />
    <path d="M 64,34 C 72,50 85,62 95,66 C 88,60 82,55 78,46 L 66,33" />
  </svg>
);

const HeartCakeArtwork: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 160 120" className={className || "w-24 h-20"} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Cake stand / plate */}
    <ellipse cx="80" cy="108" rx="65" ry="8" />
    <path d="M 35,108 L 40,114 C 60,118 100,118 120,114 L 125,108" />

    {/* Cake bottom rim base */}
    <path d="M 22,80 C 22,94 48,104 80,104 C 112,104 138,94 138,80" />
    
    {/* Bottom scalloped frosting lace */}
    <path d="M 22,80 C 30,88 38,88 46,80 C 54,88 62,88 70,80 C 78,88 86,88 94,80 C 102,88 110,88 118,80 C 126,88 134,88 138,80" strokeWidth="1.8" />

    {/* Heart Cake Side Walls */}
    <path d="M 22,50 L 22,80" />
    <path d="M 138,50 L 138,80" />
    <path d="M 80,68 L 80,98" strokeDasharray="3 3" strokeWidth="1.2" />

    {/* Heart Cake Top Surface */}
    <path d="M 80,68 C 50,48 20,40 22,52 C 24,65 55,75 80,75 C 105,75 136,65 138,52 C 140,40 110,48 80,68 Z" fill="currentColor" fillOpacity="0.05" />

    {/* Top Heart Piping Shells & Swirls */}
    <path d="M 24,52 C 28,45 38,45 42,50 C 46,45 56,45 60,52 C 64,48 74,48 80,58 C 86,48 96,48 100,52 C 104,45 114,45 118,50 C 122,45 132,45 136,52" strokeWidth="2" />
    <path d="M 28,58 C 36,68 50,72 80,72 C 110,72 124,68 132,58" strokeWidth="1.5" />

    {/* Decorative Cherries / Pearls on Cake Top */}
    <circle cx="36" cy="46" r="3.5" fill={color} />
    <circle cx="58" cy="45" r="3.5" fill={color} />
    <circle cx="80" cy="52" r="3.5" fill={color} />
    <circle cx="102" cy="45" r="3.5" fill={color} />
    <circle cx="124" cy="46" r="3.5" fill={color} />

    {/* 3 Birthday / Anniversary Candles */}
    <path d="M 58,42 L 58,26" strokeWidth="2.5" />
    <path d="M 58,23 C 56,18 60,12 58,10 C 56,12 60,18 58,23 Z" fill={color} />
    
    <path d="M 80,48 L 80,22" strokeWidth="2.5" />
    <path d="M 80,19 C 78,14 82,8 80,6 C 78,8 82,14 80,19 Z" fill={color} />

    <path d="M 102,42 L 102,26" strokeWidth="2.5" />
    <path d="M 102,23 C 100,18 104,12 102,10 C 100,12 104,18 102,23 Z" fill={color} />

    {/* Side Ribbons on Cake */}
    <path d="M 45,80 C 45,90 55,90 55,80" strokeWidth="1.5" />
    <path d="M 75,82 C 75,92 85,92 85,82" strokeWidth="1.5" />
    <path d="M 105,80 C 105,90 115,90 115,80" strokeWidth="1.5" />
  </svg>
);

const SideVineArtwork: React.FC<{ color: string; isLeft?: boolean }> = ({ color, isLeft = true }) => (
  <svg viewBox="0 0 30 180" className="w-5 h-full opacity-80" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <path d={isLeft ? "M 20,5 Q 5,45 20,90 Q 5,135 20,175" : "M 10,5 Q 25,45 10,90 Q 25,135 10,175"} />
    {/* Leaves */}
    <path d={isLeft ? "M 16,30 C 8,24 8,36 17,35" : "M 14,30 C 22,24 22,36 13,35"} fill={color} fillOpacity="0.2" />
    <path d={isLeft ? "M 10,65 C 2,60 2,72 11,70" : "M 20,65 C 28,60 28,72 19,70"} fill={color} fillOpacity="0.2" />
    <path d={isLeft ? "M 18,110 C 8,105 8,118 19,116" : "M 12,110 C 22,105 22,118 11,116"} fill={color} fillOpacity="0.2" />
    <path d={isLeft ? "M 12,145 C 4,140 4,152 13,150" : "M 18,145 C 26,140 26,152 17,150"} fill={color} fillOpacity="0.2" />
  </svg>
);

// --- ASTROLOGY THEME SVG ARTWORKS ---
const CrescentMoonArtwork: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 100 80" className={className || "w-8 h-8"} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 40,15 C 58,15 65,30 65,45 C 65,60 50,70 35,70 C 55,70 75,58 75,40 C 75,22 55,15 40,15 Z" fill={color} fillOpacity="0.1" />
    <path d="M 40,40 L 40,55" strokeWidth="1.5" strokeDasharray="3 2" />
    <path d="M 40,55 L 42,59 L 46,59 L 43,62 L 44,66 L 40,64 L 36,66 L 37,62 L 34,59 L 38,59 Z" fill={color} strokeWidth="1" />
    <path d="M 22,25 L 22,31 M 19,28 L 25,28" strokeWidth="1.5" />
    <path d="M 60,22 L 60,26 M 58,24 L 62,24" strokeWidth="1.5" />
  </svg>
);

const AstroStarArtwork: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 80 80" className={className || "w-8 h-8"} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 40,10 C 40,30 30,40 10,40 C 30,40 40,50 40,70 C 40,50 50,40 70,40 C 50,40 40,30 40,10 Z" fill={color} fillOpacity="0.1" />
    <ellipse cx="40" cy="40" rx="30" ry="12" strokeWidth="1.8" transform="rotate(-25 40 40)" />
    <circle cx="20" cy="20" r="1.5" fill={color} />
    <circle cx="60" cy="60" r="1.5" fill={color} />
  </svg>
);

const AstroConstellationArtwork: React.FC<{ color: string; isLeft?: boolean }> = ({ color, isLeft = true }) => (
  <svg viewBox="0 0 30 180" className="w-5 h-full opacity-80" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <path d={isLeft ? "M 15,5 L 5,35 L 22,65 L 10,110 L 25,145 L 15,175" : "M 15,5 L 25,35 L 8,65 L 20,110 L 5,145 L 15,175"} strokeDasharray="3 3" />
    <circle cx={isLeft ? 5 : 25} cy="35" r="3" fill={color} />
    <circle cx={isLeft ? 22 : 8} cy="65" r="3.5" fill={color} />
    <circle cx={isLeft ? 10 : 20} cy="110" r="2.5" fill={color} />
    <circle cx={isLeft ? 25 : 5} cy="145" r="4" fill={color} />
    <path d={isLeft ? "M 20,25 L 20,29 M 18,27 L 22,27" : "M 10,25 L 10,29 M 8,27 L 12,27"} strokeWidth="1.2" />
    <path d={isLeft ? "M 8,130 L 8,134 M 6,132 L 10,132" : "M 22,130 L 22,134 M 20,132 L 24,132"} strokeWidth="1.2" />
  </svg>
);

const AstroGlobeArtwork: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 160 120" className={className || "w-24 h-20"} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 45,112 L 115,112" strokeWidth="3" />
    <path d="M 80,85 L 80,112" strokeWidth="4.5" />
    <path d="M 60,112 L 80,95 L 100,112" />
    <circle cx="80" cy="50" r="35" strokeWidth="2.5" />
    <ellipse cx="80" cy="50" rx="42" ry="10" strokeWidth="2.2" />
    <line x1="80" y1="12" x2="80" y2="88" strokeWidth="1.5" strokeDasharray="3 3" />
    <ellipse cx="80" cy="50" rx="20" ry="35" strokeWidth="1.5" />
    <line x1="45" y1="50" x2="115" y2="50" strokeWidth="1.5" />
    <circle cx="80" cy="50" r="4" fill={color} />
    <path d="M 48,65 L 112,35" strokeWidth="3" />
    <path d="M 54,65 L 106,41" strokeWidth="1.5" strokeDasharray="2 2" />
    <path d="M 80,12 L 80,5" strokeWidth="1.5" />
    <path d="M 80,5 L 82,8 L 86,8 L 83,10 L 84,14 L 80,12 L 76,14 L 77,10 L 74,8 L 78,8 Z" fill={color} strokeWidth="1" />
  </svg>
);

// --- VINTAGE DAISY THEME SVG ARTWORKS ---
const DaisyHeaderLeft: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 100 80" className={className || "w-8 h-8"} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 15,65 Q 40,40 65,35" />
    <path d="M 32,48 Q 20,30 30,15" />
    <circle cx="65" cy="35" r="5" fill={color} />
    <path d="M 65,22 L 65,30 M 65,40 L 65,48 M 52,35 L 60,35 M 70,35 L 78,35" strokeWidth="3" />
    <path d="M 56,26 L 61,31 M 69,39 L 74,44 M 74,26 L 69,31 M 61,39 L 56,44" strokeWidth="3" />
    <circle cx="30" cy="15" r="3" fill={color} />
    <path d="M 30,7 L 30,12 M 30,18 L 30,23 M 22,15 L 27,15 M 33,15 L 38,15" strokeWidth="2" />
    <path d="M 24,9 L 28,13 M 32,17 L 36,21 M 36,9 L 32,13 M 28,17 L 24,21" strokeWidth="2" />
    <path d="M 36,44 C 42,40 45,45 36,44" fill={color} />
    <path d="M 22,55 C 26,50 29,56 22,55" fill={color} />
  </svg>
);

const DaisyHeaderRight: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 100 80" className={className || "w-8 h-8"} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 85,65 Q 60,40 35,35" />
    <path d="M 68,48 Q 80,30 70,15" />
    <circle cx="35" cy="35" r="5" fill={color} />
    <path d="M 35,22 L 35,30 M 35,40 L 35,48 M 22,35 L 30,35 M 40,35 L 48,35" strokeWidth="3" />
    <path d="M 26,26 L 31,31 M 39,39 L 44,44 M 44,26 L 39,31 M 31,39 L 26,44" strokeWidth="3" />
    <circle cx="70" cy="15" r="3" fill={color} />
    <path d="M 70,7 L 70,12 M 70,18 L 70,23 M 62,15 L 67,15 M 73,15 L 78,15" strokeWidth="2" />
    <path d="M 64,9 L 68,13 M 72,17 L 76,21 M 76,9 L 72,13 M 68,17 L 64,21" strokeWidth="2" />
    <path d="M 64,44 C 58,40 55,45 64,44" fill={color} />
    <path d="M 78,55 C 74,50 71,56 78,55" fill={color} />
  </svg>
);

const DaisySideVine: React.FC<{ color: string; isLeft?: boolean }> = ({ color, isLeft = true }) => (
  <svg viewBox="0 0 30 180" className="w-5 h-full opacity-80" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <path d={isLeft ? "M 15,5 C 5,35 25,65 15,95 C 5,125 25,155 15,175" : "M 15,5 C 25,35 5,65 15,95 C 25,125 5,155 15,175"} />
    <circle cx={isLeft ? 9 : 21} cy="40" r="2.5" fill={color} />
    <path d={isLeft ? "M 9,35 L 9,45 M 4,40 L 14,40" : "M 21,35 L 21,45 M 16,40 L 26,40"} strokeWidth="1.2" />
    <path d={isLeft ? "M 18,75 C 24,70 24,80 18,75" : "M 12,75 C 6,70 6,80 12,75"} fill={color} fillOpacity="0.2" />
    <circle cx={isLeft ? 21 : 9} cy="115" r="2.5" fill={color} />
    <path d={isLeft ? "M 21,110 L 21,120 M 16,115 L 26,115" : "M 9,110 L 9,120 M 4,115 L 14,115"} strokeWidth="1.2" />
    <path d={isLeft ? "M 8,145 C 2,140 2,150 8,145" : "M 22,145 C 28,140 28,150 22,145"} fill={color} fillOpacity="0.2" />
  </svg>
);

const DaisyFooterPot: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 160 120" className={className || "w-24 h-20"} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 55,80 L 105,80 L 98,110 L 62,110 Z" fill={color} fillOpacity="0.05" strokeWidth="2.5" />
    <rect x="52" y="72" width="56" height="8" rx="2" fill={color} fillOpacity="0.15" strokeWidth="2" />
    <path d="M 80,72 Q 80,45 80,28" strokeWidth="2" />
    <path d="M 76,72 Q 55,55 45,38" strokeWidth="2" />
    <path d="M 84,72 Q 105,55 115,38" strokeWidth="2" />
    <path d="M 78,72 Q 62,50 60,32" strokeWidth="1.8" />
    <path d="M 82,72 Q 98,50 100,32" strokeWidth="1.8" />
    <path d="M 68,58 C 60,55 64,48 68,58 Z" fill={color} />
    <path d="M 92,58 C 100,55 96,48 92,58 Z" fill={color} />
    <circle cx="80" cy="28" r="4.5" fill={color} />
    <path d="M 80,18 L 80,38 M 70,28 L 90,28 M 73,21 L 87,35 M 87,21 L 73,35" strokeWidth="2.2" />
    <circle cx="45" cy="38" r="4" fill={color} />
    <path d="M 45,30 L 45,46 M 37,38 L 53,38 M 39,32 L 51,44 M 51,32 L 39,44" strokeWidth="2" />
    <circle cx="115" cy="38" r="4" fill={color} />
    <path d="M 115,30 L 115,46 M 107,38 L 123,38 M 109,32 L 121,44 M 121,32 L 109,44" strokeWidth="2" />
    <circle cx="60" cy="32" r="3.5" fill={color} />
    <path d="M 60,25 L 60,39 M 53,32 L 67,32" strokeWidth="1.8" />
    <circle cx="100" cy="32" r="3.5" fill={color} />
    <path d="M 100,25 L 100,39 M 93,32 L 107,32" strokeWidth="1.8" />
  </svg>
);

// --- COZY WINTER THEME SVG ARTWORKS ---
const WinterHeaderLeft: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 100 80" className={className || "w-8 h-8"} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 15,20 Q 45,30 80,45" strokeWidth="3" />
    <path d="M 30,24 L 22,12 M 35,26 L 30,10 M 42,28 L 40,12 M 50,31 L 52,14 M 58,34 L 64,18 M 66,37 L 76,22" strokeWidth="1.5" />
    <path d="M 25,23 L 15,32 M 32,25 L 24,37 M 40,28 L 34,42 M 48,31 L 44,46 M 55,33 L 53,49 M 64,36 L 62,53" strokeWidth="1.5" />
    <line x1="45" y1="30" x2="45" y2="52" strokeWidth="1.2" strokeDasharray="3 2" />
    <path d="M 45,52 L 45,62 M 40,57 L 50,57 M 41.5,53.5 L 48.5,60.5 M 48.5,53.5 L 41.5,60.5" strokeWidth="1.8" />
  </svg>
);

const WinterHeaderRight: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 100 80" className={className || "w-8 h-8"} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 85,20 Q 55,30 20,45" strokeWidth="3" />
    <path d="M 70,24 L 78,12 M 65,26 L 70,10 M 58,28 L 60,12 M 50,31 L 48,14 M 42,34 L 36,18 M 34,37 L 24,22" strokeWidth="1.5" />
    <path d="M 75,23 L 85,32 M 68,25 L 76,37 M 60,28 L 66,42 M 52,31 L 56,46 M 45,33 L 47,49 M 36,36 L 38,53" strokeWidth="1.5" />
    <line x1="55" y1="30" x2="55" y2="52" strokeWidth="1.2" strokeDasharray="3 2" />
    <path d="M 55,52 L 55,62 M 50,57 L 60,57 M 51.5,53.5 L 58.5,60.5 M 58.5,53.5 L 51.5,60.5" strokeWidth="1.8" />
  </svg>
);

const WinterSideSnow: React.FC<{ color: string; isLeft?: boolean }> = ({ color, isLeft = true }) => (
  <svg viewBox="0 0 30 180" className="w-5 h-full opacity-80" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <g transform={isLeft ? "translate(8, 25)" : "translate(22, 25)"}>
      <path d="M 0,-6 L 0,6 M -6,0 L 6,0 M -4,-4 L 4,4 M -4,4 L 4,-4" strokeWidth="1.2" />
    </g>
    <circle cx={isLeft ? 22 : 8} cy="55" r="2" fill={color} />
    <g transform={isLeft ? "translate(20, 85)" : "translate(10, 85)"}>
      <path d="M 0,-4 L 0,4 M -4,0 L 4,0" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="1.5" fill={color} />
    </g>
    <circle cx={isLeft ? 7 : 23} cy="115" r="1.5" fill={color} />
    <g transform={isLeft ? "translate(12, 145)" : "translate(18, 145)"}>
      <path d="M 0,-6 L 0,6 M -6,0 L 6,0 M -4,-4 L 4,4 M -4,4 L 4,-4" strokeWidth="1.2" />
    </g>
  </svg>
);

const WinterSnowglobe: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 160 120" className={className || "w-24 h-20"} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 50,102 L 110,102 L 115,114 L 45,114 Z" fill={color} fillOpacity="0.1" strokeWidth="2.5" />
    <line x1="45" y1="114" x2="115" y2="114" strokeWidth="3" />
    <path d="M 40,82 C 15,75 15,22 80,22 C 145,22 145,75 120,82" strokeWidth="2.5" />
    <ellipse cx="80" cy="82" rx="40" ry="8" fill={color} fillOpacity="0.05" strokeWidth="2.2" />
    <path d="M 80,40 L 80,82" strokeWidth="2" />
    <path d="M 80,42 L 72,52 L 88,52 Z" fill={color} fillOpacity="0.2" />
    <path d="M 80,48 L 66,62 L 94,62 Z" fill={color} fillOpacity="0.2" />
    <path d="M 80,55 L 60,78 L 100,78 Z" fill={color} fillOpacity="0.2" />
    <path d="M 43,81 Q 80,87 117,81" strokeWidth="2.2" />
    <circle cx="62" cy="46" r="1.5" fill={color} />
    <circle cx="98" cy="48" r="1.2" fill={color} />
    <circle cx="54" cy="65" r="1.5" fill={color} />
    <circle cx="106" cy="63" r="1.2" fill={color} />
    <circle cx="80" cy="34" r="1" fill={color} />
    <path d="M 52,35 C 44,42 43,53 43,58" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// --- COZY BEAR & VINTAGE SCRAPBOOK THEME SVG ARTWORKS ---
const CozyBearBowHeader: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 70 70" className={className || "w-10 h-10"} fill="none">
    <path d="M 35 25 C 22 10 12 28 32 28 Z" fill="#CBB399" stroke="#9E8268" strokeWidth="1.5" />
    <path d="M 35 25 C 48 10 58 28 38 28 Z" fill="#CBB399" stroke="#9E8268" strokeWidth="1.5" />
    <path d="M 32 28 C 28 38 22 52 20 60 C 25 58 30 55 33 30 Z" fill="#BBA085" stroke="#9E8268" strokeWidth="1" />
    <path d="M 38 28 C 42 38 48 52 50 60 C 45 58 40 55 37 30 Z" fill="#BBA085" stroke="#9E8268" strokeWidth="1" />
    <circle cx="35" cy="27" r="7" fill="#5A4332" stroke="#3A281A" strokeWidth="1.5" />
    <circle cx="35" cy="27" r="5" fill="#4B3626" />
    <circle cx="33" cy="25" r="0.9" fill="#D2C2B2" />
    <circle cx="37" cy="25" r="0.9" fill="#D2C2B2" />
    <circle cx="33" cy="29" r="0.9" fill="#D2C2B2" />
    <circle cx="37" cy="29" r="0.9" fill="#D2C2B2" />
    <line x1="33" y1="25" x2="37" y2="29" stroke="#D2C2B2" strokeWidth="0.8" />
    <line x1="37" y1="25" x2="33" y2="29" stroke="#D2C2B2" strokeWidth="0.8" />
  </svg>
);

const CozyBearCookieHeader: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 70 70" className={className || "w-10 h-10"} fill="none">
    <circle cx="20" cy="22" r="11" fill="#CFA06E" stroke="#8C613A" strokeWidth="2" />
    <circle cx="20" cy="22" r="6" fill="#E8B896" />
    <circle cx="50" cy="22" r="11" fill="#CFA06E" stroke="#8C613A" strokeWidth="2" />
    <circle cx="50" cy="22" r="6" fill="#E8B896" />
    <circle cx="35" cy="38" r="22" fill="#D9A873" stroke="#8C613A" strokeWidth="2" />
    <ellipse cx="35" cy="42" rx="9" ry="7" fill="#FFF5EA" stroke="#B88A58" strokeWidth="1" />
    <ellipse cx="35" cy="39" rx="3.5" ry="2.5" fill="#5A3A22" />
    <path d="M 35 41.5 L 35 44 C 33 46 32 46 31 45 M 35 44 C 37 46 38 46 39 45" stroke="#5A3A22" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="25" cy="34" r="2.2" fill="#5A3A22" />
    <path d="M 42 32 L 47 35 L 42 38" stroke="#5A3A22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx="21" cy="40" rx="3.5" ry="2" fill="#E8A0B0" opacity="0.8" />
    <ellipse cx="49" cy="40" rx="3.5" ry="2" fill="#E8A0B0" opacity="0.8" />
  </svg>
);

const CozyPlushTeddy: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className || "w-12 h-12"} fill="none">
    <g transform="rotate(-15 50 50)">
      <rect x="10" y="42" width="80" height="20" fill="#DCD0BD" stroke="#C5B5A0" strokeWidth="1" rx="2" />
      <line x1="10" y1="48" x2="90" y2="48" stroke="#C5B5A0" strokeWidth="0.8" strokeDasharray="3 3" />
      <line x1="10" y1="56" x2="90" y2="56" stroke="#C5B5A0" strokeWidth="0.8" strokeDasharray="3 3" />
    </g>
    <circle cx="34" cy="28" r="10" fill="#A47E5B" stroke="#6E5035" strokeWidth="1.5" />
    <circle cx="34" cy="28" r="5" fill="#C5A586" />
    <circle cx="66" cy="28" r="10" fill="#A47E5B" stroke="#6E5035" strokeWidth="1.5" />
    <circle cx="66" cy="28" r="5" fill="#C5A586" />
    <circle cx="50" cy="42" r="22" fill="#A47E5B" stroke="#6E5035" strokeWidth="2" />
    <ellipse cx="50" cy="47" rx="9" ry="7" fill="#E2C9B1" />
    <ellipse cx="50" cy="44" rx="3.5" ry="2.5" fill="#3D2919" />
    <path d="M 50 46.5 L 50 49.5 C 48 51.5 46 51.5 45 50.5 M 50 49.5 C 52 51.5 54 51.5 55 50.5" stroke="#3D2919" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="40" cy="39" r="2" fill="#3D2919" />
    <circle cx="60" cy="39" r="2" fill="#3D2919" />
    <path d="M 33 22 C 27 16 23 26 31 25 Z" fill="#E8A0B0" stroke="#C57588" strokeWidth="1" />
    <path d="M 33 22 C 39 16 43 26 35 25 Z" fill="#E8A0B0" stroke="#C57588" strokeWidth="1" />
    <circle cx="33" cy="23.5" r="2" fill="#D88296" />
    <ellipse cx="50" cy="72" rx="18" ry="16" fill="#A47E5B" stroke="#6E5035" strokeWidth="2" />
    <ellipse cx="50" cy="72" rx="10" ry="9" fill="#C5A586" />
    <ellipse cx="32" cy="68" rx="7" ry="10" fill="#A47E5B" stroke="#6E5035" strokeWidth="1.5" transform="rotate(20 32 68)" />
    <ellipse cx="68" cy="68" rx="7" ry="10" fill="#A47E5B" stroke="#6E5035" strokeWidth="1.5" transform="rotate(-20 68 68)" />
  </svg>
);

const CozyLetterBCookie: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 60 70" className={className || "w-10 h-10"} fill="none">
    <path d="M 15 10 H 35 C 46 10 46 32 35 32 C 48 32 48 58 35 58 H 15 Z" fill="#CFA06E" stroke="#8C613A" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M 23 18 H 32 C 38 18 38 26 32 26 H 23 Z" fill="#FAF6EF" stroke="#8C613A" strokeWidth="1.5" />
    <path d="M 23 38 H 33 C 40 38 40 50 33 50 H 23 Z" fill="#FAF6EF" stroke="#8C613A" strokeWidth="1.5" />
    <path d="M 17 12 H 34 C 43 12 43 30 34 30 H 17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M 17 34 H 34 C 44 34 44 56 34 56 H 17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const CozyVintageCamera: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 70" className={className || "w-12 h-9"} fill="none">
    <rect x="10" y="20" width="80" height="42" rx="4" fill="#222222" stroke="#111111" strokeWidth="2" />
    <rect x="10" y="20" width="80" height="12" fill="#D0D0D0" stroke="#999999" strokeWidth="1.5" />
    <rect x="22" y="14" width="8" height="6" fill="#B0B0B0" stroke="#777777" strokeWidth="1" />
    <rect x="70" y="15" width="10" height="5" rx="1" fill="#B0B0B0" stroke="#777777" strokeWidth="1" />
    <rect x="20" y="23" width="12" height="6" fill="#444444" stroke="#222222" strokeWidth="1" />
    <rect x="72" y="23" width="8" height="6" rx="1" fill="#FFFAEE" stroke="#B0B0B0" strokeWidth="1" />
    <circle cx="50" cy="41" r="18" fill="#1A1A1A" stroke="#C0C0C0" strokeWidth="3" />
    <circle cx="50" cy="41" r="13" fill="#0D1B2A" stroke="#444444" strokeWidth="2" />
    <circle cx="50" cy="41" r="8" fill="#1B263B" />
    <circle cx="47" cy="38" r="3" fill="#FFFFFF" opacity="0.6" />
    <circle cx="36" cy="26" r="2" fill="#C0392B" />
  </svg>
);

const CozyKraftTapeLabel: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 140 40" className={className || "w-24 h-7"} fill="none">
    <rect x="5" y="6" width="110" height="26" fill="#C5A880" stroke="#A88B65" strokeWidth="1.5" rx="2" />
    <text x="14" y="23" fill="#2C2016" fontSize="11" fontWeight="bold" fontFamily="Courier, monospace" letterSpacing="0.5">
      love yourself
    </text>
    <circle cx="125" cy="19" r="9" fill="#5A4332" stroke="#3A281A" strokeWidth="1.5" />
    <circle cx="125" cy="19" r="6.5" fill="#4B3626" />
    <circle cx="122.5" cy="16.5" r="1" fill="#D2C2B2" />
    <circle cx="127.5" cy="16.5" r="1" fill="#D2C2B2" />
    <circle cx="122.5" cy="21.5" r="1" fill="#D2C2B2" />
    <circle cx="127.5" cy="21.5" r="1" fill="#D2C2B2" />
    <line x1="122.5" y1="16.5" x2="127.5" y2="21.5" stroke="#D2C2B2" strokeWidth="1" />
    <line x1="127.5" y1="16.5" x2="122.5" y2="21.5" stroke="#D2C2B2" strokeWidth="1" />
  </svg>
);

const CozyScrapbookFooterDecor: React.FC<{ className?: string; isMini?: boolean }> = ({ className, isMini = false }) => (
  <div className={`w-full h-full relative overflow-hidden flex flex-col justify-between px-1.5 py-1 ${className || ''}`}>
    <div className="flex flex-col gap-0.5 items-start z-10 pl-0.5 pt-0.5">
      <div className="bg-[#D5C7B0] text-[#3D2C1E] px-1.5 py-0.2 rounded-xs font-mono font-bold text-[7px] sm:text-[9px] shadow-2xs border border-[#C2B299]/60 transform -rotate-1">
        i'd be a fool
      </div>
      <div className="bg-[#C5B499] text-[#2C1F15] px-1.5 py-0.2 rounded-xs font-mono font-bold text-[7px] sm:text-[9px] shadow-2xs border border-[#B09F85]/60 transform rotate-1">
        not to love you
      </div>
      <div className="text-[#8C6D58] font-serif italic text-[6px] sm:text-[8px] font-semibold mt-0.5 pl-0.5">
        - your eyes tell a story
      </div>
    </div>

    <div className="flex items-end justify-between w-full z-10 pb-0.5 px-0.5">
      <div className="flex items-end -space-x-1">
        <svg viewBox="0 0 30 30" className={isMini ? "w-2.5 h-2.5" : "w-4 h-4 sm:w-5 sm:h-5"} fill="#FAF3E0" stroke="#D5C5AC" strokeWidth="1">
          <path d="M 15 2 L 18 10 L 26 10 L 20 16 L 22 24 L 15 19 L 8 24 L 10 16 L 4 10 L 12 10 Z" />
        </svg>
        <svg viewBox="0 0 30 30" className={isMini ? "w-2 h-2" : "w-3.5 h-3.5 sm:w-4 sm:h-4"} fill="#C87A5B" stroke="#9A563C" strokeWidth="1">
          <path d="M 15 2 L 18 10 L 26 10 L 20 16 L 22 24 L 15 19 L 8 24 L 10 16 L 4 10 L 12 10 Z" />
        </svg>
      </div>

      <div className="flex items-center gap-0.5 bg-neutral-900/90 px-1 py-0.5 rounded-xs shadow-xs">
        <span className="bg-black text-white px-0.8 py-0.2 text-[7px] sm:text-[9px] font-black font-mono">C</span>
        <span className="bg-white text-black px-0.8 py-0.2 text-[7px] sm:text-[9px] font-black font-mono">U</span>
        <span className="bg-black text-white px-0.8 py-0.2 text-[7px] sm:text-[9px] font-black font-mono">T</span>
        <span className="bg-white text-black px-0.5 py-0.2 text-[7px] sm:text-[9px] font-black font-mono">!</span>
        <span className="bg-black text-white px-0.8 py-0.2 text-[7px] sm:text-[9px] font-black font-mono">E</span>
      </div>

      <div className="relative">
        <svg viewBox="0 0 40 36" className={isMini ? "w-3 h-3" : "w-6 h-5 sm:w-7 sm:h-6"} fill="#FAF3E8" stroke="#D9C5B0" strokeWidth="1.2">
          <path d="M 20 2 C 8 2 2 14 6 28 L 34 28 C 38 14 32 2 20 2 Z" />
          <line x1="20" y1="2" x2="20" y2="28" />
          <line x1="20" y1="2" x2="12" y2="28" />
          <line x1="20" y1="2" x2="28" y2="28" />
          <line x1="20" y1="2" x2="6" y2="24" />
          <line x1="20" y1="2" x2="34" y2="24" />
        </svg>
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2">
          <svg viewBox="0 0 20 12" className="w-3 h-2" fill="#E89CAE" stroke="#C87084" strokeWidth="0.8">
            <path d="M 10 6 C 5 2 2 10 9 8 Z" />
            <path d="M 10 6 C 15 2 18 10 11 8 Z" />
            <circle cx="10" cy="6.5" r="1.2" fill="#D8728A" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

// --- AIRMAIL POSTCARD THEME SVG ARTWORKS ---
const AirmailPostalCancelStamp: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 170 85" className={className || "w-32 h-16"} fill="none">
    {/* Circular cancellation mark */}
    <g transform="rotate(-12 45 42)" opacity="0.9">
      <circle cx="45" cy="42" r="34" stroke="#1D3E6E" strokeWidth="2.2" strokeDasharray="4 1.5" />
      <circle cx="45" cy="42" r="29" stroke="#1D3E6E" strokeWidth="1.8" />
      <path id="circlePathAirmail" d="M 18 42 A 27 27 0 1 1 72 42 A 27 27 0 1 1 18 42" fill="none" />
      <text fill="#1D3E6E" fontSize="5.8" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
        <textPath href="#circlePathAirmail" startOffset="50%" textAnchor="middle">
          LUCKY IN LOVE • LUCKY IN LOVE •
        </textPath>
      </text>
      <circle cx="45" cy="42" r="14" stroke="#1D3E6E" strokeWidth="1.2" />
      <polygon points="45,34 47.5,39 53,39.5 49,43 50.5,48 45,45 39.5,48 41,43 37,39.5 42.5,39" fill="#1D3E6E" />
    </g>

    {/* Wavy cancellation lines */}
    <g stroke="#1D3E6E" strokeWidth="2" strokeLinecap="round" opacity="0.85">
      <path d="M 82 22 Q 102 14 122 22 T 165 22" />
      <path d="M 82 34 Q 102 26 122 34 T 165 34" />
      <path d="M 82 46 Q 102 38 122 46 T 165 46" />
      <path d="M 82 58 Q 102 50 122 58 T 165 58" />
    </g>
  </svg>
);

export const PhotoStrip: React.FC<PhotoStripProps> = ({
  photos,
  settings,
  theme,
  color,
  filter,
  isInteractive = false,
  selectedStickerId = null,
  onSelectSticker,
  onUpdateSticker,
  onRemoveSticker,
  onDropSticker,
  highlightSlot = null,
  className,
  isMiniPreview = false,
}) => {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const bgColor = settings.customColorHex || color.hex;
  const layout = settings.layoutType || 'grid-4';
  const isWeddingTheme = theme.id === 'wedding_cake';
  const isSpecialArtwork = !!theme.isSpecialArtwork;
  const artworkColor = isSpecialArtwork ? color.textColor : theme.accentColor;

  // Determine photo count based on layout
  const photoIndices =
    layout === 'single-1'
      ? [0]
      : layout === 'strip-2'
      ? [0, 1]
      : layout === 'strip-3'
      ? [0, 1, 2]
      : [0, 1, 2, 3];

  // Handle Drag & Drop of stickers from tray
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isInteractive || !onDropSticker) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isInteractive || !onDropSticker || !stripRef.current) return;
    e.preventDefault();

    const emoji = e.dataTransfer.getData('text/plain');
    if (!emoji) return;

    const rect = stripRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dropX = ((e.clientX - rect.left) / rect.width) * 100;
    const dropY = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(5, Math.min(95, dropX));
    const clampedY = Math.max(5, Math.min(95, dropY));

    onDropSticker(emoji, clampedX, clampedY);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (isInteractive && onSelectSticker) {
      // If clicking directly on empty container space, deselect sticker
      if ((e.target as HTMLElement).id?.startsWith('photobooth-strip-') || (e.target as HTMLElement).tagName === 'DIV') {
        onSelectSticker(null);
      }
    }
  };

  const renderPhotoSlot = (index: number) => {
    const photo = photos[index];
    const isTarget = highlightSlot === index;

    const smoothValue = settings.skinSmooth ?? 0;
    const getBaseFilter = () => {
      return filter.cssFilter === 'none' ? undefined : filter.cssFilter;
    };

    const getSmoothOverlayFilter = () => {
      let baseStyle = filter.cssFilter;
      if (baseStyle === 'none') {
        baseStyle = '';
      }
      return `${baseStyle} blur(5px) brightness(1.05) contrast(0.9)`.trim();
    };

    return (
      <div className="relative w-full h-full">
        {/* Airmail Postage Stamp Perforated Frame Backing */}
        {theme.id === 'airmail_postcard' && (
          <div className="absolute -inset-1 sm:-inset-1.5 bg-[#FAF6EF] shadow-2xs border-2 border-dashed border-[#CBB599] rounded-xs -z-1" />
        )}
        <div
          key={`frame-${index}`}
          id={`photo-slot-${index}`}
          className={`w-full h-full relative rounded-none overflow-hidden bg-neutral-200/80 shadow-xs border transition-all duration-300 ${
            isTarget ? 'ring-4 ring-rose-400 ring-offset-2 scale-[1.02]' : 'border-black/5'
          }`}
        >
        {photo ? (
          <div className="w-full h-full relative overflow-hidden">
            {/* Base sharp photo */}
            <img
              src={photo.dataUrl}
              alt={`Ảnh chụp ${index + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
              style={{ filter: getBaseFilter() }}
              referrerPolicy="no-referrer"
            />
            {/* Smooth skin overlay */}
            {smoothValue > 0 && (
              <img
                src={photo.dataUrl}
                alt={`Ảnh chụp mịn da ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-300"
                style={{
                  filter: getSmoothOverlayFilter(),
                  opacity: (smoothValue * 0.45) / 100,
                }}
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100/90 text-neutral-400 p-2">
            <span className="text-xl font-bold text-neutral-300 mb-0.5">#{index + 1}</span>
            <span className="text-[11px] font-medium">
              {isTarget ? '📸 Đang chụp...' : `Ô ảnh ${index + 1}`}
            </span>
          </div>
        )}

        {/* Slot placeholder index */}
      </div>
      </div>
    );
  };

  const renderHeader = () => {
    if (theme.id === 'airmail_postcard') {
      return (
        <div className={`w-full h-full flex items-center justify-between z-10 ${isMiniPreview ? 'px-1' : 'px-2.5 sm:px-3'}`}>
          <div className="flex items-center gap-1 bg-[#1D3E6E] text-white px-1.5 py-0.5 rounded-xs font-black text-[6px] sm:text-[8px] tracking-wider uppercase shadow-2xs">
            <span>✈️ AIR MAIL</span>
          </div>
          <span className={`font-mono font-bold tracking-widest text-[#1D3E6E] ${isMiniPreview ? 'text-[6px]' : 'text-[8px] sm:text-[10px]'}`}>
            PAR AVION
          </span>
        </div>
      );
    }

    if (theme.id === 'teddy_cozy_check') {
      return (
        <div className={`w-full h-full flex items-center justify-between z-10 ${isMiniPreview ? 'px-1' : 'px-2 sm:px-3'}`}>
          <div className="flex-shrink-0 z-10">
            <CozyBearBowHeader className={isMiniPreview ? "w-4 h-4" : "w-6 h-6 sm:w-8 sm:h-8"} />
          </div>
          <div className="text-center px-1 flex-1 min-w-0 z-10">
            <h2
              className={`font-black tracking-widest uppercase truncate ${isMiniPreview ? 'text-[6px]' : 'text-[9px] sm:text-xs'}`}
              style={{ color: color.textColor, fontFamily: theme.fontFamily }}
            >
              {settings.title || 'cozy moments'}
            </h2>
          </div>
          <div className="flex-shrink-0 z-10">
            <CozyBearCookieHeader className={isMiniPreview ? "w-4 h-4" : "w-6 h-6 sm:w-8 sm:h-8"} />
          </div>
        </div>
      );
    }

    if (isSpecialArtwork) {
      return (
        <div className={`w-full h-full flex items-center justify-between ${isMiniPreview ? 'px-1.5' : 'px-3 sm:px-4'}`}>
          {/* Top-left artwork */}
          <div className="flex-shrink-0">
            {theme.id === 'wedding_cake' && <DoveArtwork color={artworkColor} className={isMiniPreview ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6"} />}
            {theme.id === 'astrology' && <CrescentMoonArtwork color={artworkColor} className={isMiniPreview ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6"} />}
            {theme.id === 'vintage_daisy' && <DaisyHeaderLeft color={artworkColor} className={isMiniPreview ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6"} />}
            {theme.id === 'cozy_winter' && <WinterHeaderLeft color={artworkColor} className={isMiniPreview ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6"} />}
          </div>

          {/* Center Titles */}
          <div className="text-center px-1 flex-1 min-w-0">
            <h2
              className={`font-black tracking-widest uppercase truncate ${isMiniPreview ? 'text-[6px]' : 'text-[10px] sm:text-xs'}`}
              style={{ color: color.textColor, fontFamily: theme.fontFamily, letterSpacing: '0.08em' }}
            >
              {settings.title || (theme.id === 'wedding_cake' ? 'AMIRA & SPENCE' : theme.id === 'astrology' ? 'COSMIC MEMORY' : theme.id === 'vintage_daisy' ? 'DAISY MEMORY' : 'WINTER CHILL')}
            </h2>
            {settings.subtitle && !isMiniPreview && (
              <p className="text-[7px] sm:text-[9px] font-semibold tracking-wide italic truncate" style={{ color: color.subtextColor }}>
                {settings.subtitle}
              </p>
            )}
          </div>

          {/* Top-right artwork */}
          <div className="flex-shrink-0">
            {theme.id === 'wedding_cake' && <HeartArrowArtwork color={artworkColor} className={isMiniPreview ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6"} />}
            {theme.id === 'astrology' && <AstroStarArtwork color={artworkColor} className={isMiniPreview ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6"} />}
            {theme.id === 'vintage_daisy' && <DaisyHeaderRight color={artworkColor} className={isMiniPreview ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6"} />}
            {theme.id === 'cozy_winter' && <WinterHeaderRight color={artworkColor} className={isMiniPreview ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6"} />}
          </div>
        </div>
      );
    }

    return (
      <div className={`w-full h-full flex items-center justify-between ${isMiniPreview ? 'px-2' : 'px-3 sm:px-4'}`}>
        <div className="flex flex-col text-left justify-center">
          <span
            className={`font-serif font-black tracking-tight leading-none ${isMiniPreview ? 'text-[9px]' : 'text-xs sm:text-sm md:text-base'}`}
            style={{ color: color.textColor, fontFamily: theme.fontFamily }}
          >
            {settings.title ? settings.title : 'may'}
          </span>
          <span
            className={`font-sans font-semibold tracking-widest uppercase opacity-75 mt-0.5 ${isMiniPreview ? 'text-[4px]' : 'text-[6px] sm:text-[8px]'}`}
            style={{ color: color.subtextColor }}
          >
            PHOTOBOOTH
          </span>
        </div>
        {settings.subtitle && (
          <span className={`font-medium opacity-75 truncate max-w-[50%] text-right ${isMiniPreview ? 'text-[6px]' : 'text-[8px] sm:text-[10px]'}`} style={{ color: color.subtextColor }}>
            {settings.subtitle}
          </span>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    if (theme.id === 'airmail_postcard') {
      const titleParts = (settings.title || 'KATE & JACKSON').split('&');
      const name1 = titleParts[0]?.trim() || 'KATE';
      const name2 = titleParts[1]?.trim() || 'JACKSON';

      return (
        <div className="w-full h-full relative flex flex-col justify-between px-2.5 sm:px-3 py-1 overflow-hidden select-none">
          <div className="flex flex-col items-start z-10">
            {/* KATE & JACKSON in Vintage Bold Serif */}
            <div className="flex items-baseline gap-1 font-black leading-none text-[#1D3E6E]">
              <span className={`tracking-wider ${isMiniPreview ? 'text-[9px]' : 'text-base sm:text-2xl'}`} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {name1}
              </span>
              <span className={`font-serif italic text-rose-700 font-bold ${isMiniPreview ? 'text-[8px]' : 'text-sm sm:text-xl'}`}>
                &
              </span>
            </div>
            <div className={`font-black tracking-widest leading-none text-[#1D3E6E] mt-0.5 ${isMiniPreview ? 'text-[8px]' : 'text-sm sm:text-xl'}`} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {name2}
            </div>

            {/* got hitched! in cursive */}
            <p className={`font-serif italic font-bold text-[#1D3E6E] opacity-95 mt-0.5 ${isMiniPreview ? 'text-[5px]' : 'text-[10px] sm:text-sm'}`} style={{ fontFamily: "'Caveat', cursive" }}>
              {settings.subtitle || 'got hitched!'}
            </p>

            {/* Date stamp 1.10.14 */}
            {settings.showDate && (
              <p className={`font-mono font-bold tracking-widest text-[#1D3E6E] mt-0.5 ${isMiniPreview ? 'text-[5px]' : 'text-[9px] sm:text-xs'}`}>
                {settings.customDate || '1.10.14'}
              </p>
            )}
          </div>

          {/* Lucky in Love Postal Rubber Stamp & Cancellation Waves */}
          <div className="absolute bottom-[-10%] right-[-8%] z-20 pointer-events-none opacity-90">
            <AirmailPostalCancelStamp className={isMiniPreview ? "w-16 h-8" : "w-32 h-16 sm:w-44 sm:h-22"} />
          </div>
        </div>
      );
    }

    if (theme.id === 'teddy_cozy_check') {
      return (
        <div className="w-full h-full relative overflow-hidden">
          <CozyScrapbookFooterDecor isMini={isMiniPreview} />
        </div>
      );
    }

    if (isSpecialArtwork) {
      return (
        <div className={`w-full h-full flex flex-col justify-center items-center ${isMiniPreview ? 'px-1' : 'px-4'}`}>
          <div className="flex items-center justify-center gap-1 opacity-90">
            {theme.id === 'wedding_cake' && <RibbonBowArtwork color={artworkColor} className={isMiniPreview ? "w-4 h-2.5" : "w-7 h-4 sm:w-9 sm:h-5"} />}
          </div>

          <div className="mt-0.5 opacity-95">
            {theme.id === 'wedding_cake' && <HeartCakeArtwork color={artworkColor} className={isMiniPreview ? "w-6 h-4" : "w-8 h-6 sm:w-12 sm:h-8"} />}
            {theme.id === 'astrology' && <AstroGlobeArtwork color={artworkColor} className={isMiniPreview ? "w-6 h-4" : "w-8 h-6 sm:w-12 sm:h-8"} />}
            {theme.id === 'vintage_daisy' && <DaisyFooterPot color={artworkColor} className={isMiniPreview ? "w-6 h-4" : "w-8 h-6 sm:w-12 sm:h-8"} />}
            {theme.id === 'cozy_winter' && <WinterSnowglobe color={artworkColor} className={isMiniPreview ? "w-6 h-4" : "w-8 h-6 sm:w-12 sm:h-8"} />}
          </div>

          {/* Date String */}
          {settings.showDate && (
            <p
              className={`font-bold tracking-widest mt-0.5 ${isMiniPreview ? 'text-[5px]' : 'text-[7px] sm:text-[9px]'}`}
              style={{ color: color.textColor, fontFamily: theme.fontFamily }}
            >
              {settings.customDate || '08. 23. 26'}
            </p>
          )}

          {theme.bottomDecoration && !isMiniPreview && (
            <p className="text-[6px] sm:text-[8px] font-semibold italic opacity-90 truncate max-w-full" style={{ color: color.subtextColor }}>
              {theme.bottomDecoration}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className={`w-full h-full flex items-center justify-between ${isMiniPreview ? 'px-2' : 'px-3 sm:px-4'}`}>
        <div className="flex items-center gap-1.5 min-w-0">
          {settings.showDate && (
            <p className={`font-mono font-bold tracking-widest opacity-85 whitespace-nowrap ${isMiniPreview ? 'text-[6px]' : 'text-[8px] sm:text-[10px]'}`} style={{ color: color.textColor }}>
              {settings.customDate || '08. 23. 26'}
            </p>
          )}
          {theme.bottomDecoration && !isMiniPreview && (
            <span className="text-[7px] sm:text-[9px] font-medium italic opacity-75 truncate" style={{ color: color.subtextColor }}>
              • {theme.bottomDecoration}
            </span>
          )}
        </div>

        {/* Minimal Barcode / dots */}
        <div className="flex items-center gap-0.5 opacity-60 flex-shrink-0">
          {[3, 2, 5, 2, 4, 2, 5, 2].map((h, i) => (
            <div
              key={i}
              style={{
                width: isMiniPreview ? '1px' : '1.5px',
                height: isMiniPreview ? '5px' : '8px',
                backgroundColor: color.textColor,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderSingleStripContent = (keyPrefix: string) => {
    // Compute exact percentage styles to align 1:1 with canvasExport.ts coordinates
    let headerStyle: React.CSSProperties = {};
    let footerStyle: React.CSSProperties = {};
    let slotsConfig: { top: string; left: string; width: string; height: string }[] = [];
    let leftVineStyle: React.CSSProperties | null = null;
    let rightVineStyle: React.CSSProperties | null = null;

    if (layout === 'grid-4') {
      headerStyle = { top: '0%', left: '0%', width: '100%', height: '5.5%', position: 'absolute' };
      footerStyle = { top: '93.5%', left: '0%', width: '100%', height: '6.5%', position: 'absolute' };
      slotsConfig = [
        { left: '3.5%', top: '5.5%', width: '46.0%', height: '43.5%' },
        { left: '50.5%', top: '5.5%', width: '46.0%', height: '43.5%' },
        { left: '3.5%', top: '50.0%', width: '46.0%', height: '43.5%' },
        { left: '50.5%', top: '50.0%', width: '46.0%', height: '43.5%' },
      ];
      if (isSpecialArtwork) {
        leftVineStyle = { left: '1.2%', top: '6.0%', width: '4.0%', height: '87.0%', position: 'absolute' };
        rightVineStyle = { right: '1.2%', top: '6.0%', width: '4.0%', height: '87.0%', position: 'absolute' };
      }
    } else if (layout === 'grid-4-rect') {
      // 2x2 layout with 3:4 portrait rectangular photo slots
      headerStyle = { top: '0%', left: '0%', width: '100%', height: '5.5%', position: 'absolute' };
      footerStyle = { top: '93.5%', left: '0%', width: '100%', height: '6.5%', position: 'absolute' };
      slotsConfig = [
        { left: '3.5%', top: '5.5%', width: '46.0%', height: '43.5%' },
        { left: '50.5%', top: '5.5%', width: '46.0%', height: '43.5%' },
        { left: '3.5%', top: '50.0%', width: '46.0%', height: '43.5%' },
        { left: '50.5%', top: '50.0%', width: '46.0%', height: '43.5%' },
      ];
      if (isSpecialArtwork) {
        leftVineStyle = { left: '1.2%', top: '6.0%', width: '4.0%', height: '87.0%', position: 'absolute' };
        rightVineStyle = { right: '1.2%', top: '6.0%', width: '4.0%', height: '87.0%', position: 'absolute' };
      }
    } else if (layout === 'strip-2') {
      // 2-cut horizontal layout (left to right)
      headerStyle = { top: '0%', left: '0%', width: '100%', height: '7.0%', position: 'absolute' };
      footerStyle = { top: '90.5%', left: '0%', width: '100%', height: '9.5%', position: 'absolute' };
      slotsConfig = [
        { left: '3.5%', top: '7.0%', width: '46.0%', height: '82.5%' },
        { left: '50.5%', top: '7.0%', width: '46.0%', height: '82.5%' },
      ];
      if (isSpecialArtwork) {
        leftVineStyle = { left: '1.0%', top: '7.0%', width: '4.0%', height: '82.5%', position: 'absolute' };
        rightVineStyle = { right: '1.0%', top: '7.0%', width: '4.0%', height: '82.5%', position: 'absolute' };
      }
    } else if (layout === 'single-1') {
      // 1-cut special poster layout
      headerStyle = { top: '0%', left: '0%', width: '100%', height: '5.5%', position: 'absolute' };
      footerStyle = { top: '93.5%', left: '0%', width: '100%', height: '6.5%', position: 'absolute' };
      slotsConfig = [{ left: '3.5%', top: '5.5%', width: '93.0%', height: '87.0%' }];
      if (isSpecialArtwork) {
        leftVineStyle = { left: '1.2%', top: '6.0%', width: '4.0%', height: '86.0%', position: 'absolute' };
        rightVineStyle = { right: '1.2%', top: '6.0%', width: '4.0%', height: '86.0%', position: 'absolute' };
      }
    } else if (layout === 'strip-3') {
      if (isSpecialArtwork) {
        headerStyle = { top: '0%', left: '0%', width: '100%', height: '5.0%', position: 'absolute' };
        footerStyle = { top: '93.5%', left: '0%', width: '100%', height: '6.5%', position: 'absolute' };
        slotsConfig = [
          { left: '4.5%', top: '5.0%', width: '91.0%', height: '28.8%' },
          { left: '4.5%', top: '34.8%', width: '91.0%', height: '28.8%' },
          { left: '4.5%', top: '64.6%', width: '91.0%', height: '28.8%' },
        ];
        leftVineStyle = { left: '1.2%', top: '5.0%', width: '4.0%', height: '88.0%', position: 'absolute' };
        rightVineStyle = { right: '1.2%', top: '5.0%', width: '4.0%', height: '88.0%', position: 'absolute' };
      } else {
        headerStyle = { top: '0%', left: '0%', width: '100%', height: '5.0%', position: 'absolute' };
        footerStyle = { top: '93.5%', left: '0%', width: '100%', height: '6.5%', position: 'absolute' };
        slotsConfig = [
          { left: '4.5%', top: '5.0%', width: '91.0%', height: '28.8%' },
          { left: '4.5%', top: '34.8%', width: '91.0%', height: '28.8%' },
          { left: '4.5%', top: '64.6%', width: '91.0%', height: '28.8%' },
        ];
      }
    } else { // strip-4
      if (isSpecialArtwork) {
        headerStyle = { top: '0%', left: '0%', width: '100%', height: '4.5%', position: 'absolute' };
        footerStyle = { top: '94.0%', left: '0%', width: '100%', height: '6.0%', position: 'absolute' };
        slotsConfig = [
          { left: '4.5%', top: '4.5%', width: '91.0%', height: '21.6%' },
          { left: '4.5%', top: '26.9%', width: '91.0%', height: '21.6%' },
          { left: '4.5%', top: '49.3%', width: '91.0%', height: '21.6%' },
          { left: '4.5%', top: '71.7%', width: '91.0%', height: '21.6%' },
        ];
        leftVineStyle = { left: '1.2%', top: '4.5%', width: '4.0%', height: '89.0%', position: 'absolute' };
        rightVineStyle = { right: '1.2%', top: '4.5%', width: '4.0%', height: '89.0%', position: 'absolute' };
      } else {
        headerStyle = { top: '0%', left: '0%', width: '100%', height: '4.5%', position: 'absolute' };
        footerStyle = { top: '94.0%', left: '0%', width: '100%', height: '6.0%', position: 'absolute' };
        slotsConfig = [
          { left: '4.5%', top: '4.5%', width: '91.0%', height: '21.6%' },
          { left: '4.5%', top: '26.9%', width: '91.0%', height: '21.6%' },
          { left: '4.5%', top: '49.3%', width: '91.0%', height: '21.6%' },
          { left: '4.5%', top: '71.7%', width: '91.0%', height: '21.6%' },
        ];
      }
    }

    return (
      <div
        ref={keyPrefix === 'strip-1' ? stripRef : null}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleContainerClick}
        className="relative w-full rounded-2xl select-none shadow-xl transition-all duration-300 border overflow-hidden"
        style={{
          backgroundColor: theme.id === 'airmail_postcard' ? '#E5D5BC' : theme.id === 'teddy_cozy_check' ? '#FAF6EF' : bgColor,
          borderColor: color.borderHex || 'rgba(0,0,0,0.08)',
          color: color.textColor,
          fontFamily: theme.fontFamily,
          aspectRatio:
            layout === 'grid-4'
              ? '9 / 11'
              : layout === 'grid-4-rect'
              ? '3 / 4.2'
              : layout === 'single-1'
              ? '3 / 4'
              : layout === 'strip-2'
              ? '11 / 7.5'
              : layout === 'strip-3'
              ? '1 / 3'
              : '3 / 11',
        }}
      >
        {/* Airmail Outer Stripe Border */}
        {theme.id === 'airmail_postcard' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-95"
            style={{
              background: `repeating-linear-gradient(
                -45deg,
                #C82A2A 0px,
                #C82A2A 10px,
                #FAF6EF 10px 14px,
                #1D3E6E 14px 24px,
                #FAF6EF 24px 28px
              )`,
              padding: isMiniPreview ? '6px' : '10px sm:12px',
            }}
          >
            <div className="w-full h-full bg-[#E5D5BC] border border-[#C8B59B] rounded-2xs" />
          </div>
        )}

        {theme.id === 'teddy_cozy_check' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-90"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #E0D5C1 25%, transparent 25%), 
                linear-gradient(-45deg, #E0D5C1 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #E0D5C1 75%), 
                linear-gradient(-45deg, transparent 75%, #E0D5C1 75%)
              `,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
              backgroundColor: '#FAF6EF',
            }}
          />
        )}

        {/* Left & Right Side Vine Border for Special Themes */}
        {isSpecialArtwork && leftVineStyle && rightVineStyle && theme.id !== 'teddy_cozy_check' && (
          <>
            <div className="pointer-events-none" style={leftVineStyle}>
              {theme.id === 'wedding_cake' && <SideVineArtwork color={artworkColor} isLeft={true} />}
              {theme.id === 'astrology' && <AstroConstellationArtwork color={artworkColor} isLeft={true} />}
              {theme.id === 'vintage_daisy' && <DaisySideVine color={artworkColor} isLeft={true} />}
              {theme.id === 'cozy_winter' && <WinterSideSnow color={artworkColor} isLeft={true} />}
            </div>
            <div className="pointer-events-none" style={rightVineStyle}>
              {theme.id === 'wedding_cake' && <SideVineArtwork color={artworkColor} isLeft={false} />}
              {theme.id === 'astrology' && <AstroConstellationArtwork color={artworkColor} isLeft={false} />}
              {theme.id === 'vintage_daisy' && <DaisySideVine color={artworkColor} isLeft={false} />}
              {theme.id === 'cozy_winter' && <WinterSideSnow color={artworkColor} isLeft={false} />}
            </div>
          </>
        )}

        {/* Header Area */}
        <div style={headerStyle}>
          {renderHeader()}
        </div>

        {/* Photos Grid based on Layout */}
        {slotsConfig.map((cfg, idx) => (
          <div key={idx} style={{ ...cfg, position: 'absolute' }}>
            {renderPhotoSlot(photoIndices[idx])}
          </div>
        ))}

        {/* Footer Area */}
        <div style={footerStyle}>
          {renderFooter()}
        </div>

        {/* Middle Scrapbook Sticker Overlays for Teddy Cozy Check Theme */}
        {theme.id === 'teddy_cozy_check' && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Over Frame 1 & 2 Gap - Left: Plush Teddy */}
            <div className="absolute top-[23.0%] left-[-2%] w-[25%] sm:w-[26%] z-30 drop-shadow-xs">
              <CozyPlushTeddy className="w-full h-auto" />
            </div>
            {/* Over Frame 1 & 2 Gap - Right: Letter B Cookie */}
            <div className="absolute top-[24.0%] right-[3%] w-[13%] sm:w-[14%] z-30 drop-shadow-xs">
              <CozyLetterBCookie className="w-full h-auto" />
            </div>
            {/* Over Frame 2 & 3 Gap - Left: Vintage Film Camera */}
            <div className="absolute top-[46.0%] left-[-2%] w-[24%] sm:w-[25%] z-30 drop-shadow-xs">
              <CozyVintageCamera className="w-full h-auto" />
            </div>
            {/* Over Frame 2 & 3 Gap - Right: Kraft Tape Label */}
            <div className="absolute top-[47.2%] right-[1%] w-[46%] sm:w-[48%] z-30 drop-shadow-xs">
              <CozyKraftTapeLabel className="w-full h-auto" />
            </div>
          </div>
        )}

        {/* Placed Stickers overlay */}
        {settings.stickers && settings.stickers.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {settings.stickers.map((st: PlacedSticker) => (
              <DraggableSticker
                key={st.id}
                sticker={st}
                isInteractive={isInteractive}
                isSelected={isInteractive && selectedStickerId === st.id}
                onSelect={onSelectSticker}
                onUpdate={onUpdateSticker}
                onRemove={onRemoveSticker}
                containerRef={stripRef}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Set explicit width or allow custom className override for grid fitting
  const isGridOrPoster = layout === 'grid-4' || layout === 'grid-4-rect' || layout === 'single-1' || layout === 'strip-2';
  const containerWidthClass =
    className || (isGridOrPoster ? 'w-[280px] sm:w-[390px]' : 'w-[200px] sm:w-[300px]');

  return (
    <div id="photobooth-strip-container" className={`flex items-center justify-center gap-3 max-w-full ${className ? 'w-full' : ''}`}>
      <div className={`flex-shrink-0 ${containerWidthClass}`}>
        {renderSingleStripContent('strip-1')}
      </div>

      {settings.isDoubleStrip && !isGridOrPoster && (
        <>
          {/* Dotted Cut Line */}
          <div className="hidden sm:flex flex-col items-center justify-center gap-2 h-full py-6 text-neutral-400">
            <span className="text-xs">✂️</span>
            <div className="w-0.5 flex-1 border-r-2 border-dashed border-neutral-300" />
            <span className="text-[10px] tracking-widest rotate-90 my-4 uppercase font-bold text-neutral-400">Cắt dải</span>
            <div className="w-0.5 flex-1 border-r-2 border-dashed border-neutral-300" />
            <span className="text-xs">✂️</span>
          </div>

          <div className={`hidden sm:block flex-shrink-0 ${containerWidthClass}`}>
            {renderSingleStripContent('strip-2')}
          </div>
        </>
      )}
    </div>
  );
};

