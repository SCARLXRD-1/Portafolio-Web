'use client';

import React from 'react';
import { Mail } from 'lucide-react';

export default function AdminContact() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Mensajes</h1>
        <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Bandeja de entrada del formulario de contacto.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Bandeja de entrada */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm lg:col-span-1 flex flex-col h-full">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Bandeja de Entrada</h2>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
            <p className="text-black/50 dark:text-white/50 text-center px-4">
              Bandeja vacía.<br/>No hay mensajes nuevos.
            </p>
          </div>
        </div>

        {/* Lector y Respuesta */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2 flex flex-col h-full">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Responder Mensaje</h2>
          
          <div className="flex-1 flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Para (Email del remitente)</label>
              <input type="email" disabled className="w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl px-4 py-2 text-black/50 dark:text-white/50 cursor-not-allowed" placeholder="Selecciona un mensaje de la bandeja..." />
            </div>
            
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Tu Respuesta</label>
              <textarea className="flex-1 w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none min-h-[150px]" placeholder="Escribe tu respuesta aquí..." />
            </div>

            <button disabled className="w-full sm:w-auto self-end py-2.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Enviar Respuesta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
