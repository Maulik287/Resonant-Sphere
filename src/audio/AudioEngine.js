import * as Tone from 'tone';

const base = (import.meta.env.BASE_URL || './').replace(/\/?$/, '/');

export const PRESETS = {
  deepSpace: {
    id: 'deepSpace',
    name: 'Into The Loam',
    badge: 'DEEP SPACE DRONE',
    file: `${base}audio/Into The Loam(Deep Space Drone).wav`,
    gain: 2.4, // Sub-bass drone harmonic gain boost for clear desktop/laptop speaker audibility
    description: 'Dark, rumbling cinematic sub-bass drone (Hans Zimmer style) with cosmic tape warmth and low brass resonance.'
  },
  solarWind: {
    id: 'solarWind',
    name: 'Mind River',
    badge: 'SOLAR WIND ARPS',
    file: `${base}audio/Mind River(Solar Wind).wav`,
    gain: 1.0, // Mastered loud & punchy (400Hz - 2500Hz analog modular cascade)
    description: 'Energetic pulsing bassline and rapid analog modular synth arpeggio cascade.'
  },
  binauralDelta: {
    id: 'binauralDelta',
    name: 'Zen Temple Serenity',
    badge: 'BINAURAL DELTA & BOWLS',
    file: `${base}audio/Zen Temple Serenity(Binaural Delta & Tibetan Bowls).wav`,
    gain: 2.1, // Ambient oceanic wash & singing bowl overtones gain boost
    description: 'Scientific 2.5Hz delta brainwave harmonics, rhythmic oceanic surf wash, and Tibetan singing bowl strikes.'
  },
  crystallineSanctuary: {
    id: 'crystallineSanctuary',
    name: 'Celestial Dreamscape',
    badge: 'CRYSTALLINE SANCTUARY',
    file: `${base}audio/Celestial Dreamscape(Crystalline Sanctuary).wav`,
    gain: 2.3, // Delicate music box & cathedral choir acoustics gain boost
    description: 'Celestial music box, high-register crystalline bells, and ethereal cathedral choir acoustics.'
  }
};

function getSafeAudioUrl(filePath) {
  const lastSlash = filePath.lastIndexOf('/');
  if (lastSlash === -1) return encodeURIComponent(filePath);
  const dir = filePath.substring(0, lastSlash + 1);
  const file = filePath.substring(lastSlash + 1);
  return dir + encodeURIComponent(file);
}

function applyAudioCrossOrigin(audio, url) {
  if (typeof window !== 'undefined' && url) {
    try {
      const parsed = new URL(url, window.location.href);
      if (parsed.origin !== window.location.origin) {
        audio.crossOrigin = 'anonymous';
      }
    } catch (e) {
      // Relative or local URL - same origin, no crossOrigin needed
    }
  }
}

export const FREQUENCIES = [
  { 
    value: 174, 
    hz: '174 Hz', 
    vibe: 'Foundation & Deep Grounding', 
    shortVibe: 'Foundation & Grounding',
    desc: 'Very low, warm hum. Used for physical tension release, stress reduction, and deep stability. Excellent for a resting/idle state.',
    cutoff: 500
  },
  { 
    value: 396, 
    hz: '396 Hz', 
    vibe: 'Root & Liberation', 
    shortVibe: 'Root & Liberation',
    desc: 'Grounding mid-low tone. Traditionally used to ease subconscious fear, anxiety, and guilt. Feels reassuring and solid.',
    cutoff: 1500
  },
  { 
    value: 432, 
    hz: '432 Hz', 
    vibe: 'Verdi’s A / Natural Resonance', 
    shortVibe: 'Natural Resonance',
    desc: 'Warm, harmonious, and acoustic. Widely preferred over standard concert pitch (440 Hz) in ambient sound design for deep relaxation and mental ease.',
    cutoff: 2500
  },
  { 
    value: 528, 
    hz: '528 Hz', 
    vibe: 'The "Miracle / Clarity" Tone', 
    shortVibe: 'Miracle & Clarity',
    desc: 'Bright, uplifting, and golden. Associated with clarity, focus, and positive transformation. One of the most popular frequencies for daytime mindfulness.',
    cutoff: 6000
  },
  { 
    value: 639, 
    hz: '639 Hz', 
    vibe: 'Harmony & Connection', 
    shortVibe: 'Harmony & Connection',
    desc: 'Warm and open. Often used to promote empathy, balanced relationships, and emotional coherence. Perfect for lush pad chords.',
    cutoff: 8500
  },
  { 
    value: 741, 
    hz: '741 Hz', 
    vibe: 'Intuition & Problem Solving', 
    shortVibe: 'Intuition & Solving',
    desc: 'Clear, clean, and analytical. Used for mental clarity, detoxifying negative thought patterns, and creative expression.',
    cutoff: 10500
  },
  { 
    value: 852, 
    hz: '852 Hz', 
    vibe: 'Awareness & Stillness', 
    shortVibe: 'Awareness & Stillness',
    desc: 'Ethereal and light. Used for clearing mental chatter and accessing high-focus, meditative stillness.',
    cutoff: 12000
  }
];

