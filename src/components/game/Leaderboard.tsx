
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchLeaderboardEntries, getYandexSDK } from '@/lib/yandex-sdk';
import { Trophy, Medal, User } from 'lucide-react';
import { t } from '@/lib/translations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LeaderboardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lang: string;
}

export function Leaderboard({ isOpen, onOpenChange, lang }: LeaderboardProps) {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard();
    }
  }, [isOpen]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeaderboardEntries(20);
      if (data && data.entries) {
        setEntries(data.entries);
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[420px] rounded-[2.5rem] p-6 glass border-white/80 shadow-2xl">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-6 h-6 text-primary animate-bounce" />
            <DialogTitle className="text-xl font-black uppercase tracking-widest text-foreground">
              {t('show_leaderboard', lang)}
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {t('analyzing', lang)}...
              </p>
            </div>
          ) : entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    index === 0 ? 'bg-primary/10 border-primary/30' : 'bg-white/40 border-white/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex justify-center font-black text-lg italic">
                      {index === 0 ? <Medal className="w-5 h-5 text-yellow-500" /> : 
                       index === 1 ? <Medal className="w-5 h-5 text-slate-400" /> :
                       index === 2 ? <Medal className="w-5 h-5 text-amber-700" /> :
                       index + 1}
                    </div>
                    
                    <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                      <AvatarImage src={entry.player?.getAvatarSrc?.('medium')} />
                      <AvatarFallback className="bg-secondary text-primary">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <span className="text-sm font-black truncate max-w-[140px]">
                        {entry.player?.publicName || 'Player'}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        Rank #{entry.rank}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-md font-black text-primary">
                      {entry.score.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">
                      Points
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <p className="text-sm font-bold text-muted-foreground italic">
                No rankings available yet. Be the first to reach the top!
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
