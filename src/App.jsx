import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundEngine } from './audio/AudioEngine';
import UserSpline from './components/UserSpline';
import ParticleSphere from './components/ParticleSphere';
import HUD from './components/HUD';
import AudioPrompt from './components/AudioPrompt';

export default function App() {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [activeFreq, setActiveFreq] = useState(432);
  const [activePreset, setActivePreset] = useState('deepSpace');
  const [customTrack, setCustomTrack] = useState(null);
  const [volume, setVolume] = useState(1.0); // 100% full volume by default
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef(null);

  // Visual View Mode: 'spline' | 'particles'
  const [viewMode, setViewMode] = useState('spline');

  // Interaction telemetry
  const [interaction, setInteraction] = useState({ normX: 0.5, normY: 0.5 });
  const [telemetry, setTelemetry] = useState(soundEngine.getTelemetry());

  // Mouse tracking & acceleration refs
  const lastMousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, time: Date.now() });
  const mouseVelocity = useRef(0);
  const isHolding = useRef(false);
  const lastUserInteractionTime = useRef(Date.now());

  // 1. Audio Initialization
  const handleInitializeAudio = async () => {
    if (audioInitialized) return;
    try {
      soundEngine.unlockAudioSync();
    } catch {}
    setAudioInitialized(true);
    setIsMusicPlaying(true);
    try {
      await soundEngine.initialize();
      soundEngine.setMasterVolume(volume);
    } catch (err) {
      console.warn('Audio initialization notice:', err);
    }
  };

  // 2. Frequency, Preset & Music Change handlers
  const handleFreqChange = (freq) => {
    try {
      soundEngine.unlockAudioSync();
    } catch {}
    setActiveFreq(freq);
    soundEngine.setBaseFrequency(freq);
  };

  const handlePresetChange = (presetKey) => {
    try {
      soundEngine.unlockAudioSync();
    } catch {}
    setActivePreset(presetKey);
    soundEngine.setPreset(presetKey);
  };

  const handleUploadAudio = async (file) => {
    try {
      try {
        soundEngine.unlockAudioSync();
      } catch {}
      if (!audioInitialized) {
        setAudioInitialized(true);
      }
      const presetInfo = await soundEngine.loadUserAudio(file);
      if (presetInfo) {
        setCustomTrack(presetInfo);
        setActivePreset('userUpload');
        setIsMusicPlaying(true);
        setAudioInitialized(true);
      }
    } catch (err) {
      console.error('Audio upload error:', err);
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    soundEngine.setMasterVolume(newVol);
  };

  const handleToggleMusic = async () => {
    try {
      soundEngine.unlockAudioSync();
    } catch {}
    if (!audioInitialized) {
      await handleInitializeAudio();
      return;
    }
    const active = soundEngine.toggleAutonomousMusic();
    setIsMusicPlaying(active);
  };

  // Spacebar keyboard shortcut to Play / Stop music
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleToggleMusic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioInitialized, isMusicPlaying]);

  // 3. Session Recording
  const handleToggleRecording = () => {
    if (isRecording) {
      soundEngine.stopRecording();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
      setRecordingTime(0);
    } else {
      const started = soundEngine.startRecording();
      if (started) {
        setIsRecording(true);
        setRecordingTime(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime((prev) => {
            if (prev >= 60) {
              soundEngine.stopRecording();
              setIsRecording(false);
              clearInterval(recordingTimerRef.current);
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }
    }
  };

  // 4. Pointer Interaction and Physics Loop
  const handlePointerMove = useCallback((e) => {
    const x = e.clientX;
    const y = e.clientY;
    const now = Date.now();
    lastUserInteractionTime.current = now;

    const dt = Math.max(1, now - lastMousePos.current.time);
    const dx = x - lastMousePos.current.x;
    const dy = y - lastMousePos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const instantVelocity = (dist / dt) * 1000;

    mouseVelocity.current = mouseVelocity.current * 0.7 + instantVelocity * 0.3;
    lastMousePos.current = { x, y, time: now };

    const normX = Math.max(0, Math.min(1, x / window.innerWidth));
    const normY = Math.max(0, Math.min(1, y / window.innerHeight));

    setInteraction({ normX, normY });

    if (soundEngine.isInitialized) {
      soundEngine.updateInteraction({
        normX,
        normY,
        velocity: mouseVelocity.current,
        isHolding: isHolding.current
      });
    }
  }, []);

  const handlePointerDown = () => {
    if (!audioInitialized) {
      try {
        soundEngine.unlockAudioSync();
      } catch {}
      handleInitializeAudio();
    }
    isHolding.current = true;
    lastUserInteractionTime.current = Date.now();
    if (soundEngine.isInitialized) {
      soundEngine.updateInteraction({
        normX: interaction.normX,
        normY: interaction.normY,
        velocity: mouseVelocity.current,
        isHolding: true
      });
    }
  };

  const handlePointerUp = () => {
    isHolding.current = false;
    lastUserInteractionTime.current = Date.now();
    if (soundEngine.isInitialized) {
      soundEngine.updateInteraction({
        normX: interaction.normX,
        normY: interaction.normY,
        velocity: mouseVelocity.current,
        isHolding: false
      });
    }
  };

  // Global window pointer listeners
  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, audioInitialized]);

  // Continuous animation frame loop to decay velocity, handle autonomous idle breathing, and update telemetry
  useEffect(() => {
    let animId;
    let time = 0;

    const tick = () => {
      time += 0.016;

      mouseVelocity.current *= 0.92;
      if (mouseVelocity.current < 1) mouseVelocity.current = 0;

      const idleTime = Date.now() - lastUserInteractionTime.current;
      let effectiveNormX = interaction.normX;
      let effectiveNormY = interaction.normY;

      if (idleTime > 2500) {
        effectiveNormX = 0.5 + Math.sin(time * 0.45) * 0.18;
        effectiveNormY = 0.5 + Math.cos(time * 0.35) * 0.16;
        setInteraction({ normX: effectiveNormX, normY: effectiveNormY });
      }

      if (soundEngine.isInitialized) {
        soundEngine.updateInteraction({
          normX: effectiveNormX,
          normY: effectiveNormY,
          velocity: mouseVelocity.current,
          isHolding: isHolding.current
        });
        setTelemetry(soundEngine.getTelemetry());
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [interaction]);

  // Clean up recording timer
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  const cycleViewMode = () => {
    setViewMode((prev) => (prev === 'spline' ? 'particles' : 'spline'));
  };

  return (
    <main className="fixed inset-0 w-full h-full h-[100dvh] overflow-hidden ambient-bg select-none touch-none">
      {/* Visual Layer 1: Direct Spline iFrame Embed */}
      {viewMode === 'spline' && (
        <UserSpline 
          isMusicPlaying={isMusicPlaying && audioInitialized} 
          activeFreq={activeFreq} 
        />
      )}

      {/* Visual Layer 2: Mathematical 3D Golden Spiral Harmonic Particles */}
      {viewMode === 'particles' && (
        <ParticleSphere
          presetKey={activePreset}
          interaction={interaction}
          tension={telemetry.tension}
          velocity={telemetry.mouseVelocity}
          filterFreq={telemetry.currentFilterFreq}
          isAudioActive={audioInitialized}
        />
      )}

      {/* Floating Ethereal HUD Overlay */}
      <HUD
        audioInitialized={audioInitialized}
        onInitializeAudio={handleInitializeAudio}
        activeFreq={activeFreq}
        onFreqChange={handleFreqChange}
        activePreset={activePreset}
        onPresetChange={handlePresetChange}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isRecording={isRecording}
        onToggleRecording={handleToggleRecording}
        recordingTime={recordingTime}
        telemetry={telemetry}
        viewMode={viewMode}
        onCycleViewMode={cycleViewMode}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        customTrack={customTrack}
        onUploadAudio={handleUploadAudio}
      />

      {/* Audio Initializer Overlay if not yet triggered */}
      {!audioInitialized && (
        <AudioPrompt onInitialize={handleInitializeAudio} />
      )}
    </main>
  );
}
