import React, { useRef, useEffect } from 'react';
import { soundEngine } from '../audio/AudioEngine';

/**
 * 3D Resonant Particle Sphere Canvas
 * Mathematical 3D projection of a spherical particle harmonic cloud.
 * Directly reacts to sound telemetry, cursor velocity, and charge-up compression.
 */
export default function ParticleSphere({ 
  presetKey, 
  interaction, 
  tension = 0, 
  velocity = 0,
  filterFreq = 1200,
  isAudioActive = false
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D Spherical Particles
    const PARTICLE_COUNT = 1400;
    const particles = [];
    const isMobile = width < 768;
    const baseRadius = Math.min(width, height) * (isMobile ? 0.22 : 0.28);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;

      // Base spherical coordinates
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      particles.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        currX: x,
        currY: y,
        currZ: z,
        size: Math.random() * 2.2 + 0.8,
        pulseOffset: Math.random() * Math.PI * 2,
        speedFactor: Math.random() * 0.8 + 0.6,
        orbitAngle: Math.random() * Math.PI * 2
      });
    }

    // Palette configuration per preset
    const presetHues = {
      deepSpace: { h1: 220, h2: 270, glow: 'rgba(99, 102, 241, 0.4)' },
      solarWind: { h1: 35, h2: 15, glow: 'rgba(245, 158, 11, 0.45)' },
      binauralDelta: { h1: 160, h2: 210, glow: 'rgba(16, 185, 129, 0.4)' },
      crystallineSanctuary: { h1: 180, h2: 195, glow: 'rgba(6, 182, 212, 0.45)' }
    };

    let rotationX = 0;
    let rotationY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let time = 0;
    let shockwaveRadius = 0;
    let shockwaveAlpha = 0;
    let prevTension = 0;

    const render = () => {
      time += 0.012;

      // Background clearing with ethereal trail persistence
      ctx.fillStyle = 'rgba(7, 9, 15, 0.24)';
      ctx.fillRect(0, 0, width, height);

      const hues = presetHues[presetKey] || presetHues.deepSpace;

      // Interaction target rotation
      if (interaction) {
        targetRotY = (interaction.normX - 0.5) * 1.5;
        targetRotX = (interaction.normY - 0.5) * 1.2;
      }
      rotationY += (targetRotY - rotationY) * 0.05;
      rotationX += (targetRotX - rotationX) * 0.05;

      const autoSpin = time * 0.2;
      const cosY = Math.cos(rotationY + autoSpin);
      const sinY = Math.sin(rotationY + autoSpin);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      // Check shockwave release
      if (prevTension > 40 && tension < 10) {
        shockwaveRadius = baseRadius * 0.4;
        shockwaveAlpha = 0.85;
      }
      prevTension = tension;

      // Dynamic radius scaling: smooth breathing only (no beat vibration)
      const tensionCompression = 1 - (tension / 100) * 0.55;
      const velocityExpansion = 1 + Math.min(velocity / 800, 0.65);
      const breathing = Math.sin(time * 1.2) * 0.04;
      const dynamicRadius = baseRadius * tensionCompression * velocityExpansion * (1 + breathing);

      const fov = 420;
      const centerX = width / 2;
      const centerY = isMobile ? height / 2 - 22 : height / 2;

      // Render Shockwave Ring on release
      if (shockwaveAlpha > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, shockwaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hues.h1}, 90%, 75%, ${shockwaveAlpha})`;
        ctx.lineWidth = 4 * shockwaveAlpha;
        ctx.shadowColor = `hsla(${hues.h2}, 100%, 70%, 1)`;
        ctx.shadowBlur = 25;
        ctx.stroke();
        ctx.restore();

        shockwaveRadius += 12;
        shockwaveAlpha *= 0.94;
      }

      // Draw Center Core Glow (Smooth ethereal glow)
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 5,
        centerX, centerY, dynamicRadius * 1.15
      );
      coreGradient.addColorStop(0, `hsla(${hues.h1}, 80%, 65%, ${0.15 + (tension / 100) * 0.4})`);
      coreGradient.addColorStop(0.6, hues.glow);
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Render 3D Projected Particles
      const sortedParticles = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic deformation waves
        const wave = Math.sin(time * 2 * p.speedFactor + p.pulseOffset) * 0.08;
        const rad = dynamicRadius * (1 + wave);

        // 3D Rotations
        // 1. Rotate Y
        let x1 = p.baseX * cosY - p.baseZ * sinY;
        let z1 = p.baseZ * cosY + p.baseX * sinY;

        // 2. Rotate X
        let y1 = p.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.baseY * sinX;

        // Micro dispersion under high velocity
        if (velocity > 150) {
          const jitter = (velocity / 1200) * 0.15;
          x1 += (Math.random() - 0.5) * jitter;
          y1 += (Math.random() - 0.5) * jitter;
        }

        const worldX = x1 * rad;
        const worldY = y1 * rad;
        const worldZ = z2 * rad;

        // Perspective Projection
        const scale = fov / (fov + worldZ + 350);
        const projX = centerX + worldX * scale;
        const projY = centerY + worldY * scale;

        sortedParticles.push({
          x: projX,
          y: projY,
          scale: scale,
          z: worldZ,
          size: p.size * scale,
          pulse: p.pulseOffset
        });
      }

      // Sort by depth (back to front)
      sortedParticles.sort((a, b) => a.z - b.z);

      // Draw particles
      for (let i = 0; i < sortedParticles.length; i++) {
        const p = sortedParticles[i];
        if (p.scale <= 0) continue;

        const depthAlpha = Math.max(0.12, Math.min(0.95, (p.z + 300) / 600));
        const particleHue = (i % 2 === 0) ? hues.h1 : hues.h2;

        ctx.fillStyle = `hsla(${particleHue}, 85%, ${65 + (p.scale * 20)}%, ${depthAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.size * (1 + (tension / 100) * 0.8)), 0, Math.PI * 2);
        ctx.fill();

        // Selective particle glow nodes
        if (i % 18 === 0 && p.scale > 0.85) {
          ctx.save();
          ctx.shadowColor = `hsla(${particleHue}, 90%, 75%, 0.9)`;
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [presetKey, tension, velocity, filterFreq]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
}
