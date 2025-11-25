import React, { useState, useEffect } from 'react';
import { GameState } from './types';
import MainMenu from './components/MainMenu';
import GameLoop from './components/GameLoop';
import GameOver from './components/GameOver';
import { generateVillainTaunt } from './services/geminiService';
import { RIVALS } from './constants';
import { Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [deathCause, setDeathCause] = useState("");
  const [taunt, setTaunt] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('anton_racer_highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = async () => {
    // Pick a random rival to taunt us before race starts
    const rival = RIVALS[Math.floor(Math.random() * RIVALS.length)];
    setTaunt(null); // Reset
    
    // Optimistic start
    setGameState(GameState.PLAYING);
    
    // Fetch taunt in background to show as a toast or at top
    try {
        const text = await generateVillainTaunt(rival.name, rival.era);
        setTaunt(`Anton vs ${rival.name}: "${text}"`);
        setTimeout(() => setTaunt(null), 5000); // Hide after 5s
    } catch (e) {
        // Silent fail
    }
  };

  const handleGameOver = (finalScore: number, cause: string) => {
    setScore(finalScore);
    setDeathCause(cause);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('anton_racer_highscore', finalScore.toString());
    }
    setGameState(GameState.GAME_OVER);
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Retro visual filters */}
        <div className="scanline"></div>
        <div className="crt-flicker"></div>
        
        {/* Synthwave Background Gradient for the whole page */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-black to-black z-0"></div>
        
        {/* Grid Floor */}
        <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(transparent_0%,rgba(236,72,153,0.1)_1px,transparent_2px),linear-gradient(90deg,transparent_0%,rgba(236,72,153,0.1)_1px,transparent_2px)] bg-[length:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom z-0 pointer-events-none"></div>

        {/* Sun */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-t from-yellow-500 to-pink-600 rounded-full blur-md opacity-20 z-0"></div>

        {/* Taunt Toast */}
        {taunt && gameState === GameState.PLAYING && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-bounce">
                <div className="bg-black/80 border-2 border-pink-500 text-pink-400 p-3 rounded-tr-xl rounded-bl-xl shadow-[5px_5px_0_#ec4899] font-mono text-xs md:text-sm text-center">
                    {taunt}
                </div>
            </div>
        )}

        {/* Audio Toggle */}
        <button 
            className="absolute top-4 right-4 z-50 text-pink-500 hover:text-white transition-colors"
            onClick={() => setSoundEnabled(!soundEnabled)}
        >
            {soundEnabled ? <Volume2 /> : <VolumeX />}
        </button>

        {/* Main Content Area */}
        <div className="w-full h-full max-w-lg relative z-10">
            {gameState === GameState.MENU && (
                <MainMenu onStart={startGame} highScore={highScore} />
            )}
            
            {gameState === GameState.PLAYING && (
                <GameLoop 
                    onGameOver={handleGameOver} 
                    gameState={gameState}
                />
            )}
            
            {gameState === GameState.GAME_OVER && (
                <GameOver 
                    score={score} 
                    deathCause={deathCause}
                    onRestart={startGame}
                    onHome={() => setGameState(GameState.MENU)}
                />
            )}
        </div>
    </div>
  );
};

export default App;
