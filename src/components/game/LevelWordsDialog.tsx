'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, HelpCircle } from 'lucide-react';
import { t } from '@/lib/translations';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LevelWordsDialogProps {
  validWords: string[];
  lang?: string;
}

export function LevelWordsDialog({ validWords, lang = 'en' }: LevelWordsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortedWords = React.useMemo(() => {
    return [...validWords].sort((a, b) => a.length - b.length || a.localeCompare(b));
  }, [validWords]);

  return (
    <>
      <Button
        size="icon"
        className="w-14 h-14 rounded-full shadow-2xl glass border-4 border-white/80 hover:bg-white/50 active:scale-95 transition-all group"
        onClick={() => setIsOpen(true)}
        title={t('level_words_title', lang)}
      >
        <Eye className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[92vw] max-w-[400px] rounded-[2.5rem] p-8 glass border-white/80 shadow-2xl animate-in zoom-in-95 duration-300">
          <DialogHeader className="mb-4">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <HelpCircle className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </div>
            <DialogTitle className="text-center text-primary uppercase tracking-[0.2em] text-sm font-black">
              {t('level_words_title', lang)}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[300px] mt-4 pr-2 custom-scrollbar">
            <div className="flex flex-wrap justify-center gap-2">
              {sortedWords.map((word, idx) => (
                <div
                  key={`${word}-${idx}`}
                  className="sunny-gradient text-white font-black px-4 py-2 rounded-2xl text-sm shadow-md tracking-wider uppercase border border-white/20"
                >
                  {word}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setIsOpen(false)}
              className="rounded-full px-8 font-black uppercase tracking-widest text-[10px] h-10 bg-foreground text-background hover:opacity-90"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
