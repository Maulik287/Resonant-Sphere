import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  CircleDot, 
  Square, 
  Sparkles, 
  Layers, 
  Info,
  Play,
  Upload,
  Music2,
  SlidersHorizontal,
  Plus,
  ChevronUp,
  X,
  Check
} from 'lucide-react';
import { FREQUENCIES, PRESETS } from '../audio/AudioEngine';

export default function HUD({
  audioInitialized: _audioInitialized,
  onInitializeAudio: _onInitializeAudio,
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
  const [showTracksSheet, setShowTracksSheet] = useState(false);
  const [showToolsSheet, setShowToolsSheet] = useState(false);
  const activeFreqData = FREQUENCIES.find((f) => f.value === activeFreq) || FREQUENCIES[2];
  const currentPresetInfo = activePreset === 'userUpload' && customTrack
    ? { name: customTrack.name, badge: 'YOUR TRACK', desc: customTrack.description }
    : PRESETS[activePreset] || PRESETS.deepSpace;

  const formatHz = (num) => Math.round(num).toLocaleString();

  const getViewModeLabel = () => {
    if (viewMode === 'spline') {
      return { label: 'SPLINE 3D SCENE', icon: <Layers className="w-3.5 h-3.5 text-cyan-400" /> };
    }
    return { label: 'HARMONIC PARTICLES', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> };
  };

  const currentView = getViewModeLabel();

  return (
    <div className="hud-overlay pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-3 sm:p-6 select-none safe-area-inset">
      {/* TOP SECTION CONTAINER (Grouped so it stays docked at top and NEVER collides with central 3D sphere) */}
      <div className="flex flex-col gap-2 w-full max-w-full">
        {/* TOP BAR: Header & Primary Controls */}
        <header className="flex items-center justify-between pointer-events-auto gap-2">
          {/* Title & Brand */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <h1 className="text-[11px] sm:text-sm font-medium tracking-[0.16em] sm:tracking-[0.25em] uppercase text-white/95 truncate">
                The Resonant Sphere
              </h1>
            </div>
            <span className="hidden sm:block text-[10px] tracking-[0.2em] font-mono text-white/40 pl-3.5">
              GENERATIVE WEBAUDIO INSTRUMENT
            </span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* MOBILE-ONLY Top Quick Controls (Clean, minimal, 1-tap) */}
            <div className="flex md:hidden items-center gap-1.5">
              {/* View Mode Toggle */}
              <button
                onClick={onCycleViewMode}
                className="hud-pill p-1.5 rounded-full text-white/80 transition-all active:scale-95 cursor-pointer"
                title="Toggle 3D View Mode"
              >
                {currentView.icon}
              </button>

              {/* Upload Song Button */}
              <label 
                className="hud-pill p-1.5 rounded-full text-indigo-300 transition-all active:scale-95 cursor-pointer"
                title="Upload Custom Track"
              >
                <Upload className="w-3.5 h-3.5" />
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

              {/* Info Guide Button */}
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="hud-pill p-1.5 rounded-full text-white/75 transition-all active:scale-95 cursor-pointer"
                title="Acoustic & Solfeggio Guide"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* DESKTOP-ONLY Action Controls (Preserved 100% untouched) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Prominent Play / Stop Music Button */}
              <button
                onClick={onToggleMusic}
                className={`hud-pill flex items-center gap-2 text-[11px] font-mono tracking-wider px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  isMusicPlaying
                    ? 'border-rose-500/60 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 shadow-[0_0_18px_rgba(244,63,94,0.35)]'
                    : 'border-cyan-400/60 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 shadow-[0_0_18px_rgba(6,182,212,0.35)]'
                }`}
                title={isMusicPlaying ? "Stop music playback (or press Space)" : "Play music (or press Space)"}
              >
                {isMusicPlaying ? (
                  <>
                    <Square className="w-3 h-3 fill-rose-400 text-rose-400" />
                    <span className="font-semibold tracking-wider text-rose-200">STOP</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-cyan-300 text-cyan-300 ml-0.5" />
                    <span className="font-semibold tracking-wider text-cyan-200">PLAY</span>
                  </>
                )}
              </button>

              {/* Upload Song Pill */}
              <label 
                className="hud-pill flex items-center gap-1.5 text-[11px] font-mono tracking-wider px-3 py-1.5 rounded-full transition-all cursor-pointer border-indigo-400/50 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 hover:border-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                title="Upload audio/video file (MP3, WAV, MP4, M4A)"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <span className="font-semibold tracking-wider">UPLOAD</span>
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

              {/* View Mode Cycle */}
              <button
                onClick={onCycleViewMode}
                className="hud-pill flex items-center gap-2 text-[11px] font-mono tracking-wider px-3.5 py-1.5 rounded-full transition-all hover:border-cyan-400/50 cursor-pointer"
                title="Cycle visual mode: Spline 3D Scene / Harmonic Particles"
              >
                {currentView.icon}
                <span>{currentView.label}</span>
              </button>

              {/* Session Recorder Pill */}
              <button
                onClick={onToggleRecording}
                className={`hud-pill flex items-center gap-2 text-[11px] font-mono tracking-wider px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
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

              {/* Info Guide Button */}
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="hud-pill p-2 rounded-full transition-all hover:border-white/30 cursor-pointer"
                title="Acoustic-visual mappings & harmonic guide"
              >
                <Info className="w-3.5 h-3.5 text-white/75" />
              </button>
            </div>
          </div>
        </header>

        {/* DESKTOP-ONLY: Top-Left Frequency Selector & Card */}
        <div className="hidden md:flex flex-col gap-2 mt-2 max-w-sm pointer-events-auto">
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
      </div>

      {/* DESKTOP-ONLY: Top-Right Acoustic Preset Selector */}
      <div className="hidden md:flex absolute top-20 right-6 flex-col items-end gap-2 max-w-xs pointer-events-auto">
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
              className={`flex items-center gap-2.5 text-[11px] font-sans tracking-wide px-3.5 py-1 rounded-full transition-all text-right cursor-pointer ${
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

      {/* INTERACTIVE GUIDE MODAL (Responsive on all screen sizes) */}
      {showInfo && (
        <div className="pointer-events-auto absolute top-14 sm:top-28 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 w-[92vw] sm:max-w-md p-4 sm:p-5 rounded-2xl bg-[#0a0f1d]/95 backdrop-blur-2xl border border-white/20 text-white/80 shadow-2xl space-y-3 z-50">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <h3 className="text-xs font-mono tracking-widest uppercase text-white">
              The Resonant Sphere Instrument
            </h3>
            <button 
              onClick={() => setShowInfo(false)} 
              className="text-white/50 hover:text-white p-1 text-sm font-mono cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="text-xs font-light leading-relaxed space-y-3 text-white/70 max-h-[60vh] sm:max-h-[420px] overflow-y-auto pr-1">
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
                <strong className="text-white">Spatial Sound:</strong> Drag your finger or cursor to pan the stereo field across your headphones.
              </p>
              <p>
                <strong className="text-white">Lowpass Filter:</strong> Moving up/down sculpts acoustic warmth and clarity.
              </p>
              <p>
                <strong className="text-white">Zero-G Sphere:</strong> Floats in zero-gravity while music plays, and settles down when stopped.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM TELEMETRY OVERLAY */}
      <footer className="w-full flex items-end justify-between pointer-events-none font-mono text-[9px] sm:text-[10px] tracking-wider text-white/45">
        {/* Mobile Ergonomic Thumb-Zone Control Deck */}
        <div className="flex md:hidden flex-col gap-2.5 w-full pointer-events-auto">
          {/* 1. Solfeggio Horizontal Swipeable Frequency Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5 -mx-0.5">
            {FREQUENCIES.map((freq) => {
              const isActive = activeFreq === freq.value;
              return (
                <button
                  key={freq.value}
                  onClick={() => onFreqChange(freq.value)}
                  className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/25 border border-cyan-400/80 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-black/50 border border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span className={`font-bold ${isActive ? 'text-cyan-300' : 'text-white/70'}`}>
                    {freq.hz}
                  </span>
                  <span className="text-[9px] opacity-70">
                    {freq.shortVibe}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. Floating Glassmorphic Player Island */}
          <div className="relative flex items-center justify-between gap-2 p-2 bg-[#080d1a]/85 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
            {/* Left: Active Preset Selector Pill with live 4-bar equalizer */}
            <button
              onClick={() => {
                setShowTracksSheet(true);
                setShowToolsSheet(false);
              }}
              className="flex items-center gap-2 min-w-0 flex-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left cursor-pointer active:scale-[0.98]"
            >
              {/* 4-bar dynamic audio equalizer */}
              <div className="flex items-end gap-[2px] h-3.5 w-3.5 shrink-0">
                <span className={`w-[2.5px] bg-cyan-400 rounded-full transition-all ${isMusicPlaying ? 'animate-eq-1 h-3' : 'h-1.5 opacity-40'}`} />
                <span className={`w-[2.5px] bg-cyan-300 rounded-full transition-all ${isMusicPlaying ? 'animate-eq-2 h-3.5' : 'h-2 opacity-50'}`} />
                <span className={`w-[2.5px] bg-indigo-400 rounded-full transition-all ${isMusicPlaying ? 'animate-eq-3 h-2.5' : 'h-1 opacity-40'}`} />
                <span className={`w-[2.5px] bg-indigo-300 rounded-full transition-all ${isMusicPlaying ? 'animate-eq-4 h-3' : 'h-1.5 opacity-30'}`} />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium text-white truncate tracking-wide">
                  {currentPresetInfo.name}
                </span>
                <span className="text-[8px] font-mono text-cyan-300/80 tracking-widest uppercase truncate">
                  {activePreset === 'userUpload' ? 'CUSTOM TRACK' : currentPresetInfo.badge || 'PRESET'}
                </span>
              </div>

              <ChevronUp className="w-3.5 h-3.5 text-white/40 ml-auto shrink-0" />
            </button>

            {/* Center: Tactile Glowing Play/Stop Button */}
            <button
              onClick={onToggleMusic}
              className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 active:scale-90 cursor-pointer ${
                isMusicPlaying
                  ? 'bg-gradient-to-tr from-rose-600 to-rose-400 text-white shadow-[0_0_24px_rgba(244,63,94,0.65)] border border-rose-300/50'
                  : 'bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white shadow-[0_0_24px_rgba(6,182,212,0.65)] border border-cyan-300/50'
              }`}
              title={isMusicPlaying ? "Stop audio" : "Play audio"}
            >
              {isMusicPlaying ? (
                <Square className="w-4 h-4 fill-white text-white" />
              ) : (
                <Play className="w-4.5 h-4.5 fill-white text-white ml-0.5" />
              )}
            </button>

            {/* Right: Audio Tools & Volume Button */}
            <button
              onClick={() => {
                setShowToolsSheet(true);
                setShowTracksSheet(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-all text-xs cursor-pointer active:scale-[0.98]"
              title="Audio Controls & Session Tools"
            >
              {volume > 0.01 ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              )}
              <SlidersHorizontal className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>

          {/* 3. Micro Dynamic Telemetry Strip */}
          <div className="flex items-center justify-between px-2 text-[9px] font-mono tracking-wider text-white/40">
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-300 font-semibold">{activeFreqData.hz}</span>
              <span>·</span>
              <span className="text-indigo-300">{formatHz(telemetry.currentFilterFreq)} HZ LPF</span>
            </div>
            <span className="text-[8px] uppercase tracking-widest text-white/30">
              DRAG CANVAS TO MODULATE
            </span>
          </div>
        </div>

        {/* Desktop Left Telemetry */}
        <div className="hidden md:flex flex-col gap-1 bg-black/35 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
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

        {/* Desktop Center: Live Harmonic Progression status */}
        <div className="hidden md:flex flex-col items-center pb-2 text-[10px] tracking-[0.2em] uppercase">
          <span className="text-cyan-400 font-medium">HARMONY: {telemetry.currentChordName || 'COSMIC ROOT'}</span>
          <span className="text-[8px] text-white/30 tracking-[0.25em] mt-0.5">[ Click & Hold ] to Charge Tension // Move to Modulate</span>
        </div>

        {/* Desktop Right Telemetry */}
        <div className="hidden md:flex flex-col items-end gap-1 bg-black/35 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
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

      {/* MOBILE BOTTOM SHEET 1: TRACKS & SOUNDSCAPES */}
      {showTracksSheet && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end pointer-events-auto animate-fade-in md:hidden"
          onClick={() => setShowTracksSheet(false)}
        >
          <div 
            className="bg-[#0b1020] border-t border-cyan-500/30 rounded-t-3xl p-5 max-h-[82vh] flex flex-col shadow-2xl safe-area-inset"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">
                  Soundscapes & Tracks
                </h3>
              </div>
              <button
                onClick={() => setShowTracksSheet(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Track List */}
            <div className="py-3 space-y-2.5 overflow-y-auto max-h-[55vh] pr-1">
              {/* Custom Track (if loaded) */}
              {customTrack && (
                <div
                  onClick={() => {
                    onPresetChange('userUpload');
                    setShowTracksSheet(false);
                  }}
                  className={`flex items-start justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                    activePreset === 'userUpload'
                      ? 'bg-gradient-to-r from-indigo-500/25 to-cyan-500/25 border-indigo-400/80 shadow-[0_0_16px_rgba(99,102,241,0.3)]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white tracking-wide">
                        {customTrack.name}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                        UPLOADED
                      </span>
                    </div>
                    <p className="text-[10px] text-white/60 font-light">
                      {customTrack.description}
                    </p>
                  </div>
                  {activePreset === 'userUpload' && (
                    <div className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center shrink-0 ml-2 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              )}

              {/* Preset Cards */}
              {Object.entries(PRESETS).map(([key, preset]) => {
                const isSelected = activePreset === key;
                return (
                  <div
                    key={key}
                    onClick={() => {
                      onPresetChange(key);
                      setShowTracksSheet(false);
                    }}
                    className={`flex items-start justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400/80 shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white tracking-wide">
                          {preset.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/10 text-cyan-300">
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/60 font-light leading-snug">
                        {preset.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center shrink-0 ml-2 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Upload Custom Audio Button inside Sheet */}
            <div className="pt-2 border-t border-white/10">
              <label className="flex items-center justify-center gap-2 w-full p-3 rounded-2xl border border-dashed border-indigo-400/60 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 transition-all cursor-pointer active:scale-[0.98] text-xs font-mono font-medium">
                <Plus className="w-4 h-4 text-indigo-300" />
                <span>Upload Audio or Video File</span>
                <input 
                  type="file" 
                  accept="audio/*,video/mp4,video/*,.mp4,.m4a,.mov,.webm,.wav,.mp3,.aac,.flac" 
                  className="hidden" 
                  onChange={(e) => { 
                    if (e.target.files && e.target.files[0]) { 
                      onUploadAudio(e.target.files[0]); 
                      e.target.value = ''; 
                      setShowTracksSheet(false);
                    } 
                  }} 
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET 2: AUDIO & SESSION TOOLS */}
      {showToolsSheet && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end pointer-events-auto animate-fade-in md:hidden"
          onClick={() => setShowToolsSheet(false)}
        >
          <div 
            className="bg-[#0b1020] border-t border-indigo-500/30 rounded-t-3xl p-5 max-h-[82vh] flex flex-col shadow-2xl safe-area-inset space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-1" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">
                  Audio & Session Controls
                </h3>
              </div>
              <button
                onClick={() => setShowToolsSheet(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tool 1: Master Volume */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/70 flex items-center gap-1.5">
                  {volume > 0.01 ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                  MASTER VOLUME
                </span>
                <span className="text-cyan-300 font-bold">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 accent-cyan-400 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Tool 2: Session Audio Recorder */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white tracking-wide block">
                  Session Recorder
                </span>
                <span className="text-[10px] text-white/50 font-light block">
                  Record live audio output to WebM / WAV
                </span>
              </div>
              <button
                onClick={onToggleRecording}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono tracking-wider font-semibold transition-all active:scale-95 cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500/25 border border-rose-400 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : 'bg-white/10 border border-white/15 text-white/80 hover:bg-white/15'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                    <span>REC {recordingTime}s</span>
                  </>
                ) : (
                  <>
                    <CircleDot className="w-3.5 h-3.5 text-rose-400" />
                    <span>START REC</span>
                  </>
                )}
              </button>
            </div>

            {/* Tool 3: 3D Visualization Mode Toggle */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white tracking-wide block">
                  3D Visual Mode
                </span>
                <span className="text-[10px] text-white/50 font-light block">
                  {viewMode === 'spline' ? 'Spline 3D Spatial Scene' : 'Harmonic Interactive Particles'}
                </span>
              </div>
              <button
                onClick={onCycleViewMode}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-medium bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 active:scale-95 transition-all cursor-pointer"
              >
                {currentView.icon}
                <span className="text-[10px] uppercase">SWITCH</span>
              </button>
            </div>

            {/* Tool 4: Current Solfeggio Tuning Summary */}
            <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-cyan-300 font-bold">{activeFreqData.hz} Tuning</span>
                <span className="text-[10px] font-mono uppercase text-cyan-200/80">{activeFreqData.vibe}</span>
              </div>
              <p className="text-[10px] text-white/60 font-light leading-relaxed">
                {activeFreqData.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
