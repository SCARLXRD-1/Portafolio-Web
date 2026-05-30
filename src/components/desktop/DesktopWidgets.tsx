'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DesktopWidgets() {
  const [time, setTime] = useState(() => new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = isMounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const dateString = isMounted ? time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) : '';

  return (
    <div className="absolute top-20 left-12 z-0 pointer-events-none flex flex-col gap-6">
      {/* Large Clock Widget */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-white/90 drop-shadow-lg"
      >
        <h1 className="text-8xl font-light tracking-tighter mb-2">{timeString}</h1>
        <p className="text-2xl font-medium tracking-wide text-white/70 capitalize">{dateString}</p>
      </motion.div>

      {/* Minimal System Info Widget */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="flex flex-col gap-3 mt-4 bg-black/20 backdrop-blur-md border border-white/5 p-5 rounded-2xl w-72"
      >
        <div className="flex justify-between text-xs font-medium text-white/50 mb-1 uppercase tracking-wider">
          <span>System Status</span>
          <span className="text-emerald-400">Online</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/80">CPU Usage</span>
              <span className="text-white/80">14%</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[14%] rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/80">Memory</span>
              <span className="text-white/80">4.2 GB</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-[42%] rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
