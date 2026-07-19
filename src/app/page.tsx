
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { WordConnect } from '@/components/game/WordConnect';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { LEVELS } from '@/lib/levels';
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

export default function WordConnectPage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [isYandexReady, setIsYandexReady] = useState(false);
  const [lang, setLang] = useState('en');
  const [gameState, setGameState] = useState<{letters: string[], foundWords: string[], allValidWords: string[]}>({
    letters: [],
    foundWords: [],
    allValidWords: []
  });

  useEffect(() => {
    const init = async () => {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('word_high_score') : null;
      if (saved) setHighScore(parseInt(saved));

      const sdk = await initYandexSDK();
      if (sdk) {
        setIsYandexReady(true);
        const envLang = getEnvironmentLanguage();
        setLang(envLang);
        const yandexHigh = await fetchHighScoreFromYandex();
        if (yandexHigh !== null && yandexHigh > (parseInt(saved || '0'))) {
          setHighScore(yandexHigh);
        }
        if (sdk.features.LoadingAPI) sdk.features.LoadingAPI.ready();
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('word_high_score', score.toString());
      if (isYandexReady) syncHighScoreToYandex(score);
    }
  }, [score, highScore, isYandexReady]);

  const handleReset = useCallback(() => {
    setScore(0);
    setLevelIndex(0);
  }, []);

  const handleLevelComplete = useCallback(() => {
    toast({ 
      title: t('game_over_title', lang), 
      description: t('game_over_desc', lang),
    });
    setTimeout(() => setLevelIndex(prev => prev + 1), 1500);
  }, [lang]);

  const handleStateUpdate = useCallback((letters: string[], foundWords: string[], allValidWords: string[]) => {
    setGameState({ letters, foundWords, allValidWords });
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(prev => prev + newScore);
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ru' : 'en');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white pb-6 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-6 lg:py-8">
        <header className="flex flex-row justify-between items-center mb-4 md:mb-8 lg:mb-10">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-1.5 md:p-2 bg-primary/20 rounded-lg md:rounded-xl border border-primary/30">
              <Gamepad2 className="w-4 h-4 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-black tracking-tighter italic uppercase leading-none">LEXI<span className="text-primary">.AI</span></h1>
              <p className="text-[6px] md:text-[8px] lg:text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Word Puzzle</p>
            </div>
          </div>

          <div className="flex gap-2 md:gap-4 items-center">
            <div className="flex gap-1 md:gap-2">
              <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full hover:bg-white/10 h-8 w-8 md:h-10 md:w-10">
                <Languages className="w-3.5 h-3.5 md:w-5 md:h-5 text-muted-foreground" />
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 h-8 w-8 md:h-10 md:w-10">
                    <HelpCircle className="w-3.5 h-3.5 md:w-5 md:h-5 text-muted-foreground" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl md:text-2xl font-black italic">{t('tactical_guide', lang)}</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col space-y-4 py-4">
                    <p className="text-sm">{t('guide_draw', lang)}</p>
                    <p className="text-sm">{t('guide_find', lang)}</p>
                    <p className="text-sm">{t('guide_clear', lang)}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="glass px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl flex items-center space-x-1.5 md:space-x-2">
              <Trophy className="w-3 h-3 md:w-4 md:h-4 text-secondary" />
              <div>
                <p className="text-[6px] md:text-[8px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-0.5">{t('high_score', lang)}</p>
                <p className="text-[10px] md:text-base lg:text-lg font-black">{highScore.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="glass px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl bg-primary/5 border-primary/20 flex items-center">
              <div>
                <p className="text-[6px] md:text-[8px] font-bold text-primary uppercase tracking-wider leading-none mb-0.5">{t('score', lang)}</p>
                <p className="text-xs md:text-lg lg:text-xl font-black">{score.toLocaleString()}</p>
              </div>
            </div>
            
            <Button variant="outline" size="icon" onClick={handleReset} className="rounded-lg md:rounded-xl h-8 w-8 md:h-10 md:w-10 border-white/10 hover:bg-white/5">
              <RefreshCcw className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </Button>
          </div>
        </header>

        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-[1fr_2fr_1fr] gap-4 md:gap-6 lg:gap-8 items-start">
          {/* Left Column: Found Words */}
          <aside className="order-2 md:order-1 lg:order-1 w-full space-y-4">
            <div className="glass p-3 md:p-5 rounded-xl md:rounded-2xl">
               <h3 className="text-[9px] md:text-[10px] font-bold text-muted-foreground mb-2 md:mb-3 uppercase tracking-widest">{t('found_words', lang)}</h3>
               <div className="flex flex-wrap gap-1 md:gap-2 max-h-[100px] md:max-h-none overflow-y-auto custom-scrollbar">
                 {gameState.foundWords.length > 0 ? (
                   gameState.foundWords.map(word => (
                     <div key={word} className="bg-primary/10 text-primary px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                       {word}
                     </div>
                   ))
                 ) : (
                   <p className="text-[9px] text-muted-foreground italic">No words found yet...</p>
                 )}
               </div>
            </div>
            <div className="hidden lg:block glass p-4 md:p-6 rounded-2xl border-secondary/20 bg-secondary/5">
              <h3 className="text-[9px] md:text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">PRO TIP</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">Longer words yield significantly more points and help you finish levels faster!</p>
            </div>
          </aside>

          {/* Center Column: Primary Game */}
          <main className="order-1 md:col-span-1 lg:col-span-1 md:order-2 lg:order-2 flex flex-col items-center w-full">
            <WordConnect 
              levelIndex={levelIndex}
              onScoreUpdate={handleScoreUpdate}
              onLevelComplete={handleLevelComplete}
              onStateUpdate={handleStateUpdate}
              lang={lang}
            />
          </main>

          {/* Right Column: AI Advisor */}
          <aside className="order-3 md:col-span-2 lg:col-span-1 md:order-3 lg:order-3 w-full">
            <AIAdvisor 
              onSuggestionReceived={() => {}}
              gameState={gameState}
              lang={lang}
            />
            {/* Mobile/Tablet Pro Tip version */}
            <div className="lg:hidden mt-4 glass p-3 md:p-4 rounded-xl border-secondary/20 bg-secondary/5">
              <p className="text-[9px] md:text-[10px] text-muted-foreground text-center">Longer words yield significantly more points!</p>
            </div>
          </aside>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
