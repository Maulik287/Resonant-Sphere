import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  CircleDot, 
  Square, 
  Sparkles, 
  Layers, 
  Info,
  Maximize2,
  Music,
  Pause,
  Play,
  Upload,
  Music2
} from 'lucide-react';
import { FREQUENCIES, PRESETS } from '../audio/AudioEngine';

export default function HUD({
  audioInitialized,
  onInitializeAudio,
  activeFreq,
  onFreqChange,
  activePreset,
  onPresetChange,
  volume,
  onVolumeChange,
  isRecording,
  onToggleRecording,
  recordingTime,
  telemetry,
  viewMode,
  onCycleViewMode,
  isMusicPlaying,
  onToggleMusic,
  customTrack,
  onUploadAudio
}) {
  const [showInfo, setShowInfo] = useState(false);
  const activeFreqData = FREQUENCIES.find((f) => f.value === activeFreq) || FREQUENCIES[2];

  const formatHz = (num) => Math.round(num).toLocaleString();

  const getViewModeLabel = () => {
    if (viewMode === 'spline') {
      return { label: 'SPLINE 3D SCENE', icon: <Layers className="w-3.5 h-3.5 text-cyan-400" /> };
    }
    return { label: 'HARMONIC PARTICLES', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> };
  };

  const currentView = getViewModeLabel();

  return (
    <div className="hud-overlay pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 select-none">
      {/* TOP BAR: Header & HUD controls */}
      <header className="flex items-center justify-between pointer-events-auto">
        {/* Title & Concept */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h1 className="text-sm font-light tracking-[0.3em] uppercase text-white/90">
              The Resonant Sphere
            </h1>
          </div>
          <span className="text-[10px] tracking-[0.2em] font-mono text-white/40 pl-4">
            GENERATIVE WEBAUDIO INSTRUMENT
          </span>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* Prominent Play / Stop Music Button */}
          <button
            onClick={onToggleMusic}
            className={`hud-pill flex items-center gap-2 text-[11px] font-mono tracking-wider px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              isMusicPlaying
                ? 'border-rose-500/60 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 shadow-[0_0_18px_rgba(244,63,94,0.35)] hover:scale-[1.02] active:scale-[0.98]'
                : 'border-cyan-400/60 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 shadow-[0_0_18px_rgba(6,182,212,0.35)] hover:scale-[1.02] active:scale-[0.98]'
            }`}
            title={isMusicPlaying ? "Stop music playback (or press Space)" : "Play music (or press Space)"}
          >
            {isMusicPlaying ? (
              <>
                <Square className="w-3 h-3 fill-rose-400 text-rose-400" />
                <span className="font-semibold tracking-widest text-rose-200">STOP MUSIC</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-cyan-300 text-cyan-300 ml-0.5" />
                <span className="font-semibold tracking-widest text-cyan-200">PLAY MUSIC</span>
              </>
            )}
          </button>

          {/* Upload Song Pill */}
          <label 
            className="hud-pill flex items-center gap-2 text-[11px] font-mono tracking-wider px-3.5 py-1.5 rounded-full transition-all cursor-pointer border-indigo-400/50 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 hover:border-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.02] active:scale-[0.98]"
            title="Upload any audio or video file (MP3, WAV, MP4, M4A, etc.) to retune with Solfeggio frequencies"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-300" />
            <span className="font-semibold tracking-wider">UPLOAD SONG</span>
            <input 
              type="file" 
              accept="audio/*,video/mp4,video/*,.mp4,.m4a,.mov,.webm,.wav,.mp3,.aac,.flac" 
              className="hidden" 
              onChange={(e) => { 
                if (e.target.files && e.target.files[0]) { 
                  onUploadAudio(e.target.files[0]); 
                  e.target.value = ''; 
                } 
              }} 
            />
          </label>

          {/* View Mode Cycle (Spline Native vs iFrame vs Harmonic) */}
          <button
            onClick={onCycleViewMode}
            className="hud-pill flex items-center gap-2 text-[11px] font-mono tracking-wider px-3.5 py-1.5 rounded-full transition-all hover:border-cyan-400/50"
            title="Cycle visual mode: Spline Native WebGL / Spline iFrame / Harmonic Particles"
          >
            {currentView.icon}
            <span>{currentView.label}</span>
          </button>

          {/* Session Recorder Pill */}
          <button
            onClick={onToggleRecording}
            className={`hud-pill flex items-center gap-2 text-[11px] font-mono tracking-wider px-3.5 py-1.5 rounded-full transition-all ${
              isRecording 
                ? 'border-rose-500/60 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.35)]' 
                : 'hover:border-white/30 text-white/80'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                <span>REC {recordingTime}s</span>
              </>
            ) : (
              <>
                <CircleDot className="w-3.5 h-3.5 text-rose-400" />
                <span>RECORD AUDIO</span>
              </>
            )}
          </button>

          {/* Info Guide Button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="hud-pill p-2 rounded-full transition-all hover:border-white/30"
            title="Acoustic-visual mappings"
          >
            <Info className="w-3.5 h-3.5 text-white/70" />
          </button>

          {/* Master Volume Slider & Mute */}
          <div className="hud-pill flex items-center gap-2 px-3 py-1.5 rounded-full">
            {volume > 0.01 ? (
              <Volume2 className="w-3.5 h-3.5 text-white/70" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-rose-400/80" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 accent-cyan-400 bg-white/10 rounded cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* TOP-LEFT: Base Frequency Selector with Traditional Names & Vibe */}
      <div className="flex flex-col gap-2 mt-4 max-w-sm pointer-events-auto">
        <span className="text-[9px] tracking-[0.25em] font-mono uppercase text-white/50 pl-1">
          Fundamental Tuning // Solfeggio Frequencies
        </span>
        <div className="flex flex-wrap gap-1.5">
          {FREQUENCIES.map((freq) => (
            <button
              key={freq.value}
              onClick={() => onFreqChange(freq.value)}
              className={`flex items-center gap-1.5 text-[10px] tracking-wide px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeFreq === freq.value
                  ? 'bg-cyan-500/25 border border-cyan-400/60 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-black/40 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
              }`}
              title={`${freq.vibe}: ${freq.desc}`}
            >
              <span className="font-mono font-bold text-cyan-300">{freq.hz}</span>
              <span className="opacity-40">·</span>
              <span className={activeFreq === freq.value ? 'text-white font-medium' : 'text-white/60'}>
                {freq.shortVibe}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Frequency Traditional Vibe & Purpose Display Card */}
        {activeFreqData && (
          <div className="p-3 rounded-2xl bg-[#090d19]/85 backdrop-blur-md border border-cyan-400/25 shadow-xl text-white/80 space-y-1.5 mt-1 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-cyan-300">
                  {activeFreqData.hz}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-100 font-semibold">
                  {activeFreqData.vibe}
                </span>
              </div>
            </div>
            
            {activePreset === 'userUpload' && customTrack && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/25 border border-indigo-400/40 text-[9px] text-indigo-200 font-mono tracking-wide w-fit animate-pulse">
                <Music2 className="w-2.5 h-2.5 text-indigo-300" />
                <span>ACOUSTIC TUNING: <span className="text-white font-bold">{customTrack.name}</span> · {activeFreqData.hz} Mode</span>
              </div>
            )}

            <p className="text-[10px] text-white/65 font-light leading-relaxed">
              {activeFreqData.desc}
            </p>
          </div>
        )}
      </div>

      {/* TOP-RIGHT: Acoustic Preset Selector */}
      <div className="absolute top-20 right-6 flex flex-col items-end gap-2 max-w-xs pointer-events-auto">
        <span className="text-[9px] tracking-[0.25em] font-mono uppercase text-white/40 pr-1">
          Acoustic Presets & Tracks
        </span>
        <div className="flex flex-col items-end gap-1.5">
          {/* Custom Uploaded Track if present */}
          {customTrack && (
            <button
              onClick={() => onPresetChange('userUpload')}
              className={`flex items-center gap-2 text-[11px] font-sans tracking-wide px-3.5 py-1 rounded-full transition-all text-right cursor-pointer ${
                activePreset === 'userUpload'
                  ? 'bg-gradient-to-r from-indigo-500/35 to-cyan-500/35 border border-indigo-400/80 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)]'
                  : 'bg-indigo-950/40 hover:bg-indigo-900/30 text-indigo-200 border border-indigo-500/30'
              }`}
              title={customTrack.description}
            >
              <Music2 className="w-3 h-3 text-indigo-300" />
              <span className="font-semibold text-white truncate max-w-[130px]">{customTrack.name}</span>
              <span className="text-[9px] font-mono tracking-wider text-indigo-300">[YOUR SONG]</span>
            </button>
          )}

          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => onPresetChange(key)}
              className={`flex items-center gap-2.5 text-[11px] font-sans tracking-wide px-3.5 py-1 rounded-full transition-all text-right ${
                activePreset === key
                  ? 'bg-gradient-to-r from-cyan-500/25 to-indigo-500/25 border border-cyan-400/50 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-black/30 hover:bg-white/10 text-white/60 border border-white/10'
              }`}
              title={p.description}
            >
              <span className="font-medium">{p.name}</span>
              <span className={`text-[9px] font-mono tracking-wider ${activePreset === key ? 'text-cyan-300' : 'text-white/40'}`}>
                {p.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* INTERACTIVE GUIDE MODAL */}
      {showInfo && (
        <div className="pointer-events-auto absolute top-28 left-6 max-w-md p-5 rounded-2xl bg-[#0a0f1d]/90 backdrop-blur-xl border border-white/15 text-white/80 shadow-2xl space-y-3 z-30">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <h3 className="text-xs font-mono tracking-widest uppercase text-white">
              The Resonant Sphere Instrument
            </h3>
            <button 
              onClick={() => setShowInfo(false)} 
              className="text-white/40 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          </div>
          <div className="text-xs font-light leading-relaxed space-y-3 text-white/70 max-h-[420px] overflow-y-auto pr-1">
            <div>
              <h4 className="text-[11px] font-mono uppercase text-cyan-300 font-semibold mb-1.5">
                Harmonic Frequencies & Solfeggio Vibes
              </h4>
              <div className="space-y-2">
                {FREQUENCIES.map((f) => (
                  <div key={f.value} className="p-2 rounded-lg bg-white/5 border border-white/10 text-[10px]">
                    <div className="flex items-center justify-between text-cyan-200 font-mono font-medium">
                      <span>{f.hz}</span>
                      <span className="text-white/80">{f.vibe}</span>
                    </div>
                    <p className="text-white/60 font-light mt-0.5 leading-snug">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <p>
                <strong className="text-white">Spatial Sound:</strong> Moving your cursor pans the stereo field across your headphones or speakers.
              </p>
              <p>
                <strong className="text-white">Lowpass Filter:</strong> Moving up/down dynamically sculpts the frequency clarity and warmth.
              </p>
              <p>
                <strong className="text-white">Floating Sphere:</strong> The sphere floats in zero-gravity while music plays, and gently settles down when stopped.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM TELEMETRY OVERLAY */}
      <footer className="w-full flex items-end justify-between pointer-events-none font-mono text-[10px] tracking-widest text-white/45">
        {/* Left Telemetry */}
        <div className="flex flex-col gap-1 bg-black/35 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-white/30">BASE FREQ:</span>
            <span className="text-cyan-300 font-semibold">{telemetry.baseFreq.toFixed(1)} HZ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/30">LPF CUTOFF:</span>
            <span className="text-indigo-300 font-semibold">{formatHz(telemetry.currentFilterFreq)} HZ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/30">STEREO PAN:</span>
            <span className="text-purple-300 font-semibold">
              {telemetry.pan > 0 ? `+${telemetry.pan}` : telemetry.pan}
            </span>
          </div>
        </div>

        {/* Center: Live Harmonic Progression status */}
        <div className="hidden md:flex flex-col items-center pb-2 text-[10px] tracking-[0.2em] uppercase">
          <span className="text-cyan-400 font-medium">HARMONY: {telemetry.currentChordName || 'COSMIC ROOT'}</span>
          <span className="text-[8px] text-white/30 tracking-[0.25em] mt-0.5">[ Click & Hold ] to Charge Tension // Move to Modulate</span>
        </div>

        {/* Right Telemetry */}
        <div className="flex flex-col items-end gap-1 bg-black/35 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-white/30">VELOCITY:</span>
            <span className="text-emerald-300 font-semibold">{telemetry.mouseVelocity} PX/S</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/30">TENSION CHARGE:</span>
            <span className={`font-semibold ${telemetry.tension > 60 ? 'text-amber-300 animate-pulse' : 'text-white/60'}`}>
              {Math.round(telemetry.tension)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/30">AUTONOMOUS MUSIC:</span>
            <span className={`font-semibold ${telemetry.isMusicPlaying ? 'text-cyan-300' : 'text-white/40'}`}>
              {telemetry.isMusicPlaying ? 'ACTIVE' : 'MUTED'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
