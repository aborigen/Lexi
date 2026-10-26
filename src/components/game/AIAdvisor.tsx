"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { t } from '@/lib/translations';
import { WordLevel } from '@/lib/levels';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AIAdvisorProps {
  gameState: {
    letters: string[];
    foundWords: string[];
    allValidWords: string[];
  };
  onSuggestionReceived: (hint: string | null) => void;
  lang?: string;
  level: WordLevel;
  activeHint?: string | null;
}

export function AIAdvisor({ gameState, onSuggestionReceived, lang = 'en', level, activeHint }: AIAdvisorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetSuggestion = async () => {
    if (!gameState.letters || gameState.letters.length === 0 || !level) return;

    // Toggle off if already showing
    if (activeHint) {
      onSuggestionReceived(null);
      return;
    }

    // Check if level is already complete
    if (gameState.foundWords.length >= level.validWords.length) {
      onSuggestionReceived(t('hint_all_found', lang));
      return;
    }

    setIsLoading(true);
    // Simulate AI "thinking" for polish
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const targetWord = level.validWords[0];
      const staticHint = level.hints[targetWord];

      if (staticHint) {
        onSuggestionReceived(staticHint);
      } else {
        const placeholder = t('hint_template', lang)
          .replace('{n}', targetWord.length.toString())
          .replace('{c}', targetWord[0].toUpperCase());
        
        onSuggestionReceived(placeholder);
      }
    } catch (error) {
      console.error("Hint Error:", error);
      toast({
        title: t('ai_failed_title', lang),
        description: t('ai_failed_desc', lang),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !gameState.letters || gameState.letters.length === 0 || isLoading;
  const isHintActive = !!activeHint;

  return (
    <Button 
      size="icon" 
      className={cn(
        "w-14 h-14 rounded-full shadow-2xl transition-all group relative border-4",
        isHintActive 
          ? "bg-foreground text-background border-foreground/50 scale-110" 
          : "sunny-gradient border-white/80 active:scale-95"
      )}
      onClick={handleGetSuggestion}
      disabled={isButtonDisabled}
      title={isHintActive ? "Hide Hint" : t('get_hint', lang)}
    >
      {isLoading ? (
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      ) : (
        <BrainCircuit className={cn(
          "w-7 h-7 transition-transform",
          isHintActive ? "text-background" : "text-white group-hover:scale-110"
        )} />
      )}
    </Button>
  );
}
