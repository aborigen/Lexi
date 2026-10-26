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
      "w-full portrait:max-h-[35vh] landscape:w-[320px] sm:landscape:w-[480px] lg:landscape:w-[520px] landscape:h-full p-6 glass rounded-[2.5rem] flex flex-col gap-4 sm:gap-6 overflow-hidden shrink-0 animate-slide-in-left z-10 border-white/50 transition-all duration-1000 relative items-center justify-center",
      isLevelComplete && "bg-primary/5 border-primary/40 shadow-[0_0_60px_rgba(245,158,11,0.2)]"
    )}>
      
      {/* AI Citation Hint Box */}
      {activeHint && !isLevelComplete && (
        <div className="w-full bg-white/40 border border-primary/30 rounded-3xl p-4 sm:p-5 mb-2 animate-in fade-in slide-in-from-top-4 duration-500 shadow-lg relative overflow-hidden group">
          <div className="absolute -top-2 -left-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Quote className="w-12 h-12 text-primary rotate-180" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">
                {t('strategy_identified', lang)}
              </span>
            </div>
            <p className="text-sm sm:text-base font-black italic text-foreground leading-relaxed tracking-tight text-center whitespace-pre-line">
              {activeHint}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-2">

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
      
      <div className="flex justify-center gap-1.5 sm:gap-2.5 flex-wrap landscape:flex-nowrap overflow-x-auto no-scrollbar w-full px-2">
        {targetWord.split('').map((char, i) => (
          <div 
            key={i} 
            className={cn(
              "w-9 h-9 xs:w-11 xs:h-11 sm:w-14 sm:h-14 flex items-center justify-center border-[3px] sm:border-4 rounded-xl sm:rounded-2xl font-black text-lg sm:text-2xl transition-all duration-700 shrink-0",
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
        <div className="animate-bounce flex items-center gap-3 bg-primary/10 px-6 py-2 rounded-full border border-primary/30 shadow-2xl mt-2">
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
