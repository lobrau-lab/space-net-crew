/**
 * StarNet Procedural Audio Synthesis Engine
 * Uses the Web Audio API (AudioContext) to generate pure synthetic sound cues.
 * Zero external audio assets required.
 */

class AudioSynthesisEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    // Enabled by default if user permits; restored from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('starnet_audio_synthesis_enabled');
      this.enabled = stored === 'true';
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enable: boolean): boolean {
    this.enabled = enable;
    if (typeof window !== 'undefined') {
      localStorage.setItem('starnet_audio_synthesis_enabled', String(enable));
    }
    if (enable) {
      this.ensureContext();
      this.playChirp(); // Confirmation audio cue
    }
    return this.enabled;
  }

  public toggle(): boolean {
    return this.setEnabled(!this.enabled);
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Short mechanical tactile click (frequency drop envelope, 15ms)
   */
  public playClick() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const now = ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.015);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // AudioContext protection
    }
  }

  /**
   * Data packet blip / chirp (frequency ascending ramp, 40ms)
   */
  public playChirp() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1980, now + 0.035);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // AudioContext protection
    }
  }

  /**
   * Phase state machine shift chord (dual electronic blip)
   */
  public playPhaseTransition(phase?: string) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const baseFreq =
        phase === 'receive'
          ? 523.25 // C5
          : phase === 'decompose'
          ? 659.25 // E5
          : phase === 'route'
          ? 783.99 // G5
          : phase === 'monitor'
          ? 880.0 // A5
          : phase === 'synthesize'
          ? 1046.5 // C6
          : 1174.66; // D6

      // Play 2 quick ascending notes
      [baseFreq, baseFreq * 1.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const t = now + idx * 0.035;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.05);

        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.07);
      });
    } catch {
      // AudioContext protection
    }
  }

  /**
   * Harmonic crystal chime when a delegation completes & sparks!
   */
  public playSuccessSpark() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [1046.5, 1318.51, 1567.98, 2093.0]; // C6 - E6 - G6 - C7

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const t = now + idx * 0.038;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.13);
      });
    } catch {
      // AudioContext protection
    }
  }

  /**
   * Warning alert blip for unverified claims or errors
   */
  public playAlert() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.setValueAtTime(261.63, now + 0.05);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // AudioContext protection
    }
  }
}

export const audioSynth = new AudioSynthesisEngine();
