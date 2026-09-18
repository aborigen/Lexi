"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/translations';
import { CheckCircle2, Star } from 'lucide-react';

interface WordGridProps {
  validWords: string[];
  foundWords: string[];
  lang?: string;
}

/**
 * WordGrid Component
 * Displays the grid of word slots for the current level.
 * Words are sorted by length for a cleaner visual layout.
 */
export function WordGrid({ validWords, foundWords, lang = 'en' }: WordGridProps) {
  const isLevelComplete = foundWords.length === validWords.length;
  
  const sortedValidWords = React.useMemo(() => 
    [...validWords].sort((a, b) => a.length - b.length || a.localeCompare(b)),
    [validWords]
  );

  return (
    <div className={cn(
      "w-full landscape:w-[280px] portrait:max-h-[30%] landscape:h-full p-6 glass rounded-[2.5rem] flex flex-col gap-4 overflow-hidden shrink-0 animate-slide-in-left z-10 border-white/40 transition-all duration-1000",
      isLevelComplete && "bg-primary/5 border-primary/40 shadow-[0_0_40px_rgba(255,179,0,0.15)]"
    )}>
      <div className="flex items-center justify-between border-b border-white/20 pb-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">
            {t('found_words', lang)}
          </span>
          <span className={cn(
            "text-xs font-black uppercase italic transition-colors",
            isLevelComplete ? "text-primary" : "text-muted-foreground"
          )}>
            {lang === 'ru' ? 'Сетка слов' : 'Word Matrix'}
          </span>
        </div>
        <div className="flex flex-col items-end">
           <span className={cn(
             "text-lg font-black leading-none transition-all",
             isLevelComplete ? "text-primary scale-110" : "text-foreground/80"
           )}>
            {foundWords.length}<span className="text-[10px] opacity-30 mx-0.5">/</span>{validWords.length}
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
                    "w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center border-2 rounded-xl font-black text-xs sm:text-base transition-all duration-700",
                    isFound 
                      ? "sunny-gradient text-white border-white/40 shadow-md word-slot-found" 
                      : "bg-white/10 border-white/20 text-transparent",
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
        <div className="pt-2 flex items-center justify-center gap-2 animate-bounce">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 shadow-sm">
            {lang === 'ru' ? 'ВЕЛИКОЛЕПНО!' : 'EXCELLENT!'}
          </span>
          <Star className="w-4 h-4 text-primary fill-primary" />
        </div>
      )}
    </div>
  );
}
