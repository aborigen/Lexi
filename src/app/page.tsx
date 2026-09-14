"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WordConnect } from '@/components/game/WordConnect';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { Leaderboard } from '@/components/game/Leaderboard';
import { StatsDialog } from '@/components/game/StatsDialog';
import { ScoreParticles, ScoreParticlesHandle } from '@/components/game/ScoreParticles';
import { Trophy, RefreshCcw, Gamepad2, Languages, ListOrdered, Sun, Moon, BarChart3, SkipForward, Save, Settings, Award } from 'lucide-react';
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
import { shuffleArray } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function WordConnectPage() {
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [activeLevels, setActiveLevels] = useState<WordLevel[]>([]);
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isScoreImpact, setIsScoreImpact] = useState(false);
  const [gameState, setGameState] = useState<{letters: string[], foundWords: string[], allValidWords: string[]}>({
    letters: [],
    foundWords: [],
    allValidWords: []
  });

  const scoreBadgeRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<ScoreParticlesHandle>(null);

  // Animated score counter effect
  useEffect(() => {
    if (displayScore === score) return;
    
    const diff = score - displayScore;
    const stepSize = 5; // Refined step size
    
    const timeout = setTimeout(() => {
      setDisplayScore(prev => {
        if (diff > 0) {
          return Math.min(prev + stepSize, score);
        } else {
          return Math.max(prev - stepSize, score);
        }
      });
    }, 20); // Faster interval for smoother flow at smaller steps

    return () => clearTimeout(timeout);
  }, [score, displayScore]);

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
        const savedScore = typeof window !== 'undefined' ? localStorage.getItem('lexi_high_score') : null;
        if (savedScore && !isNaN(parseInt(savedScore))) {
          setHighScore(parseInt(savedScore));
        }

        const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('app_theme') : 'light';
        setTheme((savedTheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark');

        await initYandexSDK();
        const envLang = getEnvironmentLanguage();
        setLang(envLang);
        
        const filtered = LEVELS.filter(lvl => lvl.lang === envLang);
        const base = filtered.length > 0 ? filtered : LEVELS.filter(lvl => lvl.lang === 'en');
        setActiveLevels(shuffleArray(base));

        await updatePlayerStats({ totalSessions: 1 });
        const stats = await fetchPlayerStats();
        if (stats) setPlayerStats(stats);
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

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      syncHighScoreToYandex(score);
      reportScoreToLeaderboard(score);
    }
  }, [score, highScore]);

  const handleReset = useCallback(() => {
    setScore(0);
    setDisplayScore(0);
    setLevelIndex(0);
    const filtered = LEVELS.filter(lvl => lvl.lang === lang);
    const base = filtered.length > 0 ? filtered : LEVELS.filter(lvl => lvl.lang === 'en');
    setActiveLevels(shuffleArray(base));
    toast({ title: t('reset', lang), description: "Game progress cleared and levels shuffled." });
  }, [lang]);

  const handleNextLevel = useCallback(() => {
    setLevelIndex(prev => prev + 1);
    toast({ title: t('next_level', lang) });
  }, [lang]);

  const handleSave = useCallback(async () => {
    await syncHighScoreToYandex(highScore);
    const stats = await fetchPlayerStats();
    if (stats) setPlayerStats(stats);
    toast({ title: "Progress Saved", description: "Your local progress has been recorded." });
  }, [highScore]);

  const handleLevelComplete = useCallback(() => {
    toast({ title: t('game_over_title', lang), description: t('game_over_desc', lang) });
    
    reportScoreToLeaderboard(score);
    updatePlayerStats({ levelsCleared: 1 });
    fetchPlayerStats().then(s => s && setPlayerStats(s));
    
    setTimeout(() => setLevelIndex(prev => prev + 1), 1500);
  }, [lang, score]);

  const handleScoreUpdate = useCallback((newScore: number, wordLength: number, pos: { x: number, y: number }) => {
    if (particlesRef.current && scoreBadgeRef.current) {
      const targetRect = scoreBadgeRef.current.getBoundingClientRect();
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;
      particlesRef.current.emit(pos.x, pos.y, targetX, targetY);

      setTimeout(() => {
        setIsScoreImpact(true);
        setTimeout(() => setIsScoreImpact(false), 500);
      }, 600);
    }

    setScore(prev => prev + newScore);
    updatePlayerStats({ totalWordsFound: 1, longestWord: wordLength });
  }, []);

  const handleHintUsed = useCallback((hint: string) => {
    updatePlayerStats({ hintsUsed: 1 });
  }, []);

  const handleStateUpdate = useCallback((letters: string[], foundWords: string[], allValidWords: string[]) => {
    setGameState({ letters, foundWords, allValidWords });
  }, []);

  const handleShowStats = useCallback(() => {
    setIsStatsOpen(true);
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ru' : 'en');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const currentLevel = activeLevels.length > 0 ? activeLevels[levelIndex % activeLevels.length] : null;

  return (
    <div className="h-screen w-full text-foreground overflow-hidden flex flex-col select-none relative">
      <ScoreParticles ref={particlesRef} />

      <div className="max-w-2xl landscape:max-w-5xl w-full mx-auto px-4 flex flex-col h-full overflow-hidden relative z-10">
        <header className="flex flex-row justify-between items-center h-16 shrink-0 z-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sunny-gradient rounded-xl flex items-center justify-center shadow-lg transform -rotate-12 border-2 border-white/50">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black italic tracking-tighter text-primary drop-shadow-sm hidden sm:block">LEXI.AI</span>
          </div>

          <div className="flex gap-2 items-center">
            <div className="hidden xs:flex items-center gap-2 glass px-3 py-1.5 rounded-2xl border-primary/20">
               <Award className="w-4 h-4 text-primary" />
               <span className="text-xs font-black tracking-tighter uppercase opacity-80">
                 {lang === 'ru' ? 'Ур' : 'Lvl'} {playerStats?.levelsCleared || 0}
               </span>
            </div>

            <div 
              ref={scoreBadgeRef}
              className={cn(
                "flex items-center gap-2 glass px-4 py-1.5 rounded-2xl border-primary/20 transition-all",
                isScoreImpact && "animate-score-pulse border-primary shadow-[0_0_20px_rgba(255,179,0,0.4)]"
              )}
            >
               <Trophy className="w-4 h-4 text-primary animate-pulse" />
               <span className="text-sm sm:text-base font-black tracking-tight min-w-[3ch] text-center">
                 {displayScore.toLocaleString()}
               </span>
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
                onClick={() => setIsLeaderboardOpen(true)} 
                className="rounded-xl w-9 h-9 glass border-none hover:bg-white/40"
                aria-label="Leaderboard"
              >
                <ListOrdered className="w-4 h-4 text-muted-foreground" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl w-9 h-9 glass border-none hover:bg-white/40"
                    aria-label="Settings"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-white/40 min-w-[160px] rounded-2xl">
                  <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-40">Preferences</DropdownMenuLabel>
                  <DropdownMenuItem onClick={toggleTheme} className="flex justify-between items-center py-2.5 rounded-xl cursor-pointer">
                    <span className="text-xs font-bold">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    {theme === 'light' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleLang} className="flex justify-between items-center py-2.5 rounded-xl cursor-pointer">
                    <span className="text-xs font-bold">{lang === 'en' ? 'Русский Язык' : 'English Language'}</span>
                    <Languages className="w-4 h-4 text-primary" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem onClick={handleReset} className="flex justify-between items-center py-2.5 rounded-xl cursor-pointer text-destructive">
                    <span className="text-xs font-bold">Reset Progress</span>
                    <RefreshCcw className="w-4 h-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNextLevel} 
                className="rounded-xl w-9 h-9 glass border-none hover:bg-white/40"
                aria-label="Next Level"
              >
                <SkipForward className="w-4 h-4 text-muted-foreground" />
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
      <StatsDialog 
        isOpen={isStatsOpen} 
        onOpenChange={setIsStatsOpen} 
        stats={playerStats} 
        lang={lang} 
      />
      <Toaster />
    </div>
  );
}
