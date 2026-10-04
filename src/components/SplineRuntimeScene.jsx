import React, { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';
import { splineParticleData } from './splineSceneData';

/**
 * SplineRuntimeScene
 * Directly runs the user's Spline Particle System via native WebGL @splinetool/runtime.
 * No iframe latency, no CORS barriers, direct 1:1 cursor physics + Web Audio synchronization.
 */
export default function SplineRuntimeScene({ onLoaded, onInteraction }) {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const app = new Application(canvas, { htmlContentMode: 'inline' });
      appRef.current = app;

      // Start the particle sphere using the extracted binary scene payload
      app.start(splineParticleData)
        .then(() => {
          if (isMounted) {
            setIsReady(true);
            if (onLoaded) onLoaded(app);
          }
        })
        .catch((err) => {
          console.warn('Spline runtime start error:', err);
          if (isMounted) setError(err);
        });
    } catch (e) {
      console.warn('Failed to initialize Spline Application:', e);
      if (isMounted) setError(e);
    }

    return () => {
      isMounted = false;
      if (appRef.current && typeof appRef.current.dispose === 'function') {
        try {
          appRef.current.dispose();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        id="spline-canvas3d"
        className="w-full h-full block outline-none"
      />

      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-[#05070c]/50">
          <div className="text-white/40 text-xs tracking-[0.25em] font-mono animate-pulse">
            LOADING SPLINE PARTICLES...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-rose-400/60 text-xs tracking-wider font-mono">
            Spline Canvas fallback active
          </div>
        </div>
      )}
    </div>
  );
}
