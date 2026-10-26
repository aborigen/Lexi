"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CIRCLE_RADIUS, LETTER_RADIUS, INTERACTION_BUFFER } from '@/lib/game-constants';
import { WordLevel } from '@/lib/levels';
import { cn, shuffleArray } from '@/lib/utils';
import { audioManager } from '@/lib/audio-manager';
import { Hand, Shuffle } from 'lucide-react';
import { t } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { WordGrid } from './WordGrid';

interface WordConnectProps {
  level: WordLevel;
  onScoreUpdate: (score: number, length: number, pos: { x: number, y: number }) => void;
  onLevelComplete: () => void;
  onStateUpdate: (letters: string[], foundWords: string[], allValidWords: string[]) => void;
  lang?: string;
  activeHint?: string | null;
}

export function WordConnect({ 
  level, 
  onScoreUpdate, 
  onLevelComplete, 
  onStateUpdate,
  lang = 'en',
  activeHint = null
}: WordConnectProps) {
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [dragPath, setDragPath] = useState<{x: number, y: number} | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  
  const selectedIndicesRef = useRef<number[]>([]);
  const CANVAS_SIZE = (CIRCLE_RADIUS + LETTER_RADIUS + INTERACTION_BUFFER);
  const COORDINATE_BASE = CANVAS_SIZE * 2;
  const OFFSET = CANVAS_SIZE;

  useEffect(() => {
    selectedIndicesRef.current = selectedIndices;
  }, [selectedIndices]);

  const letterPositions = useMemo(() => {
    if (!shuffledLetters.length) return [];
    return shuffledLetters.map((_, index) => {
      const angle = (index * (360 / shuffledLetters.length) - 90) * (Math.PI / 180);
      return {
        x: OFFSET + CIRCLE_RADIUS * Math.cos(angle),
        y: OFFSET + CIRCLE_RADIUS * Math.sin(angle)
      };
    });
  }, [shuffledLetters, OFFSET]);

  useEffect(() => {
    const isFirstTime = typeof window !== 'undefined' ? !localStorage.getItem('lexi_onboarding_complete') : false;
    if (isFirstTime) setShowOnboarding(true);
  }, []);

  useEffect(() => {
    if (level) {
      setShuffledLetters(shuffleArray(level.letters));
      setFoundWords([]);
      setSelectedIndices([]);
      selectedIndicesRef.current = [];
      setDragPath(null);
      setIsInvalid(false);
      setIsSuccess(false);
    }
  }, [level]);

  useEffect(() => {
    if (level && shuffledLetters.length > 0) {
      onStateUpdate(shuffledLetters, foundWords, level.validWords);
    }
  }, [level, foundWords, onStateUpdate, shuffledLetters]);

  const completeOnboarding = useCallback(() => {
    if (showOnboarding) {
      setShowOnboarding(false);
      localStorage.setItem('lexi_onboarding_complete', 'true');
    }
  }, [showOnboarding]);

  const handleInteractionStart = (index: number) => {
    if (isSuccess || isInvalid || isShuffling) return;
    completeOnboarding();
    setIsInvalid(false);
    setIsSuccess(false);
    setSelectedIndices([index]);
    audioManager.playSelect(0);
  };

  const handleInteractionMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const currentIndices = selectedIndicesRef.current;
    if (currentIndices.length === 0 || shuffledLetters.length === 0 || isSuccess || isInvalid || isShuffling) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const scale = rect.width / COORDINATE_BASE;
    const x = (clientX - rect.left) / scale;
    const y = (clientY - rect.top) / scale;
    setDragPath({ x, y });

    if (currentIndices.length > 1) {
      const prevIdx = currentIndices[currentIndices.length - 2];
      const prevPos = letterPositions[prevIdx];
      const distToPrev = Math.sqrt(Math.pow(x - prevPos.x, 2) + Math.pow(y - prevPos.y, 2));
      
      if (distToPrev < LETTER_RADIUS * 1.2) {
        const newIndices = currentIndices.slice(0, -1);
        setSelectedIndices(newIndices);
        audioManager.playSelect(newIndices.length - 1);
        return;
      }
    }

    letterPositions.forEach((pos, idx) => {
      if (currentIndices.includes(idx)) return;
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (dist < LETTER_RADIUS * 1.5) {
        const newIndices = [...currentIndices, idx];
        setSelectedIndices(newIndices);
        audioManager.playSelect(newIndices.length - 1);
      }
    });
  }, [shuffledLetters, letterPositions, COORDINATE_BASE, isSuccess, isInvalid, isShuffling]);

  const handleInteractionEnd = useCallback(() => {
    const currentIndices = selectedIndicesRef.current;
    if (currentIndices.length === 0 || !level || shuffledLetters.length === 0 || isSuccess || isInvalid || isShuffling) return;
    
    const currentWord = currentIndices.map(i => shuffledLetters[i]).join('');
    
    if (level.validWords.includes(currentWord)) {
      setIsSuccess(true);
      const rect = containerRef.current?.getBoundingClientRect();
      const startPos = rect ? {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      setTimeout(() => {
        setFoundWords([currentWord]);
        onScoreUpdate(currentWord.length * 10, currentWord.length, startPos);
        audioManager.playLevelComplete();
        onLevelComplete();
        setSelectedIndices([]);
        selectedIndicesRef.current = [];
        setDragPath(null);
        setIsSuccess(false);
      }, 500);
    } else if (currentIndices.length > 1) {
      audioManager.playError();
      setIsInvalid(true);
      setTimeout(() => {
        setIsInvalid(false);
        setSelectedIndices([]);
        selectedIndicesRef.current = [];
        setDragPath(null);
      }, 400);
    } else {
      setSelectedIndices([]);
      selectedIndicesRef.current = [];
      setDragPath(null);
    }
  }, [level, shuffledLetters, foundWords, onScoreUpdate, onLevelComplete, isSuccess, isInvalid, isShuffling]);

  const handleShuffle = useCallback(() => {
    if (selectedIndices.length > 0 || isSuccess || isInvalid || isShuffling) return;
    setIsShuffling(true);
    audioManager.playSelect(0);
    
    setTimeout(() => {
      setShuffledLetters(prev => shuffleArray(prev));
    }, 300);

    setTimeout(() => {
      setIsShuffling(false);
    }, 600);
  }, [selectedIndices.length, isSuccess, isInvalid, isShuffling]);

  const isDrawing = selectedIndices.length > 0;
  if (!level || shuffledLetters.length === 0) return null;

  return (
    <div 
      ref={rootRef}
      className="flex flex-col portrait:items-center landscape:flex-row landscape:items-stretch landscape:gap-8 w-full h-full min-h-0 touch-none relative overflow-hidden pb-4 sm:pb-8"
      onMouseMove={handleInteractionMove}
      onTouchMove={handleInteractionMove}
      onMouseUp={handleInteractionEnd}
      onTouchEnd={handleInteractionEnd}
    >
      <WordGrid 
        validWords={level.validWords}
        foundWords={foundWords}
        lang={lang}
        activeHint={activeHint}
      />

      <div className="flex-1 flex flex-col items-center justify-between w-full min-h-0 relative z-0 py-4 landscape:py-8">
        <div className="h-16 sm:h-20 flex items-center justify-center shrink-0 w-full relative">
          {isDrawing && (
            <div className={cn(
              "px-10 py-3.5 rounded-[2.5rem] text-2xl sm:text-3xl font-black text-white animate-in zoom-in-95 duration-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] border-4 tracking-[0.2em] uppercase italic transition-all relative overflow-hidden",
              isSuccess ? "success-gradient border-white animate-success-flash" : "sunny-gradient border-white/80"
            )}>
              {selectedIndices.map(i => shuffledLetters[i]).join('')}
              <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
            </div>
          )}
        </div>

        <div className="flex-1 w-full flex items-center justify-center min-h-0 relative">
          <div 
            key={`circle-${level.letters.join('')}`}
            ref={containerRef}
            className={cn(
              "relative select-none touch-none scale-[0.6] xs:scale-[0.7] sm:scale-85 md:scale-95 landscape:scale-[0.5] sm:landscape:scale-[0.7] lg:landscape:scale-[0.85] transition-all duration-700 shrink-0 animate-zoom-in",
              isInvalid && "animate-shake",
              isSuccess && "scale-105"
            )}
            style={{ width: COORDINATE_BASE, height: COORDINATE_BASE }}
          >
            <div 
              className="absolute inset-0 ring-track rounded-full shadow-inner opacity-40 pointer-events-none"
              style={{
                width: COORDINATE_BASE,
                height: COORDINATE_BASE,
                transform: 'scale(0.9)'
              }}
            />

            <svg 
              className="absolute inset-0 pointer-events-none z-0 overflow-visible" 
              viewBox={`0 0 ${COORDINATE_BASE} ${COORDINATE_BASE}`}
            >
              <defs>
                <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isSuccess ? "#f0fdf4" : "hsl(var(--primary))"} />
                  <stop offset="100%" stopColor={isSuccess ? "#4ade80" : "hsl(var(--accent))"} />
                </linearGradient>
              </defs>

              {selectedIndices.length > 1 && selectedIndices.slice(0, -1).map((idx, i) => {
                const start = letterPositions[idx];
                const end = letterPositions[selectedIndices[i+1]];
                if (!start || !end) return null;
                return (
                  <line 
                    key={i} 
                    x1={start.x} y1={start.y} 
                    x2={end.x} y2={end.y} 
                    stroke="url(#line-gradient)" 
                    strokeWidth="24" 
                    strokeLinecap="round"
                    className={cn("transition-all duration-300", isSuccess ? "opacity-100" : "opacity-80")}
                    filter="url(#line-glow)"
                  />
                );
              })}
              {selectedIndices.length > 0 && dragPath && !isSuccess && (
                <line 
                  x1={letterPositions[selectedIndices[selectedIndices.length-1]].x} 
                  y1={letterPositions[selectedIndices[selectedIndices.length-1]].y} 
                  x2={dragPath.x} y2={dragPath.y} 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="24" 
                  strokeLinecap="round"
                  className="opacity-40"
                />
              )}
            </svg>

            <div 
              className={cn(
                "absolute z-50 flex items-center justify-center transition-all duration-500",
                (isDrawing || isSuccess || isInvalid || isShuffling) && "pointer-events-none opacity-20 scale-75"
              )}
              style={{
                left: OFFSET - LETTER_RADIUS * 1.5,
                top: OFFSET - LETTER_RADIUS * 1.5,
                width: LETTER_RADIUS * 3,
                height: LETTER_RADIUS * 3,
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShuffle}
                disabled={isDrawing || isSuccess || isInvalid || isShuffling}
                className="w-16 h-16 rounded-[2rem] glass border-white/60 text-primary hover:bg-white/60 active:scale-90 shadow-2xl transition-all"
              >
                <Shuffle className={cn("w-8 h-8 transition-all duration-500", isShuffling && "rotate-[360deg] scale-125")} />
              </Button>
            </div>

            {shuffledLetters.map((char, i) => {
              const pos = letterPositions[i];
              const isSelected = selectedIndices.includes(i);
              return (
                <div
                  key={`${char}-${i}`}
                  onMouseDown={(e) => { e.stopPropagation(); handleInteractionStart(i); }}
                  onTouchStart={(e) => { e.stopPropagation(); handleInteractionStart(i); }}
                  className={cn(
                    "absolute flex items-center justify-center font-black text-4xl sm:text-5xl rounded-[2rem] cursor-pointer transition-all duration-300 select-none border-4",
                    isSelected 
                      ? (isSuccess ? "success-gradient text-white scale-125 z-10 shadow-[0_20px_40px_rgba(34,197,94,0.4)] border-white animate-success-pop" : "sunny-gradient text-white scale-125 z-10 shadow-[0_20px_40px_rgba(245,158,11,0.4)] border-white") 
                      : "glass hover:bg-white/80 hover:scale-105 border-white/50 shadow-2xl",
                    isInvalid && isSelected && "bg-destructive text-white border-destructive",
                    isShuffling && "animate-vortex-shuffle"
                  )}
                  style={{
                    left: pos.x - LETTER_RADIUS * 1.4,
                    top: pos.y - LETTER_RADIUS * 1.4,
                    width: LETTER_RADIUS * 2.8,
                    height: LETTER_RADIUS * 2.8,
                  }}
                >
                  {char}
                </div>
              );
            })}

            {showOnboarding && (
              <div 
                className="absolute pointer-events-none z-[60] animate-onboarding-hand opacity-60"
                style={{
                  left: OFFSET - 30,
                  top: OFFSET + 100,
                }}
              >
                <div className="flex flex-col items-center">
                  <Hand className="w-16 h-16 text-primary drop-shadow-2xl" fill="currentColor" />
                  <span className="text-xs font-black uppercase text-primary bg-white/95 px-6 py-2 rounded-[1.5rem] shadow-2xl mt-4 whitespace-nowrap border-2 border-primary/30">
                    {t('guide_draw', lang)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
