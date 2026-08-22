import React, { useRef, useState, useCallback } from 'react';
import { PlacedSticker } from '../types';
import {
  Trash3Fill,
  ArrowClockwise,
  PlusLg,
  DashLg,
  ArrowsMove,
} from 'react-bootstrap-icons';

interface DraggableStickerProps {
  sticker: PlacedSticker;
  isInteractive?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (sticker: PlacedSticker) => void;
  onRemove?: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const DraggableSticker: React.FC<DraggableStickerProps> = ({
  sticker,
  isInteractive = false,
  isSelected = false,
  onSelect,
  onUpdate,
  onRemove,
  containerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
    hasMoved: boolean;
  }>({
    clientX: 0,
    clientY: 0,
    startX: sticker.x,
    startY: sticker.y,
    hasMoved: false,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    e.stopPropagation();

    // Select this sticker
    if (onSelect) {
      onSelect(sticker.id);
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }

    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: sticker.x,
      startY: sticker.y,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isInteractive || !containerRef.current || !onUpdate) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    const deltaPixelX = e.clientX - dragStartRef.current.clientX;
    const deltaPixelY = e.clientY - dragStartRef.current.clientY;

    if (Math.hypot(deltaPixelX, deltaPixelY) > 3) {
      dragStartRef.current.hasMoved = true;
    }

    const deltaPercentX = (deltaPixelX / containerRect.width) * 100;
    const deltaPercentY = (deltaPixelY / containerRect.height) * 100;

    const newX = Math.max(3, Math.min(97, dragStartRef.current.startX + deltaPercentX));
    const newY = Math.max(3, Math.min(97, dragStartRef.current.startY + deltaPercentY));

    onUpdate({
      ...sticker,
      x: Number(newX.toFixed(2)),
      y: Number(newY.toFixed(2)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Quick manipulation actions
  const handleRotate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!onUpdate) return;
      const nextRotation = (sticker.rotation + 20) % 360;
      onUpdate({ ...sticker, rotation: nextRotation });
    },
    [sticker, onUpdate]
  );

  const handleEnlarge = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!onUpdate) return;
      const nextSize = Math.min(72, sticker.size + 4);
      onUpdate({ ...sticker, size: nextSize });
    },
    [sticker, onUpdate]
  );

  const handleShrink = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!onUpdate) return;
      const nextSize = Math.max(16, sticker.size - 4);
      onUpdate({ ...sticker, size: nextSize });
    },
    [sticker, onUpdate]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onRemove) {
        onRemove(sticker.id);
      }
    },
    [sticker.id, onRemove]
  );

  if (!isInteractive) {
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none transition-transform"
        style={{
          left: `${sticker.x}%`,
          top: `${sticker.y}%`,
          fontSize: `${sticker.size}px`,
          transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
        }}
      >
        <span className="drop-shadow-md">{sticker.emoji}</span>
      </div>
    );
  }

  return (
    <div
      id={`sticker-placed-${sticker.id}`}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 select-none touch-none cursor-grab pointer-events-auto ${
        isDragging ? 'cursor-grabbing scale-110 z-30' : 'z-20'
      } ${isSelected ? 'z-30' : ''}`}
      style={{
        left: `${sticker.x}%`,
        top: `${sticker.y}%`,
        fontSize: `${sticker.size}px`,
        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Visual Selection Ring */}
      {isSelected && (
        <div
          className="absolute -inset-2.5 rounded-2xl border-2 border-dashed border-rose-400 bg-rose-500/10 pointer-events-none animate-in fade-in duration-150"
          style={{ transform: `rotate(0deg)` }}
        />
      )}

      {/* Emoji Graphic */}
      <span className="drop-shadow-md block hover:scale-105 transition-transform">
        {sticker.emoji}
      </span>

      {/* Floating Action Controls for Selected Sticker */}
      {isSelected && (
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-neutral-900/90 backdrop-blur-md px-2 py-1 rounded-full text-white shadow-xl border border-white/20 z-40 text-xs animate-in zoom-in-75 duration-150"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleRotate}
            title="Xoay +20°"
            className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-[10px] transition-all cursor-pointer"
          >
            <ArrowClockwise className="w-2.5 h-2.5" />
          </button>

          <button
            type="button"
            onClick={handleEnlarge}
            title="Phóng to"
            className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-[10px] transition-all cursor-pointer"
          >
            <PlusLg className="w-2.5 h-2.5" />
          </button>

          <button
            type="button"
            onClick={handleShrink}
            title="Thu nhỏ"
            className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-[10px] transition-all cursor-pointer"
          >
            <DashLg className="w-2.5 h-2.5" />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            title="Xóa sticker này"
            className="w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-[10px] text-white transition-all cursor-pointer"
          >
            <Trash3Fill className="w-2.5 h-2.5" />
          </button>
        </div>
      )}

      {/* Bottom Drag Helper Badge when selected */}
      {isSelected && (
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/90 text-neutral-800 px-1.5 py-0.5 rounded-md text-[9px] font-bold shadow-md flex items-center gap-0.5 whitespace-nowrap pointer-events-none border border-neutral-200"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <ArrowsMove className="w-2 h-2 text-rose-500" />
          <span>Kéo để dời</span>
        </div>
      )}
    </div>
  );
};
