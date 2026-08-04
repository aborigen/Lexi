"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { WordConnect } from '@/components/game/WordConnect';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { Leaderboard } from '@/components/game/Leaderboard';
import { Trophy, RefreshCcw, Gamepad2, Languages, ListOrdered, Sun, Moon, BarChart3 } from 'lucide-react';
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
  PlayerStats
} from '@/lib/yandex-sdk';
import { t } from '@/lib/translations';
import { LEVELS, WordLevel } from '@/lib/levels';

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

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

  // Initialization: Auto-detect language via Yandex SDK at launch
  useEffect(() => {
    const init = async () => {
      let sdkInstance = null;
      try {
        // Load local persistence
        const savedScore = typeof window !== 'undefined' ? localStorage.getItem('word_high_score') : null;
        if (savedScore && !isNaN(parseInt(savedScore))) {
          setHighScore(parseInt(savedScore));
        }

        const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('app_theme') : 'light';
        setTheme((savedTheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark');

        // SDK Bootstrap
        sdkInstance = await initYandexSDK();
        
        // Auto-detect language happens here, at launch
        const envLang = getEnvironmentLanguage();
        setLang(envLang);

        if (sdkInstance) {
          setIsYandexReady(true);
          
          // Sync high scores from cloud
          const yandexHigh = await fetchHighScoreFromYandex();
          if (yandexHigh !== null && yandexHigh > (parseInt(savedScore || '0'))) {
            setHighScore(yandexHigh);
            localStorage.setItem('word_high_score', yandexHigh.toString());
          }

          // Load stats
          const stats = await fetchPlayerStats();
          if (stats) setPlayerStats(stats);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        // Signal ready once environment detection and data sync is complete
        signalGameReady();
      }
    };
    init();
  }, []);

  // Update levels when language changes (initially or via manual switch)
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
    setActiveLevels(shuffleArray(base));
    toast({ title: t('reset', lang), description: "Game progress cleared." });
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
      description: `Words Found: ${playerStats.totalWordsFound}\nLevels Cleared: ${playerStats.levelsCleared}\nHints Used: ${playerStats.hintsUsed}`,
    });
  };

  const handleLevelComplete = useCallback(() => {
    toast({ title: t('game_over_title', lang), description: t('game_over_desc', lang) });
    
    if (isYandexReady) {
      reportScoreToLeaderboard(score);
      updatePlayerStats({ levelsCleared: 1 });
      fetchPlayerStats().then(s => s && setPlayerStats(s));
    }
    
    setTimeout(() => setLevelIndex(prev => prev + 1), 1500);
  }, [lang, isYandexReady, score]);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(prev => prev + newScore);
    if (isYandexReady) {
      updatePlayerStats({ totalWordsFound: 1 });
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

  const currentLevel = activeLevels[levelIndex % (activeLevels.length || 1)];

  return (
    <div className="h-screen w-full text-foreground overflow-hidden flex flex-col">
      <div className="max-w-xl w-full mx-auto px-4 flex flex-col h-full overflow-hidden">
        <header className="flex flex-row justify-between items-center py-2 shrink-0">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-black italic tracking-tighter uppercase leading-none">LEXI<span className="text-primary">.AI</span></h1>
          </div>

          <div className="flex gap-1.5 items-center">
            <div className="flex items-center gap-1 glass px-2 py-1 rounded-full border-primary/20">
               <Trophy className="w-3.5 h-3.5 text-primary" />
               <span className="text-xs font-black">{score.toLocaleString()}</span>
            </div>
            
            <div className="flex gap-0.5">
              <Button variant="ghost" size="icon" onClick={handleShowStats} className="rounded-full w-8 h-8">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShowLeaderboard} className="rounded-full w-8 h-8">
                <ListOrdered className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full w-8 h-8">
                {theme === 'light' ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full w-8 h-8">
                <Languages className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full w-8 h-8">
                <RefreshCcw className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col min-h-0 pb-4 overflow-hidden">
          {currentLevel && (
            <WordConnect 
              level={currentLevel}
              onScoreUpdate={handleScoreUpdate}
              onLevelComplete={handleLevelComplete}
              onStateUpdate={handleStateUpdate}
              lang={lang}
            />
          )}
          
          <div className="mt-auto pt-2 shrink-0">
            {currentLevel && (
              <AIAdvisor 
                onSuggestionReceived={handleHintUsed}
                gameState={gameState}
                lang={lang}
                level={currentLevel}
              />
            )}
          </div>
        </main>
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
