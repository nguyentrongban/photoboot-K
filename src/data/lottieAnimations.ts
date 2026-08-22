// Valid Lottie / Bodymovin JSON animations for Photobooth UI
// Designed with lively colors (Rose, Coral, Pastel Pink, Golden Sparkle, Lavender, Emerald)
// Each animation loops cleanly at 60 FPS.

// 1. Layout Grid Animation (Bố cục)
export const layoutLottie = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 100,
  h: 100,
  nm: "layout",
  ddd: 0,
  assets: [],
  layers: [
    // Top Left Box
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "TL",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [32, 32, 0], e: [30, 30, 0] },
            { t: 60, s: [30, 30, 0], e: [32, 32, 0] },
            { t: 120, s: [32, 32, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [110, 110, 100] },
            { t: 60, s: [110, 110, 100], e: [100, 100, 100] },
            { t: 120, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [26, 26] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 6 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.96, 0.28, 0.44, 1] } // Rose-500
        }
      ]
    },
    // Top Right Box
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "TR",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [68, 32, 0], e: [70, 30, 0] },
            { t: 60, s: [70, 30, 0], e: [68, 32, 0] },
            { t: 120, s: [68, 32, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [90, 90, 100] },
            { t: 60, s: [90, 90, 100], e: [100, 100, 100] },
            { t: 120, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [26, 26] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 6 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.99, 0.65, 0.65, 1] } // Pink-300
        }
      ]
    },
    // Bottom Left Box
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "BL",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [32, 68, 0], e: [30, 70, 0] },
            { t: 60, s: [30, 70, 0], e: [32, 68, 0] },
            { t: 120, s: [32, 68, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [90, 90, 100] },
            { t: 60, s: [90, 90, 100], e: [100, 100, 100] },
            { t: 120, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [26, 26] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 6 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.99, 0.45, 0.55, 1] } // Rose-400
        }
      ]
    },
    // Bottom Right Box
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "BR",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [68, 68, 0], e: [70, 70, 0] },
            { t: 60, s: [70, 70, 0], e: [68, 68, 0] },
            { t: 120, s: [68, 68, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [110, 110, 100] },
            { t: 60, s: [110, 110, 100], e: [100, 100, 100] },
            { t: 120, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [26, 26] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 6 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.15, 0.15, 0.18, 1] } // Dark Slate
        }
      ]
    }
  ]
};

// 2. Style & Ribbon/Decor Animation (Phong Cách & Viền Trang Trí)
export const styleLottie = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 100,
  h: 100,
  nm: "style",
  ddd: 0,
  assets: [],
  layers: [
    // Ribbon Center Knot
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Knot",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [10] },
            { t: 30, s: [10], e: [-10] },
            { t: 90, s: [-10], e: [0] },
            { t: 120, s: [0] }
          ]
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [115, 115, 100] },
            { t: 60, s: [115, 115, 100], e: [100, 100, 100] },
            { t: 120, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        // Left Loop
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [32, 22] },
          p: { a: 0, k: [-18, -4] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.98, 0.45, 0.62, 1] }
        },
        // Right Loop
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [32, 22] },
          p: { a: 0, k: [18, -4] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.98, 0.45, 0.62, 1] }
        },
        // Center Core
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [18, 18] },
          p: { a: 0, k: [0, 0] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.95, 0.22, 0.48, 1] }
        },
        // Left Tail
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [10, 24] },
          p: { a: 0, k: [-12, 18] },
          r: { a: 0, k: 4 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.93, 0.32, 0.52, 1] }
        },
        // Right Tail
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [10, 24] },
          p: { a: 0, k: [12, 18] },
          r: { a: 0, k: 4 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.93, 0.32, 0.52, 1] }
        }
      ]
    },
    // Little floating golden sparkle
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Sparkle",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [30], e: [100] },
            { t: 60, s: [100], e: [30] },
            { t: 120, s: [30] }
          ]
        },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [180] },
            { t: 120, s: [360] }
          ]
        },
        p: { a: 0, k: [80, 22, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [60, 60, 100], e: [120, 120, 100] },
            { t: 60, s: [120, 120, 100], e: [60, 60, 100] },
            { t: 120, s: [60, 60, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "sr",
          d: 1,
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          pt: { a: 0, k: 4 },
          ir: { a: 0, k: 3 },
          is: { a: 0, k: 0 },
          or: { a: 0, k: 12 },
          os: { a: 0, k: 0 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 0.8, 0.1, 1] } // Gold
        }
      ]
    }
  ]
};

