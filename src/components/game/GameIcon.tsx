"use client";

import React from 'react';

export function GameIcon({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="512" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#E0F7FA" />
          </linearGradient>
          <filter id="glowIcon" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <rect width="512" height="512" rx="128" fill="url(#skyGradient)" />
        
        <circle cx="420" cy="400" r="60" fill="white" fillOpacity="0.4" />
        <circle cx="360" cy="420" r="50" fill="white" fillOpacity="0.4" />
        
        <path d="M150 350 C 100 200, 400 100, 362 250" stroke="hsl(45 100% 50%)" strokeWidth="24" strokeLinecap="round" filter="url(#glowIcon)" fill="none" />
        <circle cx="150" cy="350" r="20" fill="hsl(45 100% 50%)" filter="url(#glowIcon)" />
        <circle cx="362" cy="250" r="20" fill="hsl(45 100% 50%)" filter="url(#glowIcon)" />
        
        <text 
          x="256" 
          y="320" 
          fontFamily="system-ui, sans-serif" 
          fontWeight="900" 
          fontStyle="italic" 
          fontSize="280" 
          fill="hsl(45 100% 50%)" 
          textAnchor="middle" 
          filter="url(#glowIcon)"
        >L</text>
      </svg>
    </div>
  );
}