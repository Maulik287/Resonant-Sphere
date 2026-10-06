import { Play, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/AudioEngine';

export default function AudioPrompt({ onInitialize }) {
  const handleTrigger = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      soundEngine.unlockAudioSync();
    } catch (err) {
      console.warn('Sync audio unlock notice:', err);
    }
    if (onInitialize) onInitialize();
  };

  return (
    <div 
      onClick={handleTrigger}
      onTouchEnd={handleTrigger}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer bg-black/50 backdrop-blur-[3px] transition-all hover:bg-black/40 group select-none touch-auto"
    >
      {/* Radiant ambient glow */}
      <div className="absolute w-80 h-80 rounded-full bg-cyan-500/20 blur-[100px] group-hover:bg-cyan-500/30 group-hover:scale-125 transition-all duration-700 pointer-events-none" />

      {/* Main Interactive Button Pill */}
      <button
        type="button"
        onClick={handleTrigger}
        onTouchEnd={handleTrigger}
        className="relative flex items-center gap-3 sm:gap-4 px-5 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#0d1424]/90 hover:bg-[#131d35] backdrop-blur-2xl border border-cyan-400/50 hover:border-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_55px_rgba(6,182,212,0.6)] transition-all duration-300 transform group-hover:scale-[1.03] active:scale-[0.98] max-w-[92vw] pointer-events-auto touch-manipulation cursor-pointer"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-cyan-500/25 border border-cyan-400/50 flex items-center justify-center text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-cyan-300 text-cyan-300 ml-0.5" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white drop-shadow">
            Tap to Initialize Audio
          </span>
          <span className="text-[11px] sm:text-xs text-cyan-200/80 font-light mt-0.5">
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
