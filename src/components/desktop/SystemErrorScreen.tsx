'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type ErrorType = 'offline' | '404' | 'error';

interface SystemErrorScreenProps {
  type: ErrorType;
  onRetry?: () => void;
  message?: string;
}

export default function SystemErrorScreen({ type, onRetry, message }: SystemErrorScreenProps) {
  const router = useRouter();

  const content = {
    'offline': {
      icon: <WifiOff className="w-24 h-24 text-blue-400 mb-6" />,
      title: 'CRITICAL_NETWORK_FAILURE',
      desc: 'El sistema ha detectado una pérdida total de conexión a la red. Las funciones online han sido suspendidas temporalmente.',
      code: 'ERR_INTERNET_DISCONNECTED',
      actionText: 'Reconectar Sistema',
      action: onRetry || (() => window.location.reload()),
      IconAction: RotateCcw
    },
    '404': {
      icon: <AlertTriangle className="w-24 h-24 text-yellow-400 mb-6" />,
      title: 'PAGE_FAULT_IN_NONPAGED_AREA',
      desc: 'El sector de memoria al que intentas acceder no existe o ha sido reubicado. Verifica la ruta ingresada en el sistema.',
      code: 'ERROR_404_NOT_FOUND',
      actionText: 'Volver al Escritorio',
      action: () => router.push('/'),
      IconAction: Home
    },
    'error': {
      icon: <AlertTriangle className="w-24 h-24 text-red-400 mb-6" />,
      title: 'KERNEL_DATA_INPAGE_ERROR',
      desc: message || 'Se ha producido un error fatal en la ejecución del sistema. El entorno se ha detenido para prevenir daños en la memoria.',
      code: 'FATAL_UNHANDLED_EXCEPTION',
      actionText: 'Reiniciar Sistema',
      action: onRetry || (() => window.location.reload()),
      IconAction: RotateCcw
    }
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-[#0052a3]/90 backdrop-blur-md flex flex-col items-center justify-center text-white font-mono selection:bg-white/30"
    >
      <div className="max-w-3xl w-full px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="shrink-0 flex flex-col items-center">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              {content.icon}
            </motion.div>
            <div className="text-8xl font-light opacity-20 mt-4 select-none">
              {type === '404' ? '404' : ':('}
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
              {content.title}
            </h1>
            
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              {content.desc}
            </p>

            <div className="bg-black/20 p-4 border-l-4 border-white/50 mb-8 rounded-r-md">
              <p className="text-sm text-blue-200">
                Detalles del problema:<br/>
                <span className="font-bold text-white mt-1 block">STOP: {content.code}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={content.action}
                className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#0052a3] font-bold rounded-sm overflow-hidden transition-transform hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -ml-4 w-1/2" />
                <content.IconAction size={18} />
                {content.actionText}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 text-xs text-blue-300 opacity-50">
        AKASHI_OS_V2 - ERROR_HANDLER_MODULE
      </div>
    </motion.div>
  );
}
