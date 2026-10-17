"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WordConnect } from '@/components/game/WordConnect';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { LevelWordsDialog } from '@/components/game/LevelWordsDialog';
import { StatsDialog } from '@/components/game/StatsDialog';
import { LevelList } from '@/components/game/LevelList';
import { ScoreParticles, ScoreParticlesHandle } from '@/components/game/ScoreParticles';
import { Trophy, RefreshCcw, Gamepad2, Languages, Sun, Moon, BarChart3, SkipForward, Settings, Award, LayoutGrid, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { 
  initYandexSDK, 
  syncHighScoreToYandex, 
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function WordConnectPage() {
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [activeLevels, setActiveLevels] = useState<WordLevel[]>([]);
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isLevelListOpen, setIsLevelListOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isScoreImpact, setIsScoreImpact] = useState(false);
  const [gameState, setGameState] = useState<{letters: string[], foundWords: string[], allValidWords: string[]}>({
    letters: [],
    foundWords: [],
    allValidWords: []
  });

  const scoreBadgeRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<ScoreParticlesHandle>(null);

  useEffect(() => {
    if (displayScore === score) return;
    
    const diff = score - displayScore;
    const stepSize = Math.max(1, Math.floor(Math.abs(diff) / 10));
    
    const timeout = setTimeout(() => {
      setDisplayScore(prev => {
        if (diff > 0) return Math.min(prev + stepSize, score);
        return Math.max(prev - stepSize, score);
      });
    }, 20);

    return () => clearTimeout(timeout);
  }, [score, displayScore]);

  useEffect(() => {
    const init = async () => {
      try {
        const savedScore = typeof window !== 'undefined' ? localStorage.getItem('lexi_high_score') : null;
        if (savedScore) setHighScore(parseInt(savedScore));

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
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    if (typeof window !== 'undefined') localStorage.setItem('app_theme', theme);
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
    toast({ title: t('reset', lang), description: "Progress cleared and levels shuffled." });
  }, [lang]);

  const handleNextLevel = useCallback(() => {
    setLevelIndex(prev => prev + 1);
    setIsVictoryOpen(false);
  }, []);

  const handleSelectLevel = useCallback((index: number) => {
    setLevelIndex(index);
    setIsVictoryOpen(false);
  }, []);

  const handleLevelComplete = useCallback(() => {
    setIsVictoryOpen(true);
    if (particlesRef.current) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      for(let i = 0; i < 6; i++) {
        setTimeout(() => {
          particlesRef.current?.emit(centerX + (Math.random() - 0.5) * 200, centerY + (Math.random() - 0.5) * 200, centerX, -200);
        }, i * 120);
      }
    }
    reportScoreToLeaderboard(score);
    updatePlayerStats({ levelsCleared: 1 });
    fetchPlayerStats().then(s => s && setPlayerStats(s));
  }, [score]);

  const handleScoreUpdate = useCallback((newScore: number, wordLength: number, pos: { x: number, y: number }) => {
    if (particlesRef.current && scoreBadgeRef.current) {
      const targetRect = scoreBadgeRef.current.getBoundingClientRect();
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;
      particlesRef.current.emit(pos.x, pos.y, targetX, targetY);

      setTimeout(() => {
        setIsScoreImpact(true);
        setTimeout(() => setIsScoreImpact(false), 600);
      }, 500);
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

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ru' : 'en');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const currentLevel = activeLevels.length > 0 ? activeLevels[levelIndex % activeLevels.length] : null;

  return (
    <div className="h-screen w-full text-foreground overflow-hidden flex flex-col select-none relative">
      <ScoreParticles ref={particlesRef} />

      <div className="max-w-3xl landscape:max-w-6xl w-full mx-auto px-4 flex flex-col h-full overflow-hidden relative z-10">
        <header className="flex flex-row justify-between items-center h-20 shrink-0 z-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sunny-gradient rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-6 border-2 border-white/80 active:scale-95 transition-transform cursor-pointer">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black italic tracking-tighter text-primary drop-shadow-md hidden xs:block">LEXI.AI</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hidden sm:block">Word Connect</span>
            </div>
          </div>

          <div className="flex gap-2.5 items-center">
            <div className="hidden sm:flex items-center gap-2 glass px-4 py-2 rounded-2xl border-white/60">
               <Award className="w-4 h-4 text-primary" />
               <span className="text-xs font-black tracking-tight uppercase opacity-60">
                 {lang === 'ru' ? 'УРОВЕНЬ' : 'LEVEL'} {playerStats?.levelsCleared || 0}
               </span>
            </div>

            <div 
              ref={scoreBadgeRef}
              className={cn(
                "flex items-center gap-2.5 glass px-5 py-2 rounded-2xl border-white/60 transition-all duration-500",
                isScoreImpact && "animate-score-pulse border-primary shadow-[0_0_30px_rgba(245,158,11,0.4)]"
              )}
            >
               <Trophy className="w-5 h-5 text-primary animate-bounce" />
               <span className="text-base sm:text-xl font-black tracking-tighter min-w-[4ch] text-center">
                 {displayScore.toLocaleString()}
               </span>
            </div>
            
            <div className="flex gap-1.5">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsLevelListOpen(true)} 
                className="rounded-2xl w-10 h-10 glass border-white/60 hover:bg-white/50"
              >
                <LayoutGrid className="w-5 h-5 text-primary" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-2xl w-10 h-10 glass border-white/60 hover:bg-white/50"
                  >
                    <Settings className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-white/60 min-w-[200px] rounded-[2rem] p-2 shadow-2xl">
                  <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-40 px-4 py-2">Game Settings</DropdownMenuLabel>
                  <DropdownMenuItem onClick={toggleTheme} className="flex justify-between items-center py-3 px-4 rounded-2xl cursor-pointer hover:bg-white/30">
                    <span className="text-sm font-bold">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    {theme === 'light' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleLang} className="flex justify-between items-center py-3 px-4 rounded-2xl cursor-pointer hover:bg-white/30">
                    <span className="text-sm font-bold">{lang === 'en' ? 'Русский' : 'English'}</span>
                    <Languages className="w-5 h-5 text-primary" />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsStatsOpen(true)} className="flex justify-between items-center py-3 px-4 rounded-2xl cursor-pointer hover:bg-white/30">
                    <span className="text-sm font-bold">My Stats</span>
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10 my-2" />
                  <DropdownMenuItem onClick={handleReset} className="flex justify-between items-center py-3 px-4 rounded-2xl cursor-pointer text-destructive hover:bg-destructive/10">
                    <span className="text-sm font-bold">Reset Game</span>
                    <RefreshCcw className="w-5 h-5" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setLevelIndex(prev => prev + 1)} 
                className="rounded-2xl w-10 h-10 glass border-white/60 hover:bg-white/50 hidden xs:flex"
              >
                <SkipForward className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden mt-2">
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
              <RefreshCcw className="w-12 h-12 animate-spin text-primary opacity-20" />
            </div>
          )}
        </main>

        {currentLevel && (
          <div className="h-24 shrink-0 flex items-center justify-between px-6 relative z-[100]">
            <LevelWordsDialog 
              validWords={currentLevel.validWords}
              lang={lang}
            />
            <AIAdvisor 
              onSuggestionReceived={handleHintUsed}
              gameState={gameState}
              lang={lang}
              level={currentLevel}
            />
          </div>
        )}
      </div>

      <Dialog open={isVictoryOpen} onOpenChange={setIsVictoryOpen}>
        <DialogContent className="w-[94vw] max-w-[440px] rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 glass border-white/80 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-700 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 sunny-gradient" />
          
          <div className="relative mb-6 sm:mb-8 flex justify-center">
            <div className="p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] sunny-gradient border-4 sm:border-8 border-white/50 shadow-2xl transform -rotate-6 animate-float-y">
              <Trophy className="w-10 h-10 sm:w-16 sm:h-16 text-white drop-shadow-lg" />
            </div>
            <Sparkles className="absolute -top-3 -right-3 w-8 h-8 sm:w-12 sm:h-12 text-primary animate-pulse" />
          </div>

          <DialogHeader className="mb-6 sm:mb-8 items-center space-y-1">
            <DialogTitle className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter text-foreground leading-tight">
              {t('game_over_title', lang)}
            </DialogTitle>
            <div className="bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
              <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary">
                {lang === 'ru' ? 'УРОВЕНЬ ПРОЙДЕН' : 'LEVEL COMPLETED'}
              </span>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
            <div className="p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] bg-white/30 border border-white/50">
               <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-40 block mb-0.5">Score</span>
               <span className="text-xl sm:text-2xl font-black text-primary">{score.toLocaleString()}</span>
            </div>
            <div className="p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] bg-white/30 border border-white/50">
               <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-40 block mb-0.5">Found</span>
               <span className="text-xl sm:text-2xl font-black text-primary">{gameState.foundWords.length}</span>
            </div>
          </div>

          <Button 
            onClick={handleNextLevel}
            className="w-full h-14 sm:h-16 rounded-[1.5rem] sm:rounded-[2rem] sunny-gradient text-white text-base sm:text-lg font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl border-4 border-white/40 group"
          >
            {lang === 'ru' ? 'ДАЛЕЕ' : 'CONTINUE'}
            <SkipForward className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </DialogContent>
      </Dialog>

      <StatsDialog isOpen={isStatsOpen} onOpenChange={setIsStatsOpen} stats={playerStats} lang={lang} />
      <LevelList
        isOpen={isLevelListOpen}
        onOpenChange={setIsLevelListOpen}
        levels={activeLevels}
        currentIndex={levelIndex % activeLevels.length}
        onSelectLevel={handleSelectLevel}
        lang={lang}
      />
      <Toaster />
    </div>
  );
}
