"use client";

import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  spin: number;
  spinSpeed: number;
  opacity: number;
  phase: 'burst' | 'collect';
  startTime: number;
}

export interface ScoreParticlesHandle {
  emit: (sourceX: number, sourceY: number, targetX: number, targetY: number) => void;
}

export const ScoreParticles = forwardRef<ScoreParticlesHandle>((_, ref) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextIdRef = useRef(0);
  const particlesRefState = useRef<Particle[]>([]);

  // Update internal ref to avoid stale closure issues in the animation loop
  useEffect(() => {
    particlesRefState.current = particles;
  }, [particles]);

  const emit = useCallback((sourceX: number, sourceY: number, targetX: number, targetY: number) => {
    const newParticles: Particle[] = Array.from({ length: 12 }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 8;
      return {
        id: nextIdRef.current++,
        x: sourceX,
        y: sourceY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 10, // Initial burst upwards
        targetX,
        targetY,
        size: 14 + Math.random() * 10,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        spin: 0,
        spinSpeed: 5 + Math.random() * 15,
        opacity: 1,
        phase: 'burst',
        startTime: Date.now()
      };
    });

    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  useImperativeHandle(ref, () => ({
    emit
  }));

  useEffect(() => {
    let animationFrame: number;
    const gravity = 0.5;
    const attractionForce = 0.15;

    const update = () => {
      const now = Date.now();
      
      setParticles(prev => {
        if (prev.length === 0) return prev;

        const updated = prev.map(p => {
          const age = now - p.startTime;
          
          if (p.phase === 'burst') {
            // Physics phase
            const nextX = p.x + p.vx;
            const nextY = p.y + p.vy;
            const nextVy = p.vy + gravity;
            
            // Switch to collect phase after a short time
            if (age > 400) {
              return { ...p, x: nextX, y: nextY, vy: nextVy, phase: 'collect' as const };
            }
            
            return {
              ...p,
              x: nextX,
              y: nextY,
              vy: nextVy,
              rotation: p.rotation + p.rotationSpeed,
              spin: p.spin + p.spinSpeed
            };
          } else {
            // Collection phase - move towards target
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 10) {
              return { ...p, opacity: 0 }; // Mark for removal
            }

            // Ease towards target
            return {
              ...p,
              x: p.x + dx * attractionForce,
              y: p.y + dy * attractionForce,
              rotation: p.rotation + p.rotationSpeed * 2,
              spin: p.spin + p.spinSpeed * 2,
              size: Math.max(8, p.size * 0.98)
            };
          }
        });

        const active = updated.filter(p => p.opacity > 0);
        return active;
      });

      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg) rotateY(${p.spin}deg)`,
            perspective: '500px'
          }}
        >
          {/* Coin Body */}
          <div className="w-full h-full rounded-full sunny-gradient border-2 border-white/60 shadow-[0_4px_10px_rgba(0,0,0,0.3)] relative flex items-center justify-center">
            {/* Inner Ridge */}
            <div className="w-[80%] h-[80%] rounded-full border border-white/20 flex items-center justify-center">
               {/* Shine effect */}
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent rotate-45" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

ScoreParticles.displayName = 'ScoreParticles';
