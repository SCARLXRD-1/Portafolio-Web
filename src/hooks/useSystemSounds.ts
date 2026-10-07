'use client';

import { useCallback, useRef, useEffect } from 'react';

// Using AudioContext to generate synthesized UI sounds to avoid needing external audio files
export function useSystemSounds() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // AudioContext can only be initialized after a user interaction in some browsers,
    // but creating it is usually fine, it just starts in a 'suspended' state.
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    } catch (e) {
      console.warn('AudioContext not supported', e);
    }

    return () => {
      if (audioCtxRef.current?.state !== 'closed') {
        audioCtxRef.current?.close();
      }
    };
  }, []);

  const resumeContext = useCallback(() => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playTone = useCallback((frequency: number, type: OscillatorType, duration: number, vol = 0.1) => {
    if (!audioCtxRef.current) return;
    resumeContext();

    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [resumeContext]);

  const playClick = useCallback(() => {
    // Short tick
    playTone(800, 'sine', 0.05, 0.05);
  }, [playTone]);

  const playOpen = useCallback(() => {
    // Rising tone
    if (!audioCtxRef.current) return;
    resumeContext();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }, [resumeContext]);

  const playClose = useCallback(() => {
    // Falling tone
    if (!audioCtxRef.current) return;
    resumeContext();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }, [resumeContext]);

  const playError = useCallback(() => {
    // Low double beep
    playTone(200, 'square', 0.1, 0.05);
    setTimeout(() => playTone(150, 'square', 0.15, 0.05), 150);
  }, [playTone]);

  const playLogin = useCallback(() => {
    // Pleasant chord/chime
    playTone(523.25, 'sine', 0.8, 0.05); // C5
    playTone(659.25, 'sine', 0.8, 0.05); // E5
    playTone(783.99, 'sine', 0.8, 0.05); // G5
  }, [playTone]);

  const playStartup = useCallback(() => {
    // Resonant startup chord
    playTone(392.00, 'sine', 1.2, 0.06); // G4
    playTone(523.25, 'sine', 1.2, 0.06); // C5
    playTone(659.25, 'sine', 1.2, 0.05); // E5
    playTone(783.99, 'sine', 1.2, 0.05); // G5
    setTimeout(() => playTone(1046.50, 'sine', 0.8, 0.04), 100); // C6
  }, [playTone]);

  const playTrash = useCallback(() => {
    // Synthetic crinkle/whoosh
    playTone(300, 'sawtooth', 0.08, 0.04);
    setTimeout(() => playTone(220, 'triangle', 0.1, 0.04), 50);
    setTimeout(() => playTone(160, 'sine', 0.12, 0.03), 100);
  }, [playTone]);

  const playWin = useCallback(() => {
    // Victory fanfare
    playTone(523.25, 'sine', 0.15, 0.06);
    setTimeout(() => playTone(659.25, 'sine', 0.15, 0.06), 120);
    setTimeout(() => playTone(783.99, 'sine', 0.15, 0.06), 240);
    setTimeout(() => playTone(1046.50, 'sine', 0.4, 0.08), 360);
  }, [playTone]);

  return { playClick, playOpen, playClose, playError, playLogin, playStartup, playTrash, playWin };
}
