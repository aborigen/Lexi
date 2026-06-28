
"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { 
  FRUIT_TIERS, 
  ARENA_WIDTH, 
  ARENA_HEIGHT, 
  DROP_STAGING_HEIGHT,
  GAME_OVER_LINE_Y
} from '@/lib/game-constants';

interface MatterSceneProps {
  nextFruitIndex: number;
  onFruitDropped: () => void;
  onScoreUpdate: (score: number) => void;
  onGameOver: () => void;
  suggestedX: number | null;
  onBodiesUpdate: (bodies: any[]) => void;
}

export function MatterScene({ 
  nextFruitIndex, 
  onFruitDropped, 
  onScoreUpdate, 
  onGameOver,
  suggestedX,
  onBodiesUpdate
}: MatterSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [mousePos, setMousePos] = useState({ x: ARENA_WIDTH / 2 });
  
  // Ref for callbacks to avoid re-running effect on state changes
  const callbacks = useRef({ onScoreUpdate, onGameOver, onBodiesUpdate, onFruitDropped });
  useEffect(() => {
    callbacks.current = { onScoreUpdate, onGameOver, onBodiesUpdate, onFruitDropped };
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Setup Engine & World
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 1.0;

    // 2. Setup Renderer
    const render = Matter.Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: ARENA_WIDTH,
        height: ARENA_HEIGHT,
        wireframes: false,
        background: 'transparent',
      }
    });

    // 3. Create Boundaries
    const ground = Matter.Bodies.rectangle(ARENA_WIDTH / 2, ARENA_HEIGHT + 30, ARENA_WIDTH, 60, { 
      isStatic: true, 
      label: 'boundary',
      render: { visible: false } 
    });
    const leftWall = Matter.Bodies.rectangle(-30, ARENA_HEIGHT / 2, 60, ARENA_HEIGHT, { 
      isStatic: true, 
      label: 'boundary',
      render: { visible: false } 
    });
    const rightWall = Matter.Bodies.rectangle(ARENA_WIDTH + 30, ARENA_HEIGHT / 2, 60, ARENA_HEIGHT, { 
      isStatic: true, 
      label: 'boundary',
      render: { visible: false } 
    });
    
    Matter.Composite.add(engine.world, [ground, leftWall, rightWall]);

    // 4. Collision Merging Logic
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        if (bodyA.label === bodyB.label && bodyA.label !== 'boundary') {
          const tierIdx = FRUIT_TIERS.findIndex(f => f.type === bodyA.label);
          if (tierIdx !== -1 && tierIdx < FRUIT_TIERS.length - 1) {
            const nextTier = FRUIT_TIERS[tierIdx + 1];
            const midX = (bodyA.position.x + bodyB.position.x) / 2;
            const midY = (bodyA.position.y + bodyB.position.y) / 2;

            callbacks.current.onScoreUpdate(nextTier.score);
            
            Matter.Composite.remove(engine.world, [bodyA, bodyB]);
            
            const newFruit = Matter.Bodies.circle(midX, midY, nextTier.radius, {
              label: nextTier.type,
              render: {
                fillStyle: nextTier.color,
                strokeStyle: 'rgba(255,255,255,0.4)',
                lineWidth: 2,
              },
              restitution: 0.3,
              friction: 0.1,
              plugin: { createdAt: Date.now() }
            });
            Matter.Composite.add(engine.world, newFruit);
          }
        }
      });
    });

    // 5. Game Update / Sync
    Matter.Events.on(engine, 'afterUpdate', () => {
      const allBodies = Matter.Composite.allBodies(engine.world);
      const fruits = allBodies.filter(b => b.label !== 'boundary');
      
      const bodiesData = fruits.map(b => ({
        id: b.id.toString(),
        type: b.label,
        x: b.position.x,
        y: b.position.y,
        radius: (b as any).circleRadius
      }));
      
      callbacks.current.onBodiesUpdate(bodiesData);
      
      const now = Date.now();
      const isFull = fruits.some(b => {
        const radius = (b as any).circleRadius || 0;
        const createdAt = (b.plugin as any)?.createdAt || 0;
        // Only check old enough fruits that have settled
        return (now - createdAt > 2000) && 
               (b.position.y - radius < GAME_OVER_LINE_Y) &&
               (Math.abs(b.velocity.y) < 0.2);
      });

      if (isFull) {
        setIsGameOver(true);
      }
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isGameOver) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let clientX;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const radius = FRUIT_TIERS[nextFruitIndex].radius;
    const x = Math.max(radius + 10, Math.min(ARENA_WIDTH - radius - 10, clientX - rect.left));
    setMousePos({ x });
  };

  const handleDrop = useCallback(() => {
    if (isGameOver || isDropping || !engineRef.current) return;

    setIsDropping(true);
    const fruitDef = FRUIT_TIERS[nextFruitIndex];
    
    const fruit = Matter.Bodies.circle(mousePos.x, DROP_STAGING_HEIGHT, fruitDef.radius, {
      label: fruitDef.type,
      render: {
        fillStyle: fruitDef.color,
        strokeStyle: 'rgba(255,255,255,0.4)',
        lineWidth: 2,
      },
      restitution: 0.2,
      friction: 0.1,
      plugin: { createdAt: Date.now() }
    });

    Matter.Composite.add(engineRef.current.world, fruit);
    callbacks.current.onFruitDropped();

    setTimeout(() => {
      setIsDropping(false);
    }, 600); // Cooldown to prevent spam
  }, [nextFruitIndex, mousePos.x, isGameOver, isDropping]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full cursor-none overflow-hidden touch-none select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onClick={handleDrop}
    >
      <div className="absolute inset-0 bg-[#120809]">
         <div className="absolute inset-0 opacity-5" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
         }} />
      </div>

      {/* Danger Line */}
      <div 
        className="absolute w-full border-t-2 border-dashed border-primary/30 z-10 pointer-events-none" 
        style={{ top: GAME_OVER_LINE_Y }}
      >
        <div className="absolute right-4 -top-6 text-[10px] font-bold text-primary tracking-widest bg-background/80 px-2 py-0.5 rounded border border-primary/20">
          STABILITY THRESHOLD
        </div>
      </div>

      {/* Suggested Drop Indicator */}
      {suggestedX !== null && !isGameOver && (
        <div 
          className="absolute h-full w-1 bg-secondary/20 z-0 pointer-events-none transition-all duration-300"
          style={{ left: suggestedX - 2 }}
        >
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-secondary/50 rounded-full animate-ping" />
        </div>
      )}

      {/* Preview Fruit */}
      {!isGameOver && (
        <div 
          className={`absolute pointer-events-none z-20 flex items-center justify-center transition-all duration-75 ${isDropping ? 'opacity-20 scale-90' : 'opacity-100'}`}
          style={{ 
            left: mousePos.x, 
            top: DROP_STAGING_HEIGHT,
            transform: 'translate(-50%, -50%)',
            width: FRUIT_TIERS[nextFruitIndex].radius * 2,
            height: FRUIT_TIERS[nextFruitIndex].radius * 2,
            borderRadius: '50%',
            backgroundColor: FRUIT_TIERS[nextFruitIndex].color,
            boxShadow: `0 0 30px ${FRUIT_TIERS[nextFruitIndex].color}60`,
            border: '2px solid rgba(255,255,255,0.6)'
          }}
        >
           <span className="text-2xl drop-shadow-md">{FRUIT_TIERS[nextFruitIndex].label}</span>
           <div className="absolute -top-16 h-16 w-[1px] bg-gradient-to-b from-transparent to-white/40" />
        </div>
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
          <div className="mb-6 p-6 bg-primary/10 rounded-full border-2 border-primary/30 animate-pulse">
            <LayoutDashboard className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-5xl font-black text-foreground mb-4 italic tracking-tighter">ARENA OVERFLOW</h2>
          <p className="text-muted-foreground mb-10 max-w-xs text-sm leading-relaxed">The heap has exceeded the stability threshold. Your strategy reached its limit.</p>
          <button 
            onClick={() => callbacks.current.onGameOver()}
            className="group relative px-12 py-4 bg-primary text-white font-black rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--primary),0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">REBOOT SESSION <RefreshCcw className="w-4 h-4" /></span>
            <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
