
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MatterScene } from '@/components/game/MatterScene';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { EvolutionGuide } from '@/components/game/EvolutionGuide';
import { FRUIT_TIERS, ARENA_WIDTH, ARENA_HEIGHT } from '@/lib/game-constants';
import { Trophy, RefreshCcw, LayoutDashboard, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';

export default function PulpDropGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [nextFruitIndex, setNextFruitIndex] = useState(0);
  const [currentBodies, setCurrentBodies] = useState<any[]>([]);
  const [suggestedX, setSuggestedX] = useState<number | null>(null);
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('pulpdrop_high_score');
    if (saved) setHighScore(parseInt(saved));
    setNextFruitIndex(Math.floor(Math.random() * 4)); // Start with small fruits
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('pulpdrop_high_score', score.toString());
    }
  }, [score, highScore]);

  const handleFruitDropped = useCallback(() => {
    setNextFruitIndex(Math.floor(Math.random() * 5));
    setSuggestedX(null);
  }, []);

  const handleScoreUpdate = useCallback((points: number) => {
    setScore(prev => prev + points);
  }, []);

  const handleReset = useCallback(() => {
    setScore(0);
    setSuggestedX(null);
    setGameKey(prev => prev + 1);
  }, []);

  const arenaDropRange = useMemo(() => {
    const radius = FRUIT_TIERS[nextFruitIndex].radius;
    return {
      min: radius + 10,
      max: ARENA_WIDTH - radius - 10
    };
  }, [nextFruitIndex]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter italic">PULP<span className="text-primary">DROP</span></h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Physics Strategy Merging</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="glass px-6 py-3 rounded-2xl border-white/5 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">Record</p>
                <p className="text-xl font-black">{highScore.toLocaleString()}</p>
              </div>
            </div>
            <div className="glass px-6 py-3 rounded-2xl border-primary/20 bg-primary/5 flex items-center gap-3">
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none mb-1">Score</p>
                <p className="text-2xl font-black">{score.toLocaleString()}</p>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={handleReset} className="rounded-2xl h-14 w-14 border-white/10 hover:bg-white/5">
              <RefreshCcw className="w-6 h-6" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
          {/* Left Panel: Evolution */}
          <aside className="hidden lg:flex flex-col gap-6">
            <div className="glass p-6 rounded-3xl border-white/5">
               <h3 className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
                 <RefreshCcw className="w-4 h-4" />
                 Evolution Cycle
               </h3>
               <EvolutionGuide />
            </div>
          </aside>

          {/* Center: The Game Arena */}
          <main className="flex flex-col items-center gap-6">
            <div 
              className="relative glass rounded-[2rem] border-4 border-white/5 shadow-[0_0_100px_rgba(var(--primary),0.1)] overflow-hidden"
              style={{ width: ARENA_WIDTH, height: ARENA_HEIGHT }}
            >
              <MatterScene 
                key={gameKey}
                nextFruitIndex={nextFruitIndex}
                onFruitDropped={handleFruitDropped}
                onScoreUpdate={handleScoreUpdate}
                onBodiesUpdate={setCurrentBodies}
                suggestedX={suggestedX}
                onGameOver={handleReset}
              />
            </div>
          </main>

          {/* Right Panel: AI & Next Fruit */}
          <aside className="flex flex-col gap-6 w-full max-w-sm mx-auto">
            <div className="glass p-6 rounded-3xl border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Up Next</p>
               <div className="flex items-center gap-6">
                  <div 
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-inner border-2 border-white/10 animate-float"
                    style={{ 
                      backgroundColor: FRUIT_TIERS[nextFruitIndex].color + '20',
                      borderColor: FRUIT_TIERS[nextFruitIndex].color + '40'
                    }}
                  >
                    {FRUIT_TIERS[nextFruitIndex].label}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black capitalize">{FRUIT_TIERS[nextFruitIndex].type}</h4>
                    <p className="text-sm text-muted-foreground">Tier {FRUIT_TIERS[nextFruitIndex].tier + 1}</p>
                    <div className="mt-2 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-3 h-1.5 rounded-full ${i < FRUIT_TIERS[nextFruitIndex].tier ? 'bg-primary' : 'bg-white/10'}`} />
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            <AIAdvisor 
              onSuggestionReceived={setSuggestedX}
              gameState={{
                currentFruits: currentBodies,
                nextFruitType: FRUIT_TIERS[nextFruitIndex].type,
                arenaWidth: ARENA_WIDTH,
                availableDropXRange: arenaDropRange
              }}
            />

            <div className="glass p-6 rounded-3xl border-white/5 bg-secondary/5">
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit className="w-4 h-4 text-secondary" />
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">Tactical Tip</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dropping fruits near the walls can sometimes prevent them from rolling too fast. Use the AI Strategic Lens to find potential merge chains that you might have missed.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
