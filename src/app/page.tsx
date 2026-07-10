"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ColumnsGame } from '@/components/game/ColumnsGame';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { GRID_WIDTH, GRID_HEIGHT, GEM_TYPES } from '@/lib/game-constants';
import { Trophy, RefreshCcw, BrainCircuit, HelpCircle, Gamepad2, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { initYandexSDK, syncHighScoreToYandex, fetchHighScoreFromYandex, getEnvironmentLanguage } from '@/lib/yandex-sdk';
import { t } from '@/lib/translations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ColumnsPage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [isYandexReady, setIsYandexReady] = useState(false);
  const [lang, setLang] = useState('en');
  const [currentGameState, setCurrentGameState] = useState<{grid: (number|null)[][], stack: number[]}>({
    grid: [],
    stack: []
  });
  const [suggestedMove, setSuggestedMove] = useState<{col: number, cycle: number} | null>(null);

  // Initialize High Score and Yandex SDK
  useEffect(() => {
    const init = async () => {
      // Local fallback
      const saved = typeof window !== 'undefined' ? localStorage.getItem('columns_high_score') : null;
      if (saved) setHighScore(parseInt(saved));

      // Yandex SDK Init
      const sdk = await initYandexSDK();
      if (sdk) {
        setIsYandexReady(true);
        const envLang = getEnvironmentLanguage();
        setLang(envLang);
        const yandexHigh = await fetchHighScoreFromYandex();
        if (yandexHigh !== null && yandexHigh > (parseInt(saved || '0'))) {
          setHighScore(yandexHigh);
        }

        // Call LoadingAPI.ready() when the user can start playing
        if (sdk.features.LoadingAPI) {
          sdk.features.LoadingAPI.ready();
        }
      }
    };
    init();
  }, []);

  // Update high score locally and in cloud
  useEffect(() => {
    if (score > highScore) {
      const newHigh = score;
      setHighScore(newHigh);
      localStorage.setItem('columns_high_score', newHigh.toString());
      
      if (isYandexReady) {
        syncHighScoreToYandex(newHigh);
      }
    }
  }, [score, highScore, isYandexReady]);

  const handleReset = useCallback(() => {
    setScore(0);
    setSuggestedMove(null);
    setGameKey(prev => prev + 1);
  }, []);

  const handleGameOver = useCallback(() => {
    toast({ 
      title: t('game_over_title', lang), 
      description: t('game_over_desc', lang), 
      variant: "destructive" 
    });
    
    // Defer reset to avoid render-phase state updates
    setTimeout(() => handleReset(), 0);
  }, [handleReset, lang]);

  const handleStateUpdate = useCallback((grid: (number|null)[][], stack: number[]) => {
    setCurrentGameState({ grid, stack });
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(prev => prev + newScore);
  }, []);

  const handleSuggestionReceived = useCallback((col: number, cycle: number) => {
    setSuggestedMove({ col, cycle });
  }, []);

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ru' : 'en');
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-12">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-2 md:p-3 bg-primary/20 rounded-xl md:rounded-2xl border border-primary/30">
              <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase leading-none">COLUMNS<span className="text-primary">.AI</span></h1>
              <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Match-3 Tactical Grid</p>
            </div>
          </div>

          <div className="flex space-x-2 md:space-x-4 items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLang} 
              className="rounded-full hover:bg-white/10 h-10 w-10 flex flex-col items-center justify-center"
            >
              <Languages className="w-5 h-5 text-muted-foreground" />
              <span className="text-[8px] font-bold opacity-70 uppercase">{lang}</span>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 h-10 w-10">
                  <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="glass sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black italic">{t('tactical_guide', lang)}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4 py-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">←→</div>
                    <p className="text-sm">{t('guide_move', lang)}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">↑</div>
                    <p className="text-sm">{t('guide_cycle', lang)}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">3x</div>
                    <p className="text-sm">{t('guide_match', lang)}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="glass px-3 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl flex items-center space-x-2 md:space-x-3">
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
              <div>
                <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-0.5 md:mb-1">{t('high_score', lang)}</p>
                <p className="text-sm md:text-xl font-black">{highScore.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="glass px-3 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl bg-primary/5 border-primary/20 flex items-center">
              <div>
                <p className="text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-wider leading-none mb-0.5 md:mb-1">{t('score', lang)}</p>
                <p className="text-lg md:text-2xl font-black">{score.toLocaleString()}</p>
              </div>
            </div>
            
            <Button variant="outline" size="icon" onClick={handleReset} className="rounded-xl md:rounded-2xl h-10 w-10 md:h-14 md:w-14 border-white/10 hover:bg-white/5">
              <RefreshCcw className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </div>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr] gap-6 md:gap-12 items-center lg:items-start justify-center">
          <aside className="hidden md:flex flex-col space-y-6 w-full lg:w-auto">
            <div className="glass p-6 rounded-3xl">
               <h3 className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-widest">
                 {t('gem_rarity', lang)}
               </h3>
               <div className="flex flex-wrap gap-x-6 gap-y-4">
                 {GEM_TYPES.map(gem => (
                   <div key={gem.id} className="flex items-center gap-3">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-lg md:text-xl shadow-lg border-2 border-white/10" style={{ backgroundColor: gem.color }}>
                       {gem.label}
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{gem.score} pts</span>
                   </div>
                 ))}
               </div>
            </div>
          </aside>

          <main className="flex justify-center w-full">
            <ColumnsGame 
              key={gameKey}
              onScoreUpdate={handleScoreUpdate}
              onGameOver={handleGameOver}
              onStateUpdate={handleStateUpdate}
              suggestedMove={suggestedMove}
              lang={lang}
            />
          </main>

          <aside className="flex flex-col space-y-6 w-full max-w-sm">
            <AIAdvisor 
              onSuggestionReceived={handleSuggestionReceived}
              gameState={{
                grid: currentGameState.grid,
                currentStack: currentGameState.stack,
                gridWidth: GRID_WIDTH,
                gridHeight: GRID_HEIGHT
              }}
              lang={lang}
            />

            <div className="glass p-5 md:p-6 rounded-3xl bg-secondary/5 border-secondary/10 hidden sm:block">
              <div className="flex items-center space-x-2 mb-3">
                <BrainCircuit className="w-4 h-4 text-secondary" />
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">{t('strategy_pro_tip', lang)}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('pro_tip_content', lang)}
              </p>
            </div>
          </aside>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
