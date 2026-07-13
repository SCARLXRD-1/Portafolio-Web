'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

/* ─── tiny helpers ─── */
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

/* ─── Particle field (ambient background during logo phase) ─── */
function ParticleField() {
  const particles = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: rand(0, 100),
      y: rand(0, 100),
      size: rand(1, 3),
      duration: rand(3, 7),
      delay: rand(0, 4),
      opacity: rand(0.15, 0.5),
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(52, 211, 153, ${p.opacity})`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 1.8, p.opacity],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Scan-line overlay ─── */
function ScanLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-50"
      style={{
        background:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
        mixBlendMode: 'multiply',
      }}
    />
  );
}

/* ─── AD Logo (solid filled shapes matching the brand identity) ─── */
function ADLogo({ glowIntensity = 0 }: { glowIntensity?: number }) {
  return (
    <svg
      viewBox="0 0 320 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[200px] h-[170px] md:w-[280px] md:h-[230px]"
    >
      <defs>
        {/* Soft glow */}
        <filter id="logoGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={3 + glowIntensity * 6} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={2 + glowIntensity * 3} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Metallic gradient for letters */}
        <linearGradient id="letterFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="40%" stopColor="#f9fafb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>

        {/* Blue accent */}
        <linearGradient id="blueAccent" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        {/* Green bar */}
        <linearGradient id="greenBar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Clip paths for reveal animations */}
        <clipPath id="revealA">
          <motion.rect
            x="0" y="0" width="200" height="260"
            initial={{ height: 0 }}
            animate={{ height: 260 }}
            transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.3 }}
          />
        </clipPath>

        <clipPath id="revealD">
          <motion.rect
            x="140" y="0" width="180" height="260"
            initial={{ height: 0 }}
            animate={{ height: 260 }}
            transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.6 }}
          />
        </clipPath>
      </defs>

      {/* ─── Letter "A" — solid filled triangle with crossbar cutout ─── */}
      <g filter="url(#logoGlow)" clipPath="url(#revealA)">
        <motion.path
          d={`
            M 120 15
            L 195 230
            L 170 230
            L 148 170
            L 68 170
            L 45 230
            L 20 230
            L 95 15
            Z
            M 108 55
            L 76 145
            L 140 145
            Z
          `}
          fill="url(#letterFill)"
          fillRule="evenodd"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      </g>

      {/* ─── Blue accent line (left edge of A) ─── */}
      <motion.path
        d={`
          M 95 15
          L 20 230
          L 25 230
          L 100 20
          Z
        `}
        fill="url(#blueAccent)"
        filter="url(#coreGlow)"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 1.3 }}
      />

      {/* ─── Green trapezoid at base of A ─── */}
      <motion.path
        d={`
          M 72 195
          L 78 178
          L 138 178
          L 144 195
          Z
        `}
        fill="url(#greenBar)"
        filter="url(#coreGlow)"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 1.5 }}
        style={{ transformOrigin: '108px 186px' }}
      />

      {/* ─── Letter "D" — solid filled shape ─── */}
      <g filter="url(#logoGlow)" clipPath="url(#revealD)">
        <motion.path
          d={`
            M 155 15
            L 180 15
            L 220 15
            C 260 15, 295 50, 300 95
            C 305 140, 290 190, 255 215
            C 240 225, 220 230, 200 230
            L 155 230
            Z
            M 180 42
            L 180 203
            L 200 203
            C 220 203, 240 195, 252 180
            C 265 163, 272 138, 270 112
            C 268 85, 258 62, 240 50
            C 230 43, 215 42, 200 42
            Z
          `}
          fill="url(#letterFill)"
          fillRule="evenodd"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        />
      </g>

      {/* ─── Subtle highlight shimmer ─── */}
      <motion.rect
        x="0"
        y="0"
        width="40"
        height="260"
        fill="url(#shimmer)"
        opacity="0.12"
        initial={{ x: -40 }}
        animate={{ x: 340 }}
        transition={{ duration: 1.5, delay: 2.0, ease: 'easeInOut' }}
      />
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Boot log phase ─── */
const BOOT_LOGS = [
  "ACPI: Core revision 20260531",
  "PM: Registering ACPI NVS region",
  "CPU0: AKASHI DEV Neural Engine v2.0 @ 4.80GHz",
  "SMP: Bringing up secondary AI cores...",
  "x86/npu: Booted 128 nodes, 4096 processors",
  "Btrfs loaded, crc32c=crc32c-generic",
  "Mounting root filesystem...",
  "systemd[1]: Starting system initialization.",
  "systemd[1]: Started udev Kernel Device Manager.",
  "Starting Network Service...",
  "IPv6: ADDRCONF(NETDEV_CHANGE): eth0: link becomes ready",
  "systemd[1]: Reached target Network.",
  "Starting Akashi DEV Graphics Server...",
  "Loading Core Web Modules...",
  "Initializing Window Manager...",
  "Mounting Virtual File System...",
  "systemd[1]: Started Akashi DEV Environment.",
  "Welcome to AKASHI DEV v2.0",
];

/* ─── Ring animation around logo ─── */
function OrbitalRing({ delay = 0, size = 200, duration = 3 }: { delay?: number; size?: number; duration?: number }) {
  return (
    <motion.div
      className="absolute rounded-full border pointer-events-none"
      style={{
        width: size,
        height: size,
        borderColor: 'rgba(52, 211, 153, 0.15)',
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{
        scale: [0.6, 1, 1.4],
        opacity: [0, 0.6, 0],
        borderWidth: ['2px', '1px', '0.5px'],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */
export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [phase, setPhase] = useState<'boot' | 'blackout' | 'logo' | 'done'>('boot');
  const [progress, setProgress] = useState(0);
  const [glowPulse, setGlowPulse] = useState(0);

  /* Boot log sequence */
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT_LOGS.length) {
        setLogs((prev) => [...prev, BOOT_LOGS[i]]);
        i++;
        setProgress(Math.floor((i / BOOT_LOGS.length) * 100));
      } else {
        clearInterval(iv);
        setTimeout(() => setPhase('blackout'), 200);
      }
    }, 90);
    return () => clearInterval(iv);
  }, []);

  /* Blackout → logo */
  useEffect(() => {
    if (phase === 'blackout') {
      const t = setTimeout(() => setPhase('logo'), 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  /* Logo phase → done */
  useEffect(() => {
    if (phase === 'logo') {
      // Glow pulse ramp
      const pulseIv = setInterval(() => {
        setGlowPulse((p) => Math.min(p + 0.05, 1));
      }, 50);

      const t = setTimeout(() => {
        clearInterval(pulseIv);
        setPhase('done');
      }, 4200);
      return () => {
        clearInterval(pulseIv);
        clearTimeout(t);
      };
    }
  }, [phase]);

  /* Done → callback */
  useEffect(() => {
    if (phase === 'done') {
      const t = setTimeout(onComplete, 800);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const textChars = 'AKASHI'.split('');
  const osChars = 'DEV'.split('');

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col pointer-events-none overflow-hidden"
        >
          {/* ─── BOOT PHASE ─── */}
          <AnimatePresence>
            {phase === 'boot' && (
              <motion.div
                key="boot"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-6 font-mono text-[12px] md:text-sm leading-tight flex flex-col justify-end pb-16"
              >
                <div className="max-w-3xl w-full">
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.08 }}
                      className="mb-0.5"
                    >
                      <span className="text-emerald-700/60 mr-3 font-semibold">
                        [{((i * 0.123) + 0.05).toFixed(6)}]
                      </span>
                      <span className="text-emerald-400/80">{log}</span>
                    </motion.div>
                  ))}
                  {logs.length < BOOT_LOGS.length && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-emerald-400 font-bold"
                    >
                      █
                    </motion.span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between text-[10px] text-emerald-600/60 mb-1 font-mono">
                    <span>SYSTEM BOOT</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-[2px] bg-emerald-900/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #059669, #34d399, #6ee7b7)',
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.15, ease: 'linear' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── BLACKOUT PHASE ─── */}
          {phase === 'blackout' && (
            <div className="absolute inset-0 bg-black" />
          )}

          {/* ─── LOGO PHASE ─── */}
          <AnimatePresence>
            {phase === 'logo' && (
              <motion.div
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.15, filter: 'blur(20px)' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black"
              >
                {/* Ambient particles */}
                <ParticleField />
                <ScanLines />

                {/* Radial background glow */}
                <motion.div
                  className="absolute"
                  style={{
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Orbital rings */}
                <div className="relative flex items-center justify-center">
                  <OrbitalRing delay={0} size={280} duration={2.5} />
                  <OrbitalRing delay={0.8} size={340} duration={3} />
                  <OrbitalRing delay={1.6} size={400} duration={3.5} />

                  {/* Logo container */}
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{
                      scale: { type: 'spring', stiffness: 200, damping: 20, delay: 0.2 },
                      opacity: { duration: 0.4, delay: 0.2 },
                      rotateY: { duration: 1, ease: 'easeOut', delay: 0.2 },
                    }}
                    style={{ perspective: 800 }}
                  >
                    {/* Outer glow ring */}
                    <motion.div
                      className="absolute -inset-8 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)',
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <ADLogo glowIntensity={glowPulse} />
                  </motion.div>
                </div>

                {/* ─── AKASHI OS text ─── */}
                <motion.div
                  className="mt-10 flex items-center gap-1 select-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4, duration: 0.6, ease: 'easeOut' }}
                >
                  {/* AKASHI */}
                  <div className="flex overflow-hidden">
                    {textChars.map((char, i) => (
                      <motion.span
                        key={`a-${i}`}
                        className="text-[28px] md:text-[36px] font-extralight tracking-[0.35em] text-white/90"
                        style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}
                        initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        transition={{
                          duration: 0.5,
                          delay: 2.5 + i * 0.07,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>

                  {/* Spacer */}
                  <motion.span
                    className="w-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.1 }}
                  />

                  {/* OS */}
                  <div className="flex overflow-hidden">
                    {osChars.map((char, i) => (
                      <motion.span
                        key={`o-${i}`}
                        className="text-[28px] md:text-[36px] font-bold tracking-[0.35em]"
                        style={{
                          fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                          background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                        initial={{ y: -40, opacity: 0, filter: 'blur(8px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        transition={{
                          duration: 0.5,
                          delay: 3.1 + i * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Tagline */}
                <motion.p
                  className="mt-3 text-[11px] md:text-xs tracking-[0.5em] uppercase text-emerald-500/40 font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5, duration: 0.8 }}
                >
                  Developer Environment
                </motion.p>

                {/* Bottom loading bar */}
                <motion.div
                  className="absolute bottom-12 w-48"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.8, duration: 0.4 }}
                >
                  <div className="h-[1px] bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #34d399, transparent)',
                      }}
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </div>
                </motion.div>

                {/* Version tag */}
                <motion.span
                  className="absolute bottom-6 text-[9px] text-white/15 tracking-widest font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.2, duration: 0.6 }}
                >
                  v2.0.0 BUILD 20260601
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
