"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WordLevel } from '@/lib/levels';
import { t } from '@/lib/translations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { LayoutGrid, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelListProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  levels: WordLevel[];
  currentIndex: number;
  onSelectLevel: (index: number) => void;
  lang: string;
}

export function LevelList({ isOpen, onOpenChange, levels, currentIndex, onSelectLevel, lang }: LevelListProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] max-w-[440px] rounded-[3rem] p-7 glass border-white/80 shadow-2xl animate-in zoom-in-95 duration-300">
        <DialogHeader className="mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <LayoutGrid className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
              {t('level_list', lang)}
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[450px] pr-4 -mr-4 custom-scrollbar">
          <div className="grid grid-cols-2 gap-3 pb-4">
            {levels.map((level, index) => {
              const isActive = index === currentIndex;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => {
                    onSelectLevel(index);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "h-auto flex flex-col items-start p-4 rounded-[1.5rem] border transition-all duration-300 gap-1",
                    isActive 
                      ? 'bg-primary/20 border-primary/50 shadow-lg scale-[1.02]' 
                      : 'bg-white/40 border-white/60 hover:bg-white/60'
                  )}
                >
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                      {lang === 'ru' ? 'УРОВЕНЬ' : 'LEVEL'} {index + 1}
                    </span>
                    {isActive && <CheckCircle2 className="w-3 h-3 text-primary" />}
                  </div>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {level.letters.map((char, i) => (
                      <span key={i} className="text-xs font-black text-foreground/80">{char}</span>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold opacity-40 uppercase mt-1">
                    {level.validWords.length} {lang === 'ru' ? 'СЛОВ' : 'WORDS'}
                  </span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="mt-4 pt-4 border-t border-white/20 flex justify-center">
           <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">
             Select a level to start playing
           </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
