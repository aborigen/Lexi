"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CIRCLE_RADIUS, LETTER_RADIUS, INTERACTION_BUFFER } from '@/lib/game-constants';
import { WordLevel } from '@/lib/levels';
import { cn } from '@/lib/utils';
import { audioManager } from '@/lib/audio-manager';
import { Hand } from 'lucide-react';
import { t } from '@/lib/translations';

interface WordConnectProps {
  level: WordLevel;
  onScoreUpdate: (score: number, length: number) => void;
  onLevelComplete: () => void;
  onStateUpdate: (letters: string[], foundWords: string[], allValidWords: string[]) => void;
  lang?: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function WordConnect({ 
  level, 
  onScoreUpdate, 
  onLevelComplete, 
  onStateUpdate,
  lang = 'en' 
}: WordConnectProps) {
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [dragPath, setDragPath] = useState<{x: number, y: number} | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
      // -90 is 12 o'clock. Adding 30 degrees rotates it clockwise.
      const angle = (index * (360 / shuffledLetters.length) - 60) * (Math.PI / 180);
      return {
        x: OFFSET + CIRCLE_RADIUS * Math.cos(angle),
        y: OFFSET + CIRCLE_RADIUS * Math.sin(angle)
      };
    });
  }, [shuffledLetters, OFFSET]);

  useEffect(() => {
    const isFirstTime = typeof window !== 'undefined' ? !localStorage.getItem('lexi_onboarding_complete') : false;
    if (isFirstTime) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    if (level) {
      const shuffled = shuffleArray(level.letters);
      setShuffledLetters(shuffled);
      setFoundWords([]);
      setSelectedIndices([]);
      selectedIndicesRef.current = [];
      setDragPath(null);
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
    completeOnboarding();
    setSelectedIndices([index]);
    audioManager.playSelect(0);
  };

  const handleInteractionMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const currentIndices = selectedIndicesRef.current;
    if (currentIndices.length === 0 || shuffledLetters.length === 0) return;

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

    const scaleX = rect.width / COORDINATE_BASE;
    const scaleY = rect.height / COORDINATE_BASE;
    
    const x = (clientX - rect.left) / scaleX;
    const y = (clientY - rect.top) / scaleY;
    
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
  }, [shuffledLetters, letterPositions, COORDINATE_BASE]);

  const handleInteractionEnd = useCallback(() => {
    const currentIndices = selectedIndicesRef.current;
    if (currentIndices.length === 0 || !level || shuffledLetters.length === 0) return;
    
    const currentWord = currentIndices.map(i => shuffledLetters[i]).join('');
    
    if (level.validWords.includes(currentWord)) {
      if (!foundWords.includes(currentWord)) {
        const newFound = [...foundWords, currentWord];
        setFoundWords(newFound);
        onScoreUpdate(currentWord.length * 10, currentWord.length);
        if (newFound.length === level.validWords.length) {
          audioManager.playLevelComplete();
          onLevelComplete();
        } else {
          audioManager.playSuccess();
        }
      } else {
        audioManager.playSelect(0);
      }
    } else if (currentIndices.length > 1) {
      audioManager.playError();
    }
    
    setSelectedIndices([]);
    selectedIndicesRef.current = [];
    setDragPath(null);
  }, [level, shuffledLetters, foundWords, onScoreUpdate, onLevelComplete]);

  const onboardingPath = useMemo(() => {
    if (!showOnboarding || !level || shuffledLetters.length === 0) return null;
    const firstWord = level.validWords.find(w => w.length >= 3) || level.validWords[0];
    if (!firstWord) return null;

    const indices: number[] = [];
    for (const char of firstWord.split('')) {
      const idx = shuffledLetters.indexOf(char);
      if (idx !== -1 && !indices.includes(idx)) {
        indices.push(idx);
      }
    }
    
    if (indices.length < 2) return null;
    return indices.map(i => letterPositions[i]);
  }, [showOnboarding, level, shuffledLetters, letterPositions]);

  if (!level || shuffledLetters.length === 0) return null;
  const sortedValidWords = [...level.validWords].sort((a, b) => a.length - b.length);

  return (
    <div 
      className="flex flex-col landscape:flex-row items-center w-full h-full min-h-0 touch-none relative overflow-hidden"
      onMouseMove={handleInteractionMove}
      onTouchMove={handleInteractionMove}
      onMouseUp={handleInteractionEnd}
      onTouchEnd={handleInteractionEnd}
    >
      <div 
        key={`grid-${level.letters.join('')}`} 
        className="w-full landscape:w-1/3 portrait:max-h-[25%] landscape:h-full p-2 glass rounded-2xl flex flex-wrap justify-center content-start gap-1 sm:gap-1.5 overflow-y-auto custom-scrollbar shrink-0 animate-slide-in-left mt-2 z-10"
      >
        {sortedValidWords.map((word, idx) => (
          <div key={`${word}-${idx}`} className="flex gap-0.5">
            {word.split('').map((char, i) => {
              const isFound = foundWords.includes(word);
              return (
                <div 
                  key={i} 
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border rounded-md font-black text-[10px] sm:text-sm transition-all duration-500",
                    isFound 
                      ? "sunny-gradient text-white border-white shadow-[0_2px_4px_rgba(255,171,0,0.3)] word-slot-found" 
                      : "bg-white/5 border-white/20 text-transparent"
                  )}
                >
                  {isFound ? char : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 relative z-0">
        <div className="h-14 flex items-center justify-center shrink-0 z-10">
          {selectedIndices.length > 0 && (
            <div className="sunny-gradient px-5 py-2 rounded-full text-lg sm:text-xl font-black text-white animate-in zoom-in-95 duration-300 shadow-xl border-2 border-white/80">
              {selectedIndices.map(i => shuffledLetters[i]).join('')}
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center w-full min-h-0 relative portrait:pb-12 landscape:pb-4">
          <div 
            key={`circle-${level.letters.join('')}`}
            ref={containerRef}
            className="relative select-none touch-none scale-[0.6] xs:scale-[0.7] sm:scale-85 md:scale-95 lg:scale-100 landscape:scale-[0.55] sm:landscape:scale-[0.75] transition-transform duration-300 shrink-0 animate-zoom-in"
            style={{ width: COORDINATE_BASE, height: COORDINATE_BASE }}
          >
            <svg 
              className="absolute inset-0 pointer-events-none" 
              viewBox={`0 0 ${COORDINATE_BASE} ${COORDINATE_BASE}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="line-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {showOnboarding && onboardingPath && (
                <path 
                  d={`M ${onboardingPath.map(p => `${p.x},${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="1000"
                  className="opacity-20 animate-onboarding-path"
                />
              )}

              {selectedIndices.length > 1 && selectedIndices.slice(0, -1).map((idx, i) => {
                const start = letterPositions[idx];
                const end = letterPositions[selectedIndices[i+1]];
                if (!start || !end) return null;
                return (
                  <line 
                    key={i} 
                    x1={start.x} y1={start.y} 
                    x2={end.x} y2={end.y} 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="14" 
                    strokeLinecap="round"
                    className="opacity-90"
                    filter="url(#line-glow)"
                  />
                );
              })}
              {selectedIndices.length > 0 && dragPath && (
                <line 
                  x1={letterPositions[selectedIndices[selectedIndices.length-1]].x} 
                  y1={letterPositions[selectedIndices[selectedIndices.length-1]].y} 
                  x2={dragPath.x} y2={dragPath.y} 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="14" 
                  strokeLinecap="round"
                  className="opacity-50"
                />
              )}
            </svg>

            {shuffledLetters.map((char, i) => {
              const pos = letterPositions[i];
              const isSelected = selectedIndices.includes(i);
              return (
                <div
                  key={i}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleInteractionStart(i);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleInteractionStart(i);
                  }}
                  className={cn(
                    "absolute flex items-center justify-center font-black text-3xl rounded-full cursor-pointer transition-all duration-200 select-none",
                    isSelected 
                      ? "sunny-gradient text-white scale-125 z-10 shadow-[0_8px_20px_rgba(255,171,0,0.6)] border-2 border-white" 
                      : "glass hover:bg-white/90 hover:scale-105 border-2 border-white/60 shadow-xl"
                  )}
                  style={{
                    left: pos.x - LETTER_RADIUS,
                    top: pos.y - LETTER_RADIUS,
                    width: LETTER_RADIUS * 2,
                    height: LETTER_RADIUS * 2,
                  }}
                >
                  {char}
                </div>
              );
            })}

            {showOnboarding && onboardingPath && (
              <div 
                className="absolute pointer-events-none z-50 animate-onboarding-hand"
                style={{
                  left: onboardingPath[0].x - 20,
                  top: onboardingPath[0].y - 20,
                }}
              >
                <div className="flex flex-col items-center">
                  <Hand className="w-10 h-10 text-primary drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" fill="currentColor" />
                  <span className="text-[11px] font-black uppercase text-primary bg-white/90 px-3 py-1 rounded-full shadow-lg mt-2 whitespace-nowrap border border-primary/20">
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
