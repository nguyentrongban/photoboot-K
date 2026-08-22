// Web Audio API synthesizer for Photobooth sounds (no external asset dependencies)

let audioCtx: AudioContext | null = null;
let isMuted = false;

// Lofi Chill Music state
let lofiSynthActive = false;
let lofiInterval: any = null;
let melodyInterval: any = null;
let mainLofiGain: GainNode | null = null;
let delayNode: DelayNode | null = null;
let delayFeedback: GainNode | null = null;
let lofiFilter: BiquadFilterNode | null = null;

// Warm jazz chord progression (gentle electric piano frequencies)
const CHORDS = [
  [174.61, 261.63, 329.63, 440.00], // F3, C4, E4, A4 (Fmaj7) - Cozy, dream-like
  [130.81, 196.00, 246.94, 329.63], // C3, G3, B3, E4 (Cmaj7) - Pure, relaxing
  [146.83, 220.00, 293.66, 349.23], // D3, A3, D4, F4 (Dm7) - Warm, nostalgic
  [196.00, 293.66, 392.00, 493.88], // G3, D4, G4, B4 (G6/9) - Serene resolution
];

// Pentatonic scale for live, relaxing solo melody improvisation
const MELODY_NOTES = [329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99]; // E4, G4, A4, C5, D5, E5, G5

let currentChordIndex = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setAudioMuted(muted: boolean) {
  isMuted = muted;
  if (muted) {
    stopChillMusic();
  } else {
    startChillMusic();
  }
}

export function getAudioMuted(): boolean {
  return isMuted;
}

// Play a single lofi keyboard note with tape vibrato and a warm piano envelope
function playSoftLofiNote(ctx: AudioContext, frequency: number, startTime: number, duration: number, volume: number) {
  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Tape flutter (LFO) to simulate cozy retro vinyl warp
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(3.2 + Math.random() * 0.8, startTime); // 3-4 Hz gentle speed wobble
    lfoGain.gain.setValueAtTime(0.7 + Math.random() * 0.5, startTime); // detune amplitude
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    // Blend of sine and triangle wave for beautiful, cozy analog tones
    osc.type = Math.random() > 0.4 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(frequency + (Math.random() - 0.5) * 0.4, startTime); // subtle chorus detuning
    
    // Smooth attack and very slow release for relaxation
    const attack = 0.5;
    const release = 1.6;
    
    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + attack);
    gainNode.gain.setValueAtTime(volume, startTime + duration - release);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.connect(gainNode);
    
    if (lofiFilter) {
      gainNode.connect(lofiFilter);
    } else {
      gainNode.connect(ctx.destination);
    }
    
    lfo.start(startTime);
    osc.start(startTime);
    
    lfo.stop(startTime + duration + 0.1);
    osc.stop(startTime + duration + 0.1);
  } catch (e) {
    // Ignore errors in background context
  }
}

export function startChillMusic() {
  if (isMuted || lofiSynthActive) return;
  
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    lofiSynthActive = true;
    
    // Master gain for lofi ambient path (keeps it very soft and relaxing in the background)
    mainLofiGain = ctx.createGain();
    mainLofiGain.gain.setValueAtTime(0.07, ctx.currentTime); 
    
    // Cozy lowpass filter to remove harsh frequencies and make it sound lo-fi/warm
    lofiFilter = ctx.createBiquadFilter();
    lofiFilter.type = 'lowpass';
    lofiFilter.frequency.setValueAtTime(850, ctx.currentTime);
    
    // Dreamy echo feedback delay
    delayNode = ctx.createDelay(2.0);
    delayNode.delayTime.setValueAtTime(0.6, ctx.currentTime); // 600ms gap
    
    delayFeedback = ctx.createGain();
    delayFeedback.gain.setValueAtTime(0.35, ctx.currentTime); // 35% echo repeat
    
    // Delay loop
    lofiFilter.connect(delayNode);
    delayNode.connect(delayFeedback);
    delayFeedback.connect(lofiFilter);
    
    // Output connections
    lofiFilter.connect(mainLofiGain);
    delayNode.connect(mainLofiGain);
    mainLofiGain.connect(ctx.destination);
    
    // Play first chord immediately
    triggerNextLofiEvent(ctx);
    
    // Slow chords loop (every 5 seconds)
    lofiInterval = setInterval(() => {
      const activeCtx = getAudioContext();
      if (activeCtx && !isMuted) {
        triggerNextLofiEvent(activeCtx);
      }
    }, 5000);
    
    // Random live acoustic notes (every 2.5 seconds)
    melodyInterval = setInterval(() => {
      const activeCtx = getAudioContext();
      if (activeCtx && !isMuted && Math.random() > 0.35) {
        const note = MELODY_NOTES[Math.floor(Math.random() * MELODY_NOTES.length)];
        // Play very quiet solo note
        playSoftLofiNote(activeCtx, note, activeCtx.currentTime, 1.8, 0.03);
      }
    }, 2500);
    
  } catch (e) {
    console.error('Failed to start chill lofi music', e);
  }
}

function triggerNextLofiEvent(ctx: AudioContext) {
  const chord = CHORDS[currentChordIndex];
  currentChordIndex = (currentChordIndex + 1) % CHORDS.length;
  
  // Strum notes gently
  chord.forEach((freq, idx) => {
    const noteDelay = idx * 0.15; // 150ms gentle strumming
    playSoftLofiNote(ctx, freq, ctx.currentTime + noteDelay, 4.5, 0.05);
  });
}

export function stopChillMusic() {
  lofiSynthActive = false;
  if (lofiInterval) {
    clearInterval(lofiInterval);
    lofiInterval = null;
  }
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
  
  if (mainLofiGain) {
    try {
      const ctx = getAudioContext();
      if (ctx) {
        mainLofiGain.gain.cancelScheduledValues(ctx.currentTime);
        mainLofiGain.gain.setValueAtTime(mainLofiGain.gain.value, ctx.currentTime);
        mainLofiGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0); // 1.0s smooth fade-out
      }
    } catch (e) {
      // Ignore
    }
  }
}

// Global user gesture triggers to bypass browser autoplay blocks
if (typeof window !== 'undefined') {
  const startOnGesture = () => {
    if (!isMuted) {
      startChillMusic();
    }
    window.removeEventListener('click', startOnGesture);
    window.removeEventListener('touchstart', startOnGesture);
  };
  window.addEventListener('click', startOnGesture);
  window.addEventListener('touchstart', startOnGesture);
}

// Countdown sound
export function playCountdownBeep(count: number) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const frequency = count === 1 ? 880 : 587.33; // higher pitch on last countdown
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    console.error('Audio playback error', e);
  }
}

// Shutter sound simulation
export function playShutterSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Camera shutter quick white noise burst
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start();

    // Metallic secondary click
    setTimeout(() => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.05);

      clickGain.gain.setValueAtTime(0.35, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(clickGain);
      clickGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    }, 40);
  } catch (e) {
    console.error('Shutter audio error', e);
  }
}

// Success chime
export function playSuccessChime() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chords
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  } catch (e) {
    console.error('Chime audio error', e);
  }
}
