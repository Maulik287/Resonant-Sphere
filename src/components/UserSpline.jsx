import React, { useRef, useEffect, useState } from 'react';

/**
 * USER SPLINE COMPONENT (Floating Sphere Connected to Music State)
 * Displays the complete 3D Resonant Particle Sphere without side clipping on mobile or desktop.
 * Floats gently when music is playing.
 * Gracefully settles and completely stops floating when music is stopped.
 */
export default function UserSpline({ isMusicPlaying = false, activeFreq = 432 }) {
  const containerRef = useRef(null);
  const auraRef = useRef(null);
  const isPlayingRef = useRef(isMusicPlaying);
  const activeFreqRef = useRef(activeFreq);

  // Responsive screen size tracking for pixel-perfect mobile sphere scaling
  const [screenSize, setScreenSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  }));

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        const yOffset = isMobile ? 'calc(-50% - 24px)' : '-50%';
        auraRef.current.style.transform = `translate(-50%, ${yOffset}) scale(${auraBreath.toFixed(3)})`;
        auraRef.current.style.opacity = auraOpacity.toFixed(3);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const isMobile = screenSize.width < 768;
  // 660px internal virtual canvas width provides ample horizontal FOV for Spline's Orthographic Camera
  // so the ~490px particle sphere is 100% visible with zero cropping on any phone.
  const virtualWidth = 660;
  const mobileScale = isMobile ? screenSize.width / virtualWidth : 1;
  const internalHeight = isMobile 
    ? Math.round(screenSize.height / mobileScale) + 160 
    : 0;

  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none">
      {/* Soft Ethereal Celestial Aura */}
      <div 
        ref={auraRef}
        className="absolute top-1/2 left-1/2 w-[340px] h-[340px] md:w-[550px] md:h-[550px] rounded-full pointer-events-none blur-[90px] md:blur-[140px] transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.35) 0%, rgba(99,102,241,0.2) 50%, transparent 75%)',
          opacity: 0.15,
          willChange: 'transform, opacity'
        }}
      />

      {/* Floating Sphere Motion Target */}
      <div 
        ref={containerRef} 
        className="w-full h-full absolute inset-0 origin-center pointer-events-auto overflow-hidden flex items-center justify-center"
        style={{ willChange: 'transform' }}
      >
        {/* Responsive Canvas Scaler:
            On Mobile: Scales the 660px wide Spline canvas precisely to 100vw,
            ensuring the entire circular sphere fits with natural side padding, 
            and eliminating any dark rectangular boundaries or side cropping.
            On Desktop: Extends 100% width and height seamlessly.
        */}
        <div
          className="absolute flex items-center justify-center pointer-events-auto"
          style={
            isMobile
              ? {
                  width: `${virtualWidth}px`,
                  height: `${internalHeight}px`,
                  transform: `scale(${mobileScale})`,
                  transformOrigin: 'center center',
                  top: '50%',
                  left: '50%',
                  marginTop: `${Math.round(-internalHeight / 2) - 24}px`,
                  marginLeft: `${Math.round(-virtualWidth / 2)}px`,
                }
              : {
                  width: '100%',
                  height: 'calc(100% + 130px)',
                  top: '-65px',
                  left: 0,
                }
          }
        >
          <iframe 
            src="https://my.spline.design/particles-c3JOIZMOLESX4NSfLnLP2bej/" 
            frameBorder="0" 
            title="Particle Sphere"
            className="w-full h-full border-0 pointer-events-auto"
            allow="autoplay; fullscreen"
          />
        </div>

        {/* Safety overlay to ensure zero watermark bleed */}
        <div 
          className="absolute bottom-0 right-0 w-28 h-10 sm:w-44 sm:h-14 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to top left, #05070c 80%, transparent 100%)'
          }}
        />
      </div>
    </div>
  );
}
