"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { WordConnect } from '@/components/game/WordConnect';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { Trophy, RefreshCcw, Gamepad2, Languages, ListOrdered, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { 
  initYandexSDK, 
  syncHighScoreToYandex, 
  fetchHighScoreFromYandex, 
  getEnvironmentLanguage, 
  signalGameReady,
  reportScoreToLeaderboard,
  fetchLeaderboardEntries 
} from '@/lib/yandex-sdk';
import { t } from '@/lib/translations';

export default function WordConnectPage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [isYandexReady, setIsYandexReady] = useState(false);
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [gameState, setGameState] = useState<{letters: string[], foundWords: string[], allValidWords: string[]}>({
    letters: [],
    foundWords: [],
    allValidWords: []
  });

  useEffect(() => {
    const init = async () => {
      // Local storage high score
      const savedScore = typeof window !== 'undefined' ? localStorage.getItem('word_high_score') : null;
      if (savedScore) setHighScore(parseInt(savedScore));

      // Local storage theme
      const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('app_theme') : 'light';
      setTheme(savedTheme as 'light' | 'dark');

      const sdk = await initYandexSDK();
      if (sdk) {
        setIsYandexReady(true);
        const envLang = getEnvironmentLanguage();
        setLang(envLang);

        const yandexHigh = await fetchHighScoreFromYandex();
        if (yandexHigh !== null && yandexHigh > (parseInt(savedScore || '0'))) {
          setHighScore(yandexHigh);
        }

        signalGameReady();
      }
    };
    init();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    setLevelIndex(0);
  }, [lang]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('word_high_score', score.toString());
      if (isYandexReady) {
        syncHighScoreToYandex(score);
        reportScoreToLeaderboard(score);
      }
    }
  }, [score, highScore, isYandexReady]);

  const handleReset = useCallback(() => {
    setScore(0);
    setLevelIndex(0);
  }, []);

  const handleShowLeaderboard = async () => {
    if (!isYandexReady) {
      toast({ title: "SDK Error", description: "Yandex Games SDK is not ready." });
      return;
    }
    
    const entries = await fetchLeaderboardEntries();
    if (entries) {
      toast({ 
        title: t('show_leaderboard', lang), 
        description: "Checking worldwide rankings... Open Yandex Games console to see the full list.",
      });
    }
  };

  const handleLevelComplete = useCallback(() => {
    toast({ 
      title: t('game_over_title', lang), 
      description: t('game_over_desc', lang),
    });
    
    if (isYandexReady) {
      reportScoreToLeaderboard(score);
    }
    
    setTimeout(() => setLevelIndex(prev => prev + 1), 1500);
  }, [lang, isYandexReady, score]);

  const handleStateUpdate = useCallback((letters: string[], foundWords: string[], allValidWords: string[]) => {
    setGameState({ letters, foundWords, allValidWords });
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(prev => prev + newScore);
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ru' : 'en');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="h-screen w-full text-foreground overflow-hidden flex flex-col">
      <div className="max-w-xl w-full mx-auto px-4 flex flex-col flex-1 min-h-0">
        <header className="flex flex-row justify-between items-center py-2 shrink-0">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-black italic tracking-tighter uppercase leading-none">LEXI<span className="text-primary">.AI</span></h1>
          </div>

          <div className="flex gap-1.5 items-center">
            <div className="flex items-center gap-1 glass px-2.5 py-1 rounded-full border-primary/20">
               <Trophy className="w-3 h-3 text-primary" />
               <span className="text-xs font-black">{score.toLocaleString()}</span>
            </div>
            
            <div className="flex gap-0.5">
              <Button variant="ghost" size="icon" onClick={handleShowLeaderboard} className="rounded-full h-7 w-7">
                <ListOrdered className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-7 w-7">
                {theme === 'light' ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full h-7 w-7">
                <Languages className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full h-7 w-7">
                <RefreshCcw className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col min-h-0 gap-2 pb-2">
          <WordConnect 
            levelIndex={levelIndex}
            onScoreUpdate={handleScoreUpdate}
            onLevelComplete={handleLevelComplete}
            onStateUpdate={handleStateUpdate}
            lang={lang}
          />
          
          <div className="shrink-0 flex flex-col gap-2">
            <AIAdvisor 
              onSuggestionReceived={() => {}}
              gameState={gameState}
              lang={lang}
              levelIndex={levelIndex}
            />
            
            <div className="flex gap-1.5 overflow-x-auto custom-scrollbar py-1 px-1 min-h-[32px]">
              {gameState.foundWords.map(word => (
                <div key={word} className="shrink-0 bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-primary/20 animate-in zoom-in-50 duration-300">
                  {word}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
