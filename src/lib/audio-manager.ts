
'use client';

/**
 * @fileOverview A utility for synthesizing sound effects using the Web Audio API.
 * This avoids external assets and keeps the game bundle small and offline-capable.
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

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  /**
   * Played when a letter is hovered or selected.
   */
  playSelect(index: number = 0) {
    // Pitch increases slightly based on selection index
    const freq = 440 + index * 40;
    this.createOscillator(freq, 'sine', 0.05, 0.1);
  }

  /**
   * Played when a valid word is found.
   */
  playSuccess() {
    const ctx = this.initCtx();
    if (!ctx) return;

    // Rising chime
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator(freq, 'sine', 0.2, 0.15);
      }, i * 100);
    });
  }

  /**
   * Played when an invalid word is formed or a mistake is made.
   */
  playError() {
    this.createOscillator(110, 'square', 0.2, 0.05);
  }

  /**
   * Played when the entire level is cleared.
   */
  playLevelComplete() {
    const ctx = this.initCtx();
    if (!ctx) return;

    // Celebratory flourish
    const sequence = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 100 },
      { f: 783.99, t: 200 },
      { f: 1046.50, t: 300 },
      { f: 1318.51, t: 450 }
    ];

    sequence.forEach(note => {
      setTimeout(() => {
        this.createOscillator(note.f, 'triangle', 0.4, 0.2);
      }, note.t);
    });
  }
}

export const audioManager = new AudioManager();
