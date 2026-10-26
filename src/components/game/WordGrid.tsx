
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/translations';
import { Star, Sparkles } from 'lucide-react';

interface WordGridProps {
  validWords: string[];
  foundWords: string[];
  lang?: string;
}

export function WordGrid({ validWords, foundWords, lang = 'en' }: WordGridProps) {
  const targetWord = validWords[0] || "";
  const isFound = foundWords.includes(targetWord);
  const isLevelComplete = isFound;

  return (
    <div className={cn(
      "w-full portrait:max-h-[25vh] landscape:w-72 sm:landscape:w-80 landscape:h-full p-6 glass rounded-[2.5rem] flex flex-col gap-4 sm:gap-6 overflow-hidden shrink-0 animate-slide-in-left z-10 border-white/50 transition-all duration-1000 relative items-center justify-center",
      isLevelComplete && "bg-primary/5 border-primary/40 shadow-[0_0_60px_rgba(245,158,11,0.2)]"
    )}>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 leading-none">
          {t('found_words', lang)}
        </span>
        <div className="flex items-center gap-2">
          <Sparkles className={cn("w-4 h-4 text-primary transition-opacity", isLevelComplete ? "opacity-100" : "opacity-0")} />
          <span className={cn(
            "text-sm font-black uppercase italic tracking-wider transition-colors",
            isLevelComplete ? "text-primary" : "text-muted-foreground"
          )}>
            {lang === 'ru' ? 'ЦЕЛЕВОЕ СЛОВО' : 'TARGET WORD'}
          </span>
        </div>
      </div>
      
      <div className="flex justify-center gap-1.5 sm:gap-2.5 flex-wrap">
        {targetWord.split('').map((char, i) => (
          <div 
            key={i} 
            className={cn(
              "w-9 h-9 xs:w-11 xs:h-11 sm:w-14 sm:h-14 flex items-center justify-center border-[3px] sm:border-4 rounded-xl sm:rounded-2xl font-black text-lg sm:text-2xl transition-all duration-700",
              isFound 
                ? "sunny-gradient text-white border-white/50 shadow-xl" 
                : "bg-black/5 border-white/10 text-transparent shadow-inner",
              isLevelComplete && "animate-success-pop"
            )}
          >
            {isFound ? char : ''}
          </div>
        ))}
      </div>
      
      {isLevelComplete && (
        <div className="animate-bounce flex items-center gap-3 bg-primary/10 px-6 py-2 rounded-full border border-primary/30 shadow-2xl">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">
            {lang === 'ru' ? 'ВЕЛИКОЛЕПНО!' : 'EXCELLENT!'}
          </span>
          <Star className="w-4 h-4 text-primary fill-primary" />
        </div>
      )}
    </div>
  );
}
