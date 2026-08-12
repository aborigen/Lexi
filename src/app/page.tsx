"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { WordConnect } from '@/components/game/WordConnect';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { Leaderboard } from '@/components/game/Leaderboard';
import { Trophy, RefreshCcw, Gamepad2, Languages, ListOrdered, Sun, Moon, BarChart3, Star } from 'lucide-react';
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
        
        // Explicitly load and shuffle levels for the initial language
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

  // When language is toggled, reshuffle levels
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
    setActiveLevels(shuffleArray(base)); // Shuffling levels on reset
    toast({ title: t('reset', lang), description: "Game progress cleared and levels shuffled." });
  }, [lang]);

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
    setScore(prev => prev + newScore);
    if (isYandexReady) {
      updatePlayerStats({ totalWordsFound: 1, longestWord: wordLength });
    }
  }, [isYandexReady]);

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
        <header className="flex flex-row justify-between items-center h-12 shrink-0 z-50">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
          </div>

          <div className="flex gap-1 items-center">
            <div className="flex items-center gap-1 glass px-2 py-0.5 rounded-full border-primary/20">
               <Trophy className="w-3 h-3 text-primary" />
               <span className="text-[10px] sm:text-xs font-black">{score.toLocaleString()}</span>
            </div>
            
            <div className="flex gap-0.5">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => requestReview()} 
                className="rounded-full w-7 h-7"
                aria-label="Rate Game"
              >
                <Star className="w-3.5 h-3.5 text-primary" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleShowStats} 
                className="rounded-full w-7 h-7"
                aria-label="Player Statistics"
              >
                <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleShowLeaderboard} 
                className="rounded-full w-7 h-7"
                aria-label="Leaderboard"
              >
                <ListOrdered className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="rounded-full w-7 h-7"
                aria-label={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-muted-foreground" /> : <Sun className="w-3.5 h-3.5 text-muted-foreground" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleLang} 
                className="rounded-full w-7 h-7"
                aria-label="Toggle Language"
              >
                <Languages className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleReset} 
                className="rounded-full w-7 h-7"
                aria-label="Reset Progress"
              >
                <RefreshCcw className="w-3.5 h-3.5 text-muted-foreground" />
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
              <RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" />
            </div>
          )}
        </main>

        {currentLevel && (
          <div className="absolute bottom-4 right-4 z-[100]">
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
