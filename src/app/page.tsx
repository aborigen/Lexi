"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { WordConnect } from '@/components/game/WordConnect';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { Leaderboard } from '@/components/game/Leaderboard';
import { Trophy, RefreshCcw, Gamepad2, Languages, ListOrdered, Sun, Moon, BarChart3, Star, Save } from 'lucide-react';
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
  updatePlayerStats,
  fetchPlayerStats,
  PlayerStats,
  requestReview,
  createShortcut
} from '@/lib/yandex-sdk';
import { t } from '@/lib/translations';
import { LEVELS, WordLevel } from '@/lib/levels';
import { shuffleArray } from '@/lib/utils';

export default function WordConnectPage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [activeLevels, setActiveLevels] = useState<WordLevel[]>([]);
  const [isYandexReady, setIsYandexReady] = useState(false);
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [gameState, setGameState] = useState<{letters: string[], foundWords: string[], allValidWords: string[]}>({
    letters: [],
    foundWords: [],
    allValidWords: []
  });

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const savedScore = typeof window !== 'undefined' ? localStorage.getItem('word_high_score') : null;
        if (savedScore && !isNaN(parseInt(savedScore))) {
          setHighScore(parseInt(savedScore));
        }

        const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('app_theme') : 'light';
        setTheme((savedTheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark');

        const sdkInstance = await initYandexSDK();
        
        const envLang = getEnvironmentLanguage();
        setLang(envLang);
        
        const filtered = LEVELS.filter(lvl => lvl.lang === envLang);
        const base = filtered.length > 0 ? filtered : LEVELS.filter(lvl => lvl.lang === 'en');
        setActiveLevels(shuffleArray(base));

        if (sdkInstance) {
          setIsYandexReady(true);
          
          const yandexHigh = await fetchHighScoreFromYandex();
          if (yandexHigh !== null && yandexHigh > (parseInt(savedScore || '0'))) {
            setHighScore(yandexHigh);
            localStorage.setItem('word_high_score', yandexHigh.toString());
          }

          await updatePlayerStats({ totalSessions: 1 });
          const stats = await fetchPlayerStats();
          if (stats) setPlayerStats(stats);

          if (Math.random() > 0.7) {
            createShortcut();
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        signalGameReady();
      }
    };
    init();
  }, []);

  useEffect(() => {
    const filtered = LEVELS.filter(lvl => lvl.lang === lang);
    const base = filtered.length > 0 ? filtered : LEVELS.filter(lvl => lvl.lang === 'en');
    setActiveLevels(shuffleArray(base));
    setLevelIndex(0);
  }, [lang]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_theme', theme);
    }
  }, [theme]);

  // Reactive high score sync
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      if (typeof window !== 'undefined') {
        localStorage.setItem('word_high_score', score.toString());
      }
      if (isYandexReady) {
        syncHighScoreToYandex(score);
        reportScoreToLeaderboard(score);
      }
    }
  }, [score, highScore, isYandexReady]);

  const handleReset = useCallback(() => {
    setScore(0);
    setLevelIndex(0);
    const filtered = LEVELS.filter(lvl => lvl.lang === lang);
    const base = filtered.length > 0 ? filtered : LEVELS.filter(lvl => lvl.lang === 'en');
    setActiveLevels(shuffleArray(base));
    toast({ title: t('reset', lang), description: "Game progress cleared and levels shuffled." });
  }, [lang]);

  const handleSave = useCallback(async () => {
    if (!isYandexReady) {
      toast({ title: "Offline", description: "Progress saved locally. Cloud sync requires connection." });
      return;
    }
    
    try {
      await syncHighScoreToYandex(highScore);
      await reportScoreToLeaderboard(highScore);
      const stats = await fetchPlayerStats();
      if (stats) setPlayerStats(stats);
      toast({ title: "Progress Saved", description: "Your high score and stats are synced to Yandex Cloud." });
    } catch (e) {
      toast({ title: "Sync Failed", description: "Could not sync to cloud. Try again later.", variant: "destructive" });
    }
  }, [highScore, isYandexReady]);

  const handleShowLeaderboard = () => {
    if (!isYandexReady) {
      toast({ title: "SDK Error", description: "Yandex Games SDK is not initialized." });
      return;
    }
    setIsLeaderboardOpen(true);
  };

  const handleShowStats = () => {
    if (!playerStats) {
      toast({ title: "No Data", description: "Statistics are not yet available." });
      return;
    }
    toast({
      title: t('player_stats', lang),
      description: `Words Found: ${playerStats.totalWordsFound}\nLevels Cleared: ${playerStats.levelsCleared}\nHints Used: ${playerStats.hintsUsed}\nSessions: ${playerStats.totalSessions}\nLongest Word: ${playerStats.longestWord}`,
    });
  };

  const handleLevelComplete = useCallback(() => {
    toast({ title: t('game_over_title', lang), description: t('game_over_desc', lang) });
    
    if (isYandexReady) {
      reportScoreToLeaderboard(score);
      updatePlayerStats({ levelsCleared: 1 });
      fetchPlayerStats().then(s => s && setPlayerStats(s));

      if ((levelIndex + 1) % 3 === 0) {
        requestReview();
      }
    }
    
    setTimeout(() => setLevelIndex(prev => prev + 1), 1500);
  }, [lang, isYandexReady, score, levelIndex]);

  const handleScoreUpdate = useCallback((newScore: number, wordLength: number) => {
    setScore(prev => {
      const updated = prev + newScore;
      if (updated > highScore) {
        setHighScore(updated);
        localStorage.setItem('word_high_score', updated.toString());
        if (isYandexReady) {
          syncHighScoreToYandex(updated);
          reportScoreToLeaderboard(updated);
        }
      }
      return updated;
    });

    if (isYandexReady) {
      updatePlayerStats({ totalWordsFound: 1, longestWord: wordLength });
    }
  }, [isYandexReady, highScore]);

  const handleHintUsed = useCallback(() => {
    if (isYandexReady) {
      updatePlayerStats({ hintsUsed: 1 });
    }
  }, [isYandexReady]);

  const handleStateUpdate = useCallback((letters: string[], foundWords: string[], allValidWords: string[]) => {
    setGameState({ letters, foundWords, allValidWords });
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ru' : 'en');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const currentLevel = activeLevels.length > 0 ? activeLevels[levelIndex % activeLevels.length] : null;

  return (
    <div className="h-screen w-full text-foreground overflow-hidden flex flex-col select-none relative">
      <div className="max-w-2xl landscape:max-w-5xl w-full mx-auto px-4 flex flex-col h-full overflow-hidden relative z-10">
        <header className="flex flex-row justify-between items-center h-16 shrink-0 z-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sunny-gradient rounded-xl flex items-center justify-center shadow-lg transform -rotate-12 border-2 border-white/50">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black italic tracking-tighter text-primary drop-shadow-sm hidden sm:block">LEXI.AI</span>
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 glass px-4 py-1.5 rounded-2xl border-primary/20">
               <Trophy className="w-4 h-4 text-primary animate-pulse" />
               <span className="text-sm sm:text-base font-black tracking-tight">{score.toLocaleString()}</span>
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSave} 
                className="rounded-xl w-9 h-9 glass border-none hover:bg-white/40"
                aria-label="Save Progress"
              >
                <Save className="w-4 h-4 text-primary" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleShowStats} 
                className="rounded-xl w-9 h-9 glass border-none hover:bg-white/40"
                aria-label="Player Statistics"
              >
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleShowLeaderboard} 
                className="rounded-xl w-9 h-9 glass border-none hover:bg-white/40"
                aria-label="Leaderboard"
              >
                <ListOrdered className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="rounded-xl w-9 h-9 glass border-none hover:bg-white/40"
                aria-label={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {theme === 'light' ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleLang} 
                className="rounded-xl w-9 h-9 glass border-none hover:bg-white/40"
                aria-label="Toggle Language"
              >
                <Languages className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleReset} 
                className="rounded-xl w-9 h-9 glass border-none hover:bg-white/40"
                aria-label="Reset Progress"
              >
                <RefreshCcw className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {currentLevel ? (
            <WordConnect 
              level={currentLevel}
              onScoreUpdate={handleScoreUpdate}
              onLevelComplete={handleLevelComplete}
              onStateUpdate={handleStateUpdate}
              lang={lang}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <RefreshCcw className="w-10 h-10 animate-spin text-primary opacity-30" />
            </div>
          )}
        </main>

        {currentLevel && (
          <div className="absolute bottom-6 right-6 z-[100] animate-float">
            <AIAdvisor 
              onSuggestionReceived={handleHintUsed}
              gameState={gameState}
              lang={lang}
              level={currentLevel}
            />
          </div>
        )}
      </div>

      <Leaderboard 
        isOpen={isLeaderboardOpen} 
        onOpenChange={setIsLeaderboardOpen} 
        lang={lang} 
      />
      <Toaster />
    </div>
  );
}