// 3. Color Palette Animation (Màu Nền Khung)
export const colorLottie = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 100,
  h: 100,
  nm: "color",
  ddd: 0,
  assets: [],
  layers: [
    // Palette Board
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Palette",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-6], e: [6] },
            { t: 60, s: [6], e: [-6] },
            { t: 120, s: [-6] }
          ]
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [106, 106, 100] },
            { t: 60, s: [106, 106, 100], e: [100, 100, 100] },
            { t: 120, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        // Palette Base
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [76, 64] },
          p: { a: 0, k: [0, 0] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.98, 0.94, 0.88, 1] } // Warm Cream
        },
        {
          ty: "st",
          c: { a: 0, k: [0.9, 0.8, 0.7, 1] },
          w: { a: 0, k: 3 }
        },
        // Dot 1 - Rose
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [14, 14] },
          p: { a: 0, k: [-20, -12] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.96, 0.28, 0.44, 1] }
        },
        // Dot 2 - Sky Blue
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [14, 14] },
          p: { a: 0, k: [0, -18] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.38, 0.72, 0.98, 1] }
        },
        // Dot 3 - Mint Green
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [14, 14] },
          p: { a: 0, k: [20, -10] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.25, 0.85, 0.65, 1] }
        },
        // Dot 4 - Yellow
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [14, 14] },
          p: { a: 0, k: [18, 12] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 0.8, 0.2, 1] }
        },
        // Thumb Hole
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [12, 12] },
          p: { a: 0, k: [-18, 14] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.98, 0.97, 0.95, 1] }
        }
      ]
    }
  ]
};

// 4. Magic Skin / Filter Animation (Màu Da & Bộ Lọc Xinh)
export const filterLottie = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 100,
  h: 100,
  nm: "filter",
  ddd: 0,
  assets: [],
  layers: [
    // Magic Wand Stick
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Wand",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-35], e: [-20] },
            { t: 60, s: [-20], e: [-35] },
            { t: 120, s: [-35] }
          ]
        },
        p: { a: 0, k: [46, 54, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [8, 48] },
          p: { a: 0, k: [0, 10] },
          r: { a: 0, k: 4 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.25, 0.25, 0.3, 1] }
        },
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [8, 14] },
          p: { a: 0, k: [0, -10] },
          r: { a: 0, k: 4 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.98, 0.45, 0.62, 1] }
        }
      ]
    },
    // Big Glowing Star on Tip
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "BigStar",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [180] },
            { t: 120, s: [360] }
          ]
        },
        p: { a: 0, k: [65, 30, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [90, 90, 100], e: [130, 130, 100] },
            { t: 60, s: [130, 130, 100], e: [90, 90, 100] },
            { t: 120, s: [90, 90, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "sr",
          d: 1,
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          pt: { a: 0, k: 4 },
          ir: { a: 0, k: 5 },
          is: { a: 0, k: 0 },
          or: { a: 0, k: 18 },
          os: { a: 0, k: 0 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 0.78, 0.15, 1] }
        }
      ]
    },
    // Little Sparkle 1
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "LittleSparkle",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [100] },
            { t: 40, s: [100], e: [0] },
            { t: 120, s: [0] }
          ]
        },
        r: { a: 0, k: 45 },
        p: { a: 0, k: [80, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "sr",
          d: 1,
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          pt: { a: 0, k: 4 },
          ir: { a: 0, k: 2 },
          is: { a: 0, k: 0 },
          or: { a: 0, k: 9 },
          os: { a: 0, k: 0 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.98, 0.45, 0.62, 1] }
        }
      ]
    }
  ]
};

