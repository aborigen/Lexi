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
  const isLevelComplete = foundWords.length === validWords.length;
  
  const sortedValidWords = React.useMemo(() => 
    [...validWords].sort((a, b) => a.length - b.length || a.localeCompare(b)),
    [validWords]
  );

  return (
    <div className={cn(
      "w-full landscape:w-[300px] portrait:max-h-[30vh] p-5 sm:p-6 glass rounded-[2.5rem] flex flex-col gap-4 overflow-hidden shrink-0 animate-slide-in-left z-10 border-white/50 transition-all duration-1000 relative",
      isLevelComplete && "bg-primary/5 border-primary/40 shadow-[0_0_60px_rgba(245,158,11,0.2)]"
    )}>
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 leading-none mb-1">
            {t('found_words', lang)}
          </span>
          <div className="flex items-center gap-1.5">
            <Sparkles className={cn("w-3 h-3 text-primary transition-opacity", isLevelComplete ? "opacity-100" : "opacity-0")} />
            <span className={cn(
              "text-xs font-black uppercase italic tracking-tighter transition-colors",
              isLevelComplete ? "text-primary" : "text-muted-foreground"
            )}>
              {lang === 'ru' ? 'СЕТКА СЛОВ' : 'WORD MATRIX'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <span className={cn(
             "text-xl font-black tracking-tighter transition-all duration-500",
             isLevelComplete ? "text-primary scale-110" : "text-foreground/70"
           )}>
            {foundWords.length}<span className="text-xs opacity-30 mx-1">/</span>{validWords.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-wrap justify-center content-start gap-2 sm:gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {sortedValidWords.map((word, idx) => {
          const isFound = foundWords.includes(word);
          return (
            <div key={`${word}-${idx}`} className="flex gap-1 group">
              {word.split('').map((char, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 rounded-xl font-black text-xs sm:text-lg transition-all duration-700",
                    isFound 
                      ? "sunny-gradient text-white border-white/50 shadow-xl word-slot-found" 
                      : "bg-black/5 border-white/10 text-transparent shadow-inner",
                    isLevelComplete && isFound && "animate-pulse"
                  )}
                >
                  {isFound ? char : ''}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      
      {isLevelComplete && (
        <div className="pt-3 flex items-center justify-center gap-2 animate-bounce border-t border-white/10 mt-2">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em] bg-primary/10 px-5 py-2 rounded-full border border-primary/30 shadow-2xl">
            {lang === 'ru' ? 'ВЕЛИКОЛЕПНО!' : 'EXCELLENT!'}
          </span>
          <Star className="w-4 h-4 text-primary fill-primary" />
        </div>
      )}
    </div>
  );
}
