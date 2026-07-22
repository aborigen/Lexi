
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CIRCLE_RADIUS, LETTER_RADIUS } from '@/lib/game-constants';
import { LEVELS } from '@/lib/levels';
import { cn } from '@/lib/utils';
import { audioManager } from '@/lib/audio-manager';

interface WordConnectProps {
  levelIndex: number;
  onScoreUpdate: (score: number) => void;
  onLevelComplete: () => void;
  onStateUpdate: (letters: string[], foundWords: string[], allValidWords: string[]) => void;
  lang?: string;
}

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function WordConnect({ 
  levelIndex, 
  onScoreUpdate, 
  onLevelComplete, 
  onStateUpdate,
  lang = 'en' 
}: WordConnectProps) {
  // Filter levels based on the current language
  const filteredLevels = useMemo(() => {
    const l = LEVELS.filter(lvl => lvl.lang === lang);
    return l.length > 0 ? l : LEVELS.filter(lvl => lvl.lang === 'en');
  }, [lang]);

  const level = filteredLevels[levelIndex % filteredLevels.length];
  
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [dragPath, setDragPath] = useState<{x: number, y: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state when level or language changes
  useEffect(() => {
    if (level) {
      setShuffledLetters(shuffleArray(level.letters));
    }
    setFoundWords([]);
    setSelectedIndices([]);
    setDragPath(null);
  }, [levelIndex, lang, level]);

  const getLetterPos = (index: number) => {
    if (!level || shuffledLetters.length === 0) return { x: 0, y: 0 };
    const angle = (index * (360 / shuffledLetters.length) - 90) * (Math.PI / 180);
    return {
      x: CIRCLE_RADIUS + CIRCLE_RADIUS * Math.cos(angle),
      y: CIRCLE_RADIUS + CIRCLE_RADIUS * Math.sin(angle)
    };
  };

  useEffect(() => {
    if (level && shuffledLetters.length > 0) {
      onStateUpdate(shuffledLetters, foundWords, level.validWords);
    }
  }, [level, foundWords, onStateUpdate, shuffledLetters]);

  const handleInteractionStart = (index: number) => {
    setSelectedIndices([index]);
    audioManager.playSelect(0);
  };

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (selectedIndices.length === 0 || shuffledLetters.length === 0) return;

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

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setDragPath({ x, y });

    shuffledLetters.forEach((_, idx) => {
      if (selectedIndices.includes(idx)) return;
      const pos = getLetterPos(idx);
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (dist < LETTER_RADIUS * 1.6) {
        audioManager.playSelect(selectedIndices.length);
        setSelectedIndices(prev => [...prev, idx]);
      }
    });
  };

  const handleInteractionEnd = () => {
    if (selectedIndices.length === 0 || !level || shuffledLetters.length === 0) return;

    const currentWord = selectedIndices.map(i => shuffledLetters[i]).join('');
    if (level.validWords.includes(currentWord) && !foundWords.includes(currentWord)) {
      const newFound = [...foundWords, currentWord];
      setFoundWords(newFound);
      onScoreUpdate(currentWord.length * 10);
      
      if (newFound.length === level.validWords.length) {
        audioManager.playLevelComplete();
        onLevelComplete();
      } else {
        audioManager.playSuccess();
      }
    } else if (selectedIndices.length > 1) {
      audioManager.playError();
    }
    
    setSelectedIndices([]);
    setDragPath(null);
  };

  if (!level || shuffledLetters.length === 0) return null;

  const sortedValidWords = [...level.validWords].sort((a, b) => a.length - b.length);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full min-h-0">
      <div className="flex flex-wrap justify-center gap-3 w-full p-6 glass rounded-[2rem] min-h-[120px] shrink-0">
        {sortedValidWords.map((word, idx) => (
          <div key={`${word}-${idx}`} className="flex gap-1.5">
            {word.split('').map((char, i) => {
              const isFound = foundWords.includes(word);
              return (
                <div 
                  key={i} 
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 rounded-xl font-black text-sm sm:text-base transition-all duration-500",
                    isFound 
                      ? "sunny-gradient text-white border-white shadow-[0_8px_20px_rgba(255,171,0,0.4)] word-slot-found" 
                      : "bg-white/10 border-white/40 text-transparent shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)]"
                  )}
                >
                  {isFound ? char : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0 py-2">
        <div 
          ref={containerRef}
          className="relative select-none touch-none scale-95 sm:scale-100"
          style={{ width: CIRCLE_RADIUS * 2, height: CIRCLE_RADIUS * 2 }}
          onMouseMove={handleInteractionMove}
          onTouchMove={handleInteractionMove}
          onMouseUp={handleInteractionEnd}
          onTouchEnd={handleInteractionEnd}
          onMouseLeave={handleInteractionEnd}
        >
          <svg className="absolute inset-0 pointer-events-none w-full h-full">
            <defs>
              <filter id="line-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {selectedIndices.length > 1 && selectedIndices.slice(0, -1).map((idx, i) => {
              const start = getLetterPos(idx);
              const end = getLetterPos(selectedIndices[i+1]);
              return (
                <line 
                  key={i} 
                  x1={start.x} y1={start.y} 
                  x2={end.x} y2={end.y} 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="10" 
                  strokeLinecap="round"
                  className="opacity-80"
                  filter="url(#line-glow)"
                />
              );
            })}
            {selectedIndices.length > 0 && dragPath && (
              <line 
                x1={getLetterPos(selectedIndices[selectedIndices.length-1]).x} 
                y1={getLetterPos(selectedIndices[selectedIndices.length-1]).y} 
                x2={dragPath.x} y2={dragPath.y} 
                stroke="hsl(var(--primary))" 
                strokeWidth="10" 
                strokeLinecap="round"
                className="opacity-40"
              />
            )}
          </svg>

          {shuffledLetters.map((char, i) => {
            const pos = getLetterPos(i);
            const isSelected = selectedIndices.includes(i);
            return (
              <div
                key={i}
                onMouseDown={() => handleInteractionStart(i)}
                onTouchStart={() => handleInteractionStart(i)}
                className={cn(
                  "absolute flex items-center justify-center font-black text-2xl rounded-full cursor-pointer transition-all duration-200 select-none",
                  isSelected 
                    ? "sunny-gradient text-white scale-125 z-10 shadow-[0_12px_24px_rgba(255,171,0,0.5)] border-2 border-white" 
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
        </div>
      </div>

      <div className="h-16 flex items-center justify-center shrink-0">
        {selectedIndices.length > 0 && (
          <div className="sunny-gradient px-10 py-3 rounded-full text-3xl font-black text-white animate-in zoom-in-90 duration-300 shadow-[0_10px_30px_rgba(255,171,0,0.4)] border-2 border-white/80">
            {selectedIndices.map(i => shuffledLetters[i]).join('')}
          </div>
        )}
      </div>
    </div>
  );
}
