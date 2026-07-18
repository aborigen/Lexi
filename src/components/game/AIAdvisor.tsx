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
    <div className="flex flex-col gap-5 p-6 glass rounded-3xl border-primary/20 bg-primary/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-primary rounded-xl">
             <Sparkles className="w-5 h-5 text-white" />
           </div>
           <h3 className="text-sm font-black text-primary uppercase tracking-widest">
             {t('ai_advisor', lang)}
           </h3>
        </div>
        <Button 
          size="sm" 
          variant="secondary" 
          className="h-9 px-4 font-bold bg-primary hover:bg-primary/80 text-white rounded-xl shadow-lg shadow-primary/20"
          onClick={handleGetSuggestion}
          disabled={isButtonDisabled}
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
          {isAnalyzing ? t('analyzing', lang) : t('get_hint', lang)}
        </Button>
      </div>
      
      <div className="min-h-[60px] flex items-center">
        {suggestion ? (
          <div className="text-xs text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex gap-2 items-center text-secondary font-black mb-2 tracking-widest">
               <Target className="w-3 h-3" />
               <span>{t('strategy_identified', lang)}</span>
            </div>
            {suggestion}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            {t('wait_ai', lang)}
          </p>
        )}
      </div>
    </div>
  );
}
