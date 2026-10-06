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
  Plus
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
  const [mobileTab, setMobileTab] = useState('freq'); // 'freq' | 'presets'
  const [showMobileTools, setShowMobileTools] = useState(false);
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
            {/* Prominent Play / Stop Music Button */}
            <button
              onClick={onToggleMusic}
              className={`hud-pill flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono tracking-wider px-2.5 sm:px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                isMusicPlaying
                  ? 'border-rose-500/60 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 shadow-[0_0_18px_rgba(244,63,94,0.35)]'
                  : 'border-cyan-400/60 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 shadow-[0_0_18px_rgba(6,182,212,0.35)]'
              }`}
              title={isMusicPlaying ? "Stop music playback (or press Space)" : "Play music (or press Space)"}
            >
              {isMusicPlaying ? (
                <>
                  <Square className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-rose-400 text-rose-400" />
                  <span className="font-semibold tracking-wider text-rose-200">STOP</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-cyan-300 text-cyan-300 ml-0.5" />
                  <span className="font-semibold tracking-wider text-cyan-200">PLAY</span>
                </>
              )}
            </button>

            {/* Upload Song Pill */}
            <label 
              className="hud-pill flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-mono tracking-wider p-1.5 sm:px-3 sm:py-1.5 rounded-full transition-all cursor-pointer border-indigo-400/50 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 hover:border-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
              title="Upload audio/video file (MP3, WAV, MP4, M4A)"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
              <span className="font-semibold tracking-wider hidden sm:inline">UPLOAD</span>
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

            {/* Mobile Quick Settings Toggle Button */}
            <button
              onClick={() => setShowMobileTools(!showMobileTools)}
              className={`md:hidden hud-pill p-1.5 rounded-full transition-all cursor-pointer ${
                showMobileTools ? 'border-cyan-400 bg-cyan-500/35 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]' : 'text-white/75'
              }`}
              title="Sound settings, view mode & volume"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Desktop-Only Controls */}
            <div className="hidden md:flex items-center gap-3">
              {/* View Mode Cycle */}
              <button
                onClick={onCycleViewMode}
                className="hud-pill flex items-center gap-2 text-[11px] font-mono tracking-wider px-3.5 py-1.5 rounded-full transition-all hover:border-cyan-400/50"
                title="Cycle visual mode: Spline 3D Scene / Harmonic Particles"
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

            {/* Info Guide Button */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="hud-pill p-1.5 sm:p-2 rounded-full transition-all hover:border-white/30"
              title="Acoustic-visual mappings & harmonic guide"
            >
              <Info className="w-3.5 h-3.5 text-white/75" />
            </button>
          </div>
        </header>

        {/* MOBILE QUICK TOOLS DRAWER (Volume, View Mode, Recorder, File Upload) */}
        {showMobileTools && (
          <div className="md:hidden pointer-events-auto p-3 rounded-2xl bg-[#090d19]/95 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col gap-2.5 z-40 transition-all animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Volume Control Row */}
            <div className="flex items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2 text-white/90 text-xs font-mono">
                {volume > 0.01 ? <Volume2 className="w-3.5 h-3.5 text-cyan-300" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
                <span>VOLUME: {Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-32 h-1.5 accent-cyan-400 bg-white/20 rounded cursor-pointer"
              />
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
              {/* View Mode Toggle */}
              <button
                onClick={onCycleViewMode}
                className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-wider py-2 rounded-xl bg-white/5 border border-white/15 text-white/85 active:bg-white/15"
              >
                {currentView.icon}
                <span className="truncate">{viewMode === 'spline' ? 'SPLINE 3D' : 'PARTICLES'}</span>
              </button>

              {/* Record Audio */}
              <button
                onClick={onToggleRecording}
                className={`flex-1 flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-wider py-2 rounded-xl border transition-all active:scale-[0.98] ${
                  isRecording 
                    ? 'border-rose-500/60 bg-rose-500/25 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]' 
                    : 'bg-white/5 border-white/15 text-white/85 active:bg-white/15'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-2.5 h-2.5 text-rose-400 fill-rose-400 animate-pulse" />
                    <span>REC {recordingTime}s</span>
                  </>
                ) : (
                  <>
                    <CircleDot className="w-3 h-3 text-rose-400" />
                    <span>RECORD</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Upload Button */}
            <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-mono tracking-wide cursor-pointer active:bg-indigo-500/30">
              <Upload className="w-3.5 h-3.5 text-indigo-300" />
              <span>UPLOAD AUDIO / VIDEO FILE</span>
              <input 
                type="file" 
                accept="audio/*,video/mp4,video/*,.mp4,.m4a,.mov,.webm,.wav,.mp3,.aac,.flac" 
                className="hidden" 
                onChange={(e) => { 
                  if (e.target.files && e.target.files[0]) { 
                    onUploadAudio(e.target.files[0]); 
                    setShowMobileTools(false);
                    e.target.value = ''; 
                  } 
                }} 
              />
            </label>
          </div>
        )}

        {/* MOBILE-ONLY: Segmented Solfeggio & Tracks Carousel (Neatly docked at top) */}
        <div className="md:hidden flex flex-col gap-1.5 pointer-events-auto">
          {/* Segmented Switcher */}
          <div className="flex items-center bg-black/60 backdrop-blur-md p-0.5 rounded-full border border-white/15 w-fit">
            <button
              onClick={() => setMobileTab('freq')}
              className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                mobileTab === 'freq'
                  ? 'bg-cyan-500/30 text-white font-semibold border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.35)]'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              SOLFEGGIO ({activeFreq} Hz)
            </button>
            <button
              onClick={() => setMobileTab('presets')}
              className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                mobileTab === 'presets'
                  ? 'bg-indigo-500/30 text-white font-semibold border border-indigo-400/60 shadow-[0_0_10px_rgba(99,102,241,0.35)]'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              TRACKS {customTrack ? '★' : ''}
            </button>
          </div>

          {/* Tab 1: Horizontal swipeable Solfeggio Pills */}
          {mobileTab === 'freq' && (
            <div className="flex flex-col gap-1">
              <div 
                className="touch-carousel flex overflow-x-auto no-scrollbar gap-1.5 py-1 -mx-3 px-3 snap-x snap-mandatory"
                style={{ touchAction: 'pan-x' }}
              >
                {FREQUENCIES.map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => onFreqChange(freq.value)}
                    className={`shrink-0 snap-start flex items-center gap-1.5 text-[10px] tracking-wide px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95 ${
                      activeFreq === freq.value
                        ? 'bg-cyan-500/35 border border-cyan-400/80 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-black/65 text-white/70 border border-white/10 active:bg-white/10'
                    }`}
                  >
                    <span className="font-mono font-bold text-cyan-300">{freq.hz}</span>
                    <span className="text-[9px] opacity-80">{freq.shortVibe.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
              {/* Compact active frequency note */}
              {activeFreqData && (
                <div className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-cyan-400/25 text-white/85 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-cyan-200 font-medium truncate max-w-[210px]">{activeFreqData.vibe}</span>
                  <span className="text-white/50 shrink-0">{Math.round(telemetry.currentFilterFreq)} Hz LPF</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Horizontal swipeable Presets */}
          {mobileTab === 'presets' && (
            <div 
              className="touch-carousel flex overflow-x-auto no-scrollbar gap-1.5 py-1 -mx-3 px-3 snap-x snap-mandatory"
              style={{ touchAction: 'pan-x' }}
            >
              {customTrack && (
                <button
                  onClick={() => onPresetChange('userUpload')}
                  className={`shrink-0 snap-start flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95 ${
                    activePreset === 'userUpload'
                      ? 'bg-gradient-to-r from-indigo-500/40 to-cyan-500/40 border border-indigo-400 text-white shadow-[0_0_14px_rgba(99,102,241,0.4)]'
                      : 'bg-indigo-950/70 text-indigo-200 border border-indigo-500/40'
                  }`}
                >
                  <Music2 className="w-2.5 h-2.5 text-indigo-300" />
                  <span className="font-semibold text-white truncate max-w-[100px]">{customTrack.name}</span>
                  <span className="text-[8px] font-mono text-indigo-300">[YOUR SONG]</span>
                </button>
              )}
              {Object.entries(PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => onPresetChange(key)}
                  className={`shrink-0 snap-start flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                    activePreset === key
                      ? 'bg-gradient-to-r from-cyan-500/35 to-indigo-500/35 border border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-black/65 text-white/65 border border-white/10 active:bg-white/10'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[8px] font-mono text-cyan-300/80">{p.badge.split(' ')[0]}</span>
                </button>
              ))}

              {/* Upload Pill in Tracks tab */}
              <label className="shrink-0 snap-start flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full transition-all cursor-pointer bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-200 border border-indigo-400/30">
                <Plus className="w-3 h-3 text-indigo-300" />
                <span className="font-mono">+ UPLOAD</span>
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
            </div>
          )}
        </div>

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
        {/* Mobile-Only Minimal Telemetry & Gesture Hint */}
        <div className="flex md:hidden items-center justify-between w-full pointer-events-auto">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/15 text-[9px] shadow-lg">
            <span className="text-cyan-300 font-semibold">{telemetry.baseFreq} HZ</span>
            <span className="text-white/25">·</span>
            <span className="text-indigo-300">{formatHz(telemetry.currentFilterFreq)} HZ</span>
            <span className="text-white/25">·</span>
            <span className={`font-medium ${telemetry.isMusicPlaying ? 'text-emerald-400' : 'text-rose-400'}`}>
              {telemetry.isMusicPlaying ? 'PLAYING' : 'MUTED'}
            </span>
          </div>
          <span className="text-[8px] text-white/40 tracking-wider uppercase font-mono pl-2">
            DRAG TO MODULATE
          </span>
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
    </div>
  );
}
