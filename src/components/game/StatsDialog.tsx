"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlayerStats } from '@/lib/yandex-sdk';
import { BookOpen, Brain, Star, Trophy, Activity, Award } from 'lucide-react';
import { t } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface StatsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stats: PlayerStats | null;
  lang: string;
}

/**
 * StatsDialog Component
 * A visual modal that summarizes the player's historical achievements.
 */
export function StatsDialog({ isOpen, onOpenChange, stats, lang }: StatsDialogProps) {
  if (!stats) return null;

  const items = [
    { label: lang === 'ru' ? 'Пройдено уровней' : 'Levels Cleared', value: stats.levelsCleared, icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: lang === 'ru' ? 'Найдено слов' : 'Words Found', value: stats.totalWordsFound, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: lang === 'ru' ? 'Самое длинное слово' : 'Longest Word', value: stats.longestWord, icon: Star, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: lang === 'ru' ? 'Использовано подсказок' : 'Hints Used', value: stats.hintsUsed, icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: lang === 'ru' ? 'Всего сессий' : 'Total Sessions', value: stats.totalSessions, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[400px] rounded-[3rem] p-8 glass border-white/80 shadow-2xl animate-in zoom-in-95 duration-300">
        <DialogHeader className="mb-6">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-black italic tracking-tighter uppercase text-foreground">
            {t('player_stats', lang)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {items.map((item, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white/40 border border-white/60 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl", item.bg, item.color)}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">
                    {item.label}
                  </span>
                  <span className="text-xl font-black leading-none">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => onOpenChange(false)}
            className="rounded-full px-12 h-12 font-black uppercase tracking-widest text-[11px] bg-foreground text-background hover:opacity-90 active:scale-95 transition-all shadow-lg"
          >
            OK
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
