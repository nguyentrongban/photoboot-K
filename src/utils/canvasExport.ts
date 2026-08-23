import { CapturedPhoto, FrameColor, FrameTheme, PhotoboothSettings, PhotoFilter } from '../types';

export interface ExportOptions {
  photos: CapturedPhoto[];
  settings: PhotoboothSettings;
  theme: FrameTheme;
  color: FrameColor;
  filter: PhotoFilter;
  scale?: number;
}

// --- COZY BEAR & VINTAGE SCRAPBOOK CANVAS DRAWING FUNCTIONS ---
function drawCanvasGinghamBg(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.save();
  ctx.fillStyle = '#FAF6EF';
  ctx.fillRect(x, y, width, height);

  const tileSize = 32;
  ctx.fillStyle = '#E0D5C1';
  ctx.globalAlpha = 0.85;

  for (let row = 0; row * tileSize < height; row++) {
    for (let col = 0; col * tileSize < width; col++) {
      if ((row + col) % 2 === 1) {
        ctx.fillRect(x + col * tileSize, y + row * tileSize, tileSize, tileSize);
      }
    }
  }

  ctx.fillStyle = '#C8B89E';
  ctx.globalAlpha = 0.45;
  for (let row = 1; row * tileSize < height; row += 2) {
    for (let col = 1; col * tileSize < width; col += 2) {
      ctx.fillRect(x + col * tileSize, y + row * tileSize, tileSize, tileSize);
    }
  }

  ctx.restore();
}

