
"use client";

import React from 'react';
import { FRUIT_TIERS } from '@/lib/game-constants';
import { ChevronRight } from 'lucide-react';

export function EvolutionGuide() {
  return (
    <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {FRUIT_TIERS.map((fruit, idx) => (
        <div key={fruit.type} className="group relative">
          <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 shadow-lg"
              style={{ 
                backgroundColor: fruit.color + '15', 
                borderColor: fruit.color + '40',
                color: fruit.color
              }}
            >
              {fruit.label}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-foreground capitalize tracking-tight">{fruit.type}</span>
                <span className="text-[10px] font-bold text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded-md">+{fruit.score}</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-transparent to-white/40" 
                  style={{ width: `${(fruit.tier / FRUIT_TIERS.length) * 100}%`, backgroundColor: fruit.color }}
                />
              </div>
            </div>
          </div>
          
          {idx < FRUIT_TIERS.length - 1 && (
            <div className="absolute -bottom-2 left-9 z-10 opacity-20 group-hover:opacity-40 transition-opacity">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
