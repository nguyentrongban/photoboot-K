import { CapturedPhoto, DuoMode } from '../types';

/**
 * Loads an image from dataURL into an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Merges photo A (Host) and photo B (Guest) according to the selected DuoMode.
 */
export async function mergeDuoPhotos(
  photoA: string | undefined,
  photoB: string | undefined,
  mode: DuoMode = 'split-heart',
  slotIndex = 0
): Promise<string> {
  // If only one photo is available, return it as fallback
  if (!photoA && photoB) return photoB;
  if (photoA && !photoB) return photoA;
  if (!photoA && !photoB) return '';

  const imgA = await loadImage(photoA!);
  const imgB = await loadImage(photoB!);

  const canvas = document.createElement('canvas');
  const targetWidth = 1200;
  const targetHeight = 900;
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return photoA!;

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  if (mode === 'split-heart') {
    // Mode 1: Split Slot (Half Left = Person A, Half Right = Person B)
    const halfWidth = targetWidth / 2;

    // Draw Left Half (Person A)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, halfWidth, targetHeight);
    ctx.clip();
    // Center crop Image A into left half
    drawImageCover(ctx, imgA, 0, 0, halfWidth, targetHeight, 0.5, 0.5);
    ctx.restore();

    // Draw Right Half (Person B)
    ctx.save();
    ctx.beginPath();
    ctx.rect(halfWidth, 0, halfWidth, targetHeight);
    ctx.clip();
    // Center crop Image B into right half
    drawImageCover(ctx, imgB, halfWidth, 0, halfWidth, targetHeight, 0.5, 0.5);
    ctx.restore();

    // Subtle decorative center dividing line & heart badge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(halfWidth, 0);
    ctx.lineTo(halfWidth, targetHeight);
    ctx.stroke();

    // Tiny Center Heart Badge
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(halfWidth, targetHeight / 2, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Quicksand, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♥', halfWidth, targetHeight / 2 + 1);
  } else if (mode === 'alternating') {
    // Mode 2: Slot by Slot alternating
    const isHostSlot = slotIndex % 2 === 0;
    const currentImg = isHostSlot ? imgA : imgB;
    drawImageCover(ctx, currentImg, 0, 0, targetWidth, targetHeight, 0.5, 0.5);

    // Subtle corner badge for who is in the slot
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.roundRect(24, 24, 140, 38, 19);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Quicksand, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isHostSlot ? '✨ Bạn (A)' : '🌸 Người ấy (B)', 94, 43);
  } else {
    // Mode 3: Side-by-side or Cutout/Picture-in-picture
    const halfWidth = targetWidth / 2;
    drawImageCover(ctx, imgA, 0, 0, halfWidth, targetHeight, 0.5, 0.5);
    drawImageCover(ctx, imgB, halfWidth, 0, halfWidth, targetHeight, 0.5, 0.5);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(halfWidth, 0);
    ctx.lineTo(halfWidth, targetHeight);
    ctx.stroke();
  }

  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Helper to draw an image inside a box with 'cover' object-fit
 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  offsetX = 0.5,
  offsetY = 0.5
) {
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  const imgRatio = imgW / imgH;
  const targetRatio = w / h;

  let sW = imgW;
  let sH = imgH;
  let sX = 0;
  let sY = 0;

  if (imgRatio > targetRatio) {
    sW = imgH * targetRatio;
    sX = (imgW - sW) * offsetX;
  } else {
    sH = imgW / targetRatio;
    sY = (imgH - sH) * offsetY;
  }

  ctx.drawImage(img, sX, sY, sW, sH, x, y, w, h);
}
