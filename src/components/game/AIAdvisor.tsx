"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import { t } from '@/lib/translations';
import { WordLevel } from '@/lib/levels';

interface AIAdvisorProps {
  gameState: {
    letters: string[];
    foundWords: string[];
    allValidWords: string[];
  };
  onSuggestionReceived: (hint: string) => void;
  lang?: string;
  level: WordLevel;
}

export function AIAdvisor({ gameState, onSuggestionReceived, lang = 'en', level }: AIAdvisorProps) {
  const [citation, setCitation] = useState<string | null>(null);

  useEffect(() => {
    setCitation(null);
  }, [gameState.foundWords.length, level]);

  const handleGetSuggestion = () => {
    if (!gameState.letters || gameState.letters.length === 0 || !level) return;

    const remaining = level.validWords.filter(w => !gameState.foundWords.includes(w));
    
    if (remaining.length === 0) {
      setCitation(t('hint_all_found', lang));
      return;
    }

    const sorted = [...remaining].sort((a, b) => b.length - a.length);
    const targetWord = sorted[0];
    const hint = level.hints[targetWord];

    if (hint) {
      setCitation(hint);
    } else {
      setCitation(t('hint_template', lang)
        .replace('{n}', targetWord.length.toString())
        .replace('{c}', targetWord[0])
      );
    }
  };

  const isButtonDisabled = !gameState.letters || gameState.letters.length === 0;

  return (
    <div className="glass p-3 rounded-xl border-white/60 bg-white/40 flex items-center gap-3 shadow-sm shrink-0">
      <Button 
        size="sm" 
        className="h-10 px-3 text-[11px] sm:text-xs font-black sunny-gradient hover:opacity-90 text-white rounded-lg shadow-sm shrink-0 border-b border-black/10 active:border-b-0 active:translate-y-0.5 transition-all"
        onClick={handleGetSuggestion}
        disabled={isButtonDisabled}
      >
        <BrainCircuit className="w-4 h-4 mr-1.5" />
        {t('get_hint', lang)}
      </Button>
      
      <div className="flex-1 min-w-0">
        {citation ? (
          <div className="animate-in fade-in slide-in-from-left-2 duration-400">
             <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-0.5">{t('strategy_identified', lang)}</p>
             <p className="text-xs sm:text-sm font-bold text-foreground/80 leading-snug italic line-clamp-2">
              "{citation}"
            </p>
          </div>
        ) : (
          <p className="text-xs font-medium text-muted-foreground/70 italic leading-tight">
            {t('wait_ai', lang)}
          </p>
        )}
      </div>
    </div>
  );
}