// 5. Signature & Inscription Animation (Ký Tên & Ngày Kỷ Niệm)
export const signatureLottie = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 100,
  h: 100,
  nm: "signature",
  ddd: 0,
  assets: [],
  layers: [
    // Pencil body
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Pencil",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-25], e: [-40] },
            { t: 60, s: [-40], e: [-25] },
            { t: 120, s: [-25] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [52, 45, 0], e: [58, 48, 0] },
            { t: 60, s: [58, 48, 0], e: [52, 45, 0] },
            { t: 120, s: [52, 45, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        // Pencil Body
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [12, 44] },
          p: { a: 0, k: [0, -10] },
          r: { a: 0, k: 3 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.98, 0.55, 0.25, 1] } // Orange-Amber
        },
        // Pencil Tip Wood
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [10, 12] },
          p: { a: 0, k: [0, 16] },
          r: { a: 0, k: 2 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.96, 0.88, 0.74, 1] }
        },
        // Graphite Point
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [6, 6] },
          p: { a: 0, k: [0, 22] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.2, 0.2, 0.25, 1] }
        }
      ]
    },
    // Paper / Stroke underneath
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Stroke",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [46, 75, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [80, 100, 100], e: [120, 100, 100] },
            { t: 60, s: [120, 100, 100], e: [80, 100, 100] },
            { t: 120, s: [80, 100, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [44, 4] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 2 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.94, 0.35, 0.52, 1] }
        }
      ]
    }
  ]
};

// 6. Camera Animation
export const cameraLottie = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 100,
  h: 100,
  nm: "camera",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "CameraBody",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [-4] },
            { t: 60, s: [-4], e: [4] },
            { t: 120, s: [0] }
          ]
        },
        p: { a: 0, k: [50, 52, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [108, 108, 100] },
            { t: 60, s: [108, 108, 100], e: [100, 100, 100] },
            { t: 120, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        // Flash Top
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [22, 12] },
          p: { a: 0, k: [-16, -26] },
          r: { a: 0, k: 4 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.96, 0.28, 0.44, 1] }
        },
        // Main Body
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [68, 48] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 12 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.98, 0.45, 0.62, 1] }
        },
        // Outer Lens
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [32, 32] },
          p: { a: 0, k: [0, 0] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 1, 1, 1] }
        },
        // Inner Lens Glass
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [22, 22] },
          p: { a: 0, k: [0, 0] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.2, 0.22, 0.28, 1] }
        },
        // Lens Glare
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [6, 6] },
          p: { a: 0, k: [-4, -4] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 1, 1, 0.9] }
        }
      ]
    }
  ]
};

// 7. Sticker Heart / Sparkle Animation
export const stickerLottie = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 100,
  h: 100,
  nm: "sticker",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "HeartSticker",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [12] },
            { t: 60, s: [12], e: [-12] },
            { t: 120, s: [0] }
          ]
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [95, 95, 100], e: [120, 120, 100] },
            { t: 60, s: [120, 120, 100], e: [95, 95, 100] },
            { t: 120, s: [95, 95, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [28, 28] },
          p: { a: 0, k: [-10, -10] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.96, 0.28, 0.44, 1] }
        },
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [28, 28] },
          p: { a: 0, k: [10, -10] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.96, 0.28, 0.44, 1] }
        },
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [26, 26] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 4 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.96, 0.28, 0.44, 1] }
        }
      ]
    }
  ]
};

// 8. Sparkle
export const sparkleLottie = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 100,
  h: 100,
  nm: "sparkle",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Star",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [180] },
            { t: 120, s: [360] }
          ]
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [85, 85, 100], e: [125, 125, 100] },
            { t: 60, s: [125, 125, 100], e: [85, 85, 100] },
            { t: 120, s: [85, 85, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "sr",
          d: 1,
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          pt: { a: 0, k: 4 },
          ir: { a: 0, k: 8 },
          is: { a: 0, k: 0 },
          or: { a: 0, k: 34 },
          os: { a: 0, k: 0 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 0.78, 0.15, 1] }
        }
      ]
    }
  ]
};

// 9. Heart
export const heartLottie = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 100,
  h: 100,
  nm: "heart",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "HeartShape",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [90, 90, 100], e: [115, 115, 100] },
            { t: 30, s: [115, 115, 100], e: [95, 95, 100] },
            { t: 60, s: [95, 95, 100], e: [115, 115, 100] },
            { t: 120, s: [90, 90, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [32, 32] },
          p: { a: 0, k: [-12, -10] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.96, 0.28, 0.44, 1] }
        },
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [32, 32] },
          p: { a: 0, k: [12, -10] }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.96, 0.28, 0.44, 1] }
        }
      ]
    }
  ]
};
