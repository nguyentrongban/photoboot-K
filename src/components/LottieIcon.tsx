import React from 'react';
import { motion } from 'motion/react';

export type LottieIconType =
  | 'layout'
  | 'style'
  | 'color'
  | 'filter'
  | 'signature'
  | 'camera'
  | 'sticker'
  | 'sparkle'
  | 'heart';

interface LottieIconProps {
  name: LottieIconType;
  size?: number | string;
  className?: string;
}

export const LottieIcon: React.FC<LottieIconProps> = ({
  name,
  size = 28,
  className = '',
}) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(String(size), 10) || 28;

  const renderIcon = () => {
    switch (name) {
      case 'layout':
        return (
          <svg
            viewBox="0 0 40 40"
            width={pixelSize}
            height={pixelSize}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Top-Left Box */}
            <motion.rect
              x="5"
              y="5"
              width="13"
              height="13"
              rx="4"
              fill="#F43F5E"
              animate={{
                scale: [1, 1.1, 1],
                y: [0, -1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Top-Right Box */}
            <motion.rect
              x="22"
              y="5"
              width="13"
              height="13"
              rx="4"
              fill="#FB7185"
              animate={{
                scale: [1, 0.95, 1],
                y: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.3,
              }}
            />
            {/* Bottom-Left Box */}
            <motion.rect
              x="5"
              y="22"
              width="13"
              height="13"
              rx="4"
              fill="#FDA4AF"
              animate={{
                scale: [1, 0.95, 1],
                y: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.6,
              }}
            />
            {/* Bottom-Right Box */}
            <motion.rect
              x="22"
              y="22"
              width="13"
              height="13"
              rx="4"
              fill="#1E293B"
              animate={{
                scale: [1, 1.1, 1],
                y: [0, -1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.9,
              }}
            />
            {/* Center Sparkle */}
            <motion.circle
              cx="20"
              cy="20"
              r="2.5"
              fill="#F59E0B"
              animate={{
                scale: [0.8, 1.4, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </svg>
        );

      case 'style':
        return (
          <svg
            viewBox="0 0 40 40"
            width={pixelSize}
            height={pixelSize}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Floating Bow Ribbon */}
            <motion.g
              animate={{
                rotate: [-4, 4, -4],
                y: [-1, 1, -1],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '20px', originY: '20px' }}
            >
              {/* Left Ribbon Wing */}
              <path
                d="M18 20C12 13 6 15 7 21C8 26 14 24 18 20Z"
                fill="#FB7185"
              />
              <path
                d="M17 19.5C13 15 9 16 10 20.5C11 23.5 15 22.5 17 19.5Z"
                fill="#FDA4AF"
              />
              {/* Right Ribbon Wing */}
              <path
                d="M22 20C28 13 34 15 33 21C32 26 26 24 22 20Z"
                fill="#FB7185"
              />
              <path
                d="M23 19.5C27 15 31 16 30 20.5C29 23.5 25 22.5 23 19.5Z"
                fill="#FDA4AF"
              />
              {/* Ribbon Tails */}
              <path
                d="M16 22L12 33L17 31L19 23"
                fill="#F43F5E"
              />
              <path
                d="M24 22L28 33L23 31L21 23"
                fill="#F43F5E"
              />
              {/* Center Knot */}
              <circle
                cx="20"
                cy="20"
                r="4.5"
                fill="#E11D48"
              />
              <circle
                cx="19"
                cy="19"
                r="1.5"
                fill="#FFF"
                opacity="0.8"
              />
            </motion.g>

            {/* Orbiting Sparkle Star */}
            <motion.path
              d="M33 10L34 13L37 14L34 15L33 18L32 15L29 14L32 13Z"
              fill="#F59E0B"
              animate={{
                scale: [0.6, 1.2, 0.6],
                rotate: [0, 90, 180, 270, 360],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '33px', originY: '14px' }}
            />
          </svg>
        );

      case 'color':
        return (
          <svg
            viewBox="0 0 40 40"
            width={pixelSize}
            height={pixelSize}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Palette Board */}
            <motion.g
              animate={{
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '20px', originY: '20px' }}
            >
              <path
                d="M20 6C11.7 6 5 12.7 5 21C5 29.3 11.7 35 20 35C22.5 35 24 33.5 24 31.5C24 30.5 23.5 29.8 23 29C22.4 28.1 22 27.2 22 26C22 23.8 23.8 22 26 22H29C33.4 22 37 18.4 37 14C37 9.6 29.4 6 20 6Z"
                fill="#FEF3C7"
                stroke="#FDE68A"
                strokeWidth="1.5"
              />
              {/* Color Drops */}
              <motion.circle
                cx="13"
                cy="14"
                r="3"
                fill="#F43F5E"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              />
              <motion.circle
                cx="21"
                cy="11"
                r="3"
                fill="#38BDF8"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
              <motion.circle
                cx="29"
                cy="14"
                r="3"
                fill="#34D399"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              />
              <motion.circle
                cx="31"
                cy="20"
                r="2.5"
                fill="#A855F7"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
              />
              {/* Thumb Hole */}
              <circle
                cx="14"
                cy="27"
                r="3"
                fill="#FFF1F2"
              />
            </motion.g>

            {/* Dipping Paintbrush */}
            <motion.g
              animate={{
                x: [0, 2, 0],
                y: [0, -2, 0],
                rotate: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '32px', originY: '32px' }}
            >
              <rect
                x="28"
                y="24"
                width="4"
                height="12"
                rx="2"
                fill="#78350F"
                transform="rotate(-45 28 24)"
              />
              <path
                d="M24 28L26 30L22 34L20 32Z"
                fill="#F43F5E"
              />
            </motion.g>
          </svg>
        );

      case 'filter':
        return (
          <svg
            viewBox="0 0 40 40"
            width={pixelSize}
            height={pixelSize}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Wand Stick */}
            <motion.g
              animate={{
                rotate: [-25, -15, -25],
                y: [0, -1.5, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '15px', originY: '28px' }}
            >
              <rect
                x="14"
                y="18"
                width="4"
                height="18"
                rx="2"
                fill="#475569"
              />
              <rect
                x="14"
                y="14"
                width="4"
                height="6"
                rx="2"
                fill="#FB7185"
              />
            </motion.g>

            {/* Glowing Big Magic Star */}
            <motion.path
              d="M25 4L27 12L35 14L27 16L25 24L23 16L15 14L23 12Z"
              fill="#F59E0B"
              animate={{
                scale: [0.9, 1.25, 0.9],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '25px', originY: '14px' }}
            />
            {/* Inner Core of Star */}
            <motion.circle
              cx="25"
              cy="14"
              r="2.5"
              fill="#FFF"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Surrounding Little Sparkles */}
            <motion.circle
              cx="10"
              cy="10"
              r="2"
              fill="#EC4899"
              animate={{
                scale: [0, 1.4, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: 0.2,
              }}
            />
            <motion.circle
              cx="33"
              cy="28"
              r="1.8"
              fill="#38BDF8"
              animate={{
                scale: [0, 1.4, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: 0.8,
              }}
            />
          </svg>
        );

      case 'signature':
        return (
          <svg
            viewBox="0 0 40 40"
            width={pixelSize}
            height={pixelSize}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Animated Pen */}
            <motion.g
              animate={{
                x: [-1, 2, -1],
                y: [0, 1, 0],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '22px', originY: '24px' }}
            >
              {/* Pen Body */}
              <rect
                x="20"
                y="6"
                width="6"
                height="18"
                rx="2"
                fill="#F97316"
                transform="rotate(35 20 6)"
              />
              <rect
                x="19"
                y="5"
                width="6"
                height="4"
                rx="1"
                fill="#FBBF24"
                transform="rotate(35 19 5)"
              />
              {/* Pen Nib */}
              <path
                d="M10 24L14 21L15 26Z"
                fill="#334155"
              />
            </motion.g>

            {/* Signature Ribbon Line */}
            <motion.path
              d="M7 31C12 28 15 34 20 30C25 26 28 32 34 30"
              stroke="#F43F5E"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{
                pathLength: [0.3, 1, 0.3],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Cute Little Heart at the end */}
            <motion.path
              d="M33 26C33 24.5 34 23.5 35.5 23.5C36.5 23.5 37 24 37.5 24.5C38 24 38.5 23.5 39.5 23.5C41 23.5 42 24.5 42 26C42 28 39.5 30 37.5 31.5C35.5 30 33 28 33 26Z"
              fill="#F43F5E"
              animate={{
                scale: [0.9, 1.3, 0.9],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '37.5px', originY: '27.5px' }}
            />
          </svg>
        );

      case 'camera':
        return (
          <svg
            viewBox="0 0 40 40"
            width={pixelSize}
            height={pixelSize}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            <motion.g
              animate={{
                scale: [1, 1.05, 1],
                y: [0, -1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '20px', originY: '22px' }}
            >
              {/* Camera Body */}
              <rect
                x="6"
                y="12"
                width="28"
                height="21"
                rx="6"
                fill="#F43F5E"
              />
              {/* Flash Light Top */}
              <rect
                x="10"
                y="8"
                width="8"
                height="5"
                rx="2"
                fill="#FB7185"
              />
              <motion.circle
                cx="14"
                cy="10"
                r="1.5"
                fill="#FEF08A"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                }}
              />

              {/* Shutter Button */}
              <rect
                x="25"
                y="9"
                width="6"
                height="4"
                rx="1"
                fill="#E11D48"
              />

              {/* Lens Outer Ring */}
              <circle
                cx="20"
                cy="22.5"
                r="7.5"
                fill="#FFFFFF"
              />
              {/* Lens Glass */}
              <circle
                cx="20"
                cy="22.5"
                r="5.5"
                fill="#0F172A"
              />
              {/* Lens Reflection */}
              <motion.circle
                cx="18.5"
                cy="21"
                r="1.8"
                fill="#38BDF8"
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                }}
              />
            </motion.g>
          </svg>
        );

      case 'sticker':
        return (
          <svg
            viewBox="0 0 40 40"
            width={pixelSize}
            height={pixelSize}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Bouncing Cute Heart */}
            <motion.path
              d="M20 32C20 32 8 24 8 16C8 11.5 11.5 8 16 8C18.5 8 20 9.5 20 9.5C20 9.5 21.5 8 24 8C28.5 8 32 11.5 32 16C32 24 20 32 20 32Z"
              fill="#F43F5E"
              animate={{
                scale: [0.95, 1.15, 0.95],
                rotate: [-4, 4, -4],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '20px', originY: '20px' }}
            />
            {/* Heart Highlight */}
            <path
              d="M13 14C13 12 14.5 10.5 16.5 10.5"
              stroke="#FFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Orbiting Sparkle */}
            <motion.path
              d="M32 7L33 9L35 10L33 11L32 13L31 11L29 10L31 9Z"
              fill="#F59E0B"
              animate={{
                scale: [0.7, 1.3, 0.7],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              style={{ originX: '32px', originY: '10px' }}
            />
          </svg>
        );

      case 'sparkle':
        return (
          <svg
            viewBox="0 0 40 40"
            width={pixelSize}
            height={pixelSize}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            <motion.path
              d="M20 4L23 15L34 18L23 21L20 32L17 21L6 18L17 15Z"
              fill="#F59E0B"
              animate={{
                scale: [0.85, 1.2, 0.85],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '20px', originY: '18px' }}
            />
            <motion.circle
              cx="20"
              cy="18"
              r="3"
              fill="#FEF08A"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </svg>
        );

      case 'heart':
      default:
        return (
          <svg
            viewBox="0 0 40 40"
            width={pixelSize}
            height={pixelSize}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            <motion.path
              d="M20 32C20 32 8 24 8 16C8 11.5 11.5 8 16 8C18.5 8 20 9.5 20 9.5C20 9.5 21.5 8 24 8C28.5 8 32 11.5 32 16C32 24 20 32 20 32Z"
              fill="#FB7185"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ originX: '20px', originY: '20px' }}
            />
          </svg>
        );
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
    >
      {renderIcon()}
    </span>
  );
};
