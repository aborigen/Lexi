
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
  const gameOverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Setup Engine & World
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 1.2;

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
    const ground = Matter.Bodies.rectangle(ARENA_WIDTH / 2, ARENA_HEIGHT + 25, ARENA_WIDTH, 50, { 
      isStatic: true, 
      label: 'boundary',
      render: { visible: false } 
    });
    const leftWall = Matter.Bodies.rectangle(-25, ARENA_HEIGHT / 2, 50, ARENA_HEIGHT, { 
      isStatic: true, 
      label: 'boundary',
      render: { visible: false } 
    });
    const rightWall = Matter.Bodies.rectangle(ARENA_WIDTH + 25, ARENA_HEIGHT / 2, 50, ARENA_HEIGHT, { 
      isStatic: true, 
      label: 'boundary',
      render: { visible: false } 
    });
    
    Matter.Composite.add(engine.world, [ground, leftWall, rightWall]);

    // 4. Collision Event (Merging Logic)
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        // Ensure we are comparing two fruits of the same type
        if (bodyA.label === bodyB.label && bodyA.label !== 'boundary' && bodyA.label !== 'Circle Body') {
          const tierIdx = FRUIT_TIERS.findIndex(f => f.type === bodyA.label);
          if (tierIdx !== -1 && tierIdx < FRUIT_TIERS.length - 1) {
            const nextTier = FRUIT_TIERS[tierIdx + 1];
            const midX = (bodyA.position.x + bodyB.position.x) / 2;
            const midY = (bodyA.position.y + bodyB.position.y) / 2;

            onScoreUpdate(nextTier.score);
            
            Matter.Composite.remove(engine.world, [bodyA, bodyB]);
            
            const newFruit = Matter.Bodies.circle(midX, midY, nextTier.radius, {
              label: nextTier.type,
              render: {
                fillStyle: nextTier.color,
                strokeStyle: 'rgba(255,255,255,0.3)',
                lineWidth: 2,
              },
              restitution: 0.3,
              friction: 0.1,
              plugin: { createdAt: Date.now() } // Mark creation time
            });
            Matter.Composite.add(engine.world, newFruit);
          }
        }
      });
    });

    // 5. State Sync & Game Over Check
    Matter.Events.on(engine, 'afterUpdate', () => {
      if (isGameOver) return;

      const allBodies = Matter.Composite.allBodies(engine.world);
      const fruitBodies = allBodies.filter(b => b.label !== 'boundary');
      
      const bodiesData = fruitBodies.map(b => ({
        id: b.id.toString(),
        type: b.label,
        x: b.position.x,
        y: b.position.y,
        radius: (b as any).circleRadius
      }));
      
      onBodiesUpdate(bodiesData);
      
      const now = Date.now();
      const overflowing = fruitBodies.some(b => {
        const radius = (b as any).circleRadius || 0;
        const isAboveLine = b.position.y - radius < GAME_OVER_LINE_Y;
        const isSettled = Math.abs(b.velocity.y) < 0.1 && Math.abs(b.velocity.x) < 0.1;
        
        // Ignore very recently created fruits (like the one just dropped)
        const createdAt = (b.plugin as any)?.createdAt || 0;
        const isOldEnough = now - createdAt > 1000;

        return isAboveLine && isSettled && isOldEnough;
      });

      if (overflowing) {
        if (!gameOverTimerRef.current) {
          gameOverTimerRef.current = setTimeout(() => {
            setIsGameOver(true);
            onGameOver();
          }, 2000);
        }
      } else {
        if (gameOverTimerRef.current) {
          clearTimeout(gameOverTimerRef.current);
          gameOverTimerRef.current = null;
        }
      }
    });

    // 6. Start Runner & Renderer
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Cleanup
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      if (gameOverTimerRef.current) clearTimeout(gameOverTimerRef.current);
    };
  }, [onGameOver, onBodiesUpdate, isGameOver, onScoreUpdate]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isGameOver) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let clientX;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
    } else {
      return;
    }

    const x = Math.max(
      FRUIT_TIERS[nextFruitIndex].radius, 
      Math.min(ARENA_WIDTH - FRUIT_TIERS[nextFruitIndex].radius, clientX - rect.left)
    );
    setMousePos({ x });
  };

  const handleClick = useCallback(() => {
    if (isGameOver || isDropping || !engineRef.current) return;

    setIsDropping(true);
    const fruitDef = FRUIT_TIERS[nextFruitIndex];
    const dropX = mousePos.x;
    
    const fruit = Matter.Bodies.circle(dropX, DROP_STAGING_HEIGHT, fruitDef.radius, {
      label: fruitDef.type,
      render: {
        fillStyle: fruitDef.color,
        strokeStyle: 'rgba(255,255,255,0.3)',
        lineWidth: 2,
      },
      restitution: 0.2,
      friction: 0.1,
      plugin: { createdAt: Date.now() } // Mark creation time
    });

    Matter.Composite.add(engineRef.current.world, fruit);
    onFruitDropped();

    // Drop Cooldown
    setTimeout(() => {
      setIsDropping(false);
    }, 500);
  }, [nextFruitIndex, mousePos.x, isGameOver, isDropping, onFruitDropped]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full cursor-none overflow-hidden touch-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-[#1A0C0E] overflow-hidden">
         <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
         }} />
      </div>

      <div 
        className="absolute w-full border-t-2 border-dashed border-primary/40 z-10 pointer-events-none" 
        style={{ top: GAME_OVER_LINE_Y }}
      >
        <div className="absolute right-2 -top-6 text-[10px] font-bold text-primary tracking-widest bg-background/80 px-2 py-0.5 rounded">
          DANGER ZONE
        </div>
      </div>

      {suggestedX !== null && !isGameOver && (
        <div 
          className="absolute h-full w-[2px] bg-secondary/30 z-0 pointer-events-none"
          style={{ left: suggestedX }}
        >
          <div className="absolute bottom-0 w-4 h-4 -left-[7px] border-2 border-secondary/50 rounded-full animate-ping" />
        </div>
      )}

      {!isGameOver && (
        <div 
          className={`absolute pointer-events-none z-20 flex items-center justify-center transition-opacity duration-200 ${isDropping ? 'opacity-20' : 'opacity-100'}`}
          style={{ 
            left: mousePos.x, 
            top: DROP_STAGING_HEIGHT,
            transform: 'translate(-50%, -50%)',
            width: FRUIT_TIERS[nextFruitIndex].radius * 2,
            height: FRUIT_TIERS[nextFruitIndex].radius * 2,
            borderRadius: '50%',
            backgroundColor: FRUIT_TIERS[nextFruitIndex].color,
            boxShadow: `0 0 20px ${FRUIT_TIERS[nextFruitIndex].color}80`,
            border: '2px solid rgba(255,255,255,0.4)'
          }}
        >
           <span className="text-xl select-none">{FRUIT_TIERS[nextFruitIndex].label}</span>
           <div className="absolute -top-12 h-12 w-[1px] bg-gradient-to-b from-transparent to-primary/50" />
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-500">
          <h2 className="text-4xl font-black text-primary mb-2 italic">ARENA FULL!</h2>
          <p className="text-muted-foreground mb-8 max-w-[200px]">The fruits have reached the danger threshold.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/40"
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