const isMobileDevice = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
};

const MOBILE_GAIN_MAP = {
  deepSpace: 1.0,             // 2.4 / 2.4 = 1.0 (Full volume for deep sub drone)
  crystallineSanctuary: 0.95,  // 2.3 / 2.4 = 0.95 (Celestial bells & choir)
  binauralDelta: 0.88,         // 2.1 / 2.4 = 0.88 (Tibetan bowls & delta waves)
  solarWind: 0.45              // 1.0 / 2.4 = 0.45 (Mind River arps mastered loud, scaled so all tracks balance)
};

export class SoundEngine {
  constructor() {
    this.isInitialized = false;
    this.isPlaying = false;
    this.baseFreq = 432;
    this.baseFilterCutoff = 2500;
    this.currentPresetKey = 'deepSpace';
    this.preset = PRESETS.deepSpace;
    this.masterVolume = 1.0;
    this.isMobile = isMobileDevice();

    // Timers
    this.loopTimers = [];
    this.isMusicActive = true;

    // Audio players for Google Flow Music tracks
    this.players = {};

    // Pre-instantiate players so they can be primed synchronously on first user gesture
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      this.createPlayers();
      this.setupVisibilityListeners();
    }

    // Live Telemetry
    this.telemetry = {
      baseFreq: 432,
      currentFilterFreq: 2500,
      pan: 0,
      mouseVelocity: 0,
      tension: 0,
      qValue: 2.0,
      activeVoices: 4,
      currentChordName: 'Into The Loam // Deep Space Drone',
      isMusicPlaying: true,
      presetName: 'Into The Loam'
    };

    // Recorder
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;

