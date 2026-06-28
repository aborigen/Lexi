
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ColumnsGame } from '@/components/game/ColumnsGame';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { GRID_WIDTH, GRID_HEIGHT, GEM_TYPES } from '@/lib/game-constants';
import { Trophy, RefreshCcw, LayoutDashboard, BrainCircuit, HelpCircle, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ColumnsPage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [currentGameState, setCurrentGameState] = useState<{grid: (number|null)[][], stack: number[]}>({
    grid: [],
    stack: []
  });
  const [suggestedMove, setSuggestedMove] = useState<{col: number, cycle: number} | null>(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('columns_high_score') : null;
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('columns_high_score', score.toString());
    }
  }, [score, highScore]);

  const handleReset = useCallback(() => {
    setScore(0);
    setSuggestedMove(null);
    setGameKey(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-6 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter italic uppercase">COLUMNS<span className="text-primary">.AI</span></h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Match-3 Tactical Grid</p>
            </div>
          </div>

          <div className="flex space-x-4 items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                  <HelpCircle className="w-6 h-6 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="glass sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black italic">TACTICAL GUIDE</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4 py-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">←→</div>
                    <p className="text-sm">Use <span className="text-foreground font-bold">Arrow Keys</span> to move the falling stack.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">↑</div>
                    <p className="text-sm">Press <span className="text-foreground font-bold">Up or Space</span> to cycle the order of gems.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">3x</div>
                    <p className="text-sm">Match 3+ gems <span className="text-foreground font-bold">horizontally, vertically, or diagonally</span>.</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="glass px-6 py-3 rounded-2xl flex items-center space-x-3">
              <Trophy className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">High Score</p>
                <p className="text-xl font-black">{highScore.toLocaleString()}</p>
              </div>
            </div>
            <div className="glass px-6 py-3 rounded-2xl bg-primary/5 border-primary/20 flex items-center space-x-3">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none mb-1">Current</p>
                <p className="text-2xl font-black">{score.toLocaleString()}</p>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={handleReset} className="rounded-2xl h-14 w-14 border-white/10 hover:bg-white/5">
              <RefreshCcw className="w-6 h-6" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 items-start justify-center">
          <aside className="hidden lg:flex flex-col space-y-6">
            <div className="glass p-6 rounded-3xl">
               <h3 className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-widest">
                 Gem Rarity
               </h3>
               <div className="flex flex-col gap-4">
                 {GEM_TYPES.map(gem => (
                   <div key={gem.id} className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-lg border-2 border-white/10" style={{ backgroundColor: gem.color }}>
                       {gem.label}
                     </div>
                     <span className="text-xs font-bold uppercase tracking-tighter opacity-70">{gem.score} pts</span>
                   </div>
                 ))}
               </div>
            </div>
          </aside>

          <main className="flex justify-center">
            <ColumnsGame 
              key={gameKey}
              onScoreUpdate={setScore}
              onGameOver={() => {
                toast({ title: "Grid Overflow!", description: "The columns have reached the ceiling.", variant: "destructive" });
                handleReset();
              }}
              onStateUpdate={(grid, stack) => setCurrentGameState({ grid, stack })}
              suggestedMove={suggestedMove}
            />
          </main>

          <aside className="flex flex-col space-y-6 w-full max-w-sm">
            <AIAdvisor 
              onSuggestionReceived={(col, cycle) => setSuggestedMove({ col, cycle })}
              gameState={{
                grid: currentGameState.grid,
                currentStack: currentGameState.stack,
                gridWidth: GRID_WIDTH,
                gridHeight: GRID_HEIGHT
              }}
            />

            <div className="glass p-6 rounded-3xl bg-secondary/5 border-secondary/10">
              <div className="flex items-center space-x-2 mb-3">
                <BrainCircuit className="w-4 h-4 text-secondary" />
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">Strategy Pro-Tip</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Diagonals are often overlooked. Try to stack gems to create multi-directional cascades for massive score multipliers.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
