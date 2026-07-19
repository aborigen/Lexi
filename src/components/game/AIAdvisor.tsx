
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';
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
    <div className="glass p-3 rounded-2xl border-primary/20 bg-primary/5 flex items-center gap-3">
      <Button 
        size="sm" 
        variant="secondary" 
        className="h-8 px-3 text-[10px] font-bold bg-primary hover:bg-primary/80 text-white rounded-xl shadow-md shrink-0"
        onClick={handleGetSuggestion}
        disabled={isButtonDisabled}
      >
        {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <BrainCircuit className="w-3 h-3 mr-1.5" />}
        {isAnalyzing ? t('analyzing', lang) : t('get_hint', lang)}
      </Button>
      
      <div className="flex-1 min-w-0">
        {suggestion ? (
          <p className="text-[10px] text-muted-foreground leading-tight animate-in fade-in slide-in-from-left-2 duration-500 line-clamp-2">
            {suggestion}
          </p>
        ) : (
          <p className="text-[10px] text-muted-foreground italic">
            {t('wait_ai', lang)}
          </p>
        )}
      </div>
    </div>
  );
}
