'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Loader2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { insforge } from '@/lib/insforge';

export default function AdminContact() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje permanentemente?')) return;
    try {
      const { error } = await insforge.database.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      if (selectedMsg?.id === id) setSelectedMsg(null);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (msg: any) => {
    setSelectedMsg(msg);
    if (msg.status === 'unread') {
      try {
        await insforge.database.from('contact_messages').update({ status: 'read' }).eq('id', msg.id);
        fetchMessages();
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Mensajes</h1>
        <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Bandeja de entrada del formulario de contacto.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Bandeja de entrada */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm lg:col-span-1 flex flex-col h-full overflow-hidden">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Bandeja de Entrada</h2>
          
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
              <p className="text-black/50 dark:text-white/50 text-center px-4">
                Bandeja vacía.<br/>No hay mensajes nuevos.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {messages.map(msg => (
                <div 
                  key={msg.id}
                  onClick={() => markAsRead(msg)}
                  className={`p-4 rounded-xl cursor-pointer transition-colors border ${
                    selectedMsg?.id === msg.id 
                      ? 'bg-emerald-500/10 border-emerald-500/50' 
                      : 'bg-white dark:bg-black/40 border-black/5 dark:border-white/5 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold truncate pr-2 ${msg.status === 'unread' ? 'text-black dark:text-white' : 'text-black/70 dark:text-white/70'}`}>
                      {msg.name}
                    </h3>
                    {msg.status === 'unread' && <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />}
                  </div>
                  <p className="text-xs text-black/50 dark:text-white/50 truncate mb-2">{msg.email}</p>
                  <p className="text-sm text-black/60 dark:text-white/60 line-clamp-2">{msg.message}</p>
                  <div className="mt-3 text-[10px] text-black/40 dark:text-white/40 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(msg.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lector y Respuesta */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-black dark:text-white">Lectura de Mensaje</h2>
            {selectedMsg && (
              <button 
                onClick={() => handleDelete(selectedMsg.id)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Eliminar mensaje"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
          
          {selectedMsg ? (
            <div className="flex-1 flex flex-col space-y-6">
              <div className="bg-white dark:bg-black/40 p-4 rounded-xl border border-black/5 dark:border-white/5">
                <div className="mb-4 pb-4 border-b border-black/5 dark:border-white/5">
                  <h3 className="font-bold text-lg text-black dark:text-white">{selectedMsg.name}</h3>
                  <p className="text-sm text-black/60 dark:text-white/60">{selectedMsg.email}</p>
                </div>
                <div className="prose dark:prose-invert max-w-none text-black/80 dark:text-white/80 whitespace-pre-wrap">
                  {selectedMsg.message}
                </div>
              </div>

              <div className="mt-auto flex justify-end">
                <a 
                  href={`mailto:${selectedMsg.email}?subject=Re: Contacto desde Portafolio`}
                  className="w-full sm:w-auto py-2.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors text-center"
                >
                  Responder por Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-black/30 dark:text-white/30">
              <Mail size={48} className="mb-4 opacity-50" />
              <p>Selecciona un mensaje de la bandeja para leerlo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
