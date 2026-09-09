"use client";

import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';

interface Particle {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  delay: number;
  size: number;
  rotation: number;
  arcFactor: number;
}

export interface ScoreParticlesHandle {
  emit: (sourceX: number, sourceY: number, targetX: number, targetY: number) => void;
}

export const ScoreParticles = forwardRef<ScoreParticlesHandle>((_, ref) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextIdRef = useRef(0);

  const emit = useCallback((sourceX: number, sourceY: number, targetX: number, targetY: number) => {
    const newParticles: Particle[] = Array.from({ length: 8 }).map((_, i) => ({
      id: nextIdRef.current++,
      startX: sourceX,
      startY: sourceY,
      targetX,
      targetY,
      progress: 0,
      speed: 0.02 + Math.random() * 0.015,
      delay: i * 50,
      size: 8 + Math.random() * 12,
      rotation: Math.random() * 360,
      arcFactor: (Math.random() - 0.5) * 200 // Random curve
    }));

    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  useImperativeHandle(ref, () => ({
    emit
  }));

  useEffect(() => {
    let animationFrame: number;

    const update = () => {
      setParticles(prev => {
        const updated = prev.map(p => {
          if (p.delay > 0) return { ...p, delay: p.delay - 16 };
          return { ...p, progress: Math.min(1, p.progress + p.speed) };
        });

        const active = updated.filter(p => p.progress < 1);
        if (active.length === 0 && prev.length === 0) return prev;
        return active;
      });

      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {particles.map(p => {
        if (p.delay > 0) return null;

        // Quadratic Bezier or simple interpolation with arc
        const dx = p.targetX - p.startX;
        const dy = p.targetY - p.startY;
        
        // Add a curve to the path
        const arc = Math.sin(p.progress * Math.PI) * p.arcFactor;
        
        const currentX = p.startX + dx * p.progress + arc;
        const currentY = p.startY + dy * p.progress - Math.abs(arc) * 0.5;

        const opacity = p.progress < 0.2 ? p.progress * 5 : 1 - p.progress;
        const scale = 1 - p.progress * 0.5;

        return (
          <div
            key={p.id}
            className="absolute rounded-full sunny-gradient border border-white/40 shadow-lg"
            style={{
              left: currentX,
              top: currentY,
              width: p.size,
              height: p.size,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${p.rotation + p.progress * 720}deg)`,
            }}
          >
            <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
          </div>
        );
      })}
    </div>
  );
});

ScoreParticles.displayName = 'ScoreParticles';
