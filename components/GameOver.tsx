import React, { useEffect, useState } from 'react';
import { generateRaceCommentary } from '../services/geminiService';
import { RotateCcw, Home, Share2 } from 'lucide-react';

interface GameOverProps {
  score: number;
  deathCause: string;
  onRestart: () => void;
  onHome: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, deathCause, onRestart, onHome }) => {
  const [commentary, setCommentary] = useState<string>("Analyzing race data via modem...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCommentary = async () => {
      const text = await generateRaceCommentary(score, deathCause);
      if (isMounted) {
        setCommentary(text);
        setLoading(false);
      }
    };
    fetchCommentary();
    return () => { isMounted = false; };
  }, [score, deathCause]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto bg-slate-900 border-x-4 border-red-900 p-6 relative z-50">
      
      <div className="text-center mb-6 animate-bounce">
        <h1 className="text-5xl font-['Press_Start_2P'] text-red-500 drop-shadow-[4px_4px_0_#fff]">WASTED</h1>
      </div>

      <div className="bg-slate-800 border-2 border-cyan-500 rounded p-6 w-full mb-6 relative overflow-hidden">
        {/* CRT Scanline overlay inside box */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-10"></div>
        
        <div className="flex justify-between items-center border-b border-slate-600 pb-2 mb-4">
            <span className="text-gray-400 font-mono text-sm">FINAL SCORE</span>
            <span className="text-2xl text-yellow-400 font-bold font-mono">{score.toString().padStart(6, '0')}</span>
        </div>

        <div className="mb-4">
            <span className="text-xs text-gray-500 uppercase block mb-1">Cause of Incident</span>
            <div className="text-red-400 font-bold">{deathCause}</div>
        </div>

        <div>
            <span className="text-xs text-cyan-400 uppercase block mb-2 font-bold flex items-center gap-2">
                {loading ? <span className="animate-spin">⏳</span> : '🎙️'} Race Commentary
            </span>
            <p className="text-sm text-white font-mono leading-relaxed min-h-[80px]">
                {loading ? (
                    <span className="animate-pulse">Loading snarky remark...</span>
                ) : (
                    `"${commentary}"`
                )}
            </p>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={onRestart}
          className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-4 rounded shadow-[0_4px_0_rgb(21,128,61)] active:shadow-[0_0px_0_rgb(21,128,61)] active:translate-y-1 transition-all flex items-center justify-center gap-2"
        >
            <RotateCcw size={20} /> RETRY
        </button>
        <button
          onClick={onHome}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded shadow-[0_4px_0_rgb(30,41,59)] active:shadow-[0_0px_0_rgb(30,41,59)] active:translate-y-1 transition-all flex items-center justify-center gap-2"
        >
            <Home size={20} /> MENU
        </button>
      </div>
    </div>
  );
};

export default GameOver;
