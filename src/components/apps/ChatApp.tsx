'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Send, MessageCircle, User, UserCheck, RotateCcw, Loader2 } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { useSystemSounds } from '@/hooks/useSystemSounds';

interface ChatMessage {
  id: string;
  sender: 'visitor' | 'admin';
  content: string;
  created_at: string;
}

export default function ChatApp() {
  const locale = useLocale();
  const isEs = locale === 'es';
  const { playClick, playOpen } = useSystemSounds();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [messages.length, isInitializing]);

  const createNewSession = async () => {
    try {
      const { data, error } = await insforge.database
        .from('live_chats')
        .insert([{ visitor_name: 'Visitante' }])
        .select()
        .single();

      if (data && !error) {
        const newId = data.id as string;
        localStorage.setItem('live_chat_id', newId);
        setChatId(newId);
        setMessages([]);
        return newId;
      }
    } catch (err) {
      console.error('Error al inicializar sesión de chat:', err);
    }
    return null;
  };

  const handleResetChat = async () => {
    playClick();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('live_chat_id');
    }
    setIsInitializing(true);
    await createNewSession();
    setIsInitializing(false);
  };

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    let isSubscribed = true;

    const initChat = async () => {
      let currentChatId = typeof window !== 'undefined' ? localStorage.getItem('live_chat_id') : null;

      if (!currentChatId) {
        currentChatId = await createNewSession();
      } else {
        setChatId(currentChatId);
      }

      if (currentChatId && isSubscribed) {
        // Cargar historial
        try {
          const { data: history } = await insforge.database
            .from('chat_messages')
            .select('*')
            .eq('chat_id', currentChatId)
            .order('created_at', { ascending: true });

          if (history && isSubscribed) {
            setMessages(history as ChatMessage[]);
          }
        } catch {}

        // Polling de respaldo periódico
        pollInterval = setInterval(async () => {
          try {
            const { data } = await insforge.database
              .from('chat_messages')
              .select('*')
              .eq('chat_id', currentChatId)
              .order('created_at', { ascending: true });

            if (data && isSubscribed) {
              setMessages((prev) => {
                if (prev.length !== data.length) {
                  return data as ChatMessage[];
                }
                return prev;
              });
            }
          } catch {}
        }, 3500);

        // Suscripción Realtime para mensajes entrantes del admin
        try {
          await insforge.realtime.connect();
          await insforge.realtime.subscribe(`chat:${currentChatId}`);

          const handleIncoming = (payload: any) => {
            if (payload && payload.sender === 'admin' && isSubscribed) {
              setMessages((prev) => {
                if (prev.some((m) => m.id === payload.id)) return prev;
                playOpen();
                return [...prev, payload as ChatMessage];
              });
            }
          };

          insforge.realtime.on('new_message', handleIncoming);
        } catch {}
      }

      if (isSubscribed) {
        setIsInitializing(false);
      }
    };

    initChat();

    return () => {
      isSubscribed = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text || !chatId || isSending) return;

    playClick();
    setIsSending(true);
    setInputValue('');

    const tempMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'visitor',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      await insforge.database.from('chat_messages').insert([
        {
          chat_id: chatId,
          sender: 'visitor',
          content: text,
        },
      ]);

      await insforge.database
        .from('live_chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', chatId);

      await insforge.realtime.publish(`chat:${chatId}`, 'new_message', tempMsg);
      await insforge.realtime.publish('admin_chats', 'chat_updated', { id: chatId });
    } catch (err) {
      console.error('Error enviando mensaje:', err);
    } finally {
      setIsSending(false);
    }
  };

  const starterChips = [
    isEs ? '¿Qué disponibilidad tienes para nuevos proyectos?' : 'What is your current availability for new projects?',
    isEs ? 'Me gustaría agendar una llamada contigo.' : 'I would like to schedule a call with you.',
    isEs ? '¿Qué stack recomiendas para una app web moderna?' : 'What stack do you recommend for a modern web app?',
  ];

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-zinc-950 text-zinc-400 gap-3">
        <Loader2 className="animate-spin text-blue-500" size={28} />
        <span className="text-xs">{isEs ? 'Conectando con el chat...' : 'Connecting to chat...'}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-white relative select-none">
      {/* Header */}
      <header className="px-4 py-3 border-b border-white/10 bg-zinc-900/80 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-inner bg-zinc-800 shrink-0">
              <img
                src="/PERFIL.png"
                alt="Jhonatan"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 42%' }}
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-semibold text-sm leading-tight text-white">Jhonatan</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Admin
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              {isEs ? 'Mensaje directo · En vivo' : 'Direct message · Live'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          title={isEs ? 'Iniciar nueva conversación' : 'Start new conversation'}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RotateCcw size={15} />
        </button>
      </header>

      {/* Messages View */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 space-y-4 px-4 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-blue-400 shadow-lg">
              <MessageCircle size={24} />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm text-zinc-200">
                {isEs ? 'Mensaje directo con Jhonatan' : 'Direct message with Jhonatan'}
              </p>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                {isEs
                  ? 'Escribe tu consulta o propuesta. No hay respuestas automáticas de IA: te responderé directamente.'
                  : 'Leave your inquiry or proposal. No automated AI bots: I will reply directly.'}
              </p>
            </div>

            {/* Quick Starters */}
            <div className="w-full max-w-sm pt-2 flex flex-col gap-1.5">
              {starterChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    playClick();
                    setInputValue(chip);
                  }}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-white/5 hover:border-blue-500/30 text-zinc-300 hover:text-white transition-all duration-150"
                >
                  💬 {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isAdmin = msg.sender === 'admin';
            return (
              <div key={msg.id || i} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] sm:max-w-[78%] flex gap-2 ${isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-auto text-xs ${
                      isAdmin
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'bg-zinc-800 text-zinc-300 border border-white/5'
                    }`}
                  >
                    {isAdmin ? <UserCheck size={13} /> : <User size={13} />}
                  </div>

                  {/* Bubble */}
                  <div className="flex flex-col gap-1">
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm break-words ${
                        isAdmin
                          ? 'bg-zinc-900 text-zinc-100 border border-white/10 rounded-bl-xs'
                          : 'bg-blue-600 text-white rounded-br-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.created_at && (
                      <span
                        className={`text-[10px] text-zinc-500 px-1 ${
                          isAdmin ? 'text-left' : 'text-right'
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input bar */}
      <div className="p-3 bg-zinc-900/80 border-t border-white/10 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-2xl mx-auto relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isEs ? 'Escribe tu mensaje para Jhonatan...' : 'Type your message for Jhonatan...'}
            className="flex-1 bg-zinc-950 border border-white/10 rounded-full px-4 py-2.5 pr-11 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="absolute right-1.5 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-40 disabled:bg-zinc-800 hover:bg-blue-500 transition-colors shadow-sm"
          >
            <Send size={13} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

