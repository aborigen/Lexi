"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { WordConnect } from '@/components/game/WordConnect';
import { AIAdvisor } from '@/components/game/AIAdvisor';
import { Trophy, RefreshCcw, Gamepad2, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { 
  initYandexSDK, 
  syncHighScoreToYandex, 
  fetchHighScoreFromYandex, 
  getEnvironmentLanguage, 
  signalGameReady,
  reportScoreToLeaderboard 
} from '@/lib/yandex-sdk';
import { t } from '@/lib/translations';

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

        signalGameReady();
      }
    };
    init();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    // Reset level progression when language changes to ensure valid content
    setLevelIndex(0);
  }, [lang]);

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
      <div className="max-w-xl w-full mx-auto px-4 py-2 flex flex-col flex-1 min-h-0">
        <header className="flex flex-row justify-between items-center py-4 shrink-0">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">LEXI<span className="text-primary">.AI</span></h1>
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-1.5 glass px-3 py-1 rounded-full border-primary/20">
               <Trophy className="w-3.5 h-3.5 text-primary" />
               <span className="text-sm font-black">{score.toLocaleString()}</span>
            </div>
            
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full h-8 w-8">
                <Languages className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full h-8 w-8">
                <RefreshCcw className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col min-h-0 gap-4 pb-4">
          <WordConnect 
            levelIndex={levelIndex}
            onScoreUpdate={handleScoreUpdate}
            onLevelComplete={handleLevelComplete}
            onStateUpdate={handleStateUpdate}
            lang={lang}
          />
          
          <div className="shrink-0 flex flex-col gap-3">
            <AIAdvisor 
              onSuggestionReceived={() => {}}
              gameState={gameState}
              lang={lang}
            />
            
            <div className="flex gap-2 overflow-x-auto custom-scrollbar py-2 px-1">
              {gameState.foundWords.map(word => (
                <div key={word} className="shrink-0 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20 animate-in zoom-in-50 duration-300">
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
