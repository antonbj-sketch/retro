import React, { useState } from 'react';
import { GameState } from '../types';
import { Play, Trophy, Skull } from 'lucide-react';
import { RIVALS } from '../constants';

interface MainMenuProps {
  onStart: () => void;
  highScore: number;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, highScore }) => {
  const [selectedRival, setSelectedRival] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto bg-slate-900 border-x-4 border-purple-900 p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900 to-black z-0"></div>
      
      {/* Title */}
      <div className="z-10 text-center mb-8 animate-pulse">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-purple-600 font-['Press_Start_2P'] drop-shadow-[4px_4px_0_rgba(0,0,0,1)] transform -skew-x-6">
          ANTON'S
          <br />
          <span className="text-pink-500 text-4xl block mt-2">RAGE RACER</span>
        </h1>
        <p className="text-cyan-300 mt-4 tracking-widest font-bold text-lg">80s VILLAIN EDITION</p>
      </div>

      {/* Character Profile */}
      <div className="z-10 bg-slate-800/80 border-2 border-pink-500 p-4 rounded-lg shadow-[0_0_20px_rgba(236,72,153,0.3)] mb-8 w-full backdrop-blur-sm">
        <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center border-2 border-cyan-400 shadow-[0_0_10px_cyan]">
                <Skull size={32} className="text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white uppercase">Anton (You)</h2>
                <p className="text-xs text-purple-300">Era: 1985</p>
                <p className="text-xs text-gray-400 italic">"I'll be back... faster!"</p>
            </div>
        </div>
      </div>

      {/* Rivals Preview */}
      <div className="z-10 mb-8 w-full text-center">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Tonight's Victims</p>
        <div className="flex justify-center -space-x-2 overflow-hidden py-2">
            {RIVALS.slice(0, 4).map((r, i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white ${r.color} flex items-center justify-center text-[10px] font-bold shadow-lg`} title={r.name}>
                    {r.name[0]}
                </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-600 bg-gray-800 flex items-center justify-center text-[10px] text-gray-500">
                +
            </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="z-10 group relative px-8 py-4 bg-yellow-400 text-black font-black text-xl uppercase tracking-wider transform transition-transform hover:scale-105 active:scale-95 hover:rotate-1 skew-x-[-10deg] border-b-4 border-yellow-700"
      >
        <span className="flex items-center gap-2">
            <Play fill="black" /> START ENGINE
        </span>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>

      {highScore > 0 && (
        <div className="z-10 mt-6 text-yellow-400 font-mono flex items-center gap-2 bg-black/50 px-4 py-2 rounded">
            <Trophy size={16} /> HIGH SCORE: {highScore}
        </div>
      )}
    </div>
  );
};

export default MainMenu;
