import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Lane, GameObject, EntityType } from '../types';
import { LANE_COUNT, PLAYER_Y_POS, RIVALS, OBSTACLES, SPAWN_RATE_MS } from '../constants';
import { Play, RotateCcw, Zap } from 'lucide-react';

interface GameLoopProps {
  onGameOver: (score: number, cause: string) => void;
  gameState: GameState;
}

const GameLoop: React.FC<GameLoopProps> = ({ onGameOver, gameState }) => {
  // State for rendering
  const [playerLane, setPlayerLane] = useState<Lane>(Lane.CENTER);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1);
  
  // Refs for game loop logic (avoid stale closures)
  const lastTimeRef = useRef<number>(0);
  const requestRef = useRef<number>();
  const scoreRef = useRef(0);
  const speedRef = useRef(1);
  const objectsRef = useRef<GameObject[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const playerLaneRef = useRef<Lane>(Lane.CENTER);
  const gameOverRef = useRef(false);

  // Initialize/Reset
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      scoreRef.current = 0;
      speedRef.current = 1; // Start slow
      objectsRef.current = [];
      lastSpawnRef.current = 0;
      gameOverRef.current = false;
      playerLaneRef.current = Lane.CENTER;
      
      setScore(0);
      setSpeed(1);
      setGameObjects([]);
      setPlayerLane(Lane.CENTER);

      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== GameState.PLAYING) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        movePlayer(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        movePlayer(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const movePlayer = (direction: number) => {
    setPlayerLane((prev) => {
      const newLane = Math.max(0, Math.min(LANE_COUNT - 1, prev + direction));
      playerLaneRef.current = newLane;
      return newLane;
    });
  };

  const spawnEntity = (timestamp: number) => {
    const timeSinceSpawn = timestamp - lastSpawnRef.current;
    // Spawn rate decreases as speed increases (harder)
    const currentSpawnRate = Math.max(400, SPAWN_RATE_MS - (speedRef.current * 200)); 

    if (timeSinceSpawn > currentSpawnRate) {
      const lane = Math.floor(Math.random() * LANE_COUNT);
      const isRival = Math.random() > 0.7; // 30% chance for rival
      
      let newEntity: GameObject;
      const id = `${timestamp}-${Math.random()}`;

      if (isRival) {
        const rivalConfig = RIVALS[Math.floor(Math.random() * RIVALS.length)];
        newEntity = {
          id,
          type: EntityType.RIVAL,
          lane,
          y: -10, // Start just above screen
          speed: 0.5 + (Math.random() * 0.3), // Rivals move slower than the scrolling track usually
          name: rivalConfig.name,
          color: rivalConfig.color,
          era: rivalConfig.era
        };
      } else {
        const obstacleConfig = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
        newEntity = {
          id,
          type: EntityType.OBSTACLE,
          lane,
          y: -10,
          speed: 0, // Obstacles are static relative to the track
          name: obstacleConfig.name,
          icon: obstacleConfig.icon
        };
      }

      objectsRef.current.push(newEntity);
      lastSpawnRef.current = timestamp;
    }
  };

  const checkCollisions = () => {
    const playerRect = {
      l: playerLaneRef.current,
      t: PLAYER_Y_POS,
      b: PLAYER_Y_POS + 10, // approximate height in %
    };

    for (const obj of objectsRef.current) {
      // Simple lane collision
      if (obj.lane === playerRect.l) {
        // Vertical overlap
        // Object is roughly 10% height
        const objBottom = obj.y + 10;
        const objTop = obj.y;

        if (objBottom > playerRect.t + 2 && objTop < playerRect.b - 2) { // +2/-2 for lenient hitboxes
          return obj;
        }
      }
    }
    return null;
  };

  const animate = (time: number) => {
    if (gameOverRef.current) return;
    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // 1. Update Speed & Score
    speedRef.current += 0.0005; // Gradual acceleration
    scoreRef.current += (speedRef.current * 0.5); // Score based on distance/speed

    // 2. Spawn Logic
    spawnEntity(time);

    // 3. Move Objects
    // If it's an obstacle, it moves down at track speed.
    // If it's a rival, it moves down at (track speed - rival speed).
    objectsRef.current = objectsRef.current.map(obj => {
      let moveSpeed = speedRef.current; // Base track speed
      if (obj.type === EntityType.RIVAL) {
        moveSpeed = speedRef.current - (obj.speed * 0.5); // Rivals move slightly slower than track
      }
      return { ...obj, y: obj.y + moveSpeed };
    }).filter(obj => obj.y < 120); // Remove if off screen

    // 4. Collision Check
    const collision = checkCollisions();
    if (collision) {
      gameOverRef.current = true;
      onGameOver(Math.floor(scoreRef.current), collision.name || "Unknown Object");
      return; 
    }

    // 5. Update React State for Render (throttling can happen here if needed, but modern React handles 60fps okay-ish for simple DOM)
    setGameObjects([...objectsRef.current]);
    setScore(Math.floor(scoreRef.current));
    setSpeed(speedRef.current);

    requestRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900 border-x-4 border-pink-600 shadow-[0_0_20px_rgba(236,72,153,0.5)] max-w-lg mx-auto rounded-lg">
      
      {/* Moving Track Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex">
        <div className={`w-1/3 border-r border-slate-700 h-full `}></div>
        <div className={`w-1/3 border-r border-slate-700 h-full `}></div>
      </div>
      
      {/* Road Markings (Animated via CSS for smoothness) */}
      <div className="absolute inset-0 pointer-events-none flex justify-around">
         <div className="h-full w-2 bg-transparent border-l-2 border-dashed border-slate-600 animate-scroll-track" style={{ animationDuration: `${2/speed}s` }}></div>
         <div className="h-full w-2 bg-transparent border-l-2 border-dashed border-slate-600 animate-scroll-track" style={{ animationDuration: `${2/speed}s` }}></div>
      </div>

      <style>{`
        @keyframes scrollTrack {
          from { transform: translateY(-100%); }
          to { transform: translateY(0%); }
        }
        .animate-scroll-track {
          animation: scrollTrack linear infinite;
        }
      `}</style>

      {/* Game Entities */}
      {gameObjects.map(obj => (
        <div
          key={obj.id}
          className="absolute transition-transform duration-75"
          style={{
            left: `${(obj.lane / LANE_COUNT) * 100}%`,
            top: `${obj.y}%`,
            width: `${100 / LANE_COUNT}%`,
            height: '10%', // Approx height
          }}
        >
          <div className="w-full h-full flex items-center justify-center p-2">
            {obj.type === EntityType.OBSTACLE ? (
              <div className="text-4xl filter drop-shadow-md animate-bounce">
                {obj.icon}
              </div>
            ) : (
              <div className={`w-10/12 h-full rounded-md shadow-lg flex flex-col items-center justify-center text-xs font-bold text-white relative border-2 border-black ${obj.color}`}>
                <div className="absolute -top-4 bg-black px-1 text-[8px] rounded whitespace-nowrap border border-white">{obj.name}</div>
                <div className="w-full h-1/2 bg-black/20 mb-1"></div> {/* Windshield */}
                <div className="flex w-full justify-between px-1">
                   <div className="w-1 h-2 bg-red-500 rounded-full animate-pulse"></div>
                   <div className="w-1 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Player (Anton) */}
      <div
        className="absolute transition-all duration-100 ease-out"
        style={{
          left: `${(playerLane / LANE_COUNT) * 100}%`,
          top: `${PLAYER_Y_POS}%`,
          width: `${100 / LANE_COUNT}%`,
          height: '10%',
        }}
      >
        <div className="w-full h-full flex items-center justify-center p-2 relative">
           {/* Anton's Car */}
           <div className="w-10/12 h-full bg-gradient-to-b from-purple-600 to-pink-600 rounded-t-lg rounded-b-md shadow-[0_0_15px_#ec4899] border-2 border-cyan-400 z-10 relative">
              <div className="w-full h-2 bg-cyan-300 shadow-[0_0_10px_cyan] mt-1"></div> {/* Headlights */}
              <div className="w-8/12 mx-auto h-1/3 bg-black/60 mt-2 border border-purple-400 skew-x-12"></div> {/* Windshield */}
              <div className="absolute -right-2 top-4 w-1 h-6 bg-cyan-400"></div> {/* Side pipes */}
              <div className="absolute -left-2 top-4 w-1 h-6 bg-cyan-400"></div>
           </div>
           
           {/* Exhaust Flame */}
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-orange-500 blur-sm rounded-full animate-pulse z-0 translate-y-2"></div>
        </div>
      </div>

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <div className="bg-black/70 border border-purple-500 p-2 rounded text-green-400 font-mono text-sm">
          <div>SCORE: {score.toString().padStart(6, '0')}</div>
          <div className="text-xs text-pink-500 mt-1">SPEED: {Math.floor(speed * 100)} MPH</div>
        </div>
      </div>
      
      {/* Mobile Controls Overlay */}
      <div className="absolute inset-0 flex pointer-events-auto">
        <div className="w-1/2 h-full active:bg-white/5 transition-colors" onPointerDown={() => movePlayer(-1)}></div>
        <div className="w-1/2 h-full active:bg-white/5 transition-colors" onPointerDown={() => movePlayer(1)}></div>
      </div>
    </div>
  );
};

export default GameLoop;