    this.pentatonicRatios = [1, 9/8, 5/4, 3/2, 5/3, 2, 9/4, 5/2];
  }

  createPlayers() {
    if (typeof Audio === 'undefined') return;
    Object.entries(PRESETS).forEach(([key, preset]) => {
      if (this.players[key]) return;
      const audio = new Audio();
      const safeUrl = getSafeAudioUrl(preset.file);
      applyAudioCrossOrigin(audio, safeUrl);
      audio.src = safeUrl;
      audio.loop = true;
      // Preload active preset; lazy-load secondary tracks on mobile to prevent memory & bandwidth saturation
      audio.preload = (key === this.currentPresetKey || !this.isMobile) ? 'auto' : 'metadata';
      audio.playbackRate = 1.0;
      audio.volume = 1.0;
      audio.muted = false;
      // Mobile Safari / Chrome inline audio playback attributes
      audio.setAttribute('playsinline', '');
      audio.setAttribute('webkit-playsinline', '');
      audio.setAttribute('x-webkit-airplay', 'allow');

      this.players[key] = {
        element: audio,
        source: null,
        gainNode: null,
        presetKey: key
      };
    });
  }

  setupVisibilityListeners() {
    if (typeof document === 'undefined') return;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isInitialized && this.isMusicActive) {
        const rawCtx = Tone.context?.rawContext || Tone.getContext()?.rawContext;
        if (rawCtx && (rawCtx.state === 'suspended' || rawCtx.state === 'interrupted')) {
          rawCtx.resume().catch(() => {});
        }
        const activePlayer = this.players[this.currentPresetKey];
        if (activePlayer && activePlayer.element && activePlayer.element.paused) {
          activePlayer.element.play().catch(() => {});
        }
      }
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('pageshow', () => {
        if (this.isInitialized && this.isMusicActive) {
          const rawCtx = Tone.context?.rawContext || Tone.getContext()?.rawContext;
          if (rawCtx && (rawCtx.state === 'suspended' || rawCtx.state === 'interrupted')) {
            rawCtx.resume().catch(() => {});
          }
        }
      });
    }
  }

  /**
   * Synchronous audio unlock executed strictly inside a user tap/click/touch gesture.
   * Resolves mobile browser autoplay restrictions (iOS Safari & Android WebKit/Chrome)
   * by invoking .play() before the transient user activation token expires.
   */
  unlockAudioSync() {
    // 1. Force iOS audio session to 'playback' (bypasses physical hardware silent switch on iOS 16.4+)
    if (typeof navigator !== 'undefined' && 'audioSession' in navigator) {
      try {
        navigator.audioSession.type = 'playback';
      } catch (e) {}
    }

    // 2. Synchronously resume AudioContext for Tone.js
    try {
      const rawCtx = Tone.context?.rawContext || Tone.getContext()?.rawContext;
      if (rawCtx && rawCtx.state === 'suspended') {
        rawCtx.resume();
      }
    } catch (e) {}

    // 3. Ensure preset players are instantiated
    this.createPlayers();

    // 4. Synchronously trigger .play() directly on active preset element!
    // Important: No dummy silent audio here so the single iOS user gesture token is 100% dedicated to the real music!
    const activePlayer = this.players[this.currentPresetKey];
    if (activePlayer && activePlayer.element && this.isMusicActive) {
      try {
        activePlayer.element.muted = false;
        activePlayer.element.playbackRate = 1.0;
        if (this.isMobile) {
          const vol = (MOBILE_GAIN_MAP[this.currentPresetKey] || 1.0) * (this.masterVolume ?? 1.0);
          activePlayer.element.volume = Math.max(0, Math.min(1.0, vol));
        }
        if (activePlayer.element.paused) {
          const playPromise = activePlayer.element.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch((err) => {
              console.warn('Sync play attempt notice:', err);
            });
          }
        }
      } catch (e) {}
    }
  }

  async initialize() {
    if (this.isInitialized) return;

    // Ensure audio session is in playback mode
    if (typeof navigator !== 'undefined' && 'audioSession' in navigator) {
      try {
        navigator.audioSession.type = 'playback';
      } catch (e) {}
    }

    // 1. AudioContext setup
    await Tone.start();
    const rawCtx = Tone.context?.rawContext || Tone.getContext()?.rawContext;
    if (rawCtx && rawCtx.state !== 'running') {
      try {
        await rawCtx.resume();
      } catch (e) {}
    }
    Tone.context.lookAhead = 0.05;

    Tone.getDestination().mute = false;
    Tone.getDestination().volume.value = 0;

    // 2. Master Gain (Clean transparent headroom)
    this.masterGain = new Tone.Gain(1.0).toDestination();

    // 3. Audio Spectrum Analyser
    if (rawCtx) {
      this.analyser = rawCtx.createAnalyser();
      this.analyser.fftSize = 128; // Snappy 64 frequency bands
      this.analyser.smoothingTimeConstant = 0.7; // Fast responsive beat tracking
      this.masterGain.connect(this.analyser);
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    try {
      this.recordDest = Tone.context.createMediaStreamDestination();
      this.masterGain.connect(this.recordDest);
    } catch (e) {}

    // 4. Transparent Stereo Panning & Natural Clean Low-Pass Filter on Song Path
    this.panner = new Tone.Panner(0);
    this.mainFilter = new Tone.Filter({
      frequency: this.baseFilterCutoff,
      type: 'lowpass',
      rolloff: -12,
      Q: 0.7
    });

    this.mainFilter.connect(this.panner);
    this.panner.connect(this.masterGain);

    // 5. Connect players cleanly
    this.createPlayers();
    if (!this.isMobile) {
      // DESKTOP ONLY: WebAudio routing for DSP filter, stereo panning & calibrated gain
      Object.entries(this.players).forEach(([key, player]) => {
        if (rawCtx && !player.source) {
          try {
            player.source = rawCtx.createMediaElementSource(player.element);
            player.gainNode = rawCtx.createGain();
            player.gainNode.gain.value = 0; // muted initially until selected
            player.source.connect(player.gainNode);
            Tone.connect(player.gainNode, this.mainFilter);
          } catch (err) {
            console.warn(`WebAudio routing for ${key} notice:`, err);
          }
        }
      });
    }
    // Note for Mobile: Do NOT call createMediaElementSource!
    // Leaving audio element unattached allows native HTML5 audio to route directly
    // through the phone speaker, completely bypassing the iOS hardware Silent Switch and WebAudio muting!

    this.isInitialized = true;
    this.isPlaying = true;

    // Apply the active preset immediately
    this.setPreset(this.currentPresetKey);
  }

  async loadUserAudio(file) {
    if (!file) return null;

    if (!this.isInitialized) {
      await this.initialize();
    }

    const rawCtx = Tone.context.rawContext || Tone.getContext().rawContext;
    const objectUrl = URL.createObjectURL(file);
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

    // Clean up existing user player if one already exists
    if (this.players.userUpload) {
      try {
        this.players.userUpload.element.pause();
        this.players.userUpload.element.src = '';
      } catch (e) {}
    }

    this.customPreset = {
      id: 'userUpload',
      name: fileNameWithoutExt,
      badge: 'YOUR TRACK',
      file: objectUrl,
      description: `Uploaded Song: "${file.name}" retuned to Solfeggio frequencies.`
    };

    const audio = new Audio();
    audio.src = objectUrl;
    audio.loop = true;
    audio.preload = 'auto';
    audio.playbackRate = 1.0; // Strictly 1.0 normal playback speed
    audio.volume = 1.0;
    audio.muted = false;
    audio.setAttribute('playsinline', '');
    audio.setAttribute('webkit-playsinline', '');

    let sourceNode = null;
    let gainNode = null;

    if (!this.isMobile && rawCtx) {
      try {
        sourceNode = rawCtx.createMediaElementSource(audio);
        gainNode = rawCtx.createGain();
        gainNode.gain.value = 0;
        sourceNode.connect(gainNode);
        Tone.connect(gainNode, this.mainFilter);
      } catch (err) {
        console.warn('WebAudio routing for user upload notice:', err);
      }
    }

    this.players.userUpload = {
      element: audio,
      source: sourceNode,
      gainNode: gainNode,
      isCustom: true
    };

    this.isMusicActive = true;
    this.setPreset('userUpload');
    return this.customPreset;
  }

  setPreset(presetKey) {
    let presetObj = PRESETS[presetKey];
    if (presetKey === 'userUpload' && this.customPreset) {
      presetObj = this.customPreset;
    }
    if (!presetObj) return;

    this.currentPresetKey = presetKey;
    this.preset = presetObj;
    this.telemetry.presetName = this.preset.name;
    this.telemetry.currentChordName = `${this.preset.name} [${this.preset.badge}]`;

    if (!this.isInitialized) return;

    const rawCtx = Tone.context.rawContext || Tone.getContext().rawContext;
    const now = rawCtx ? rawCtx.currentTime : 0;    // Crossfade out other players
    Object.entries(this.players).forEach(([key, player]) => {
      if (key !== presetKey) {
        if (!this.isMobile && player.gainNode && rawCtx) {
          player.gainNode.gain.setTargetAtTime(0, now, 0.4);
        } else {
          player.element.volume = 0;
        }
        setTimeout(() => {
          if (this.currentPresetKey !== key) {
            player.element.pause();
          }
        }, 600);
      }
    });

    // Crossfade in active player
    const activePlayer = this.players[presetKey];
    if (activePlayer) {
      activePlayer.element.muted = false;
      activePlayer.element.playbackRate = 1.0;
      const targetGain = presetObj.gain || 1.0;

      if (this.isMusicActive) {
        if (!this.isMobile && activePlayer.gainNode && rawCtx) {
          // DESKTOP: Web Audio routing with calibrated boost gains
          activePlayer.element.volume = 1.0;
          activePlayer.element.play().catch((e) => console.warn('Audio play trigger:', e));
          activePlayer.gainNode.gain.cancelScheduledValues(now);
          activePlayer.gainNode.gain.setValueAtTime(activePlayer.gainNode.gain.value, now);
          activePlayer.gainNode.gain.setTargetAtTime(targetGain, now, 0.4);
        } else {
          // MOBILE: Native direct audio playback to phone speakers
          const vol = (MOBILE_GAIN_MAP[presetKey] || 1.0) * (this.masterVolume ?? 1.0);
          activePlayer.element.volume = Math.max(0, Math.min(1.0, vol));
          activePlayer.element.play().catch((e) => console.warn('Mobile audio play trigger:', e));
        }
      }
    }
  }

  setBaseFrequency(freq) {
    this.baseFreq = freq;
    this.telemetry.baseFreq = freq;

    const freqObj = FREQUENCIES.find((f) => f.value === freq) || FREQUENCIES[2];
    // Keep a healthy minimum cutoff of 850 Hz so higher-register presets (bells, bowls) are never silenced
    this.baseFilterCutoff = Math.max(850, freqObj.cutoff);

    // 1. Strictly lock song playback rate to 1.0 - never speed up or slow down
    Object.values(this.players).forEach((p) => {
      if (p && p.element) {
        p.element.playbackRate = 1.0;
      }
    });

    if (!this.isInitialized) return;

    // 2. Low-Pass Filter shaping on the song path according to frequency mode:
    if (this.mainFilter) {
      this.mainFilter.frequency.rampTo(this.baseFilterCutoff, 0.35);
      this.telemetry.currentFilterFreq = Math.round(this.baseFilterCutoff);
    }
  }

  stopMusic() {
    this.isMusicActive = false;
    this.telemetry.isMusicPlaying = false;

    const rawCtx = Tone.context.rawContext || Tone.getContext()?.rawContext;
    const now = rawCtx ? rawCtx.currentTime : 0;

    // Immediately stop and mute ALL audio players
    Object.values(this.players).forEach((player) => {
      try {
        if (!this.isMobile && player.gainNode && rawCtx) {
          player.gainNode.gain.cancelScheduledValues(now);
          player.gainNode.gain.setValueAtTime(0, now);
        } else {
          player.element.volume = 0;
        }
        player.element.pause();
      } catch (err) {
        console.warn('Error stopping player:', err);
      }
    });

    return false;
  }

  playMusic() {
    this.isMusicActive = true;
    this.telemetry.isMusicPlaying = true;

    if (!this.isInitialized) {
      return true;
    }

    const rawCtx = Tone.context.rawContext || Tone.getContext()?.rawContext;
    const now = rawCtx ? rawCtx.currentTime : 0;
    const activePlayer = this.players[this.currentPresetKey];

    if (activePlayer) {
      activePlayer.element.muted = false;
      activePlayer.element.playbackRate = 1.0; // Strictly 1.0 normal speed
      const targetGain = this.preset?.gain || 1.0;

      if (!this.isMobile && activePlayer.gainNode && rawCtx) {
        activePlayer.element.volume = 1.0;
        activePlayer.element.play().catch((e) => console.warn('Audio play trigger:', e));
        activePlayer.gainNode.gain.cancelScheduledValues(now);
        activePlayer.gainNode.gain.setValueAtTime(activePlayer.gainNode.gain.value, now);
        activePlayer.gainNode.gain.setTargetAtTime(targetGain, now, 0.25);
      } else {
        const vol = (MOBILE_GAIN_MAP[this.currentPresetKey] || 1.0) * (this.masterVolume ?? 1.0);
        activePlayer.element.volume = Math.max(0, Math.min(1.0, vol));
        activePlayer.element.play().catch((e) => console.warn('Mobile audio play trigger:', e));
      }
    }

    return true;
  }

  toggleAutonomousMusic() {
    if (this.isMusicActive) {
      return this.stopMusic();
    } else {
      return this.playMusic();
    }
  }

  getAudioReactiveData() {
    if (!this.analyser || !this.isMusicActive) {
      return { bass: 0, mid: 0, level: 0, beat: false };
    }

    this.analyser.getByteFrequencyData(this.freqData);

    // 1. Bass Energy (~20Hz to 220Hz, bins 0-5)
    let bassSum = 0;
    const bassBins = Math.min(5, this.freqData.length);
    for (let i = 0; i < bassBins; i++) {
      bassSum += this.freqData[i];
    }
    const bass = bassSum / (bassBins * 255);

    // 2. Mid Harmonics (~220Hz to 1600Hz, bins 5-18)
    let midSum = 0;
    const midBins = Math.min(18, this.freqData.length);
    for (let i = bassBins; i < midBins; i++) {
      midSum += this.freqData[i];
    }
    const mid = midSum / (Math.max(1, midBins - bassBins) * 255);

    // 3. Overall Level
    let totalSum = 0;
    for (let i = 0; i < this.freqData.length; i++) {
      totalSum += this.freqData[i];
    }
    const level = totalSum / (this.freqData.length * 255);

    // 4. Dynamic Beat Detection
    if (!this.beatThreshold) this.beatThreshold = 0.28;
    let beat = false;
    if (bass > this.beatThreshold && bass > 0.22) {
      beat = true;
      this.beatThreshold = bass * 1.15;
    } else {
      this.beatThreshold = Math.max(0.22, this.beatThreshold * 0.95);
    }

    return {
      bass,
      mid,
      level,
      beat
    };
  }

  updateInteraction({ normX, normY, velocity, isHolding }) {
    if (!this.isInitialized) return;

    const now = Tone.now();

    // 1. X-Axis: Gentle 3D Stereo Panning
    const targetPan = (normX - 0.5) * 1.4;
    this.panner.pan.rampTo(targetPan, 0.08, now);
    this.telemetry.pan = Number(targetPan.toFixed(2));

    // 2. Y-Axis: Natural Clean Low-Pass Sculpting around active frequency mode
    const invertedY = Math.max(0, Math.min(1, 1 - normY));
    const modFactor = 0.75 + invertedY * 0.5; // subtle +/- 25% curve
    const targetCutoff = Math.max(250, Math.min(18000, this.baseFilterCutoff * modFactor));
    this.mainFilter.frequency.rampTo(targetCutoff, 0.08, now);
    this.telemetry.currentFilterFreq = Math.round(targetCutoff);

    // 3. Mouse Velocity telemetry (visual only, no fake synth beeps)
    this.telemetry.mouseVelocity = Math.round(velocity);

    // 4. Click & Hold: Telemetry tension for visual resonance (no sawtooth buzz)
    if (isHolding) {
      this.telemetry.tension = Math.min(100, this.telemetry.tension + 4);
    } else {
      this.telemetry.tension = Math.max(0, this.telemetry.tension - 6);
    }
  }

  setMasterVolume(volumeNormalized) {
    this.masterVolume = Math.max(0, Math.min(1.0, volumeNormalized));
    if (this.masterGain) {
      try {
        this.masterGain.gain.rampTo(this.masterVolume, 0.05);
      } catch (e) {
        this.masterGain.gain.value = this.masterVolume;
      }
    }
    const activePlayer = this.players[this.currentPresetKey];
    if (activePlayer && activePlayer.element) {
      if (this.isMobile || !activePlayer.gainNode) {
        const vol = (MOBILE_GAIN_MAP[this.currentPresetKey] || 1.0) * this.masterVolume;
        activePlayer.element.volume = Math.max(0, Math.min(1.0, vol));
      }
    }
  }

  startRecording() {
    if (!this.recordDest) return;
    try {
      this.recordedChunks = [];
      const stream = this.recordDest.stream;
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `resonant-sphere-${this.preset.id}-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
      };

      this.mediaRecorder.start(200);
      this.isRecording = true;
      return true;
    } catch (err) {
      console.error('Recording initialization error:', err);
      return false;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  getTelemetry() {
    return { ...this.telemetry };
  }
}

export const soundEngine = new SoundEngine();
