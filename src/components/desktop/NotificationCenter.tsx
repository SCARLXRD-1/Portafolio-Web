'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Info, CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

const icons = {
  info: <Info className="text-blue-500" size={20} />,
  success: <CheckCircle2 className="text-emerald-500" size={20} />,
  error: <AlertCircle className="text-red-500" size={20} />,
  warning: <AlertTriangle className="text-amber-500" size={20} />,
};

export default function NotificationCenter() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-12 right-4 z-[9999] flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)] pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-2xl pointer-events-auto flex items-start gap-3"
          >
            <div className="shrink-0 mt-0.5">{icons[notification.type]}</div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-black dark:text-white">
                {notification.title}
              </h4>
              <p className="text-xs text-black/70 dark:text-white/70 mt-1 leading-relaxed">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="shrink-0 p-1 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
