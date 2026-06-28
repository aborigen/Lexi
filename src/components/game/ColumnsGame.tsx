
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_WIDTH, GRID_HEIGHT, GEM_TYPES, TICK_RATE_INITIAL, TICK_RATE_MIN, TICK_RATE_DECREMENT } from '@/lib/game-constants';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronDown, RotateCcw, MoveDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColumnsGameProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: () => void;
  onStateUpdate: (grid: (number | null)[][], currentStack: number[]) => void;
  suggestedMove: { col: number; cycle: number } | null;
}

/**
 * The primary game component for the Columns match-3 puzzle.
 * Manages the game grid, falling stacks, input handling, and the core game loop.
 * 
 * @param {ColumnsGameProps} props - The component props.
 * @returns {JSX.Element} The rendered game board and mobile controls.
 */
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
  const gridRef = useRef(grid);
  const clearingRef = useRef(false);

  // Sync ref with state for use in callbacks that access the grid between renders
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Notify parent of state changes (e.g., for AI Advisor)
  useEffect(() => {
    const timer = setTimeout(() => {
      onStateUpdate(grid, currentStack);
    }, 0);
    return () => clearTimeout(timer);
  }, [grid, currentStack, onStateUpdate]);

  /**
   * Randomly selects three gem IDs to form a new vertical stack.
   * @returns {number[]} An array of 3 gem IDs.
   */
  const generateStack = useCallback(() => [
    GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)].id,
    GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)].id,
    GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)].id,
  ], []);

  /**
   * Resets the game to its initial state with a fresh grid and two stacks.
   */
  const initGame = useCallback(() => {
    const emptyGrid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null));
    setGrid(emptyGrid);
    gridRef.current = emptyGrid;
    
    const initial = generateStack();
    const next = generateStack();
    setCurrentStack(initial);
    setNextStack(next);
    setStackPos({ row: -2, col: Math.floor(GRID_WIDTH / 2) });
    setIsClearing(false);
    clearingRef.current = false;
  }, [generateStack]);

  // Initialize game on component mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  /**
   * Shifts the gem order in the current falling stack (rotates the three gems).
   */
  const cycleGems = useCallback(() => {
    if (clearingRef.current) return;
    setCurrentStack(prev => [prev[2], prev[0], prev[1]]);
  }, []);

  /**
   * Attempts to move the current falling stack one column to the left.
   * Checks for grid boundaries and gem collisions.
   */
  const moveLeft = useCallback(() => {
    if (clearingRef.current) return;
    setStackPos(prev => {
      const newCol = Math.max(0, prev.col - 1);
      const isBlocked = [0, 1, 2].some(i => {
        const r = prev.row + i;
        return r >= 0 && r < GRID_HEIGHT && gridRef.current[r][newCol] !== null;
      });
      return isBlocked ? prev : { ...prev, col: newCol };
    });
  }, []);

  /**
   * Attempts to move the current falling stack one column to the right.
   * Checks for grid boundaries and gem collisions.
   */
  const moveRight = useCallback(() => {
    if (clearingRef.current) return;
    setStackPos(prev => {
      const newCol = Math.min(GRID_WIDTH - 1, prev.col + 1);
      const isBlocked = [0, 1, 2].some(i => {
        const r = prev.row + i;
        return r >= 0 && r < GRID_HEIGHT && gridRef.current[r][newCol] !== null;
      });
      return isBlocked ? prev : { ...prev, col: newCol };
    });
  }, []);

  /**
   * Scans a grid state for matching sets of 3+ identical gems.
   * Checks horizontal, vertical, and both diagonal directions.
   * 
   * @param {(number | null)[][]} currentGrid - The current state of the board.
   * @returns {Set<string>} A set of coordinate strings "row,col" identifying matched gems.
   */
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

  /**
   * Orchestrates the process of clearing matches and applying gravity.
   * Loops until no further matches are found (cascades).
   * 
   * @param {(number | null)[][]} startingGrid - The grid state after a piece has landed.
   */
  const processBoard = useCallback(async (startingGrid: (number | null)[][]) => {
    setIsClearing(true);
    clearingRef.current = true;
    let currentGrid = startingGrid.map(row => [...row]);
    
    while (true) {
      const matches = findMatches(currentGrid);
      if (matches.size === 0) break;

      const scoreToAdd = matches.size * 50;
      setTimeout(() => onScoreUpdate(scoreToAdd), 0);

      // Clear the matches
      matches.forEach(m => {
        const [r, c] = m.split(',').map(Number);
        currentGrid[r][c] = null;
      });

      setGrid([...currentGrid.map(r => [...r])]);
      await new Promise(r => setTimeout(r, 200));

      // Apply gravity to settle gems
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
      setGrid([...currentGrid.map(r => [...r])]);
      await new Promise(r => setTimeout(r, 150));
    }

    // Check for game over condition
    if (currentGrid[0].some(cell => cell !== null)) {
      setTimeout(() => onGameOver(), 0);
      return;
    }

    // Prep for next falling piece
    setCurrentStack(nextStack);
    setNextStack(generateStack());
    setStackPos({ row: -2, col: Math.floor(GRID_WIDTH / 2) });
    setIsClearing(false);
    clearingRef.current = false;
  }, [nextStack, onScoreUpdate, onGameOver, generateStack]);

  /**
   * The main "heartbeat" of the game loop.
   * Advances the falling stack by one row and checks for collision/landing.
   */
  const tick = useCallback(() => {
    if (isPaused || clearingRef.current) return;

    setStackPos(prev => {
      const nextRow = prev.row + 1;
      const canMove = nextRow + 2 < GRID_HEIGHT && gridRef.current[nextRow + 2][prev.col] === null;

      if (!canMove) {
        const finalGrid = gridRef.current.map(row => [...row]);
        let hasLandedInBounds = false;
        
        for (let i = 0; i < 3; i++) {
          const r = prev.row + i;
          if (r >= 0 && r < GRID_HEIGHT) {
            finalGrid[r][prev.col] = currentStack[i];
            hasLandedInBounds = true;
          }
        }

        if (hasLandedInBounds) {
          setGrid(finalGrid);
          processBoard(finalGrid);
        } else {
          setTimeout(() => onGameOver(), 0);
        }
        
        return prev;
      }
      return { ...prev, row: nextRow };
    });
  }, [isPaused, currentStack, processBoard, onGameOver]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || clearingRef.current) return;
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
      if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        cycleGems();
      }
      if (e.key === 'ArrowDown') tick();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, moveLeft, moveRight, cycleGems, tick]);

  // Manage game timer
  useEffect(() => {
    const rate = Math.max(TICK_RATE_MIN, TICK_RATE_INITIAL);
    gameLoopRef.current = setInterval(tick, rate);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [tick]);

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start w-full justify-center">
        {/* Game Board container */}
        <div 
          className="relative bg-black/40 border-4 border-white/10 rounded-2xl overflow-hidden shadow-2xl shrink-0"
          style={{ 
            width: GRID_WIDTH * 32, 
            height: GRID_HEIGHT * 32,
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`
          }}
        >
          {/* Static Gems in the grid */}
          {grid.map((row, r) => row.map((gemId, c) => (
            <div key={`${r}-${c}`} className="w-full h-full border-[0.5px] border-white/5 flex items-center justify-center">
              {gemId && (
                <Gem 
                  type={GEM_TYPES.find(g => g.id === gemId)!} 
                  size={26}
                />
              )}
            </div>
          )))}

          {/* Current Falling Piece */}
          {!isClearing && currentStack.length > 0 && [0, 1, 2].map(i => {
            const r = stackPos.row + i;
            if (r < 0 || r >= GRID_HEIGHT) return null;
            return (
              <div 
                key={`falling-${i}`}
                className="absolute flex items-center justify-center transition-all duration-75"
                style={{ 
                  top: r * 32, 
                  left: stackPos.col * 32,
                  width: 32,
                  height: 32
                }}
              >
                <Gem 
                  type={GEM_TYPES.find(g => g.id === currentStack[i])!} 
                  isFalling
                  size={26}
                />
              </div>
            );
          })}

          {/* AI Hint Visualization */}
          {suggestedMove && !isClearing && (
            <div 
              className="absolute h-full w-[32px] bg-primary/10 border-x border-primary/20 pointer-events-none transition-all duration-300"
              style={{ left: suggestedMove.col * 32 }}
            />
          )}
        </div>

        {/* Info Panel with "Next Piece" preview */}
        <div className="flex flex-row md:flex-col gap-4 w-full md:w-auto justify-center">
          <div className="glass p-3 md:p-4 rounded-2xl border-white/10 flex flex-col items-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 md:mb-3">Next</p>
            <div className="flex flex-row md:flex-col gap-1">
              {nextStack.map((id, i) => (
                <div key={i} className="w-8 h-8 md:w-10 md:h-10 glass rounded-lg flex items-center justify-center text-lg md:text-xl shadow-inner border border-white/5">
                  {GEM_TYPES.find(g => g.id === id)?.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Touch Controls for Smartphones */}
      <div className="flex flex-col gap-4 w-full max-w-[320px] lg:hidden mb-8">
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            className="h-16 glass rounded-2xl border-white/10 active:scale-95 transition-transform"
            onPointerDown={(e) => { e.preventDefault(); moveLeft(); }}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 glass rounded-2xl border-primary/20 bg-primary/10 active:scale-95 transition-transform"
              onPointerDown={(e) => { e.preventDefault(); cycleGems(); }}
            >
              <RotateCcw className="w-7 h-7" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 glass rounded-2xl border-white/10 active:scale-95 transition-transform"
              onPointerDown={(e) => { e.preventDefault(); tick(); }}
            >
              <ChevronDown className="w-8 h-8" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-16 glass rounded-2xl border-white/10 active:scale-95 transition-transform"
            onPointerDown={(e) => { e.preventDefault(); moveRight(); }}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * A UI component representing a single colored gem.
 * 
 * @param {Object} props - The component props.
 * @param {GemType} props.type - The metadata for the gem type (label, color, shadow).
 * @param {boolean} [props.isFalling] - Whether the gem is currently part of a falling stack.
 * @param {number} [props.size=32] - The pixel dimension of the gem.
 * @returns {JSX.Element} The rendered gem element.
 */
function Gem({ type, isFalling, size = 32 }: { type: any, isFalling?: boolean, size?: number }) {
  return (
    <div 
      className={cn(
        "rounded-lg flex items-center justify-center transition-all",
        isFalling ? "scale-105" : "scale-100"
      )}
      style={{ 
        width: size,
        height: size,
        fontSize: size * 0.6,
        backgroundColor: type.color,
        boxShadow: `0 4px 12px ${type.shadow}, inset 0 2px 4px rgba(255,255,255,0.3)`,
        border: '2px solid rgba(255,255,255,0.4)'
      }}
    >
      {type.label}
    </div>
  );
}
