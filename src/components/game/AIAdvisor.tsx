
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Target, BrainCircuit } from 'lucide-react';
import { getWordHint, type WordHintInput } from '@/ai/flows/strategic-column-suggestion';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/translations';

interface AIAdvisorProps {
  gameState: WordHintInput;
  onSuggestionReceived: (hint: string) => void;
  lang?: string;
}

export function AIAdvisor({ gameState, onSuggestionReceived, lang = 'en' }: AIAdvisorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    if (isAnalyzing || !gameState.letters || gameState.letters.length === 0) return;
    
    setIsAnalyzing(true);
    setSuggestion(null);

    try {
      const result = await getWordHint(gameState);
      setSuggestion(result.reasoning);
      onSuggestionReceived(result.hintWord);
    } catch (error) {
      toast({
        title: t('ai_failed_title', lang),
        description: t('ai_failed_desc', lang),
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isButtonDisabled = isAnalyzing || !gameState.letters || gameState.letters.length === 0;

  return (
    <div className="flex flex-col gap-4 md:gap-5 p-4 md:p-6 glass rounded-2xl md:rounded-3xl border-primary/20 bg-primary/5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3">
           <div className="p-1.5 md:p-2 bg-primary rounded-lg md:rounded-xl">
             <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
           </div>
           <h3 className="text-[10px] md:text-xs font-black text-primary uppercase tracking-widest leading-none">
             {t('ai_advisor', lang)}
           </h3>
        </div>
        <Button 
          size="sm" 
          variant="secondary" 
          className="h-8 md:h-9 px-3 md:px-4 text-[10px] md:text-xs font-bold bg-primary hover:bg-primary/80 text-white rounded-lg md:rounded-xl shadow-lg shadow-primary/20"
          onClick={handleGetSuggestion}
          disabled={isButtonDisabled}
        >
          {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <BrainCircuit className="w-3 h-3 mr-1.5" />}
          {isAnalyzing ? t('analyzing', lang) : t('get_hint', lang)}
        </Button>
      </div>
      
      <div className="min-h-[50px] md:min-h-[60px] flex items-center">
        {suggestion ? (
          <div className="text-[10px] md:text-xs text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex gap-1.5 md:gap-2 items-center text-secondary font-black mb-1.5 md:mb-2 tracking-widest">
               <Target className="w-2.5 h-2.5 md:w-3 md:h-3" />
               <span>{t('strategy_identified', lang)}</span>
            </div>
            {suggestion}
          </div>
        ) : (
          <p className="text-[10px] md:text-xs text-muted-foreground italic">
            {t('wait_ai', lang)}
          </p>
        )}
      </div>
    </div>
  );
}
