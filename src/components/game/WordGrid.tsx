"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/translations';
import { Star, Sparkles, Quote } from 'lucide-react';

interface WordGridProps {
  validWords: string[];
  foundWords: string[];
  lang?: string;
  activeHint?: string | null;
}

export function WordGrid({ validWords, foundWords, lang = 'en', activeHint = null }: WordGridProps) {
  const targetWord = validWords[0] || "";
  const isFound = foundWords.includes(targetWord);
  const isLevelComplete = isFound;

  return (
    <div className={cn(
      "w-full portrait:min-h-[220px] portrait:max-h-[40vh] landscape:w-[320px] sm:landscape:w-[480px] lg:landscape:w-[520px] landscape:h-full p-4 sm:p-6 glass rounded-[2.5rem] flex flex-col gap-3 sm:gap-6 overflow-hidden shrink-0 animate-slide-in-left z-10 border-white/50 transition-all duration-1000 relative items-center justify-center",
      isLevelComplete && "bg-primary/5 border-primary/40 shadow-[0_0_60px_rgba(245,158,11,0.2)]"
    )}>
      
      {/* AI Citation Hint Box */}
      {activeHint && !isLevelComplete && (
        <div className="w-full bg-white/40 border border-primary/30 rounded-3xl p-3 sm:p-5 animate-in fade-in slide-in-from-top-4 duration-500 shadow-lg relative overflow-hidden group">
          <div className="absolute -top-2 -left-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Quote className="w-10 h-10 text-primary rotate-180" />
          </div>
          <div className="relative z-10 flex flex-col justify-center min-h-[60px] sm:min-h-[80px]">
            <p className="text-xs sm:text-base font-black italic text-foreground leading-snug sm:leading-relaxed tracking-tight text-center whitespace-pre-line line-clamp-4">
              {activeHint}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-1 sm:gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className={cn("w-3 h-3 sm:w-4 sm:h-4 text-primary transition-opacity", isLevelComplete ? "opacity-100" : "opacity-0")} />
          <span className={cn(
            "text-[10px] sm:text-sm font-black uppercase italic tracking-wider transition-colors",
            isLevelComplete ? "text-primary" : "text-muted-foreground"
          )}>
            {lang === 'ru' ? 'ЦЕЛЕВОЕ СЛОВО' : 'TARGET WORD'}
          </span>
        </div>
      </div>
      
      <div className="flex justify-center gap-1 sm:gap-2.5 flex-wrap landscape:flex-nowrap overflow-x-auto no-scrollbar w-full px-1">
        {targetWord.split('').map((char, i) => (
          <div 
            key={i} 
            className={cn(
              "w-8 h-8 xs:w-10 xs:h-10 sm:w-14 sm:h-14 flex items-center justify-center border-2 sm:border-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-2xl transition-all duration-700 shrink-0",
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
        <div className="animate-bounce flex items-center gap-2 sm:gap-3 bg-primary/10 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-primary/30 shadow-2xl">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary" />
          <span className="text-[8px] sm:text-[10px] font-black uppercase text-primary tracking-[0.2em] sm:tracking-[0.3em]">
            {lang === 'ru' ? 'ВЕЛИКОЛЕПНО!' : 'EXCELLENT!'}
          </span>
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary" />
        </div>
      )}
    </div>
  );
}
