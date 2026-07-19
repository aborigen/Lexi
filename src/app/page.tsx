
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { WordConnect } from '@/components/game/WordConnect';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { Trophy, RefreshCcw, HelpCircle, Gamepad2, Languages } from 'lucide-react';
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
    <div className="h-screen w-full bg-background text-foreground overflow-hidden flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-4 py-2 flex flex-col flex-1 min-h-0">
        <header className="flex flex-row justify-between items-center py-2 md:py-4 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary/20 rounded-lg border border-primary/30">
              <Gamepad2 className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter italic uppercase leading-none">LEXI<span className="text-primary">.AI</span></h1>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Word Puzzle</p>
            </div>
          </div>

          <div className="flex gap-2 md:gap-4 items-center">
            <div className="flex gap-1 md:gap-2">
              <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full hover:bg-white/10 h-9 w-9">
                <Languages className="w-4 h-4 text-muted-foreground" />
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 h-9 w-9">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
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

            <div className="glass px-3 py-1.5 rounded-xl flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-secondary" />
              <div className="hidden xs:block">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-0.5">{t('high_score', lang)}</p>
                <p className="text-sm font-black">{highScore.toLocaleString()}</p>
              </div>
              <p className="xs:hidden text-sm font-black">{highScore.toLocaleString()}</p>
            </div>
            
            <div className="glass px-3 py-1.5 rounded-xl bg-primary/5 border-primary/20 flex items-center">
              <div>
                <p className="text-[8px] font-bold text-primary uppercase tracking-wider leading-none mb-0.5">{t('score', lang)}</p>
                <p className="text-sm font-black">{score.toLocaleString()}</p>
              </div>
            </div>
            
            <Button variant="outline" size="icon" onClick={handleReset} className="rounded-xl h-9 w-9 border-white/10 hover:bg-white/5">
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-[1fr_2fr_1fr] gap-4 md:gap-6 pb-4">
          {/* Left Column: Found Words */}
          <aside className="order-2 md:order-1 lg:order-1 flex flex-col min-h-0 max-h-[30vh] md:max-h-none">
            <div className="glass p-3 md:p-5 rounded-2xl flex flex-col flex-1 min-h-0">
               <h3 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest shrink-0">{t('found_words', lang)}</h3>
               <div className="flex flex-wrap gap-2 overflow-y-auto custom-scrollbar flex-1 pr-2">
                 {gameState.foundWords.length > 0 ? (
                   gameState.foundWords.map(word => (
                     <div key={word} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20 animate-in zoom-in-50 duration-300">
                       {word}
                     </div>
                   ))
                 ) : (
                   <p className="text-[10px] text-muted-foreground italic">No words found yet...</p>
                 )}
               </div>
            </div>
          </aside>

          {/* Center Column: Primary Game */}
          <main className="order-1 md:col-span-1 lg:col-span-1 md:order-2 lg:order-2 flex flex-col items-center justify-center min-h-0">
            <WordConnect 
              levelIndex={levelIndex}
              onScoreUpdate={handleScoreUpdate}
              onLevelComplete={handleLevelComplete}
              onStateUpdate={handleStateUpdate}
              lang={lang}
            />
          </main>

          {/* Right Column: AI Advisor */}
          <aside className="order-3 md:col-span-2 lg:col-span-1 md:order-3 lg:order-3 flex flex-col min-h-0">
            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
              <AIAdvisor 
                onSuggestionReceived={() => {}}
                gameState={gameState}
                lang={lang}
              />
              <div className="glass p-5 rounded-2xl border-secondary/20 bg-secondary/5 hidden lg:block">
                <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">PRO TIP</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Longer words yield significantly more points and help you finish levels faster!</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
