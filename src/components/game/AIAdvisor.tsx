"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Sparkles, Loader2 } from 'lucide-react';
import { t } from '@/lib/translations';
import { WordLevel } from '@/lib/levels';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

/**
 * AIAdvisor Component
 * FAB (Floating Action Button) implementation for maximum screen space.
 */
export function AIAdvisor({ gameState, onSuggestionReceived, lang = 'en', level }: AIAdvisorProps) {
  const [citation, setCitation] = useState<string | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCitation(null);
  }, [gameState.foundWords.length, level]);

  const handleGetSuggestion = async () => {
    if (!gameState.letters || gameState.letters.length === 0 || !level) return;

    const remaining = level.validWords.filter(w => !gameState.foundWords.includes(w));
    
    if (remaining.length === 0) {
      setCitation(t('hint_all_found', lang));
      setIsOverlayOpen(true);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const sorted = [...remaining].sort((a, b) => b.length - a.length);
      const targetWord = sorted[0];
      const staticHint = level.hints[targetWord];

      if (staticHint) {
        setCitation(staticHint);
        setIsOverlayOpen(true);
        onSuggestionReceived(staticHint);
      } else {
        const placeholder = t('hint_template', lang)
          .replace('{n}', targetWord.length.toString())
          .replace('{c}', targetWord[0].toUpperCase());
        
        setCitation(placeholder);
        setIsOverlayOpen(true);
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

  return (
    <>
      <Button 
        size="icon" 
        className="w-14 h-14 rounded-full shadow-2xl sunny-gradient border-4 border-white/80 active:scale-95 transition-all group relative"
        onClick={handleGetSuggestion}
        disabled={isButtonDisabled}
        title={t('get_hint', lang)}
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <BrainCircuit className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        )}
        
        {!isLoading && !isButtonDisabled && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-accent border-2 border-white"></span>
          </span>
        )}
      </Button>

      <Dialog open={isOverlayOpen} onOpenChange={setIsOverlayOpen}>
        <DialogContent className="w-[92vw] max-w-[400px] rounded-[2.5rem] p-8 glass border-white/80 shadow-2xl animate-in zoom-in-95 duration-300">
          <DialogHeader className="mb-4">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </div>
            <DialogTitle className="text-center text-primary uppercase tracking-[0.2em] text-xs font-black">
              {t('strategy_identified', lang)}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-2 text-center">
            <p className="text-lg sm:text-xl font-black leading-relaxed italic text-foreground tracking-tight whitespace-pre-line">
              {citation}
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              onClick={() => setIsOverlayOpen(false)}
              className="rounded-full px-8 font-black uppercase tracking-widest text-[10px] h-10 bg-foreground text-background hover:opacity-90"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
