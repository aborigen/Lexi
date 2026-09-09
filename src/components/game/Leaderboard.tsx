"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchLeaderboardEntries, getPlayerInstance } from '@/lib/yandex-sdk';
import { Trophy, Medal, User, AlertCircle } from 'lucide-react';
import { t } from '@/lib/translations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lang: string;
}

export function Leaderboard({ isOpen, onOpenChange, lang }: LeaderboardProps) {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentPlayer = getPlayerInstance();

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard();
    }
  }, [isOpen]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLeaderboardEntries(20);
      if (data && data.entries) {
        const processed = data.entries
          .filter((e: any) => e.player && e.score !== undefined)
          .reduce((acc: any[], current: any) => {
            const x = acc.find(item => item.player.uniqueID === current.player.uniqueID);
            if (!x) return acc.concat([current]);
            return acc;
          }, [])
          .sort((a: any, b: any) => b.score - a.score);

        setEntries(processed);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error("Leaderboard Algorithm Error:", err);
      setError("Could not synchronize with global rankings.");
    } finally {
      setIsLoading(false);
    }
  };

  const leaderboardContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 animate-in fade-in duration-500">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg" />
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
            {t('analyzing', lang)}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 gap-4">
          <div className="p-3 rounded-full bg-destructive/10">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-sm font-bold text-muted-foreground italic leading-relaxed">
            {error}
          </p>
          <Button variant="outline" size="sm" onClick={loadLeaderboard} className="rounded-full px-6 glass">
            Retry
          </Button>
        </div>
      );
    }

    if (entries.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-4 opacity-60">
          <div className="p-4 rounded-full bg-muted/20">
            <Trophy className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground italic">
            Rankings are currently empty.<br/>Be the first to claim the throne!
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2.5 pb-4">
        {entries.map((entry, index) => {
          const isMe = currentPlayer && entry.player.uniqueID === (currentPlayer as any).uniqueID;
          const rank = index + 1;
          
          return (
            <div 
              key={entry.player.uniqueID || index} 
              className={cn(
                "flex items-center justify-between p-3.5 rounded-[1.5rem] border transition-all duration-300",
                isMe 
                  ? 'bg-primary/20 border-primary/50 shadow-[0_0_20px_rgba(255,179,0,0.2)] scale-[1.02] z-10' 
                  : 'bg-white/40 border-white/60 hover:bg-white/60'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 flex justify-center font-black text-base italic text-foreground/70">
                  {rank === 1 ? <Medal className="w-6 h-6 text-yellow-500 drop-shadow-sm" /> : 
                   rank === 2 ? <Medal className="w-6 h-6 text-slate-400 drop-shadow-sm" /> :
                   rank === 3 ? <Medal className="w-6 h-6 text-amber-700 drop-shadow-sm" /> :
                   <span className="opacity-40">{rank}</span>}
                </div>
                
                <div className="relative">
                  <Avatar className="w-11 h-11 border-2 border-white shadow-md">
                    <AvatarImage src={entry.player?.getAvatarSrc?.('medium')} />
                    <AvatarFallback className="bg-secondary/50 text-primary">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  {isMe && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white animate-pulse" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-black truncate max-w-[140px] tracking-tight",
                    isMe && "text-primary"
                  )}>
                    {entry.player?.publicName || 'Unknown Player'}
                  </span>
                  <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-tighter">
                    {isMe ? 'This is you' : `Level Participant #${rank}`}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-lg font-black text-primary leading-none drop-shadow-sm">
                  {entry.score.toLocaleString()}
                </span>
                <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em] mt-1">
                  PTS
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [entries, isLoading, error, currentPlayer, lang]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] max-w-[440px] rounded-[3rem] p-7 glass border-white/80 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] animate-in zoom-in-95 duration-300 overflow-hidden">
        <DialogHeader className="mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
              {t('show_leaderboard', lang)}
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[450px] pr-4 -mr-4 custom-scrollbar">
          {leaderboardContent}
        </ScrollArea>
        
        <div className="mt-4 pt-4 border-t border-white/20 flex justify-center">
           <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">
             Global Ranking • Yandex Games Network
           </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
