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
}) => {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const bgColor = settings.customColorHex || color.hex;
  const layout = settings.layoutType || 'grid-4';
  const isWeddingTheme = theme.id === 'wedding_cake';
  const isSpecialArtwork = !!theme.isSpecialArtwork;
  const artworkColor = isSpecialArtwork ? color.textColor : theme.accentColor;

  // Determine photo count based on layout
  const photoIndices = layout === 'strip-3' ? [0, 1, 2] : [0, 1, 2, 3];

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
      <div
        key={`frame-${index}`}
        id={`photo-slot-${index}`}
        className={`w-full h-full relative rounded-xl overflow-hidden bg-neutral-200/80 shadow-xs border transition-all duration-300 ${
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

        {/* Small corner theme decoration if not special artwork */}
        {!isSpecialArtwork && theme.sideDecorations && theme.sideDecorations.length > 0 && (
          <>
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 text-xs drop-shadow-sm select-none pointer-events-none">
              {theme.sideDecorations[index % theme.sideDecorations.length]}
            </span>
            <span className="absolute -right-1 top-1/2 -translate-y-1/2 text-xs drop-shadow-sm select-none pointer-events-none">
              {theme.sideDecorations[(index + 1) % theme.sideDecorations.length]}
            </span>
          </>
        )}
      </div>
    );
  };

  const renderHeader = () => {
    if (isSpecialArtwork) {
      return (
        <div className="w-full h-full flex items-center justify-between px-4">
          {/* Top-left artwork */}
          <div className="flex-shrink-0">
            {theme.id === 'wedding_cake' && <DoveArtwork color={artworkColor} className="w-6 h-6 sm:w-8 sm:h-8" />}
            {theme.id === 'astrology' && <CrescentMoonArtwork color={artworkColor} className="w-6 h-6 sm:w-8 sm:h-8" />}
            {theme.id === 'vintage_daisy' && <DaisyHeaderLeft color={artworkColor} className="w-6 h-6 sm:w-8 sm:h-8" />}
            {theme.id === 'cozy_winter' && <WinterHeaderLeft color={artworkColor} className="w-6 h-6 sm:w-8 sm:h-8" />}
          </div>

          {/* Center Titles */}
          <div className="text-center px-1 flex-1 min-w-0">
            <h2
              className="text-xs sm:text-sm font-black tracking-widest uppercase truncate"
              style={{ color: color.textColor, fontFamily: theme.fontFamily, letterSpacing: '0.1em' }}
            >
              {settings.title || (theme.id === 'wedding_cake' ? 'AMIRA & SPENCE' : theme.id === 'astrology' ? 'COSMIC MEMORY' : theme.id === 'vintage_daisy' ? 'DAISY MEMORY' : 'WINTER CHILL')}
            </h2>
            {settings.subtitle && (
              <p className="text-[8px] sm:text-[10px] font-semibold tracking-wide italic mt-0.5 truncate" style={{ color: color.subtextColor }}>
                {settings.subtitle}
              </p>
            )}
          </div>

          {/* Top-right artwork */}
          <div className="flex-shrink-0">
            {theme.id === 'wedding_cake' && <HeartArrowArtwork color={artworkColor} className="w-6 h-6 sm:w-8 sm:h-8" />}
            {theme.id === 'astrology' && <AstroStarArtwork color={artworkColor} className="w-6 h-6 sm:w-8 sm:h-8" />}
            {theme.id === 'vintage_daisy' && <DaisyHeaderRight color={artworkColor} className="w-6 h-6 sm:w-8 sm:h-8" />}
            {theme.id === 'cozy_winter' && <WinterHeaderRight color={artworkColor} className="w-6 h-6 sm:w-8 sm:h-8" />}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col justify-center items-center px-4">
        {theme.topDecoration && (
          <p className="text-[9px] sm:text-xs font-bold tracking-wider opacity-90 truncate w-full text-center">
            {theme.topDecoration}
          </p>
        )}
        <h2 className="text-xs sm:text-sm font-black tracking-widest uppercase mt-0.5 truncate w-full text-center" style={{ color: color.textColor }}>
          {settings.title || 'PHOTOBOOTH MEMORY'}
        </h2>
        {settings.subtitle && (
          <p className="text-[8px] sm:text-[10px] font-semibold tracking-wide truncate w-full text-center" style={{ color: color.subtextColor }}>
            {settings.subtitle}
          </p>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    if (isSpecialArtwork) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center px-4">
          <div className="flex items-center justify-center gap-1 opacity-90">
            {theme.id === 'wedding_cake' && <RibbonBowArtwork color={artworkColor} className="w-8 h-5 sm:w-12 sm:h-7" />}
          </div>

          <div className="mt-0.5 opacity-95">
            {theme.id === 'wedding_cake' && <HeartCakeArtwork color={artworkColor} className="w-12 h-10 sm:w-20 sm:h-18" />}
            {theme.id === 'astrology' && <AstroGlobeArtwork color={artworkColor} className="w-12 h-10 sm:w-20 sm:h-18" />}
            {theme.id === 'vintage_daisy' && <DaisyFooterPot color={artworkColor} className="w-12 h-10 sm:w-20 sm:h-18" />}
            {theme.id === 'cozy_winter' && <WinterSnowglobe color={artworkColor} className="w-12 h-10 sm:w-20 sm:h-18" />}
          </div>

          {/* Date String */}
          {settings.showDate && (
            <p
              className="text-[8px] sm:text-xs font-bold tracking-widest mt-0.5"
              style={{ color: color.textColor, fontFamily: theme.fontFamily }}
            >
              {settings.customDate || '08. 23. 25'}
            </p>
          )}

          {theme.bottomDecoration && (
            <p className="text-[7px] sm:text-[9px] font-semibold italic opacity-90 mt-0.5" style={{ color: color.subtextColor }}>
              {theme.bottomDecoration}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col justify-center items-center px-4">
        {settings.showDate && settings.customDate && (
          <p className="text-[9px] sm:text-xs font-bold tracking-wider" style={{ color: color.textColor }}>
            {settings.customDate}
          </p>
        )}

        {theme.bottomDecoration && (
          <p className="text-[8px] sm:text-xs font-bold italic tracking-wide truncate w-full text-center" style={{ color: color.subtextColor }}>
            {theme.bottomDecoration}
          </p>
        )}

        <div className="flex items-center justify-center gap-1 text-[7px] sm:text-[9px] tracking-widest font-mono uppercase mt-0.5 opacity-75" style={{ color: color.subtextColor }}>
          <Stars className="w-2.5 h-2.5 text-amber-500 inline" />
          <span>LIFE FOUR CUTS • SEOUL</span>
        </div>

        {/* Barcode graphic */}
        <div className="flex items-center justify-center gap-0.5 mt-0.5 opacity-60">
          {[4, 2, 6, 3, 2, 5, 2, 6, 2, 4, 3, 5, 2, 4, 2].map((h, i) => (
            <div
              key={i}
              className="rounded-xs"
              style={{
                width: `${(i % 3) + 1.2}px`,
                height: '10px',
                backgroundColor: color.textColor,
              }}
            />
          ))}
        </div>
        <span className="text-[7px] sm:text-[8px] font-mono tracking-tighter opacity-50" style={{ color: color.textColor }}>
          KR-2026-BOOTH
        </span>
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
      headerStyle = { top: '0%', left: '0%', width: '100%', height: '12.27%', position: 'absolute' };
      footerStyle = { top: '67.18%', left: '0%', width: '100%', height: '32.82%', position: 'absolute' };
      slotsConfig = [
        { left: '7.78%', top: '12.27%', width: '41.11%', height: '25.18%' },
        { left: '51.11%', top: '12.27%', width: '41.11%', height: '25.18%' },
        { left: '7.78%', top: '39.27%', width: '41.11%', height: '25.18%' },
        { left: '51.11%', top: '39.27%', width: '41.11%', height: '25.18%' },
      ];
      if (isSpecialArtwork) {
        leftVineStyle = { left: '1.5%', top: '14.55%', width: '4.5%', height: '58.18%', position: 'absolute' };
        rightVineStyle = { right: '1.5%', top: '14.55%', width: '4.5%', height: '58.18%', position: 'absolute' };
      }
    } else if (layout === 'strip-3') {
      if (isSpecialArtwork) {
        headerStyle = { top: '0%', left: '0%', width: '100%', height: '5.83%', position: 'absolute' };
        footerStyle = { top: '73.83%', left: '0%', width: '100%', height: '26.17%', position: 'absolute' };
        slotsConfig = [
          { left: '7.5%', top: '5.83%', width: '85.0%', height: '21.11%' },
          { left: '7.5%', top: '28.5%', width: '85.0%', height: '21.11%' },
          { left: '7.5%', top: '51.17%', width: '85.0%', height: '21.11%' },
        ];
        leftVineStyle = { left: '1.5%', top: '7.78%', width: '4.5%', height: '76.67%', position: 'absolute' };
        rightVineStyle = { right: '1.5%', top: '7.78%', width: '4.5%', height: '76.67%', position: 'absolute' };
      } else {
        headerStyle = { top: '0%', left: '0%', width: '100%', height: '8.33%', position: 'absolute' };
        footerStyle = { top: '76.33%', left: '0%', width: '100%', height: '23.67%', position: 'absolute' };
        slotsConfig = [
          { left: '7.5%', top: '8.33%', width: '85.0%', height: '21.11%' },
          { left: '7.5%', top: '31.0%', width: '85.0%', height: '21.11%' },
          { left: '7.5%', top: '53.67%', width: '85.0%', height: '21.11%' },
        ];
      }
    } else { // strip-4
      if (isSpecialArtwork) {
        headerStyle = { top: '0%', left: '0%', width: '100%', height: '4.77%', position: 'absolute' };
        footerStyle = { top: '70.21%', left: '0%', width: '100%', height: '29.79%', position: 'absolute' };
        slotsConfig = [
          { left: '7.5%', top: '4.77%', width: '85.0%', height: '15.45%' },
          { left: '7.5%', top: '21.13%', width: '85.0%', height: '15.45%' },
          { left: '7.5%', top: '37.49%', width: '85.0%', height: '15.45%' },
          { left: '7.5%', top: '53.85%', width: '85.0%', height: '15.45%' },
        ];
        leftVineStyle = { left: '1.5%', top: '6.36%', width: '4.5%', height: '76.36%', position: 'absolute' };
        rightVineStyle = { right: '1.5%', top: '6.36%', width: '4.5%', height: '76.36%', position: 'absolute' };
      } else {
        headerStyle = { top: '0%', left: '0%', width: '100%', height: '6.82%', position: 'absolute' };
        footerStyle = { top: '72.26%', left: '0%', width: '100%', height: '27.74%', position: 'absolute' };
        slotsConfig = [
          { left: '7.5%', top: '6.82%', width: '85.0%', height: '15.45%' },
          { left: '7.5%', top: '23.18%', width: '85.0%', height: '15.45%' },
          { left: '7.5%', top: '39.54%', width: '85.0%', height: '15.45%' },
          { left: '7.5%', top: '55.90%', width: '85.0%', height: '15.45%' },
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
          backgroundColor: bgColor,
          borderColor: color.borderHex || 'rgba(0,0,0,0.08)',
          color: color.textColor,
          fontFamily: theme.fontFamily,
          aspectRatio: layout === 'grid-4' ? '9 / 11' : layout === 'strip-3' ? '1 / 3' : '3 / 11',
        }}
      >
        {/* Left & Right Side Vine Border for Special Themes */}
        {isSpecialArtwork && leftVineStyle && rightVineStyle && (
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

  // Set explicit width instead of only max-width to prevent collapsing in flex containers
  const containerWidthClass = layout === 'grid-4' 
    ? 'w-[280px] sm:w-[390px]' 
    : 'w-[200px] sm:w-[300px]';

  return (
    <div id="photobooth-strip-container" className="flex items-center justify-center gap-3 max-w-full">
      <div className={`flex-shrink-0 ${containerWidthClass}`}>
        {renderSingleStripContent('strip-1')}
      </div>

      {settings.isDoubleStrip && layout !== 'grid-4' && (
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

