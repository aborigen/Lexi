'use client';

/**
 * @fileOverview A utility for synthesizing sound effects using the Web Audio API.
 * 
 * TUNING GUIDE:
 * - Frequency: Change the numbers (e.g., 440) to change pitch.
 * - Type: 'sine' is soft, 'square' is buzzy/retro, 'triangle' is balanced.
 * - Gain: Adjust the volume parameter (0.0 to 1.0).
 * - Envelope: Adjust 'duration' to make sounds longer or punchier.
 */

class AudioManager {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private createOscillator(freq: number, type: OscillatorType = 'sine', duration: number = 0.1, volume: number = 0.2) {
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // ADSR-like Envelope: Start at volume, fade to near-zero
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  /**
   * Selection sound: Rising pitch based on the index of the letter in the word.
   */
  playSelect(index: number = 0) {
    // Tuning: Base 330Hz (E4), rising by 60Hz per letter
    const freq = 330 + index * 60;
    this.createOscillator(freq, 'sine', 0.1, 0.1);
  }

  /**
   * Word found sound: A pleasant Major 7th arpeggio.
   */
  playSuccess() {
    const ctx = this.initCtx();
    if (!ctx) return;

    // C Major Arpeggio: C5, E5, G5, B5
    const notes = [523.25, 659.25, 783.99, 987.77]; 
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator(freq, 'sine', 0.3, 0.1);
      }, i * 80);
    });
  }

  /**
   * Error sound: A low, dissonant buzz.
   */
  playError() {
    // Tuning: 90Hz Square wave for a 'thud' feel
    this.createOscillator(90, 'square', 0.2, 0.05);
  }

  /**
   * Level cleared: A bright, triumphant sequence.
   */
  playLevelComplete() {
    const ctx = this.initCtx();
    if (!ctx) return;

    // Celebratory flourish in C Major
    const sequence = [
      { f: 523.25, t: 0 },   // C5
      { f: 659.25, t: 100 }, // E5
      { f: 783.99, t: 200 }, // G5
      { f: 1046.50, t: 300 }, // C6
      { f: 1318.51, t: 400 }, // E6
      { f: 1567.98, t: 550 }  // G6
    ];

    sequence.forEach(note => {
      setTimeout(() => {
        this.createOscillator(note.f, 'triangle', 0.5, 0.15);
      }, note.t);
    });
  }
}

export const audioManager = new AudioManager();
