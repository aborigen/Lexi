
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
 * Static-export compatible version. 
 * Uses pre-baked hints from levels or generates structural hints client-side.
 */
export function AIAdvisor({ gameState, onSuggestionReceived, lang = 'en', level }: AIAdvisorProps) {
  const [citation, setCitation] = useState<string | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Clear citation when level or found words change
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
    
    // Simulate AI "thinking" time for game feel, without server roundtrips
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Pick the longest remaining word for the hint
      const sorted = [...remaining].sort((a, b) => b.length - a.length);
      const targetWord = sorted[0];
      
      // Look up static hint from the enriched JSON library
      const staticHint = level.hints[targetWord];

      if (staticHint) {
        setCitation(staticHint);
        setIsOverlayOpen(true);
        onSuggestionReceived(staticHint);
      } else {
        // Structural fallback if citation is missing (client-side)
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
      <div className="glass p-3 rounded-2xl border-white/60 bg-white/40 flex items-center justify-between gap-4 shadow-md shrink-0 mb-2">
        <div className="flex flex-col">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">
            {t('ai_advisor', lang)}
          </p>
          <p className="text-[11px] font-bold text-foreground/60 leading-tight max-w-[180px]">
            {t('wait_ai', lang)}
          </p>
        </div>

        <Button 
          size="sm" 
          className="h-11 px-5 text-xs font-black sunny-gradient hover:opacity-90 text-white rounded-xl shadow-lg shrink-0 border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all"
          onClick={handleGetSuggestion}
          disabled={isButtonDisabled}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <BrainCircuit className="w-4 h-4 mr-2" />
          )}
          {t('get_hint', lang)}
        </Button>
      </div>

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
