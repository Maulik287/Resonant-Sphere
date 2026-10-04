import React from 'react';
import { Play, Sparkles, Volume2 } from 'lucide-react';

export default function AudioPrompt({ onInitialize }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onInitialize) onInitialize();
  };

  return (
    <div 
      onClick={handleClick}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer bg-black/50 backdrop-blur-[3px] transition-all hover:bg-black/40 group select-none"
    >
      {/* Radiant ambient glow */}
      <div className="absolute w-80 h-80 rounded-full bg-cyan-500/20 blur-[100px] group-hover:bg-cyan-500/30 group-hover:scale-125 transition-all duration-700 pointer-events-none" />

      {/* Main Interactive Button Pill */}
      <button
        onClick={handleClick}
        className="relative flex items-center gap-4 px-8 py-4 rounded-full bg-[#0d1424]/90 hover:bg-[#131d35] backdrop-blur-2xl border border-cyan-400/50 hover:border-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_55px_rgba(6,182,212,0.6)] transition-all duration-300 transform group-hover:scale-[1.03] active:scale-[0.98]"
      >
        <div className="w-10 h-10 rounded-full bg-cyan-500/25 border border-cyan-400/50 flex items-center justify-center text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
          <Play className="w-4 h-4 fill-cyan-300 text-cyan-300 ml-0.5" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold tracking-wider uppercase text-white drop-shadow">
            Click to Initialize Audio
          </span>
          <span className="text-xs text-cyan-200/70 font-light mt-0.5">
            Enter the 432 Hz generative harmonic field
          </span>
        </div>
      </button>

      {/* Subtle guide note below */}
      <div className="mt-6 flex items-center gap-2 text-xs font-mono text-white/50 tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>Headphones recommended for spatial 3D audio</span>
      </div>
    </div>
  );
}
