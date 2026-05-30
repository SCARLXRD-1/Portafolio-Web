'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    // Significantly reduced duration for faster load times (from 3500 to 1200)
    const duration = 1300; 
    const intervalTime = 15;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setProgress(Math.min((currentStep / steps) * 100, 100));

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 200); // reduced from 500
        }, 200); // reduced from 800
      }
    }, intervalTime);

    // Trigger fireworks earlier
    const fwTimeout = setTimeout(() => setShowFireworks(true), 800);

    return () => {
      clearInterval(interval);
      clearTimeout(fwTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textChars = "AKASHI DEV".split("");

  // Generate random firework particles
  const fireworkParticles = Array.from({ length: 40 }).map((_, i) => {
    const angle = (i * 360) / 40;
    const distance = 80 + Math.random() * 200;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;
    const size = 2 + Math.random() * 4;
    const colorClass = Math.random() > 0.5 ? 'bg-emerald-400' : 'bg-white';
    return { x, y, size, colorClass };
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full relative"
          >
            
            {/* SVG Text Animation Container */}
            <div className="relative w-full max-w-4xl h-32 md:h-48 flex justify-center items-center mb-16">
              
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200">
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                <text 
                  x="50%" 
                  y="50%" 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  className="text-5xl md:text-7xl font-black tracking-[0.2em]"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 900 }}
                  filter="url(#glow)"
                >
                  {textChars.map((char, i) => (
                    <motion.tspan
                      key={i}
                      initial={{ strokeDasharray: 400, strokeDashoffset: 400, fill: "rgba(255,255,255,0)", stroke: "rgba(52,211,153,0.8)", strokeWidth: 2 }}
                      animate={{ strokeDashoffset: 0, fill: "rgba(255,255,255,1)", stroke: "rgba(52,211,153,0)" }}
                      transition={{ 
                        strokeDashoffset: { duration: 0.4, ease: "easeInOut", delay: i * 0.05 },
                        fill: { duration: 0.3, ease: "easeOut", delay: i * 0.05 + 0.3 },
                        stroke: { duration: 0.3, ease: "easeOut", delay: i * 0.05 + 0.3 }
                      }}
                    >
                      {char}
                    </motion.tspan>
                  ))}
                </text>
              </svg>

              {/* Fireworks Explosion */}
              {showFireworks && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 z-50">
                  {fireworkParticles.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{ 
                        x: p.x, 
                        y: p.y, 
                        scale: [0, 1.2, 0], 
                        opacity: [1, 1, 0] 
                      }}
                      transition={{ duration: 1, ease: "easeOut", delay: Math.random() * 0.2 }}
                      className={`absolute rounded-full ${p.colorClass}`}
                      style={{ width: p.size, height: p.size, boxShadow: '0 0 12px 2px currentColor' }}
                    />
                  ))}
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 12, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-emerald-300 blur-xl mix-blend-screen"
                  />
                </div>
              )}
            </div>

            <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="mt-4 text-xs font-mono text-white/40 tracking-widest uppercase">
              Initializing System... {Math.round(progress)}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
