"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, BrainCircuit } from 'lucide-react';
import { t } from '@/lib/translations';
import { getWordHint } from '@/ai/flows/strategic-column-suggestion';

interface AIAdvisorProps {
  gameState: {
    letters: string[];
    foundWords: string[];
    allValidWords: string[];
  };
  onSuggestionReceived: (hint: string) => void;
  lang?: string;
}

export function AIAdvisor({ gameState, onSuggestionReceived, lang = 'en' }: AIAdvisorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [citation, setCitation] = useState<string | null>(null);

  const handleGetSuggestion = async () => {
    if (isAnalyzing || !gameState.letters || gameState.letters.length === 0) return;
    
    setIsAnalyzing(true);
    setCitation(null);

    try {
      const result = await getWordHint({
        letters: gameState.letters,
        foundWords: gameState.foundWords,
        allValidWords: gameState.allValidWords,
        lang: lang
      });

      setCitation(result.citation);
      if (result.hintWord) {
        onSuggestionReceived(result.hintWord);
      }
    } catch (error) {
      console.error("Failed to fetch hint:", error);
      setCitation(t('ai_failed_desc', lang));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isButtonDisabled = isAnalyzing || !gameState.letters || gameState.letters.length === 0;

  return (
    <div className="glass p-4 rounded-[1.5rem] border-white/60 bg-white/40 flex flex-col md:flex-row items-center gap-4 shadow-lg min-h-[80px]">
      <Button 
        size="sm" 
        className="h-10 px-4 text-xs font-black sunny-gradient hover:opacity-90 text-white rounded-2xl shadow-[0_6px_15px_rgba(255,171,0,0.3)] shrink-0 border-b-4 border-black/10 active:border-b-0 active:translate-y-1 transition-all"
        onClick={handleGetSuggestion}
        disabled={isButtonDisabled}
      >
        {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
        {isAnalyzing ? t('analyzing', lang) : t('get_hint', lang)}
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
