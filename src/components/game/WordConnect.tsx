
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CIRCLE_RADIUS, LETTER_RADIUS } from '@/lib/game-constants';
import { LEVELS } from '@/lib/levels';
import { cn } from '@/lib/utils';

interface WordConnectProps {
  levelIndex: number;
  onScoreUpdate: (score: number) => void;
  onLevelComplete: () => void;
  onStateUpdate: (letters: string[], foundWords: string[], allValidWords: string[]) => void;
  lang?: string;
}

export function WordConnect({ 
  levelIndex, 
  onScoreUpdate, 
  onLevelComplete, 
  onStateUpdate,
  lang = 'en' 
}: WordConnectProps) {
  const level = LEVELS[levelIndex % LEVELS.length];
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [dragPath, setDragPath] = useState<{x: number, y: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getLetterPos = (index: number) => {
    const angle = (index * (360 / level.letters.length) - 90) * (Math.PI / 180);
    return {
      x: CIRCLE_RADIUS + CIRCLE_RADIUS * Math.cos(angle),
      y: CIRCLE_RADIUS + CIRCLE_RADIUS * Math.sin(angle)
    };
  };

  useEffect(() => {
    onStateUpdate(level.letters, foundWords, level.validWords);
  }, [level, foundWords, onStateUpdate]);

  const handleInteractionStart = (index: number) => {
    setSelectedIndices([index]);
  };

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (selectedIndices.length === 0) return;

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

    level.letters.forEach((_, idx) => {
      if (selectedIndices.includes(idx)) return;
      const pos = getLetterPos(idx);
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (dist < LETTER_RADIUS * 1.5) {
        setSelectedIndices(prev => [...prev, idx]);
      }
    });
  };

  const handleInteractionEnd = () => {
    const currentWord = selectedIndices.map(i => level.letters[i]).join('');
    if (level.validWords.includes(currentWord) && !foundWords.includes(currentWord)) {
      const newFound = [...foundWords, currentWord];
      setFoundWords(newFound);
      onScoreUpdate(currentWord.length * 10);
      
      if (newFound.length === level.validWords.length) {
        onLevelComplete();
      }
    }
    setSelectedIndices([]);
    setDragPath(null);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full h-full min-h-0">
      {/* Word Grid Slots */}
      <div className="flex flex-wrap justify-center gap-3 w-full p-4 glass rounded-3xl min-h-[80px] shrink-0">
        {level.validWords.map(word => (
          <div key={word} className="flex gap-1">
            {word.split('').map((char, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-6 h-6 flex items-center justify-center border rounded-lg font-black text-xs transition-all duration-500",
                  foundWords.includes(word) 
                    ? "bg-primary text-white border-primary shadow-lg scale-110" 
                    : "bg-white/10 border-white/20 text-transparent"
                )}
              >
                {foundWords.includes(word) ? char : ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Circle Interaction Area */}
      <div className="flex-1 flex items-center justify-center min-h-0 py-4">
        <div 
          ref={containerRef}
          className="relative select-none touch-none scale-90 sm:scale-100"
          style={{ width: CIRCLE_RADIUS * 2, height: CIRCLE_RADIUS * 2 }}
          onMouseMove={handleInteractionMove}
          onTouchMove={handleInteractionMove}
          onMouseUp={handleInteractionEnd}
          onTouchEnd={handleInteractionEnd}
          onMouseLeave={handleInteractionEnd}
        >
          <svg className="absolute inset-0 pointer-events-none w-full h-full">
            {selectedIndices.length > 1 && selectedIndices.slice(0, -1).map((idx, i) => {
              const start = getLetterPos(idx);
              const end = getLetterPos(selectedIndices[i+1]);
              return (
                <line 
                  key={i} 
                  x1={start.x} y1={start.y} 
                  x2={end.x} y2={end.y} 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  className="opacity-50"
                />
              );
            })}
            {selectedIndices.length > 0 && dragPath && (
              <line 
                x1={getLetterPos(selectedIndices[selectedIndices.length-1]).x} 
                y1={getLetterPos(selectedIndices[selectedIndices.length-1]).y} 
                x2={dragPath.x} y2={dragPath.y} 
                stroke="hsl(var(--primary))" 
                strokeWidth="8" 
                strokeLinecap="round"
                className="opacity-30"
              />
            )}
          </svg>

          {level.letters.map((char, i) => {
            const pos = getLetterPos(i);
            const isSelected = selectedIndices.includes(i);
            return (
              <div
                key={i}
                onMouseDown={() => handleInteractionStart(i)}
                onTouchStart={() => handleInteractionStart(i)}
                className={cn(
                  "absolute flex items-center justify-center font-black text-xl rounded-full cursor-pointer transition-all duration-200 shadow-xl",
                  isSelected ? "bg-primary text-white scale-110 z-10" : "glass hover:bg-white/80"
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

      {/* Current Selection Preview */}
      <div className="h-12 flex items-center justify-center shrink-0">
        {selectedIndices.length > 0 && (
          <div className="glass px-8 py-2 rounded-full text-2xl font-black text-primary animate-in zoom-in-90 duration-300 shadow-xl border-primary/20">
            {selectedIndices.map(i => level.letters[i]).join('')}
          </div>
        )}
      </div>
    </div>
  );
}
