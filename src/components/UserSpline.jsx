import React, { useRef, useEffect } from 'react';

/**
 * USER SPLINE COMPONENT (Floating Sphere Connected to Music State)
 * Floats gently when music is playing.
 * Gracefully settles and completely stops floating when music is stopped.
 */
export default function UserSpline({ isMusicPlaying = false, activeFreq = 432 }) {
  const containerRef = useRef(null);
  const auraRef = useRef(null);
  const isPlayingRef = useRef(isMusicPlaying);
  const activeFreqRef = useRef(activeFreq);

  // Keep refs updated without restarting the animation loop
  useEffect(() => {
    isPlayingRef.current = isMusicPlaying;
  }, [isMusicPlaying]);

  useEffect(() => {
    activeFreqRef.current = activeFreq;
  }, [activeFreq]);

  useEffect(() => {
    let animId;
    let time = 0;
    let floatFactor = isPlayingRef.current ? 1.0 : 0.0;
    // Normalized Solfeggio ratio: 0 (174 Hz) to 1 (852 Hz)
    let smoothFreqFactor = Math.max(0, Math.min(1, ((activeFreqRef.current || 432) - 174) / (852 - 174)));

    const tick = () => {
      // Smoothly transition between 1 (floating) and 0 (resting motionless)
      const targetFactor = isPlayingRef.current ? 1.0 : 0.0;
      floatFactor += (targetFactor - floatFactor) * 0.04;

      // Target frequency factor (174Hz = 0.0, 432Hz ≈ 0.38, 528Hz ≈ 0.52, 852Hz = 1.0)
      const targetFreqFactor = Math.max(0, Math.min(1, ((activeFreqRef.current || 432) - 174) / (852 - 174)));
      // Smooth organic lerp when switching frequencies
      smoothFreqFactor += (targetFreqFactor - smoothFreqFactor) * 0.035;

      // 1. Altitude offset: lower frequency sits lower (+10px), higher frequency floats higher (-16px)
      const altitudeOffset = 10 - smoothFreqFactor * 26;

      // 2. Amplitude multiplier: 0.8x for 174Hz up to 1.35x for 852Hz
      const amplitudeMult = 0.8 + smoothFreqFactor * 0.55;

      // 3. Rhythm/speed: slower & deeper for low frequencies, lighter & airier for high frequencies
      const speedMult = 0.85 + smoothFreqFactor * 0.4;

      // Advance time smoothly according to current float factor and frequency speed
      if (floatFactor > 0.001) {
        time += 0.015 * floatFactor * speedMult;
      }

      // Zero-gravity floating motion scaled by floatFactor and frequency amplitude/altitude
      const waveY = (Math.sin(time * 0.85) * 18 + Math.sin(time * 0.4) * 6) * amplitudeMult;
      const floatY = (waveY + altitudeOffset) * floatFactor;
      const floatX = (Math.cos(time * 0.6) * 10 * amplitudeMult) * floatFactor;

      // Apply transform: glides back to exactly (0, 0, 0) when music stops
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${floatX.toFixed(2)}px, ${floatY.toFixed(2)}px, 0)`;
      }

      // Ethereal aura breathes with frequency expansion
      if (auraRef.current) {
        const auraSizeMult = 1.0 + smoothFreqFactor * 0.15;
        const auraBreath = (1 + Math.sin(time * 0.7) * 0.08 * floatFactor) * auraSizeMult;
        const auraOpacity = 0.15 + (0.2 + smoothFreqFactor * 0.1) * floatFactor;
        const isMobile = window.innerWidth < 768;
        const yOffset = isMobile ? '-56%' : '-50%';
        auraRef.current.style.transform = `translate(-50%, ${yOffset}) scale(${auraBreath.toFixed(3)})`;
        auraRef.current.style.opacity = auraOpacity.toFixed(3);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none">
      {/* Soft Ethereal Celestial Aura */}
      <div 
        ref={auraRef}
        className="absolute top-1/2 left-1/2 w-[380px] h-[380px] md:w-[550px] md:h-[550px] rounded-full pointer-events-none blur-[100px] md:blur-[140px] transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.35) 0%, rgba(99,102,241,0.2) 50%, transparent 75%)',
          opacity: 0.15,
          willChange: 'transform, opacity'
        }}
      />

      {/* Floating Sphere Container (Responsive scaling: slightly smaller on mobile to display complete sphere) */}
      <div className="w-full h-full absolute inset-0 origin-center pointer-events-none overflow-hidden scale-[0.78] sm:scale-[0.82] md:scale-100 -translate-y-6 md:translate-y-0 transition-transform duration-300">
        <div 
          ref={containerRef} 
          className="w-full h-full absolute inset-0 origin-center pointer-events-auto overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          <iframe 
            src="https://my.spline.design/particles-c3JOIZMOLESX4NSfLnLP2bej/" 
            frameBorder="0" 
            width="100%" 
            title="Particle Sphere"
            className="w-full absolute left-0 border-0 pointer-events-auto"
            style={{
              top: '-65px',
              height: 'calc(100% + 130px)'
            }}
            allow="autoplay; fullscreen"
          />

          {/* Safety overlay to ensure zero watermark bleed */}
          <div 
            className="absolute bottom-0 right-0 w-24 h-8 sm:w-44 sm:h-14 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to top left, #07090f 70%, transparent 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
