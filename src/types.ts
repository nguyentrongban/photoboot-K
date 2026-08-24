export type Step = 1 | 2 | 3;

export type LayoutType = 'strip-3' | 'strip-4' | 'grid-4' | 'grid-4-rect' | 'strip-2' | 'single-1';

export interface FrameTheme {
  id: string;
  name: string;
  category: 'minimal' | 'cute' | 'vintage' | 'party' | 'korean' | 'y2k' | 'wedding';
  description: string;
  badgeText: string;
  fontFamily: string;
  accentColor: string;
  borderStyle: string;
  topDecoration?: string;
  bottomDecoration?: string;
  sideDecorations?: string[];
  cornerDecoration?: string;
  defaultTextColor: string;
  isSpecialArtwork?: boolean;
  isImageOverlay?: boolean;
  hasFixedColor?: boolean;
  fixedColorId?: string;
}

export interface FrameColor {
  id: string;
  name: string;
  hex: string;
  textColor: string;
  subtextColor: string;
  borderHex: string;
  isDark?: boolean;
}

export interface PhotoFilter {
  id: string;
  name: string;
  filterClass: string;
  cssFilter: string;
  description: string;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  index: number;
}

export interface PlacedSticker {
  id: string;
  emoji: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  size: number;
  rotation: number;
}

export interface PhotoboothSettings {
  layoutType: LayoutType;
  themeId: string;
  colorId: string;
  customColorHex?: string;
  filterId: string;
  title: string;
  subtitle: string;
  showDate: boolean;
  customDate: string;
  showQrCode: boolean;
  showFilmHoles: boolean;
  isDoubleStrip: boolean;
  stickers: PlacedSticker[];
  skinSmooth?: number;
  duoMode?: DuoMode;
}

export type DuoMode = 'split-heart' | 'side-by-side' | 'alternating' | 'cutout';

export interface DuoMember {
  id: string;
  name: string;
  role: 'host' | 'guest';
  isReady: boolean;
  avatarSeed: string;
}

export interface DuoRoomState {
  code: string;
  createdAt: number;
  members: Record<string, DuoMember>;
  duoMode: DuoMode;
  settings: PhotoboothSettings;
  photos: {
    host: CapturedPhoto[];
    guest: CapturedPhoto[];
    merged: CapturedPhoto[];
  };
  currentSlot: number | null;
  countdownStart: number | null;
  timerDuration: number;
  step: Step;
  stickers: PlacedSticker[];
}

export interface DuoReaction {
  id: string;
  senderId?: string;
  senderName?: string;
  emoji: string;
}

export interface DuoChatMessage {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

