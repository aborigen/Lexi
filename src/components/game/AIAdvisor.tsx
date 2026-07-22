"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import { t } from '@/lib/translations';
import { LEVELS } from '@/lib/levels';

interface AIAdvisorProps {
  gameState: {
    letters: string[];
    foundWords: string[];
    allValidWords: string[];
  };
  onSuggestionReceived: (hint: string) => void;
  lang?: string;
  levelIndex?: number;
}

export function AIAdvisor({ gameState, onSuggestionReceived, lang = 'en', levelIndex = 0 }: AIAdvisorProps) {
  const [citation, setCitation] = useState<string | null>(null);

  // Clear hint when gameState words change (e.g. word found)
  useEffect(() => {
    setCitation(null);
  }, [gameState.foundWords.length]);

  const handleGetSuggestion = () => {
    if (!gameState.letters || gameState.letters.length === 0) return;

    // Filter levels for the current language
    const filteredLevels = LEVELS.filter(lvl => lvl.lang === lang);
    const currentLevel = filteredLevels[levelIndex % filteredLevels.length];
    
    if (!currentLevel) return;

    // Find words not yet found
    const remaining = currentLevel.validWords.filter(w => !gameState.foundWords.includes(w));
    
    if (remaining.length === 0) {
      setCitation(t('hint_all_found', lang));
      return;
    }

    // Prioritize longer words for better hints
    const sorted = [...remaining].sort((a, b) => b.length - a.length);
    const targetWord = sorted[0];
    const hint = currentLevel.hints[targetWord];

    if (hint) {
      setCitation(hint);
    } else {
      // Fallback if hint is missing
      setCitation(t('hint_template', lang)
        .replace('{n}', targetWord.length.toString())
        .replace('{c}', targetWord[0])
      );
    }
  };

  const isButtonDisabled = !gameState.letters || gameState.letters.length === 0;

  return (
    <div className="glass p-4 rounded-[1.5rem] border-white/60 bg-white/40 flex flex-col md:flex-row items-center gap-4 shadow-lg min-h-[80px]">
      <Button 
        size="sm" 
        className="h-10 px-4 text-xs font-black sunny-gradient hover:opacity-90 text-white rounded-2xl shadow-[0_6px_15px_rgba(255,171,0,0.3)] shrink-0 border-b-4 border-black/10 active:border-b-0 active:translate-y-1 transition-all"
        onClick={handleGetSuggestion}
        disabled={isButtonDisabled}
      >
        <BrainCircuit className="w-4 h-4 mr-2" />
        {t('get_hint', lang)}
      </Button>
      
      <div className="flex-1 min-w-0">
        {citation ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
             <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-1">{t('strategy_identified', lang)}</p>
             <p className="text-xs font-bold text-foreground/80 leading-tight italic">
              "{citation}"
            </p>
          </div>
        ) : (
          <p className="text-xs font-medium text-muted-foreground/70 italic">
            {t('wait_ai', lang)}
          </p>
        )}
      </div>
    </div>
  );
}