function drawCanvasCozyBearBow(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 70;
  ctx.scale(scale, scale);

  ctx.fillStyle = '#CBB399';
  ctx.strokeStyle = '#9E8268';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(35, 25);
  ctx.bezierCurveTo(22, 10, 12, 28, 32, 28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(35, 25);
  ctx.bezierCurveTo(48, 10, 58, 28, 38, 28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#BBA085';
  ctx.beginPath();
  ctx.moveTo(32, 28);
  ctx.bezierCurveTo(28, 38, 22, 52, 20, 60);
  ctx.bezierCurveTo(25, 58, 30, 55, 33, 30);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(38, 28);
  ctx.bezierCurveTo(42, 38, 48, 52, 50, 60);
  ctx.bezierCurveTo(45, 58, 40, 55, 37, 30);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#5A4332';
  ctx.strokeStyle = '#3A281A';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(35, 27, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4B3626';
  ctx.beginPath();
  ctx.arc(35, 27, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#D2C2B2';
  ctx.beginPath();
  ctx.arc(33, 25, 0.9, 0, Math.PI * 2);
  ctx.arc(37, 25, 0.9, 0, Math.PI * 2);
  ctx.arc(33, 29, 0.9, 0, Math.PI * 2);
  ctx.arc(37, 29, 0.9, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCanvasCozyBearCookie(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 70;
  ctx.scale(scale, scale);

  ctx.fillStyle = '#CFA06E';
  ctx.strokeStyle = '#8C613A';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(20, 22, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#E8B896';
  ctx.beginPath();
  ctx.arc(20, 22, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#CFA06E';
  ctx.beginPath();
  ctx.arc(50, 22, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#E8B896';
  ctx.beginPath();
  ctx.arc(50, 22, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#D9A873';
  ctx.beginPath();
  ctx.arc(35, 38, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFF5EA';
  ctx.strokeStyle = '#B88A58';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(35, 42, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#5A3A22';
  ctx.beginPath();
  ctx.ellipse(35, 39, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5A3A22';
  ctx.beginPath();
  ctx.arc(25, 34, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#E8A0B0';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.ellipse(21, 40, 3.5, 2, 0, 0, Math.PI * 2);
  ctx.ellipse(49, 40, 3.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCanvasCozyPlushTeddy(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 100;
  ctx.scale(scale, scale);

  ctx.fillStyle = '#A47E5B';
  ctx.strokeStyle = '#6E5035';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(34, 28, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#C5A586';
  ctx.beginPath();
  ctx.arc(34, 28, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#A47E5B';
  ctx.beginPath();
  ctx.arc(66, 28, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#C5A586';
  ctx.beginPath();
  ctx.arc(66, 28, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#A47E5B';
  ctx.beginPath();
  ctx.arc(50, 42, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#E2C9B1';
  ctx.beginPath();
  ctx.ellipse(50, 47, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3D2919';
  ctx.beginPath();
  ctx.ellipse(50, 44, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(40, 39, 2, 0, Math.PI * 2);
  ctx.arc(60, 39, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#A47E5B';
  ctx.beginPath();
  ctx.ellipse(50, 72, 18, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#C5A586';
  ctx.beginPath();
  ctx.ellipse(50, 72, 10, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCanvasCozyLetterBCookie(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 60;
  ctx.scale(scale, scale);

  ctx.fillStyle = '#CFA06E';
  ctx.strokeStyle = '#8C613A';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(15, 10);
  ctx.lineTo(35, 10);
  ctx.bezierCurveTo(46, 10, 46, 32, 35, 32);
  ctx.bezierCurveTo(48, 32, 48, 58, 35, 58);
  ctx.lineTo(15, 58);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FAF6EF';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(23, 18);
  ctx.lineTo(32, 18);
  ctx.bezierCurveTo(38, 18, 38, 26, 32, 26);
  ctx.lineTo(23, 26);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(23, 38);
  ctx.lineTo(33, 38);
  ctx.bezierCurveTo(40, 38, 40, 50, 33, 50);
  ctx.lineTo(23, 50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(17, 12);
  ctx.lineTo(34, 12);
  ctx.bezierCurveTo(43, 12, 43, 30, 34, 30);
  ctx.lineTo(17, 30);
  ctx.stroke();

  ctx.restore();
}

function drawCanvasCozyVintageCamera(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 100;
  ctx.scale(scale, scale);

  ctx.fillStyle = '#222222';
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 2;
  ctx.fillRect(10, 20, 80, 42);
  ctx.strokeRect(10, 20, 80, 42);

  ctx.fillStyle = '#D0D0D0';
  ctx.strokeStyle = '#999999';
  ctx.lineWidth = 1.5;
  ctx.fillRect(10, 20, 80, 12);
  ctx.strokeRect(10, 20, 80, 12);

  ctx.fillStyle = '#1A1A1A';
  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(50, 41, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0D1B2A';
  ctx.beginPath();
  ctx.arc(50, 41, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(47, 38, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCanvasCozyKraftTape(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#C5A880';
  ctx.strokeStyle = '#A88B65';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#2C2016';
  ctx.font = `bold ${Math.round(height * 0.45)}px "Courier New", monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('love yourself', 10, height / 2);

  ctx.restore();
}

function drawCanvasCozyScrapbookFooter(ctx: CanvasRenderingContext2D, startX: number, footerY: number, width: number) {
  ctx.save();

  // 1. Quote tapes
  ctx.save();
  ctx.fillStyle = '#D5C7B0';
  ctx.strokeStyle = 'rgba(194, 178, 153, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(startX + 15, footerY + 10, 130, 22, 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#3D2C1E';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText("i'd be a fool", startX + 80, footerY + 21);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = '#C5B499';
  ctx.strokeStyle = 'rgba(176, 159, 133, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(startX + 15, footerY + 36, 145, 22, 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#2C1F15';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('not to love you', startX + 87, footerY + 47);
  ctx.restore();

  // Subtitle handwritten string
  ctx.font = 'italic 13px Georgia, serif';
  ctx.fillStyle = '#8C6D58';
  ctx.textAlign = 'left';
  ctx.fillText('- your eyes tell a story', startX + 20, footerY + 74);

  // CUTiE magazine badge in center
  ctx.save();
  const cutieX = startX + width / 2 - 40;
  const cutieY = footerY + 70;
  ctx.fillStyle = 'rgba(20, 20, 20, 0.9)';
  ctx.beginPath();
  ctx.roundRect(cutieX, cutieY, 80, 28, 4);
  ctx.fill();

  const letters = [
    { text: 'C', bg: '#000000', fg: '#FFFFFF' },
    { text: 'U', bg: '#FFFFFF', fg: '#000000' },
    { text: 'T', bg: '#000000', fg: '#FFFFFF' },
    { text: '!', bg: '#FFFFFF', fg: '#000000' },
    { text: 'E', bg: '#000000', fg: '#FFFFFF' },
  ];

  let lX = cutieX + 6;
  letters.forEach((l) => {
    ctx.fillStyle = l.bg;
    ctx.fillRect(lX, cutieY + 4, 13, 20);
    ctx.fillStyle = l.fg;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(l.text, lX + 6.5, cutieY + 14);
    lX += 14;
  });
  ctx.restore();

  // Date at bottom right
  ctx.font = 'bold 15px "Courier New", monospace';
  ctx.fillStyle = '#5A4332';
  ctx.textAlign = 'right';
  ctx.fillText('08. 23. 2026', startX + width - 20, footerY + 88);

  ctx.restore();
}
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// Draw Wedding Dove on Canvas
function drawCanvasDove(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 80;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(20, 45);
  ctx.bezierCurveTo(10, 40, 5, 30, 15, 20);
  ctx.bezierCurveTo(25, 10, 40, 15, 50, 30);
  ctx.bezierCurveTo(60, 15, 80, 10, 90, 25);
  ctx.bezierCurveTo(95, 35, 85, 55, 70, 55);
  ctx.bezierCurveTo(60, 55, 50, 65, 35, 65);
  ctx.bezierCurveTo(20, 65, 15, 55, 20, 45);
  ctx.stroke();

  // Wing curves
  ctx.beginPath();
  ctx.moveTo(45, 32);
  ctx.bezierCurveTo(55, 25, 70, 25, 80, 35);
  ctx.moveTo(35, 45);
  ctx.bezierCurveTo(38, 50, 45, 52, 52, 48);
  ctx.stroke();

  // Eye
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(75, 28, 2, 0, Math.PI * 2);
  ctx.fill();

  // Olive twig / ribbon
  ctx.beginPath();
  ctx.moveTo(88, 25);
  ctx.bezierCurveTo(93, 20, 98, 22, 95, 28);
  ctx.moveTo(92, 23);
  ctx.bezierCurveTo(94, 18, 97, 18, 95, 22);
  ctx.stroke();

  ctx.restore();
}

// Draw Wedding Heart Arrow on Canvas
function drawCanvasHeartArrow(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 80;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Heart
  ctx.beginPath();
  ctx.moveTo(45, 65);
  ctx.bezierCurveTo(45, 65, 15, 45, 15, 25);
  ctx.bezierCurveTo(15, 12, 28, 8, 38, 18);
  ctx.bezierCurveTo(43, 23, 45, 28, 45, 28);
  ctx.bezierCurveTo(45, 28, 47, 23, 52, 18);
  ctx.bezierCurveTo(62, 8, 75, 12, 75, 25);
  ctx.bezierCurveTo(75, 45, 45, 65, 45, 65);
  ctx.stroke();

  // Arrow
  ctx.beginPath();
  ctx.moveTo(8, 72);
  ctx.lineTo(82, 10);
  ctx.moveTo(70, 8);
  ctx.lineTo(84, 10);
  ctx.lineTo(82, 24);
  ctx.moveTo(5, 68);
  ctx.lineTo(14, 75);
  ctx.lineTo(10, 79);
  ctx.stroke();

  ctx.restore();
}

// Draw Ribbon Bow on Canvas
function drawCanvasRibbonBow(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, color: string) {
  ctx.save();
  ctx.translate(cx - width / 2, cy);
  const scale = width / 120;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Center knot
  ctx.beginPath();
  ctx.ellipse(60, 28, 8, 7, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Left loop
  ctx.beginPath();
  ctx.moveTo(53, 28);
  ctx.bezierCurveTo(30, 12, 15, 20, 18, 34);
  ctx.bezierCurveTo(20, 44, 42, 42, 54, 32);
  ctx.stroke();

  // Right loop
  ctx.beginPath();
  ctx.moveTo(67, 28);
  ctx.bezierCurveTo(90, 12, 105, 20, 102, 34);
  ctx.bezierCurveTo(100, 44, 78, 42, 66, 32);
  ctx.stroke();

  // Tails
  ctx.beginPath();
  ctx.moveTo(56, 34);
  ctx.bezierCurveTo(48, 50, 35, 62, 25, 66);
  ctx.bezierCurveTo(32, 60, 38, 55, 42, 46);
  ctx.lineTo(54, 33);
  ctx.moveTo(64, 34);
  ctx.bezierCurveTo(72, 50, 85, 62, 95, 66);
  ctx.bezierCurveTo(88, 60, 82, 55, 78, 46);
  ctx.lineTo(66, 33);
  ctx.stroke();

  ctx.restore();
}

// Draw Vintage Heart Cake on Canvas
function drawCanvasHeartCake(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, color: string) {
  ctx.save();
  ctx.translate(cx - width / 2, cy);
  const scale = width / 160;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Cake stand
  ctx.beginPath();
  ctx.ellipse(80, 108, 65, 8, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(35, 108);
  ctx.lineTo(40, 114);
  ctx.bezierCurveTo(60, 118, 100, 118, 120, 114);
  ctx.lineTo(125, 108);
  ctx.stroke();

  // Bottom rim
  ctx.beginPath();
  ctx.moveTo(22, 80);
  ctx.bezierCurveTo(22, 94, 48, 104, 80, 104);
  ctx.bezierCurveTo(112, 104, 138, 94, 138, 80);
  ctx.stroke();

  // Scalloped bottom frosting
  ctx.beginPath();
  ctx.moveTo(22, 80);
  const scallops = [30, 38, 46, 54, 62, 70, 78, 86, 94, 102, 110, 118, 126, 134, 138];
  for (let i = 0; i < scallops.length; i += 2) {
    const midX = scallops[i];
    const endX = scallops[i + 1] || 138;
    ctx.bezierCurveTo(midX, 88, midX + 4, 88, endX, 80);
  }
  ctx.stroke();

  // Walls
  ctx.beginPath();
  ctx.moveTo(22, 50);
  ctx.lineTo(22, 80);
  ctx.moveTo(138, 50);
  ctx.lineTo(138, 80);
  ctx.stroke();

  // Cake top surface outline
  ctx.beginPath();
  ctx.moveTo(80, 68);
  ctx.bezierCurveTo(50, 48, 20, 40, 22, 52);
  ctx.bezierCurveTo(24, 65, 55, 75, 80, 75);
  ctx.bezierCurveTo(105, 75, 136, 65, 138, 52);
  ctx.bezierCurveTo(140, 40, 110, 48, 80, 68);
  ctx.stroke();

  // Top piping swirls
  ctx.beginPath();
  ctx.moveTo(24, 52);
  ctx.bezierCurveTo(28, 45, 38, 45, 42, 50);
  ctx.bezierCurveTo(46, 45, 56, 45, 60, 52);
  ctx.bezierCurveTo(64, 48, 74, 48, 80, 58);
  ctx.bezierCurveTo(86, 48, 96, 48, 100, 52);
  ctx.bezierCurveTo(104, 45, 114, 45, 118, 50);
  ctx.bezierCurveTo(122, 45, 132, 45, 136, 52);
  ctx.stroke();

  // Cherries / Pearls
  const pearls = [
    { x: 36, y: 46 },
    { x: 58, y: 45 },
    { x: 80, y: 52 },
    { x: 102, y: 45 },
    { x: 124, y: 46 },
  ];
  pearls.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3 Candles
  const candles = [58, 80, 102];
  candles.forEach(cxPos => {
    ctx.beginPath();
    ctx.moveTo(cxPos, 42);
    ctx.lineTo(cxPos, 26);
    ctx.stroke();

    // Flame
    ctx.beginPath();
    ctx.moveTo(cxPos, 23);
    ctx.bezierCurveTo(cxPos - 3, 17, cxPos + 3, 11, cxPos, 8);
    ctx.bezierCurveTo(cxPos - 2, 11, cxPos + 2, 17, cxPos, 23);
    ctx.fill();
  });

  ctx.restore();
}

// Draw Dong Son Drum on Canvas
function drawCanvasDongSonDrum(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.18, 0, Math.PI * 2);
  ctx.globalAlpha = 0.25;
  ctx.fill();
  ctx.globalAlpha = 1;

  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const r1 = radius * 0.18;
    const r2 = radius * 0.36;
    ctx.beginPath();
    ctx.moveTo(r1 * Math.cos(angle), r1 * Math.sin(angle));
    ctx.lineTo(r2 * Math.cos(angle), r2 * Math.sin(angle));
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.45, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 24; i++) {
    const angle = (i * 15 * Math.PI) / 180;
    const r1 = radius * 0.68;
    const r2 = radius * 0.82;
    ctx.beginPath();
    ctx.moveTo(r1 * Math.cos(angle), r1 * Math.sin(angle));
    ctx.lineTo(r2 * Math.cos(angle), r2 * Math.sin(angle));
    ctx.stroke();
  }

  ctx.restore();
}

// Draw Vietnam Map on Canvas
function drawCanvasVietnamMap(ctx: CanvasRenderingContext2D, x: number, y: number, height: number, color: string, showLabels = true) {
  ctx.save();
  ctx.translate(x, y);
  const scale = height / 130;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(42, 10);
  ctx.bezierCurveTo(48, 10, 58, 12, 60, 20);
  ctx.bezierCurveTo(62, 26, 50, 30, 45, 38);
  ctx.bezierCurveTo(40, 46, 55, 52, 52, 62);
  ctx.bezierCurveTo(48, 72, 32, 75, 28, 85);
  ctx.bezierCurveTo(25, 92, 38, 96, 35, 102);
  ctx.bezierCurveTo(32, 108, 24, 106, 18, 112);
  ctx.bezierCurveTo(14, 116, 12, 110, 16, 104);
  ctx.bezierCurveTo(20, 98, 16, 92, 22, 86);
  ctx.bezierCurveTo(26, 82, 34, 74, 38, 66);
  ctx.bezierCurveTo(42, 58, 32, 50, 36, 40);
  ctx.bezierCurveTo(40, 32, 50, 22, 42, 10);
  ctx.closePath();

  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(78, 45, 2.5, 0, Math.PI * 2);
  ctx.arc(83, 42, 2, 0, Math.PI * 2);
  ctx.arc(81, 48, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(75, 88, 2.5, 0, Math.PI * 2);
  ctx.arc(82, 85, 2, 0, Math.PI * 2);
  ctx.arc(78, 93, 2.2, 0, Math.PI * 2);
  ctx.fill();

  if (showLabels) {
    ctx.font = 'bold 6px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('HOÀNG SA', 65, 36);
    ctx.fillText('TRƯỜNG SA', 63, 105);
  }

  ctx.restore();
}

// Draw Side Vines on Canvas
function drawCanvasSideVine(ctx: CanvasRenderingContext2D, x: number, startY: number, height: number, isLeft: boolean, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  const step = height / 4;
  let currentY = startY;
  ctx.moveTo(x, currentY);

  for (let i = 0; i < 4; i++) {
    const wave = isLeft ? -15 : 15;
    ctx.quadraticCurveTo(x + wave, currentY + step / 2, x, currentY + step);
    
    // Draw leaves
    const leafY = currentY + step * 0.4;
    const leafX = x + (isLeft ? -10 : 10);
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.ellipse(leafX, leafY, 8, 4, isLeft ? -0.4 : 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    currentY += step;
  }
  ctx.stroke();
  ctx.restore();
}

// --- ASTROLOGY CANVAS DRAWINGS ---
function drawCanvasAstroMoon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 80;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(40, 15);
  ctx.bezierCurveTo(58, 15, 65, 30, 65, 45);
  ctx.bezierCurveTo(65, 60, 50, 70, 35, 70);
  ctx.bezierCurveTo(55, 70, 75, 58, 75, 40);
  ctx.bezierCurveTo(75, 22, 55, 15, 40, 15);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.globalAlpha = 0.1;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  ctx.beginPath();
  ctx.setLineDash([3, 2]);
  ctx.moveTo(40, 40);
  ctx.lineTo(40, 55);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  const pts = [
    {x: 40, y: 55}, {x: 42, y: 59}, {x: 46, y: 59}, {x: 43, y: 62},
    {x: 44, y: 66}, {x: 40, y: 64}, {x: 36, y: 66}, {x: 37, y: 62},
    {x: 34, y: 59}, {x: 38, y: 59}
  ];
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(22, 25); ctx.lineTo(22, 31);
  ctx.moveTo(19, 28); ctx.lineTo(25, 28);
  ctx.moveTo(60, 22); ctx.lineTo(60, 26);
  ctx.moveTo(58, 24); ctx.lineTo(62, 24);
  ctx.stroke();

  ctx.restore();
}

function drawCanvasAstroStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 80;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(40, 10);
  ctx.bezierCurveTo(40, 30, 30, 40, 10, 40);
  ctx.bezierCurveTo(30, 40, 40, 50, 40, 70);
  ctx.bezierCurveTo(40, 50, 50, 40, 70, 40);
  ctx.bezierCurveTo(50, 40, 40, 30, 40, 10);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.globalAlpha = 0.1;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  ctx.save();
  ctx.translate(40, 40);
  ctx.rotate(-25 * Math.PI / 180);
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 12, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(20, 20, 2, 0, Math.PI * 2);
  ctx.arc(60, 60, 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

function drawCanvasAstroConstellation(ctx: CanvasRenderingContext2D, x: number, startY: number, height: number, isLeft: boolean, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.setLineDash([4, 4]);

  const step = height / 5;
  const pts = isLeft ? [
    {x: x, y: startY},
    {x: x - 10, y: startY + step},
    {x: x + 7, y: startY + step * 2},
    {x: x - 5, y: startY + step * 3},
    {x: x + 10, y: startY + step * 4},
    {x: x, y: startY + height}
  ] : [
    {x: x, y: startY},
    {x: x + 10, y: startY + step},
    {x: x - 7, y: startY + step * 2},
    {x: x + 5, y: startY + step * 3},
    {x: x - 10, y: startY + step * 4},
    {x: x, y: startY + height}
  ];

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  const radii = [3, 4, 3, 5, 2];
  for (let i = 1; i < pts.length - 1; i++) {
    ctx.beginPath();
    ctx.arc(pts[i].x, pts[i].y, radii[i % radii.length], 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  const spX1 = isLeft ? x + 5 : x - 5;
  const spY1 = startY + step * 0.7;
  ctx.moveTo(spX1, spY1 - 3); ctx.lineTo(spX1, spY1 + 3);
  ctx.moveTo(spX1 - 3, spY1); ctx.lineTo(spX1 + 3, spY1);

  const spX2 = isLeft ? x - 7 : x + 7;
  const spY2 = startY + step * 3.6;
  ctx.moveTo(spX2, spY2 - 3); ctx.lineTo(spX2, spY2 + 3);
  ctx.moveTo(spX2 - 3, spY2); ctx.lineTo(spX2 + 3, spY2);
  ctx.stroke();

  ctx.restore();
}

function drawCanvasAstroGlobe(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, color: string) {
  ctx.save();
  ctx.translate(cx - width / 2, cy);
  const scale = width / 160;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(45, 112); ctx.lineTo(115, 112);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(80, 85); ctx.lineTo(80, 112);
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(60, 112); ctx.lineTo(80, 95); ctx.lineTo(100, 112);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(80, 50, 35, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(80, 50, 42, 10, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.setLineDash([3, 3]);
  ctx.moveTo(80, 12); ctx.lineTo(80, 88);
  ctx.stroke();
  ctx.setLineDash([]);
  
  ctx.beginPath();
  ctx.ellipse(80, 50, 20, 35, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(45, 50); ctx.lineTo(115, 50);
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(80, 50, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(48, 65); ctx.lineTo(112, 35);
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(80, 12); ctx.lineTo(80, 5);
  ctx.stroke();

  ctx.beginPath();
  const starPts = [
    {x: 80, y: 5}, {x: 82, y: 8}, {x: 86, y: 8}, {x: 83, y: 10},
    {x: 84, y: 14}, {x: 80, y: 12}, {x: 76, y: 14}, {x: 77, y: 10},
    {x: 74, y: 8}, {x: 78, y: 8}
  ];
  ctx.moveTo(starPts[0].x, starPts[0].y);
  for (let i = 1; i < starPts.length; i++) {
    ctx.lineTo(starPts[i].x, starPts[i].y);
  }
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// --- VINTAGE DAISY CANVAS DRAWINGS ---
function drawCanvasDaisyHeaderLeft(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 100;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(15, 65); ctx.quadraticCurveTo(40, 40, 65, 35);
  ctx.moveTo(32, 48); ctx.quadraticCurveTo(20, 30, 30, 15);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(65, 35, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(65, 20); ctx.lineTo(65, 28);
  ctx.moveTo(65, 42); ctx.lineTo(65, 50);
  ctx.moveTo(50, 35); ctx.lineTo(58, 35);
  ctx.moveTo(72, 35); ctx.lineTo(80, 35);
  ctx.moveTo(54, 24); ctx.lineTo(60, 30);
  ctx.moveTo(70, 40); ctx.lineTo(76, 46);
  ctx.moveTo(76, 24); ctx.lineTo(70, 30);
  ctx.moveTo(60, 40); ctx.lineTo(54, 46);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(30, 15, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(30, 5); ctx.lineTo(30, 11);
  ctx.moveTo(30, 19); ctx.lineTo(30, 25);
  ctx.moveTo(20, 15); ctx.lineTo(26, 15);
  ctx.moveTo(34, 15); ctx.lineTo(40, 15);
  ctx.moveTo(23, 8); ctx.lineTo(27, 12);
  ctx.moveTo(33, 18); ctx.lineTo(37, 22);
  ctx.moveTo(37, 8); ctx.lineTo(33, 12);
  ctx.moveTo(27, 18); ctx.lineTo(23, 22);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(36, 44, 5, 2, -0.3, 0, Math.PI * 2);
  ctx.ellipse(22, 55, 5, 2, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCanvasDaisyHeaderRight(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 100;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(85, 65); ctx.quadraticCurveTo(60, 40, 35, 35);
  ctx.moveTo(68, 48); ctx.quadraticCurveTo(80, 30, 70, 15);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(35, 35, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(35, 20); ctx.lineTo(35, 28);
  ctx.moveTo(35, 42); ctx.lineTo(35, 50);
  ctx.moveTo(20, 35); ctx.lineTo(28, 35);
  ctx.moveTo(42, 35); ctx.lineTo(50, 35);
  ctx.moveTo(24, 24); ctx.lineTo(30, 30);
  ctx.moveTo(40, 40); ctx.lineTo(46, 46);
  ctx.moveTo(46, 24); ctx.lineTo(40, 30);
  ctx.moveTo(30, 40); ctx.lineTo(24, 46);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(70, 15, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(70, 5); ctx.lineTo(70, 11);
  ctx.moveTo(70, 19); ctx.lineTo(70, 25);
  ctx.moveTo(60, 15); ctx.lineTo(66, 15);
  ctx.moveTo(74, 15); ctx.lineTo(80, 15);
  ctx.moveTo(63, 8); ctx.lineTo(67, 12);
  ctx.moveTo(73, 18); ctx.lineTo(77, 22);
  ctx.moveTo(77, 8); ctx.lineTo(73, 12);
  ctx.moveTo(67, 18); ctx.lineTo(63, 22);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(64, 44, 5, 2, 0.3, 0, Math.PI * 2);
  ctx.ellipse(78, 55, 5, 2, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCanvasDaisySideVine(ctx: CanvasRenderingContext2D, x: number, startY: number, height: number, isLeft: boolean, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';

  ctx.beginPath();
  const step = height / 4;
  let currentY = startY;
  ctx.moveTo(x, currentY);
  for (let i = 0; i < 4; i++) {
    const wave = isLeft ? -12 : 12;
    ctx.quadraticCurveTo(x + wave, currentY + step / 2, x, currentY + step);
    currentY += step;
  }
  ctx.stroke();

  const flowerY1 = startY + height * 0.22;
  const flowerX1 = x + (isLeft ? -6 : 6);
  ctx.beginPath();
  ctx.arc(flowerX1, flowerY1, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(flowerX1, flowerY1 - 6); ctx.lineTo(flowerX1, flowerY1 + 6);
  ctx.moveTo(flowerX1 - 6, flowerY1); ctx.lineTo(flowerX1 + 6, flowerY1);
  ctx.stroke();

  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  const leafY1 = startY + height * 0.45;
  const leafX1 = x + (isLeft ? 6 : -6);
  ctx.ellipse(leafX1, leafY1, 6, 3, isLeft ? -0.4 : 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  const flowerY2 = startY + height * 0.65;
  const flowerX2 = x + (isLeft ? 6 : -6);
  ctx.beginPath();
  ctx.arc(flowerX2, flowerY2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(flowerX2, flowerY2 - 6); ctx.lineTo(flowerX2, flowerY2 + 6);
  ctx.moveTo(flowerX2 - 6, flowerY2); ctx.lineTo(flowerX2 + 6, flowerY2);
  ctx.stroke();

  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  const leafY2 = startY + height * 0.82;
  const leafX2 = x + (isLeft ? -6 : 6);
  ctx.ellipse(leafX2, leafY2, 6, 3, isLeft ? 0.4 : -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawCanvasDaisyFooterPot(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, color: string) {
  ctx.save();
  ctx.translate(cx - width / 2, cy);
  const scale = width / 160;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(55, 80); ctx.lineTo(105, 80); ctx.lineTo(98, 110); ctx.lineTo(62, 110);
  ctx.closePath();
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fill();
  ctx.restore();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(52, 72, 56, 8, 2);
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fill();
  ctx.restore();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(80, 72); ctx.quadraticCurveTo(80, 45, 80, 28);
  ctx.moveTo(76, 72); ctx.quadraticCurveTo(55, 55, 45, 38);
  ctx.moveTo(84, 72); ctx.quadraticCurveTo(105, 55, 115, 38);
  ctx.moveTo(78, 72); ctx.quadraticCurveTo(62, 50, 60, 32);
  ctx.moveTo(82, 72); ctx.quadraticCurveTo(98, 50, 100, 32);
  ctx.stroke();

  ctx.beginPath(); ctx.arc(80, 28, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(80, 16); ctx.lineTo(80, 40);
  ctx.moveTo(68, 28); ctx.lineTo(92, 28);
  ctx.moveTo(71, 19); ctx.lineTo(89, 37);
  ctx.moveTo(89, 19); ctx.lineTo(71, 37);
  ctx.stroke();

  ctx.beginPath(); ctx.arc(45, 38, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(45, 29); ctx.lineTo(45, 47);
  ctx.moveTo(36, 38); ctx.lineTo(54, 38);
  ctx.moveTo(38, 31); ctx.lineTo(52, 45);
  ctx.moveTo(52, 31); ctx.lineTo(38, 45);
  ctx.stroke();

  ctx.beginPath(); ctx.arc(115, 38, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(115, 29); ctx.lineTo(115, 47);
  ctx.moveTo(106, 38); ctx.lineTo(124, 38);
  ctx.moveTo(108, 31); ctx.lineTo(122, 45);
  ctx.moveTo(122, 31); ctx.lineTo(108, 45);
  ctx.stroke();

  ctx.beginPath(); ctx.arc(60, 32, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(60, 24); ctx.lineTo(60, 40);
  ctx.moveTo(52, 32); ctx.lineTo(68, 32);
  ctx.stroke();

  ctx.beginPath(); ctx.arc(100, 32, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(100, 24); ctx.lineTo(100, 40);
  ctx.moveTo(92, 32); ctx.lineTo(108, 32);
  ctx.stroke();

  ctx.restore();
}

// --- COZY WINTER CANVAS DRAWINGS ---
function drawCanvasWinterHeaderLeft(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 100;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(15, 20); ctx.quadraticCurveTo(45, 30, 80, 45);
  ctx.stroke();

  ctx.save();
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  const needlePoints = [
    {x1: 30, y1: 24, x2: 22, y2: 12}, {x1: 35, y1: 26, x2: 30, y2: 10},
    {x1: 42, y1: 28, x2: 40, y2: 12}, {x1: 50, y1: 31, x2: 52, y2: 14},
    {x1: 58, y1: 34, x2: 64, y2: 18}, {x1: 66, y1: 37, x2: 76, y2: 22},
    {x1: 25, y1: 23, x2: 15, y2: 32}, {x1: 32, y1: 25, x2: 24, y2: 37},
    {x1: 40, y1: 28, x2: 34, y2: 42}, {x1: 48, y1: 31, x2: 44, y2: 46},
    {x1: 55, y1: 33, x2: 53, y2: 49}, {x1: 64, y1: 36, x2: 62, y2: 53}
  ];
  for (const n of needlePoints) {
    ctx.moveTo(n.x1, n.y1); ctx.lineTo(n.x2, n.y2);
  }
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.setLineDash([3, 2]);
  ctx.moveTo(45, 30); ctx.lineTo(45, 52);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(45, 52); ctx.lineTo(45, 62);
  ctx.moveTo(40, 57); ctx.lineTo(50, 57);
  ctx.moveTo(41.5, 53.5); ctx.lineTo(48.5, 60.5);
  ctx.moveTo(48.5, 53.5); ctx.lineTo(41.5, 60.5);
  ctx.stroke();

  ctx.restore();
}

function drawCanvasWinterHeaderRight(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 100;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(85, 20); ctx.quadraticCurveTo(55, 30, 20, 45);
  ctx.stroke();

  ctx.save();
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  const needlePoints = [
    {x1: 70, y1: 24, x2: 78, y2: 12}, {x1: 65, y1: 26, x2: 70, y2: 10},
    {x1: 58, y1: 28, x2: 60, y2: 12}, {x1: 50, y1: 31, x2: 48, y2: 14},
    {x1: 42, y1: 34, x2: 36, y2: 18}, {x1: 34, y1: 37, x2: 24, y2: 22},
    {x1: 75, y1: 23, x2: 85, y2: 32}, {x1: 68, y1: 25, x2: 76, y2: 37},
    {x1: 60, y1: 28, x2: 66, y2: 42}, {x1: 52, y1: 31, x2: 56, y2: 46},
    {x1: 45, y1: 33, x2: 47, y2: 49}, {x1: 36, y1: 36, x2: 38, y2: 53}
  ];
  for (const n of needlePoints) {
    ctx.moveTo(n.x1, n.y1); ctx.lineTo(n.x2, n.y2);
  }
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.setLineDash([3, 2]);
  ctx.moveTo(55, 30); ctx.lineTo(55, 52);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(55, 52); ctx.lineTo(55, 62);
  ctx.moveTo(50, 57); ctx.lineTo(60, 57);
  ctx.moveTo(51.5, 53.5); ctx.lineTo(58.5, 60.5);
  ctx.moveTo(58.5, 53.5); ctx.lineTo(51.5, 60.5);
  ctx.stroke();

  ctx.restore();
}

function drawCanvasWinterSideSnow(ctx: CanvasRenderingContext2D, x: number, startY: number, height: number, isLeft: boolean, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';

  ctx.save();
  const s1X = isLeft ? x + 5 : x - 5;
  const s1Y = startY + height * 0.15;
  ctx.translate(s1X, s1Y);
  ctx.beginPath();
  ctx.moveTo(0, -7); ctx.lineTo(0, 7);
  ctx.moveTo(-7, 0); ctx.lineTo(7, 0);
  ctx.moveTo(-5, -5); ctx.lineTo(5, 5);
  ctx.moveTo(-5, 5); ctx.lineTo(5, -5);
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(isLeft ? x + 15 : x - 15, startY + height * 0.35, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  const s2X = isLeft ? x + 12 : x - 12;
  const s2Y = startY + height * 0.55;
  ctx.translate(s2X, s2Y);
  ctx.beginPath();
  ctx.moveTo(0, -5); ctx.lineTo(0, 5);
  ctx.moveTo(-5, 0); ctx.lineTo(5, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(isLeft ? x + 2 : x - 2, startY + height * 0.75, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  const s3X = isLeft ? x + 8 : x - 8;
  const s3Y = startY + height * 0.88;
  ctx.translate(s3X, s3Y);
  ctx.beginPath();
  ctx.moveTo(0, -7); ctx.lineTo(0, 7);
  ctx.moveTo(-7, 0); ctx.lineTo(7, 0);
  ctx.moveTo(-5, -5); ctx.lineTo(5, 5);
  ctx.moveTo(-5, 5); ctx.lineTo(5, -5);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawCanvasWinterSnowglobe(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, color: string) {
  ctx.save();
  ctx.translate(cx - width / 2, cy);
  const scale = width / 160;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(50, 102); ctx.lineTo(110, 102); ctx.lineTo(115, 114); ctx.lineTo(45, 114);
  ctx.closePath();
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fill();
  ctx.restore();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(45, 114); ctx.lineTo(115, 114);
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(40, 82); ctx.bezierCurveTo(15, 75, 15, 22, 80, 22);
  ctx.bezierCurveTo(145, 22, 145, 75, 120, 82);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(80, 82, 40, 8, 0, 0, Math.PI * 2);
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fill();
  ctx.restore();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(80, 40); ctx.lineTo(80, 82);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(80, 42); ctx.lineTo(72, 52); ctx.lineTo(88, 52); ctx.closePath();
  ctx.save(); ctx.globalAlpha = 0.2; ctx.fill(); ctx.restore(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(80, 48); ctx.lineTo(66, 62); ctx.lineTo(94, 62); ctx.closePath();
  ctx.save(); ctx.globalAlpha = 0.2; ctx.fill(); ctx.restore(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(80, 55); ctx.lineTo(60, 78); ctx.lineTo(100, 78); ctx.closePath();
  ctx.save(); ctx.globalAlpha = 0.2; ctx.fill(); ctx.restore(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(43, 81); ctx.quadraticCurveTo(80, 87, 117, 81);
  ctx.stroke();

  const specks = [
    {x: 62, y: 46, r: 2}, {x: 98, y: 48, r: 1.5},
    {x: 54, y: 65, r: 2}, {x: 106, y: 63, r: 1.5}, {x: 80, y: 34, r: 1.2}
  ];
  specks.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.beginPath();
  ctx.arc(80, 50, 36, -Math.PI * 0.7, -Math.PI * 0.45);
  ctx.stroke();

  ctx.restore();
}

export async function generateStripCanvas(options: ExportOptions): Promise<HTMLCanvasElement> {
  const { photos, settings, theme, color, filter } = options;
  const layout = settings.layoutType || 'grid-4';
  const isWeddingTheme = theme.id === 'wedding_cake';
  const isSpecialArtwork = !!theme.isSpecialArtwork;

  // Load photos into HTMLImageElements
  const loadedImages: (HTMLImageElement | null)[] = await Promise.all(
    photos.map(p => (p && p.dataUrl ? loadImage(p.dataUrl).catch(() => null) : Promise.resolve(null)))
  );

  const bgColor = settings.customColorHex || color.hex;
  const textColor = color.textColor;
  const subtextColor = color.subtextColor;
  const artworkColor = isSpecialArtwork ? textColor : theme.accentColor;

  // Setup Canvas Dimensions based on Layout
  let totalWidth = 600;
  let totalHeight = 1800;

  if (layout === 'grid-4') {
    // 2x2 Square / Instagram Photocard layout
    totalWidth = 900;
    totalHeight = 1100;
  } else if (layout === 'grid-4-rect') {
    // 2x2 Tall Rectangular layout (3:4 portrait photo slots)
    totalWidth = 900;
    totalHeight = 1280;
  } else if (layout === 'single-1') {
    // 1-cut special poster frame
    totalWidth = 600;
    totalHeight = 800;
  } else if (layout === 'strip-2') {
    // 2-cut horizontal layout (left to right 2 photos)
    totalWidth = 900;
    totalHeight = 620;
  } else if (layout === 'strip-4') {
    // 4-cut vertical strip
    totalWidth = settings.isDoubleStrip ? 1240 : 600;
    totalHeight = 2200;
  } else {
    // 3-cut vertical strip
    totalWidth = settings.isDoubleStrip ? 1240 : 600;
    totalHeight = 1800;
  }

  const exportScale = options.scale || 1.5;

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth * exportScale;
  canvas.height = totalHeight * exportScale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Scale context to draw at standard coordinate system while outputting high-DPI
  ctx.scale(exportScale, exportScale);

  const drawPhotoWithFilters = (img: HTMLImageElement, drawX: number, drawY: number, drawW: number, drawH: number) => {
    let baseFilterString = 'none';
    if (filter.id === 'bw') {
      baseFilterString = 'grayscale(1) contrast(1.2)';
    } else if (filter.id === 'kglow') {
      baseFilterString = 'brightness(1.1) contrast(1.05) saturate(0.95)';
    } else if (filter.id === 'tiktok_smooth') {
      baseFilterString = 'brightness(1.12) contrast(0.93) saturate(1.02)';
    } else if (filter.id === 'tiktok_pinky') {
      baseFilterString = 'brightness(1.14) saturate(1.08) hue-rotate(-6deg) contrast(0.93)';
    } else if (filter.id === 'tiktok_moisture') {
      baseFilterString = 'brightness(1.16) contrast(0.88) saturate(0.90) hue-rotate(3deg)';
    } else if (filter.id === 'warm') {
      baseFilterString = 'sepia(0.35) brightness(1.05) contrast(1.05)';
    } else if (filter.id === 'cool') {
      baseFilterString = 'hue-rotate(15deg) saturate(0.9) brightness(1.05)';
    } else if (filter.id === 'rosy') {
      baseFilterString = 'saturate(1.25) hue-rotate(-10deg) brightness(1.05)';
    }

    // 1. Draw base image with base filter
    ctx.save();
    ctx.filter = baseFilterString;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    // 2. Draw smooth overlay layer if skinSmooth is enabled
    const smoothValue = options.settings.skinSmooth ?? 0;
    if (smoothValue > 0) {
      ctx.save();
      const blurRadius = 5 * exportScale;
      let overlayFilter = baseFilterString;
      if (overlayFilter === 'none') {
        overlayFilter = '';
      }
      ctx.filter = `${overlayFilter} blur(${blurRadius}px) brightness(1.05) contrast(0.9)`.trim();
      ctx.globalAlpha = (smoothValue * 0.45) / 100;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    }
  };

  // 1. RENDER 2x2 GRID LAYOUTS (Square or Tall Rectangle)
  if (layout === 'grid-4' || layout === 'grid-4-rect') {
    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Outer subtle border
    ctx.strokeStyle = color.borderHex || 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, totalWidth - 8, totalHeight - 8);

    // Side Vines for Special Themes in Grid Layout
    if (isSpecialArtwork) {
      if (theme.id === 'wedding_cake') {
        drawCanvasSideVine(ctx, 35, 160, 640, true, artworkColor);
        drawCanvasSideVine(ctx, totalWidth - 35, 160, 640, false, artworkColor);
      } else if (theme.id === 'astrology') {
        drawCanvasAstroConstellation(ctx, 35, 160, 640, true, artworkColor);
        drawCanvasAstroConstellation(ctx, totalWidth - 35, 160, 640, false, artworkColor);
      } else if (theme.id === 'vintage_daisy') {
        drawCanvasDaisySideVine(ctx, 35, 160, 640, true, artworkColor);
        drawCanvasDaisySideVine(ctx, totalWidth - 35, 160, 640, false, artworkColor);
      } else if (theme.id === 'cozy_winter') {
        drawCanvasWinterSideSnow(ctx, 35, 160, 640, true, artworkColor);
        drawCanvasWinterSideSnow(ctx, totalWidth - 35, 160, 640, false, artworkColor);
      }
    }

    // Header Area
    if (isSpecialArtwork) {
      if (theme.id === 'wedding_cake') {
        drawCanvasDove(ctx, 50, 45, 65, artworkColor);
        drawCanvasHeartArrow(ctx, totalWidth - 110, 45, 65, artworkColor);
      } else if (theme.id === 'astrology') {
        drawCanvasAstroMoon(ctx, 50, 35, 65, artworkColor);
        drawCanvasAstroStar(ctx, totalWidth - 110, 35, 65, artworkColor);
      } else if (theme.id === 'vintage_daisy') {
        drawCanvasDaisyHeaderLeft(ctx, 50, 35, 65, artworkColor);
        drawCanvasDaisyHeaderRight(ctx, totalWidth - 110, 35, 65, artworkColor);
      } else if (theme.id === 'cozy_winter') {
        drawCanvasWinterHeaderLeft(ctx, 50, 35, 65, artworkColor);
        drawCanvasWinterHeaderRight(ctx, totalWidth - 110, 35, 65, artworkColor);
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold 36px "${theme.fontFamily || 'Playfair Display'}"`;
      ctx.fillStyle = textColor;
      ctx.fillText((settings.title || (theme.id === 'wedding_cake' ? 'AMIRA & SPENCE' : theme.id === 'astrology' ? 'COSMIC MEMORY' : theme.id === 'vintage_daisy' ? 'DAISY MEMORY' : 'WINTER CHILL')).toUpperCase(), totalWidth / 2, 65);

      if (settings.subtitle) {
        ctx.font = `italic 20px "${theme.fontFamily || 'Plus Jakarta Sans'}", sans-serif`;
        ctx.fillStyle = subtextColor;
        ctx.fillText(settings.subtitle, totalWidth / 2, 105);
      }
    } else {
      // May Photobooth Top Header
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '900 32px "Playfair Display", Georgia, serif';
      ctx.fillStyle = textColor;
      ctx.fillText(settings.title || 'may', 32, 16);

      ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = subtextColor;
      ctx.fillText('PHOTOBOOTH', 32, 50);

      if (settings.subtitle) {
        ctx.textAlign = 'right';
        ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(settings.subtitle, totalWidth - 32, 22);
      }
      ctx.restore();
    }

    // 2x2 Photos Grid
    const padX = 32;
    const gridStartY = 55;
    const gap = 10;
    const photoWidth = (totalWidth - padX * 2 - gap) / 2; // ~413px
    const photoHeight = 413;
    const borderRadius = 0;

    const gridPositions = [
      { x: padX, y: gridStartY },
      { x: padX + photoWidth + gap, y: gridStartY },
      { x: padX, y: gridStartY + photoHeight + gap },
      { x: padX + photoWidth + gap, y: gridStartY + photoHeight + gap },
    ];

    for (let i = 0; i < 4; i++) {
      const pos = gridPositions[i];
      const img = loadedImages[i];

      // Draw background / white border card
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(pos.x, pos.y, photoWidth, photoHeight, borderRadius);
      ctx.fill();
      ctx.restore();

      // Clip & Draw Photo
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pos.x, pos.y, photoWidth, photoHeight, borderRadius);
      ctx.clip();

      if (img) {
        const imgAspect = img.width / img.height;
        const targetAspect = photoWidth / photoHeight;
        let drawW, drawH, drawX, drawY;

        if (imgAspect > targetAspect) {
          drawH = photoHeight;
          drawW = photoHeight * imgAspect;
          drawX = pos.x - (drawW - photoWidth) / 2;
          drawY = pos.y;
        } else {
          drawW = photoWidth;
          drawH = photoWidth / imgAspect;
          drawX = pos.x;
          drawY = pos.y - (drawH - photoHeight) / 2;
        }

        drawPhotoWithFilters(img, drawX, drawY, drawW, drawH);
      } else {
        ctx.fillStyle = '#F3F4F6';
        ctx.fillRect(pos.x, pos.y, photoWidth, photoHeight);
        ctx.fillStyle = '#9CA3AF';
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Khung ${i + 1}`, pos.x + photoWidth / 2, pos.y + photoHeight / 2);
      }
      ctx.restore();

      // Border outline
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(pos.x, pos.y, photoWidth, photoHeight, borderRadius);
      ctx.stroke();
      ctx.restore();
    }

    // Footer Area
    const footerY = gridStartY + (photoHeight + gap) * 2 + 10;

    if (isSpecialArtwork) {
      if (theme.id === 'wedding_cake') {
        // Ribbon Bow
        drawCanvasRibbonBow(ctx, totalWidth / 2, footerY + 10, 100, artworkColor);
        // Heart Cake Artwork
        drawCanvasHeartCake(ctx, totalWidth / 2, footerY + 65, 140, artworkColor);
      } else if (theme.id === 'astrology') {
        drawCanvasAstroGlobe(ctx, totalWidth / 2, footerY + 55, 140, artworkColor);
      } else if (theme.id === 'vintage_daisy') {
        drawCanvasDaisyFooterPot(ctx, totalWidth / 2, footerY + 55, 140, artworkColor);
      } else if (theme.id === 'cozy_winter') {
        drawCanvasWinterSnowglobe(ctx, totalWidth / 2, footerY + 55, 140, artworkColor);
      }

      // Date String
      if (settings.showDate) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold 24px "${theme.fontFamily || 'Playfair Display'}", Georgia, serif`;
        ctx.fillStyle = textColor;
        ctx.fillText(settings.customDate || '08. 23. 25', totalWidth / 2, footerY + 230);
      }

      if (theme.bottomDecoration) {
        ctx.font = `italic 16px "${theme.fontFamily || 'Plus Jakarta Sans'}", sans-serif`;
        ctx.fillStyle = subtextColor;
        ctx.fillText(theme.bottomDecoration, totalWidth / 2, footerY + 265);
      }
    } else {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (settings.showDate && settings.customDate) {
        ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = textColor;
        ctx.fillText(settings.customDate, totalWidth / 2, footerY + 20);
      }

      if (theme.bottomDecoration) {
        ctx.font = 'bold 20px "Quicksand", sans-serif';
        ctx.fillStyle = subtextColor;
        ctx.fillText(theme.bottomDecoration, totalWidth / 2, footerY + 55);
      }

      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = subtextColor;
      ctx.fillText('LIFE FOUR CUTS • PHOTOBOOTH KOREA', totalWidth / 2, footerY + 90);
    }

    // Draw Placed Stickers
    if (settings.stickers && settings.stickers.length > 0) {
      settings.stickers.forEach((st) => {
        ctx.save();
        const posX = (st.x / 100) * totalWidth;
        const posY = (st.y / 100) * totalHeight;
        ctx.translate(posX, posY);
        ctx.rotate((st.rotation * Math.PI) / 180);
        ctx.font = `${st.size * 2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.emoji, 0, 0);
        ctx.restore();
      });
    }

    return canvas;
  }

  // 2. RENDER 2-CUT HORIZONTAL LAYOUT (Left to Right)
  if (layout === 'strip-2') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Outer subtle border
    ctx.strokeStyle = color.borderHex || 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, totalWidth - 8, totalHeight - 8);

    // Side Vines for Special Themes
    if (isSpecialArtwork) {
      if (theme.id === 'wedding_cake') {
        drawCanvasSideVine(ctx, 25, 110, 380, true, artworkColor);
        drawCanvasSideVine(ctx, totalWidth - 25, 110, 380, false, artworkColor);
      } else if (theme.id === 'astrology') {
        drawCanvasAstroConstellation(ctx, 25, 110, 380, true, artworkColor);
        drawCanvasAstroConstellation(ctx, totalWidth - 25, 110, 380, false, artworkColor);
      } else if (theme.id === 'vintage_daisy') {
        drawCanvasDaisySideVine(ctx, 25, 110, 380, true, artworkColor);
        drawCanvasDaisySideVine(ctx, totalWidth - 25, 110, 380, false, artworkColor);
      } else if (theme.id === 'cozy_winter') {
        drawCanvasWinterSideSnow(ctx, 25, 110, 380, true, artworkColor);
        drawCanvasWinterSideSnow(ctx, totalWidth - 25, 110, 380, false, artworkColor);
      }
    }

    // Header Area
    if (isSpecialArtwork) {
      if (theme.id === 'wedding_cake') {
        drawCanvasDove(ctx, 50, 35, 50, artworkColor);
        drawCanvasHeartArrow(ctx, totalWidth - 100, 35, 50, artworkColor);
      } else if (theme.id === 'astrology') {
        drawCanvasAstroMoon(ctx, 50, 25, 50, artworkColor);
        drawCanvasAstroStar(ctx, totalWidth - 100, 25, 50, artworkColor);
      } else if (theme.id === 'vintage_daisy') {
        drawCanvasDaisyHeaderLeft(ctx, 50, 25, 50, artworkColor);
        drawCanvasDaisyHeaderRight(ctx, totalWidth - 100, 25, 50, artworkColor);
      } else if (theme.id === 'cozy_winter') {
        drawCanvasWinterHeaderLeft(ctx, 50, 25, 50, artworkColor);
        drawCanvasWinterHeaderRight(ctx, totalWidth - 100, 25, 50, artworkColor);
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold 32px "${theme.fontFamily || 'Playfair Display'}"`;
      ctx.fillStyle = textColor;
      ctx.fillText((settings.title || (theme.id === 'wedding_cake' ? 'AMIRA & SPENCE' : theme.id === 'astrology' ? 'COSMIC MEMORY' : theme.id === 'vintage_daisy' ? 'DAISY MEMORY' : 'WINTER CHILL')).toUpperCase(), totalWidth / 2, 55);

      if (settings.subtitle) {
        ctx.font = `italic 18px "${theme.fontFamily || 'Plus Jakarta Sans'}", sans-serif`;
        ctx.fillStyle = subtextColor;
        ctx.fillText(settings.subtitle, totalWidth / 2, 88);
      }
    } else {
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '900 28px "Playfair Display", Georgia, serif';
      ctx.fillStyle = textColor;
      ctx.fillText(settings.title || 'may', 32, 14);

      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = subtextColor;
      ctx.fillText('PHOTOBOOTH', 32, 44);

      if (settings.subtitle) {
        ctx.textAlign = 'right';
        ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(settings.subtitle, totalWidth - 32, 18);
      }
      ctx.restore();
    }

    // 2 Photos Side by Side (Left to Right)
    const padX = 32;
    const photoW = (totalWidth - padX * 2 - 10) / 2; // ~413px
    const photoH = 440;
    const startY = 48;
    const positions = [
      { x: padX, y: startY },
      { x: padX + photoW + 10, y: startY },
    ];

    for (let i = 0; i < 2; i++) {
      const pos = positions[i];
      const img = loadedImages[i];

      // White card background behind photo
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(pos.x, pos.y, photoW, photoH);
      ctx.restore();

      // Clip & Draw Photo (Sharp square 0 border radius)
      ctx.save();
      ctx.beginPath();
      ctx.rect(pos.x, pos.y, photoW, photoH);
      ctx.clip();

      if (img) {
        const imgAspect = img.width / img.height;
        const targetAspect = photoW / photoH;
        let drawW, drawH, drawX, drawY;

        if (imgAspect > targetAspect) {
          drawH = photoH;
          drawW = photoH * imgAspect;
          drawX = pos.x - (drawW - photoW) / 2;
          drawY = pos.y;
        } else {
          drawW = photoW;
          drawH = photoW / imgAspect;
          drawX = pos.x;
          drawY = pos.y - (drawH - photoH) / 2;
        }

        drawPhotoWithFilters(img, drawX, drawY, drawW, drawH);
      } else {
        ctx.fillStyle = '#F3F4F6';
        ctx.fillRect(pos.x, pos.y, photoW, photoH);
        ctx.fillStyle = '#9CA3AF';
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Khung ${i + 1}`, pos.x + photoW / 2, pos.y + photoH / 2);
      }
      ctx.restore();

      // Sharp border stroke
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 2;
      ctx.strokeRect(pos.x, pos.y, photoW, photoH);
      ctx.restore();
    }

    // Footer Area
    const footerY = startY + photoH + 10;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    if (settings.showDate) {
      ctx.font = '600 18px "Plus Jakarta Sans", monospace, sans-serif';
      ctx.fillStyle = textColor;
      ctx.fillText(settings.customDate || '08. 23. 26', 32, footerY + 24);
    }

    if (theme.bottomDecoration) {
      ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = subtextColor;
      ctx.fillText(`• ${theme.bottomDecoration}`, 155, footerY + 24);
    }
    ctx.restore();

    // Draw Stickers
    if (settings.stickers && settings.stickers.length > 0) {
      settings.stickers.forEach((st) => {
        ctx.save();
        const posX = (st.x / 100) * totalWidth;
        const posY = (st.y / 100) * totalHeight;
        ctx.translate(posX, posY);
        ctx.rotate((st.rotation * Math.PI) / 180);
        ctx.font = `${st.size * 2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.emoji, 0, 0);
        ctx.restore();
      });
    }

    return canvas;
  }

  // AIRMAIL POSTCARD CANVAS DRAWING HELPERS
  function drawCanvasAirmailBg(ctx: CanvasRenderingContext2D, startX: number, y: number, width: number, height: number) {
    ctx.save();
    const stripeBorderWidth = 16;
    ctx.fillStyle = '#E5D5BC';
    ctx.fillRect(startX, y, width, height);

    // Draw red and blue airmail stripes along the outer border ring only
    ctx.save();
    ctx.beginPath();
    ctx.rect(startX, y, width, height);
    ctx.rect(startX + stripeBorderWidth, y + stripeBorderWidth, width - stripeBorderWidth * 2, height - stripeBorderWidth * 2);
    ctx.clip('evenodd');

    const numStripes = Math.ceil((width + height) / 15);
    for (let i = -numStripes; i < numStripes; i++) {
      const xPos = startX + i * 36;
      ctx.fillStyle = '#C82A2A';
      ctx.beginPath();
      ctx.moveTo(xPos, y);
      ctx.lineTo(xPos + 14, y);
      ctx.lineTo(xPos + 14 - height, y + height);
      ctx.lineTo(xPos - height, y + height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1D3E6E';
      ctx.beginPath();
      ctx.moveTo(xPos + 18, y);
      ctx.lineTo(xPos + 32, y);
      ctx.lineTo(xPos + 32 - height, y + height);
      ctx.lineTo(xPos + 18 - height, y + height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    ctx.strokeStyle = '#C8B59B';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX + stripeBorderWidth, y + stripeBorderWidth, width - stripeBorderWidth * 2, height - stripeBorderWidth * 2);

    ctx.restore();
  }

  function drawCanvasAirmailPerforatedFrame(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.save();
    const pad = 12;
    ctx.fillStyle = '#FAF6EF';
    ctx.fillRect(x - pad, y - pad, width + pad * 2, height + pad * 2);

    ctx.strokeStyle = '#CBB599';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(x - pad + 2, y - pad + 2, width + pad * 2 - 4, height + pad * 2 - 4);
    ctx.restore();
  }

  function drawCanvasAirmailFooter(ctx: CanvasRenderingContext2D, startX: number, footerY: number, width: number, settings: PhotoboothSettings) {
    ctx.save();
    ctx.translate(startX + 36, footerY + 10);

    const titleParts = (settings.title || 'KATE & JACKSON').split('&');
    const name1 = titleParts[0]?.trim() || 'KATE';
    const name2 = titleParts[1]?.trim() || 'JACKSON';

    // Name 1
    ctx.fillStyle = '#1D3E6E';
    ctx.font = '900 46px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(name1, 0, 0);

    const name1Width = ctx.measureText(name1).width;

    // &
    ctx.fillStyle = '#C82A2A';
    ctx.font = 'italic bold 38px "Caveat", "Playfair Display", Georgia, serif';
    ctx.fillText('&', name1Width + 12, 2);

    // Name 2
    ctx.fillStyle = '#1D3E6E';
    ctx.font = '900 46px "Playfair Display", Georgia, serif';
    ctx.fillText(name2, 0, 52);

    // Subtitle
    ctx.fillStyle = '#1D3E6E';
    ctx.font = 'italic bold 30px "Caveat", "Playfair Display", cursive, serif';
    ctx.fillText(settings.subtitle || 'got hitched!', 0, 108);

    // Date
    if (settings.showDate) {
      ctx.font = 'bold 24px "Courier New", monospace';
      ctx.fillText(settings.customDate || '1.10.14', 0, 146);
    }

    // Cancellation Rubber Stamp
    ctx.save();
    ctx.translate(width - 230, 25);
    ctx.rotate((-12 * Math.PI) / 180);

    ctx.strokeStyle = '#1D3E6E';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(60, 60, 52, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(60, 60, 44, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(60, 60, 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#1D3E6E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', 60, 60);

    ctx.font = '900 10px sans-serif';
    ctx.fillText('LUCKY IN LOVE', 60, 24);
    ctx.fillText('LUCKY IN LOVE', 60, 96);

    ctx.restore();

    // Wavy Cancellation Lines
    ctx.save();
    ctx.strokeStyle = '#1D3E6E';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    const waveStartX = width - 130;
    for (let i = 0; i < 4; i++) {
      const wy = 38 + i * 18;
      ctx.beginPath();
      ctx.moveTo(waveStartX, wy);
      ctx.quadraticCurveTo(waveStartX + 20, wy - 8, waveStartX + 40, wy);
      ctx.quadraticCurveTo(waveStartX + 60, wy + 8, waveStartX + 80, wy);
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  // 3. RENDER VERTICAL STRIP (Single-1, Strip-3, or Strip-4)
  const singleWidth = 600;
  const isDouble = settings.isDoubleStrip;
  const photoCount = layout === 'single-1' ? 1 : layout === 'strip-4' ? 4 : 3;

  const renderSingleStrip = (startX: number) => {
    // 1. Background
    ctx.save();
    if (theme.id === 'airmail_postcard') {
      drawCanvasAirmailBg(ctx, startX, 0, singleWidth, totalHeight);
    } else if (theme.id === 'teddy_cozy_check') {
      drawCanvasGinghamBg(ctx, startX, 0, singleWidth, totalHeight);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(startX, 0, singleWidth, totalHeight);
    }

    // Outer border
    ctx.strokeStyle = color.borderHex || 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 4;
    ctx.strokeRect(startX + 2, 2, singleWidth - 4, totalHeight - 4);

    // Side Vines / Borders for Special Themes
    if (isSpecialArtwork && theme.id !== 'teddy_cozy_check') {
      if (theme.id === 'wedding_cake') {
        drawCanvasSideVine(ctx, startX + 22, 140, totalHeight - 420, true, artworkColor);
        drawCanvasSideVine(ctx, startX + singleWidth - 22, 140, totalHeight - 420, false, artworkColor);
      } else if (theme.id === 'astrology') {
        drawCanvasAstroConstellation(ctx, startX + 22, 140, totalHeight - 420, true, artworkColor);
        drawCanvasAstroConstellation(ctx, startX + singleWidth - 22, 140, totalHeight - 420, false, artworkColor);
      } else if (theme.id === 'vintage_daisy') {
        drawCanvasDaisySideVine(ctx, startX + 22, 140, totalHeight - 420, true, artworkColor);
        drawCanvasDaisySideVine(ctx, startX + singleWidth - 22, 140, totalHeight - 420, false, artworkColor);
      } else if (theme.id === 'cozy_winter') {
        drawCanvasWinterSideSnow(ctx, startX + 22, 140, totalHeight - 420, true, artworkColor);
        drawCanvasWinterSideSnow(ctx, startX + singleWidth - 22, 140, totalHeight - 420, false, artworkColor);
      }
    }

    // 2. Header Area
    if (theme.id === 'airmail_postcard') {
      ctx.save();
      ctx.fillStyle = '#1D3E6E';
      ctx.fillRect(startX + 30, 20, 110, 26);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✈️ AIR MAIL', startX + 85, 33);

      ctx.font = 'bold 14px "Courier New", monospace';
      ctx.fillStyle = '#1D3E6E';
      ctx.textAlign = 'right';
      ctx.fillText('PAR AVION', startX + singleWidth - 35, 33);
      ctx.restore();
    } else if (theme.id === 'teddy_cozy_check') {
      drawCanvasCozyBearBow(ctx, startX + 20, 15, 55);
      drawCanvasCozyBearCookie(ctx, startX + singleWidth - 75, 15, 55);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold 28px "${theme.fontFamily || 'Plus Jakarta Sans'}"`;
      ctx.fillStyle = textColor;
      ctx.fillText((settings.title || 'COZY MOMENTS').toUpperCase(), startX + singleWidth / 2, 45);
    } else if (isSpecialArtwork) {
      if (theme.id === 'wedding_cake') {
        drawCanvasDove(ctx, startX + 25, 30, 50, artworkColor);
        drawCanvasHeartArrow(ctx, startX + singleWidth - 75, 30, 50, artworkColor);
      } else if (theme.id === 'astrology') {
        drawCanvasAstroMoon(ctx, startX + 25, 20, 50, artworkColor);
        drawCanvasAstroStar(ctx, startX + singleWidth - 75, 20, 50, artworkColor);
      } else if (theme.id === 'vintage_daisy') {
        drawCanvasDaisyHeaderLeft(ctx, startX + 25, 20, 50, artworkColor);
        drawCanvasDaisyHeaderRight(ctx, startX + singleWidth - 75, 20, 50, artworkColor);
      } else if (theme.id === 'cozy_winter') {
        drawCanvasWinterHeaderLeft(ctx, startX + 25, 20, 50, artworkColor);
        drawCanvasWinterHeaderRight(ctx, startX + singleWidth - 75, 20, 50, artworkColor);
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold 28px "${theme.fontFamily || 'Playfair Display'}"`;
      ctx.fillStyle = textColor;
      ctx.fillText((settings.title || (theme.id === 'wedding_cake' ? 'AMIRA & SPENCE' : theme.id === 'astrology' ? 'COSMIC MEMORY' : theme.id === 'vintage_daisy' ? 'DAISY MEMORY' : 'WINTER CHILL')).toUpperCase(), startX + singleWidth / 2, 50);

      if (settings.subtitle) {
        ctx.font = `italic 16px "${theme.fontFamily || 'Plus Jakarta Sans'}"`;
        ctx.fillStyle = subtextColor;
        ctx.fillText(settings.subtitle, startX + singleWidth / 2, 80);
      }
    } else {
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '900 28px "Playfair Display", Georgia, serif';
      ctx.fillStyle = textColor;
      ctx.fillText(settings.title || 'may', startX + 25, 14);

      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = subtextColor;
      ctx.fillText('PHOTOBOOTH', startX + 25, 44);

      if (settings.subtitle) {
        ctx.textAlign = 'right';
        ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(settings.subtitle, startX + singleWidth - 25, 18);
      }
      ctx.restore();
    }

    // 3. Photo Frames
    const framePaddingX = 25;
    const photoWidth = singleWidth - framePaddingX * 2; // 550px
    const photoHeight = layout === 'single-1' ? 670 : 380;
    const startY = 65;
    const gap = 10;
    const borderRadius = 0;

    for (let i = 0; i < photoCount; i++) {
      const currentY = startY + i * (photoHeight + gap);
      const img = loadedImages[i];

      // Draw Airmail Perforated Stamp Frame
      if (theme.id === 'airmail_postcard') {
        drawCanvasAirmailPerforatedFrame(ctx, startX + framePaddingX, currentY, photoWidth, photoHeight);
      } else {
        // Draw photo container shadow / background
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(startX + framePaddingX, currentY, photoWidth, photoHeight, borderRadius);
        ctx.fill();
        ctx.restore();
      }

      // Clip for image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(startX + framePaddingX, currentY, photoWidth, photoHeight, borderRadius);
      ctx.clip();

      if (img) {
        const imgAspect = img.width / img.height;
        const targetAspect = photoWidth / photoHeight;
        let drawW, drawH, drawX, drawY;

        if (imgAspect > targetAspect) {
          drawH = photoHeight;
          drawW = photoHeight * imgAspect;
          drawX = startX + framePaddingX - (drawW - photoWidth) / 2;
          drawY = currentY;
        } else {
          drawW = photoWidth;
          drawH = photoWidth / imgAspect;
          drawX = startX + framePaddingX;
          drawY = currentY - (drawH - photoHeight) / 2;
        }

        drawPhotoWithFilters(img, drawX, drawY, drawW, drawH);
      } else {
        ctx.fillStyle = '#F3F4F6';
        ctx.fillRect(startX + framePaddingX, currentY, photoWidth, photoHeight);
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Khung ảnh ${i + 1}`, startX + singleWidth / 2, currentY + photoHeight / 2);
      }
      ctx.restore();

      // Inner stroke
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(startX + framePaddingX, currentY, photoWidth, photoHeight, borderRadius);
      ctx.stroke();
      ctx.restore();

      // Side decorations
      if (!isSpecialArtwork && theme.sideDecorations && theme.sideDecorations.length > 0) {
        ctx.save();
        ctx.font = '22px sans-serif';
        const leftDeco = theme.sideDecorations[i % theme.sideDecorations.length];
        const rightDeco = theme.sideDecorations[(i + 1) % theme.sideDecorations.length];
        ctx.fillText(leftDeco, startX + framePaddingX - 18, currentY + photoHeight / 2);
        ctx.fillText(rightDeco, startX + singleWidth - framePaddingX + 18, currentY + photoHeight / 2);
        ctx.restore();
      }
    }

    // Middle Scrapbook Overlays for Teddy Cozy Theme (between frames)
    if (theme.id === 'teddy_cozy_check' && photoCount >= 4) {
      // Over Frame 1 & 2 Gap
      const gap1Y = startY + photoHeight;
      drawCanvasCozyPlushTeddy(ctx, startX + 10, gap1Y - 25, 130);
      drawCanvasCozyLetterBCookie(ctx, startX + singleWidth - 95, gap1Y - 20, 75);

      // Over Frame 2 & 3 Gap
      const gap2Y = startY + 2 * (photoHeight + gap);
      drawCanvasCozyVintageCamera(ctx, startX + 10, gap2Y - 25, 130);
      drawCanvasCozyKraftTape(ctx, startX + singleWidth - 270, gap2Y - 18, 250, 42);
    }

    // 4. Footer Area
    const footerY = startY + photoCount * (photoHeight + gap) + 10;

    if (theme.id === 'airmail_postcard') {
      drawCanvasAirmailFooter(ctx, startX, footerY, singleWidth, settings);
    } else if (theme.id === 'teddy_cozy_check') {
      drawCanvasCozyScrapbookFooter(ctx, startX, footerY, singleWidth);
    } else if (isSpecialArtwork) {
      if (theme.id === 'wedding_cake') {
        drawCanvasRibbonBow(ctx, startX + singleWidth / 2, footerY + 5, 80, artworkColor);
        drawCanvasHeartCake(ctx, startX + singleWidth / 2, footerY + 50, 110, artworkColor);
      } else if (theme.id === 'astrology') {
        drawCanvasAstroGlobe(ctx, startX + singleWidth / 2, footerY + 40, 110, artworkColor);
      } else if (theme.id === 'vintage_daisy') {
        drawCanvasDaisyFooterPot(ctx, startX + singleWidth / 2, footerY + 40, 110, artworkColor);
      } else if (theme.id === 'cozy_winter') {
        drawCanvasWinterSnowglobe(ctx, startX + singleWidth / 2, footerY + 40, 110, artworkColor);
      }

      if (settings.showDate) {
        ctx.font = `bold 20px "${theme.fontFamily || 'Playfair Display'}"`;
        ctx.fillStyle = textColor;
        ctx.fillText(settings.customDate || '08. 23. 25', startX + singleWidth / 2, footerY + 185);
      }

      if (theme.bottomDecoration) {
        ctx.font = `italic 14px "${theme.fontFamily || 'Plus Jakarta Sans'}"`;
        ctx.fillStyle = subtextColor;
        ctx.fillText(theme.bottomDecoration, startX + singleWidth / 2, footerY + 215);
      }
    } else {
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      if (settings.showDate) {
        ctx.font = '600 18px "Plus Jakarta Sans", monospace, sans-serif';
        ctx.fillStyle = textColor;
        ctx.fillText(settings.customDate || '08. 23. 26', startX + 25, footerY + 24);
      }

      if (theme.bottomDecoration) {
        ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = subtextColor;
        ctx.fillText(`• ${theme.bottomDecoration}`, startX + 145, footerY + 24);
      }
      ctx.restore();
    }

    // 5. Placed Stickers
    if (settings.stickers && settings.stickers.length > 0) {
      settings.stickers.forEach((st) => {
        ctx.save();
        const posX = startX + (st.x / 100) * singleWidth;
        const posY = (st.y / 100) * totalHeight;
        ctx.translate(posX, posY);
        ctx.rotate((st.rotation * Math.PI) / 180);
        ctx.font = `${st.size * 1.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.emoji, 0, 0);
        ctx.restore();
      });
    }

    ctx.restore();
  };

  // Render first strip
  renderSingleStrip(0);

  // Render second strip if double strip is enabled
  if (isDouble) {
    ctx.save();
    ctx.fillStyle = '#E5E7EB';
    ctx.fillRect(singleWidth, 0, 40, totalHeight);

    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(singleWidth + 20, 40);
    ctx.lineTo(singleWidth + 20, totalHeight - 40);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'center';
    ctx.fillText('✂️', singleWidth + 20, totalHeight / 2);
    ctx.restore();

    renderSingleStrip(singleWidth + 40);
  }

  return canvas;
}

export async function downloadPhotoStrip(options: ExportOptions): Promise<{ dataUrl: string; blob: Blob | null }> {
  const canvas = await generateStripCanvas(options);
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const filename = `photobooth_${options.settings.layoutType || 'grid4'}_${timestamp}.png`;

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      let dataUrl = '';
      try {
        dataUrl = canvas.toDataURL('image/png', 1.0);
      } catch {
        // ignore if tainted
      }

      if (blob) {
        // 1. Check if Web Share API is available with file support (Ideal for iOS Safari & Android mobile)
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const file = new File([blob], filename, { type: 'image/png' });

        if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'PicZo Photobooth',
              text: 'Ảnh chụp Photobooth Hàn Quốc cực xinh! 📸✨',
            });
            resolve({ dataUrl, blob });
            return;
          } catch (shareErr: any) {
            // User cancelled share or fallback to anchor download
            if (shareErr.name === 'AbortError') {
              resolve({ dataUrl, blob });
              return;
            }
          }
        }

        // 2. Blob URL Download (Standard, reliable on all modern browsers & custom domains)
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = blobUrl;
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 5000);
      } else {
        // Fallback to dataUrl
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      resolve({ dataUrl, blob });
    }, 'image/png', 1.0);
  });
}

export async function copyPhotoToClipboard(options: ExportOptions): Promise<boolean> {
  try {
    const canvas = await generateStripCanvas(options);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob,
              }),
            ]);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          console.error('Clipboard write error', e);
          resolve(false);
        }
      }, 'image/png');
    });
  } catch (err) {
    console.error('Copy to clipboard failed', err);
    return false;
  }
}

