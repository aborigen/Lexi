
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/translations';

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
  const sortedValidWords = React.useMemo(() => 
    [...validWords].sort((a, b) => a.length - b.length || a.localeCompare(b)),
    [validWords]
  );

  return (
    <div className="w-full landscape:w-[280px] portrait:max-h-[30%] landscape:h-full p-6 glass rounded-[2.5rem] flex flex-col gap-4 overflow-hidden shrink-0 animate-slide-in-left z-10 border-white/40">
      <div className="flex items-center justify-between border-b border-white/20 pb-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">
            {t('found_words', lang)}
          </span>
          <span className="text-xs font-black text-primary uppercase italic">
            {lang === 'ru' ? 'Сетка слов' : 'Word Matrix'}
          </span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-lg font-black leading-none text-foreground/80">
            {foundWords.length}<span className="text-[10px] opacity-30 mx-0.5">/</span>{validWords.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-wrap justify-center content-start gap-2 sm:gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {sortedValidWords.map((word, idx) => (
          <div key={`${word}-${idx}`} className="flex gap-1 group">
            {word.split('').map((char, i) => {
              const isFound = foundWords.includes(word);
              return (
                <div 
                  key={i} 
                  className={cn(
                    "w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center border-2 rounded-xl font-black text-xs sm:text-base transition-all duration-700",
                    isFound 
                      ? "sunny-gradient text-white border-white/40 shadow-md word-slot-found" 
                      : "bg-white/10 border-white/20 text-transparent"
                  )}
                >
                  {isFound ? char : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {foundWords.length === validWords.length && (
        <div className="pt-2 text-center animate-bounce">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {lang === 'ru' ? 'Отлично!' : 'Excellent!'}
          </span>
        </div>
      )}
    </div>
  );
}
