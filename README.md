# The Resonant Sphere — Interactive Generative Sound Experience

An audiovisual ambient instrument bridging tactile 3D particle physics with real-time Web Audio synthesis.

## 🌟 Core Architecture & Audio-Visual Mappings

- **X-Axis (Horizontal Sweep)**: 
  - Dynamic stereo panning via `Tone.Panner` across the binaural soundfield.
  - Spectral bandpass tilt sweeping between warm lower-mids and crystalline highs.
- **Y-Axis (Vertical Rise)**: 
  - 24dB/oct resonant low-pass filter cutoff sweeping exponentially from `220 Hz` to `8,360 Hz`.
  - Introduces subtle higher harmonic layers (fifth / octave sine overtones).
- **Mouse Velocity / Acceleration**: 
  - Rapid cursor flicking triggers wet reverb decay bloom and pentatonic celestial shimmer chime notes.
- **Click & Hold (Harmonic Tension / Charge-Up)**: 
  - Compresses particles into a high-density luminous core while ramping filter resonance ($Q$) and triggering a deep sub-bass surge.
  - Releasing mouse triggers an acoustic wash bloom shockwave.
- **Session Recorder**: 
  - Records real-time 30–60s stereo audio sessions straight to `.webm` file downloads.
- **Base Tuning Selector**: 
  - 432 Hz Grounding, 528 Hz Clarity, 440 Hz Concert A, 174 Hz Foundation, 639 Hz Connection.
- **Acoustic Presets**: 
  - Deep Space Drone, Solar Wind, Binaural Delta 2.5Hz, Crystalline Sanctuary.

---

## 🎨 Integrating Your Spline Component

You can integrate your Spline component in either of two ways:

### Option 1: Drop your Spline export code into `src/components/UserSpline.jsx`
Open [`src/components/UserSpline.jsx`](file:///src/components/UserSpline.jsx) and paste your React component code directly.

### Option 2: Provide your Spline Scene URL
Paste your public `.splinecode` URL into the in-app HUD by clicking the **Link icon** in the top bar, or update `splineUrl` in [`src/App.jsx`](file:///src/App.jsx).

---

## 🚀 Running Locally

```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.
