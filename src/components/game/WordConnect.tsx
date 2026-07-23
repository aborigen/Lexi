"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CIRCLE_RADIUS, LETTER_RADIUS } from '@/lib/game-constants';
import { WordLevel } from '@/lib/levels';
import { cn } from '@/lib/utils';
import { audioManager } from '@/lib/audio-manager';

interface WordConnectProps {
  level: WordLevel;
  onScoreUpdate: (score: number) => void;
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use a Ref to keep track of indices for high-performance stable callbacks during interaction
  const selectedIndicesRef = useRef<number[]>([]);

  // Synchronize state to ref
  useEffect(() => {
    selectedIndicesRef.current = selectedIndices;
  }, [selectedIndices]);

  const letterPositions = useMemo(() => {
    if (!shuffledLetters.length) return [];
    return shuffledLetters.map((_, index) => {
      const angle = (index * (360 / shuffledLetters.length) - 90) * (Math.PI / 180);
      return {
        x: CIRCLE_RADIUS + CIRCLE_RADIUS * Math.cos(angle),
        y: CIRCLE_RADIUS + CIRCLE_RADIUS * Math.sin(angle)
      };
    });
  }, [shuffledLetters]);

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

  const handleInteractionStart = (index: number) => {
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
      if (e.cancelable) e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = (clientX - rect.left) / (rect.width / (CIRCLE_RADIUS * 2));
    const y = (clientY - rect.top) / (rect.height / (CIRCLE_RADIUS * 2));
    setDragPath({ x, y });

    // Backtrack Logic: If we move back to the previous letter, deselect the current one
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

    // Forward selection
    letterPositions.forEach((pos, idx) => {
      if (currentIndices.includes(idx)) return;
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (dist < LETTER_RADIUS * 1.5) {
        const newIndices = [...currentIndices, idx];
        setSelectedIndices(newIndices);
        audioManager.playSelect(newIndices.length - 1);
      }
    });
  }, [shuffledLetters, letterPositions]); // selectedIndices state is NOT a dependency to keep handler stable

  const handleInteractionEnd = () => {
    const currentIndices = selectedIndicesRef.current;
    if (currentIndices.length === 0 || !level || shuffledLetters.length === 0) return;
    const currentWord = currentIndices.map(i => shuffledLetters[i]).join('');
    
    if (level.validWords.includes(currentWord)) {
      if (!foundWords.includes(currentWord)) {
        const newFound = [...foundWords, currentWord];
        setFoundWords(newFound);
        onScoreUpdate(currentWord.length * 10);
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
  };

  if (!level || shuffledLetters.length === 0) return null;
  const sortedValidWords = [...level.validWords].sort((a, b) => a.length - b.length);

  return (
    <div className="flex flex-col items-center gap-2 py-2 flex-1 min-h-0 overflow-hidden touch-none">
      <div className="w-full p-2 glass rounded-2xl flex flex-wrap justify-center gap-1.5 sm:gap-2 max-h-[140px] overflow-y-auto custom-scrollbar shrink-0">
        {sortedValidWords.map((word, idx) => (
          <div key={`${word}-${idx}`} className="flex gap-0.5">
            {word.split('').map((char, i) => {
              const isFound = foundWords.includes(word);
              return (
                <div 
                  key={i} 
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border rounded-md font-black text-[10px] sm:text-xs transition-all duration-500",
                    isFound 
                      ? "sunny-gradient text-white border-white shadow-[0_2px_6px_rgba(255,171,0,0.3)] word-slot-found" 
                      : "bg-white/10 border-white/40 text-transparent"
                  )}
                >
                  {isFound ? char : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="h-8 flex items-center justify-center shrink-0">
        {selectedIndices.length > 0 && (
          <div className="sunny-gradient px-4 py-1 rounded-full text-lg font-black text-white animate-in zoom-in-95 duration-300 shadow-md border border-white/80">
            {selectedIndices.map(i => shuffledLetters[i]).join('')}
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center w-full min-h-0">
        <div 
          ref={containerRef}
          className="relative select-none touch-none scale-[0.65] sm:scale-75 md:scale-90 transition-transform duration-300 shrink-0"
          style={{ width: CIRCLE_RADIUS * 2, height: CIRCLE_RADIUS * 2 }}
          onMouseMove={handleInteractionMove}
          onTouchMove={handleInteractionMove}
          onMouseUp={handleInteractionEnd}
          onTouchEnd={handleInteractionEnd}
          onMouseLeave={handleInteractionEnd}
        >
          <svg className="absolute inset-0 pointer-events-none" viewBox={`0 0 ${CIRCLE_RADIUS*2} ${CIRCLE_RADIUS*2}`}>
            <defs>
              <filter id="line-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
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
                  stroke="hsl(var(--primary))" 
                  strokeWidth="12" 
                  strokeLinecap="round"
                  className="opacity-80"
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
                strokeWidth="12" 
                strokeLinecap="round"
                className="opacity-40"
              />
            )}
          </svg>

          {shuffledLetters.map((char, i) => {
            const pos = letterPositions[i];
            const isSelected = selectedIndices.includes(i);
            return (
              <div
                key={i}
                onMouseDown={() => handleInteractionStart(i)}
                onTouchStart={(e) => {
                  if (e.cancelable) e.preventDefault();
                  handleInteractionStart(i);
                }}
                className={cn(
                  "absolute flex items-center justify-center font-black text-2xl rounded-full cursor-pointer transition-all duration-200 select-none",
                  isSelected 
                    ? "sunny-gradient text-white scale-125 z-10 shadow-[0_8px_16px_rgba(255,171,0,0.5)] border-2 border-white" 
                    : "glass hover:bg-white/90 hover:scale-105 border-2 border-white/60 shadow-lg"
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
    </div>
  );
}
