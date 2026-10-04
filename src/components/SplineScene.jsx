import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';

// Lazy load Spline to prevent SSR or initial bundle blocking
const Spline = lazy(() => import('@splinetool/react-spline'));

/**
 * SplineScene Container
 * Handles dynamic Spline scene loading, Spline runtime variable synchronization,
 * and graceful fallback.
 */
export default function SplineScene({ 
  sceneUrl, 
  onSplineLoaded, 
  interaction, 
  tension, 
  velocity 
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const splineAppRef = useRef(null);

  const handleLoad = (splineApp) => {
    splineAppRef.current = splineApp;
    setIsLoading(false);
    if (onSplineLoaded) onSplineLoaded(splineApp);
  };

  // Sync real-time Web Audio telemetry variables with Spline scene if variables exist
  useEffect(() => {
    if (!splineAppRef.current) return;
    try {
      const app = splineAppRef.current;
      if (typeof app.setVariable === 'function') {
        if (interaction) {
          app.setVariable('normX', interaction.normX);
          app.setVariable('normY', interaction.normY);
        }
        app.setVariable('tension', tension);
        app.setVariable('velocity', velocity);
      }
    } catch (e) {
      // Ignored if variables aren't defined in this specific spline scene
    }
  }, [interaction, tension, velocity]);

  if (hasError || !sceneUrl) {
    return null;
  }

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center text-xs tracking-widest uppercase text-white/30">
          Loading Spline Scene...
        </div>
      }>
        <Spline
          scene={sceneUrl}
          onLoad={handleLoad}
          onError={(err) => {
            console.warn('Spline scene failed to load, falling back to Canvas Particles:', err);
            setHasError(true);
          }}
          className="w-full h-full"
        />
      </Suspense>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white/40 text-xs tracking-[0.25em] font-mono animate-pulse">
            INITIALIZING 3D SPLINE ENGINE...
          </div>
        </div>
      )}
    </div>
  );
}
