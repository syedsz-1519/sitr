/**
 * Ambient Audio Synthesizer for Dhikr Sanctuary.
 * Uses Web Audio API to generate soft, meditative rhythmic chanting and sacred mosque drones
 * without relying on external audio files or bandwidth.
 */

export type AmbientSoundPreset = 'rhythmic-chant' | 'mosque-drone' | 'dawn-sakinah';

export interface AmbientPresetConfig {
  id: AmbientSoundPreset;
  name: string;
  description: string;
  arabicSubtitle: string;
  baseFreq: number; // Fundamental frequency in Hz
  harmonics: number[]; // Multipliers
  lfoRate: number; // Hz (e.g., 0.22Hz = ~13 breaths/min)
  lfoDepth: number; // Modulation depth (0 to 1)
  formants: number[]; // Formant frequencies in Hz for vocal chanting texture
}

export const AMBIENT_PRESETS: Record<AmbientSoundPreset, AmbientPresetConfig> = {
  'rhythmic-chant': {
    id: 'rhythmic-chant',
    name: 'Soft Rhythmic Chant',
    description: 'Gentle vocal formants with rhythmic breath cadence for deep dhikr',
    arabicSubtitle: 'ذِكْرٌ هَادِئٌ وَرَحِيب',
    baseFreq: 110, // A2 (warm male chest resonance)
    harmonics: [1, 2, 3, 4],
    lfoRate: 0.22, // ~13.2 cycles per minute (calm meditative breath rate)
    lfoDepth: 0.45,
    formants: [380, 750, 1150], // Human vowel 'Ohm / Hu' vocal formants
  },
  'mosque-drone': {
    id: 'mosque-drone',
    name: 'Midnight Mosque Drone',
    description: 'Deep sanctuary acoustic resonance with tranquil harmonic fifths',
    arabicSubtitle: 'سَكِينَةُ المِحْرَاب',
    baseFreq: 73.42, // D2 (deep grounded sanctuary resonance)
    harmonics: [1, 1.5, 2, 3], // Root + Fifth + Octave + Octave+Fifth
    lfoRate: 0.14, // ~8.4 cycles per minute (slow ambient drift)
    lfoDepth: 0.28,
    formants: [260, 520, 850],
  },
  'dawn-sakinah': {
    id: 'dawn-sakinah',
    name: 'Dawn Sakinah Pulse',
    description: 'Bright, serene harmonic overtones reflecting morning tranquility',
    arabicSubtitle: 'طُمَأْنِينَةُ الفَجْر',
    baseFreq: 146.83, // D3 (warm morning light)
    harmonics: [1, 2, 2.5, 3],
    lfoRate: 0.18,
    lfoDepth: 0.35,
    formants: [420, 950, 1400],
  },
};

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private currentPreset: AmbientSoundPreset = 'rhythmic-chant';
  private masterGain: GainNode | null = null;
  private currentVolume: number = 0.45;

  // Active audio nodes for cleanup
  private activeNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    filters: BiquadFilterNode[];
    lfo: OscillatorNode | null;
    noiseSource: AudioBufferSourceNode | null;
  } = {
    oscillators: [],
    gains: [],
    filters: [],
    lfo: null,
    noiseSource: null,
  };

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isAudioRunning(): boolean {
    return this.isRunning;
  }

  public getPreset(): AmbientSoundPreset {
    return this.currentPreset;
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public setVolume(vol: number): void {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume * 0.5, now + 0.15);
    }
  }

  public async start(presetKey: AmbientSoundPreset = this.currentPreset): Promise<boolean> {
    try {
      const ctx = this.initContext();
      if (!ctx) return false;

      if (this.isRunning) {
        await this.stop(false);
      }

      this.currentPreset = presetKey;
      const config = AMBIENT_PRESETS[presetKey] || AMBIENT_PRESETS['rhythmic-chant'];

      const now = ctx.currentTime;

      // Master output gain with smooth fade-in
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(this.currentVolume * 0.5, now + 1.2);
      master.connect(ctx.destination);
      this.masterGain = master;

      // Create LFO for breathing/rhythmic chanting pulse
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(config.lfoRate, now);

      const lfoGain = ctx.createGain();
      // Modulate amplitude around baseline
      const baseAmp = 1 - config.lfoDepth;
      lfoGain.gain.setValueAtTime(config.lfoDepth * 0.5, now);

      const rhythmGainNode = ctx.createGain();
      rhythmGainNode.gain.setValueAtTime(baseAmp, now);

      lfo.connect(lfoGain);
      lfoGain.connect(rhythmGainNode.gain);
      lfo.start(now);
      this.activeNodes.lfo = lfo;

      // Filter bank to simulate human vocal tract (chanting formants)
      const formantsGain = ctx.createGain();
      formantsGain.gain.setValueAtTime(0.7, now);

      config.formants.forEach((fFreq) => {
        const bq = ctx.createBiquadFilter();
        bq.type = 'bandpass';
        bq.frequency.setValueAtTime(fFreq, now);
        bq.Q.setValueAtTime(3.8, now); // Gentle human vowel resonance

        rhythmGainNode.connect(bq);
        bq.connect(formantsGain);
        this.activeNodes.filters.push(bq);
      });

      formantsGain.connect(master);

      // Low-pass warmth filter for main body
      const warmthFilter = ctx.createBiquadFilter();
      warmthFilter.type = 'lowpass';
      warmthFilter.frequency.setValueAtTime(650, now);
      warmthFilter.Q.setValueAtTime(1.2, now);
      rhythmGainNode.connect(warmthFilter);
      warmthFilter.connect(master);
      this.activeNodes.filters.push(warmthFilter);

      // Harmonics generation (detuned sine/triangle blend for sacred choral warmth)
      config.harmonics.forEach((multiplier, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        const baseF = config.baseFreq * multiplier;
        osc.frequency.setValueAtTime(baseF, now);

        // Micro-detuning for lush stereo-chorus phase effect
        const detuneCents = (i % 2 === 0 ? 1 : -1) * (2.5 + i * 1.2);
        osc.detune.setValueAtTime(detuneCents, now);

        // Mix sine & soft triangle
        osc.type = i === 0 ? 'sine' : i === 1 ? 'triangle' : 'sine';

        // Amplitude tapers down for higher harmonics
        const weight = 0.28 / (i + 1);
        oscGain.gain.setValueAtTime(weight, now);

        osc.connect(oscGain);
        oscGain.connect(rhythmGainNode);

        osc.start(now);
        this.activeNodes.oscillators.push(osc);
        this.activeNodes.gains.push(oscGain);
      });

      // Subtle atmospheric pink-noise wash (sanctuary air presence)
      try {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.05;
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(320, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.04, now);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(master);

        noiseSource.start(now);
        this.activeNodes.noiseSource = noiseSource;
      } catch {
        // Noise buffer fallback if context restricted
      }

      this.isRunning = true;
      return true;
    } catch {
      this.isRunning = false;
      return false;
    }
  }

  public async stop(smooth: boolean = true): Promise<void> {
    if (!this.isRunning && !this.masterGain) return;

    if (this.ctx && this.masterGain && smooth) {
      const now = this.ctx.currentTime;
      try {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
        await new Promise((r) => setTimeout(r, 650));
      } catch {
        // Fallthrough to immediate disconnect
      }
    }

    // Stop and disconnect all active nodes
    this.activeNodes.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.activeNodes.oscillators = [];

    if (this.activeNodes.lfo) {
      try {
        this.activeNodes.lfo.stop();
        this.activeNodes.lfo.disconnect();
      } catch {}
      this.activeNodes.lfo = null;
    }

    if (this.activeNodes.noiseSource) {
      try {
        this.activeNodes.noiseSource.stop();
        this.activeNodes.noiseSource.disconnect();
      } catch {}
      this.activeNodes.noiseSource = null;
    }

    this.activeNodes.filters.forEach((f) => {
      try {
        f.disconnect();
      } catch {}
    });
    this.activeNodes.filters = [];

    this.activeNodes.gains.forEach((g) => {
      try {
        g.disconnect();
      } catch {}
    });
    this.activeNodes.gains = [];

    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {}
      this.masterGain = null;
    }

    this.isRunning = false;
  }

  /**
   * Subtle soft tactile bead click on dhikr counter increment (optional acoustic feedback)
   */
  public playBeadClick(): void {
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }

  /**
   * Serene, contemplative two-tone chime for Taqwa & Quranic scheduled reminders
   */
  public playNotificationChime(): void {
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Note 1: 523.25 Hz (C5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);

      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 1.3);

      // Note 2: 659.25 Hz (E5) after 160ms delay
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.16);

      gain2.gain.setValueAtTime(0.0001, now + 0.16);
      gain2.gain.linearRampToValueAtTime(0.2, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.16);
      osc2.stop(now + 1.7);
    } catch {
      // ignore audio context restrictions
    }
  }
}

export const dhikrAmbientAudio = new AmbientAudioEngine();
