
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { WordConnect } from '@/components/game/WordConnect';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { LEVELS } from '@/lib/game-constants';
import { Trophy, RefreshCcw, BrainCircuit, HelpCircle, Gamepad2, Languages, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-12">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-2 md:p-3 bg-primary/20 rounded-xl md:rounded-2xl border border-primary/30">
              <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase leading-none">LEXI<span className="text-primary">.AI</span></h1>
              <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Word Connect Puzzle</p>
            </div>
          </div>

          <div className="flex space-x-2 md:space-x-4 items-center">
            <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full hover:bg-white/10 h-10 w-10">
              <Languages className="w-5 h-5 text-muted-foreground" />
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
                  <p className="text-sm">{t('guide_draw', lang)}</p>
                  <p className="text-sm">{t('guide_find', lang)}</p>
                  <p className="text-sm">{t('guide_clear', lang)}</p>
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
            
            <Button variant="outline" size="icon" onClick={handleReset} className="rounded-xl h-10 w-10 border-white/10 hover:bg-white/5">
              <RefreshCcw className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_2fr_1fr] gap-6 items-center lg:items-start">
          <aside className="w-full">
            <div className="glass p-6 rounded-3xl">
               <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-widest">{t('found_words', lang)}</h3>
               <div className="flex flex-wrap gap-2">
                 {gameState.foundWords.map(word => (
                   <div key={word} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30">
                     {word}
                   </div>
                 ))}
               </div>
            </div>
          </aside>

          <main className="w-full flex justify-center">
            <WordConnect 
              levelIndex={levelIndex}
              onScoreUpdate={handleScoreUpdate}
              onLevelComplete={handleLevelComplete}
              onStateUpdate={handleStateUpdate}
              lang={lang}
            />
          </main>

          <aside className="w-full space-y-6">
            <AIAdvisor 
              onSuggestionReceived={() => {}}
              gameState={gameState}
              lang={lang}
            />
            <div className="glass p-6 rounded-3xl">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">PRO TIP</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Longer words yield significantly more points and help you finish levels faster!</p>
            </div>
          </aside>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
