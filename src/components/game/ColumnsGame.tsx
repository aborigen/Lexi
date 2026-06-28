
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_WIDTH, GRID_HEIGHT, GEM_TYPES, TICK_RATE_INITIAL, TICK_RATE_MIN, TICK_RATE_DECREMENT } from '@/lib/game-constants';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ColumnsGameProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: () => void;
  onStateUpdate: (grid: (number | null)[][], currentStack: number[]) => void;
  suggestedMove: { col: number; cycle: number } | null;
}

export function ColumnsGame({ onScoreUpdate, onGameOver, onStateUpdate, suggestedMove }: ColumnsGameProps) {
  const [grid, setGrid] = useState<(number | null)[][]>(
    Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null))
  );
  const [currentStack, setCurrentStack] = useState<number[]>([]);
  const [stackPos, setStackPos] = useState({ row: -2, col: Math.floor(GRID_WIDTH / 2) });
  const [nextStack, setNextStack] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const generateStack = () => [
    GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)].id,
    GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)].id,
    GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)].id,
  ];

  const initGame = useCallback(() => {
    setGrid(Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null)));
    const initial = generateStack();
    const next = generateStack();
    setCurrentStack(initial);
    setNextStack(next);
    setStackPos({ row: -2, col: Math.floor(GRID_WIDTH / 2) });
    setIsClearing(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const cycleGems = useCallback(() => {
    setCurrentStack(prev => [prev[2], prev[0], prev[1]]);
  }, []);

  const moveLeft = useCallback(() => {
    setStackPos(prev => {
      const newCol = Math.max(0, prev.col - 1);
      return { ...prev, col: newCol };
    });
  }, []);

  const moveRight = useCallback(() => {
    setStackPos(prev => {
      const newCol = Math.min(GRID_WIDTH - 1, prev.col + 1);
      return { ...prev, col: newCol };
    });
  }, []);

  const findMatches = (currentGrid: (number | null)[][]) => {
    const matches = new Set<string>();
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (let r = 0; r < GRID_HEIGHT; r++) {
      for (let c = 0; c < GRID_WIDTH; c++) {
        const gem = currentGrid[r][c];
        if (!gem) continue;

        for (const [dr, dc] of directions) {
          let count = 1;
          const tempMatches = [`${r},${c}`];

          // Check positive direction
          let nr = r + dr;
          let nc = c + dc;
          while (nr >= 0 && nr < GRID_HEIGHT && nc >= 0 && nc < GRID_WIDTH && currentGrid[nr][nc] === gem) {
            tempMatches.push(`${nr},${nc}`);
            count++;
            nr += dr;
            nc += dc;
          }

          if (count >= 3) {
            tempMatches.forEach(m => matches.add(m));
          }
        }
      }
    }
    return matches;
  };

  const processBoard = useCallback(async () => {
    setIsClearing(true);
    let currentGrid = [...grid.map(row => [...row])];
    let totalCleared = 0;

    while (true) {
      const matches = findMatches(currentGrid);
      if (matches.size === 0) break;

      totalCleared += matches.size;
      onScoreUpdate(matches.size * 50);

      // Clear matches
      matches.forEach(m => {
        const [r, c] = m.split(',').map(Number);
        currentGrid[r][c] = null;
      });

      setGrid([...currentGrid]);
      await new Promise(r => setTimeout(r, 300));

      // Apply gravity
      for (let c = 0; c < GRID_WIDTH; c++) {
        let emptyRow = GRID_HEIGHT - 1;
        for (let r = GRID_HEIGHT - 1; r >= 0; r--) {
          if (currentGrid[r][c] !== null) {
            const val = currentGrid[r][c];
            currentGrid[r][c] = null;
            currentGrid[emptyRow][c] = val;
            emptyRow--;
          }
        }
      }
      setGrid([...currentGrid]);
      await new Promise(r => setTimeout(r, 200));
    }

    setIsClearing(false);
    
    // Check game over
    if (currentGrid[0].some(cell => cell !== null)) {
      onGameOver();
      return;
    }

    // Spawn new stack
    setCurrentStack(nextStack);
    setNextStack(generateStack());
    setStackPos({ row: -2, col: Math.floor(GRID_WIDTH / 2) });
  }, [grid, nextStack, onScoreUpdate, onGameOver]);

  const tick = useCallback(() => {
    if (isPaused || isClearing) return;

    setStackPos(prev => {
      const nextRow = prev.row + 1;
      const canMove = nextRow + 2 < GRID_HEIGHT && grid[nextRow + 2][prev.col] === null;

      if (!canMove) {
        // Land
        const newGrid = [...grid.map(row => [...row])];
        for (let i = 0; i < 3; i++) {
          const r = prev.row + i;
          if (r >= 0 && r < GRID_HEIGHT) {
            newGrid[r][prev.col] = currentStack[i];
          }
        }
        setGrid(newGrid);
        setTimeout(() => processBoard(), 0);
        return prev;
      }
      return { ...prev, row: nextRow };
    });
  }, [grid, isPaused, isClearing, currentStack, processBoard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isClearing) return;
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
      if (e.key === 'ArrowUp' || e.key === ' ') cycleGems();
      if (e.key === 'ArrowDown') tick();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isClearing, moveLeft, moveRight, cycleGems, tick]);

  useEffect(() => {
    const rate = Math.max(TICK_RATE_MIN, TICK_RATE_INITIAL);
    gameLoopRef.current = setInterval(tick, rate);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [tick]);

  useEffect(() => {
    onStateUpdate(grid, currentStack);
  }, [grid, currentStack, onStateUpdate]);

  return (
    <div className="relative flex gap-8">
      <div 
        className="relative bg-black/40 border-4 border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        style={{ 
          width: GRID_WIDTH * 40, 
          height: GRID_HEIGHT * 40,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`
        }}
      >
        {/* Static Grid */}
        {grid.map((row, r) => row.map((gemId, c) => (
          <div key={`${r}-${c}`} className="w-full h-full border-[0.5px] border-white/5 flex items-center justify-center">
            {gemId && (
              <Gem 
                type={GEM_TYPES.find(g => g.id === gemId)!} 
                isGhost={false}
              />
            )}
          </div>
        )))}

        {/* Falling Stack */}
        {!isClearing && currentStack.length > 0 && [0, 1, 2].map(i => {
          const r = stackPos.row + i;
          if (r < 0 || r >= GRID_HEIGHT) return null;
          return (
            <div 
              key={`falling-${i}`}
              className="absolute w-[40px] h-[40px] flex items-center justify-center transition-all duration-75"
              style={{ 
                top: r * 40, 
                left: stackPos.col * 40 
              }}
            >
              <Gem 
                type={GEM_TYPES.find(g => g.id === currentStack[i])!} 
                isGhost={false}
                isFalling
              />
            </div>
          );
        })}

        {/* AI Suggested Landing Zone */}
        {suggestedMove && !isClearing && (
          <div 
            className="absolute h-full w-[40px] bg-primary/10 border-x border-primary/20 pointer-events-none"
            style={{ left: suggestedMove.col * 40 }}
          />
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="glass p-4 rounded-2xl border-white/10 flex flex-col items-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Next</p>
          <div className="flex flex-col gap-1">
            {nextStack.map((id, i) => (
              <div key={i} className="w-10 h-10 glass rounded-lg flex items-center justify-center text-xl">
                {GEM_TYPES.find(g => g.id === id)?.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Gem({ type, isGhost, isFalling }: { type: any, isGhost: boolean, isFalling?: boolean }) {
  return (
    <div 
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center text-xl transition-all",
        isGhost ? "opacity-30" : "opacity-100",
        isFalling && "scale-105"
      )}
      style={{ 
        backgroundColor: type.color,
        boxShadow: `0 4px 12px ${type.shadow}`,
        border: '2px solid rgba(255,255,255,0.4)'
      }}
    >
      {type.label}
    </div>
  );
}
