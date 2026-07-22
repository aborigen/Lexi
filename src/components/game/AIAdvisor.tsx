"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, BrainCircuit } from 'lucide-react';
import { t } from '@/lib/translations';

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
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleGetSuggestion = async () => {
    if (isAnalyzing || !gameState.letters || gameState.letters.length === 0) return;
    
    setIsAnalyzing(true);
    setSuggestion(null);

    // Simulate "thinking" time for the advisor effect
    setTimeout(() => {
      const remaining = gameState.allValidWords.filter(w => !gameState.foundWords.includes(w));
      
      if (remaining.length === 0) {
        setSuggestion(t('hint_all_found', lang));
      } else {
        // Pick a random remaining word
        const randomWord = remaining[Math.floor(Math.random() * remaining.length)];
        
        // Provide a localized hint template replacement
        const template = t('hint_template', lang);
        const hintText = template
          .replace('{n}', randomWord.length.toString())
          .replace('{c}', randomWord[0].toUpperCase());
        
        setSuggestion(hintText);
        onSuggestionReceived(randomWord);
      }
      setIsAnalyzing(false);
    }, 800);
  };

  const isButtonDisabled = isAnalyzing || !gameState.letters || gameState.letters.length === 0;

  return (
    <div className="glass p-4 rounded-[1.5rem] border-white/60 bg-white/40 flex items-center gap-4 shadow-lg">
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
        {suggestion ? (
          <p className="text-xs font-bold text-foreground/80 leading-tight animate-in fade-in slide-in-from-left-4 duration-500 line-clamp-2">
            {suggestion}
          </p>
        ) : (
          <p className="text-xs font-medium text-muted-foreground/70 italic">
            {t('wait_ai', lang)}
          </p>
        )}
      </div>
    </div>
  );
}