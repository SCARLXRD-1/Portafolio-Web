'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Send, MessageCircle, Bot, User, Loader2 } from 'lucide-react';
import { insforge } from '@/lib/insforge';

interface ChatMessage {
  id: string;
  sender: 'visitor' | 'admin';
  content: string;
  created_at: string;
}

export default function ChatApp() {
  const locale = useLocale();
  const isEs = locale === 'es';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isInitializing]);

  // Inicializar Chat
  useEffect(() => {
    const initChat = async () => {
      let currentChatId = localStorage.getItem('live_chat_id');

      if (!currentChatId) {
        // Crear un nuevo chat si no existe
        try {
          const { data, error } = await insforge.database
            .from('live_chats')
            .insert([{ visitor_name: 'Anónimo' }])
            .select()
            .single();

          if (data && !error) {
            currentChatId = data.id as string;
            if (currentChatId) {
              localStorage.setItem('live_chat_id', currentChatId);
            }
          }
        } catch (err) {
          console.error('Error creando chat:', err);
        }
      }

      setChatId(currentChatId);

      if (currentChatId) {
        // Cargar historial
        const { data: history } = await insforge.database
          .from('chat_messages')
          .select('*')
          .eq('chat_id', currentChatId)
          .order('created_at', { ascending: true });

        if (history) setMessages(history);

        // Conectar al servidor en tiempo real y suscribirse al canal
        await insforge.realtime.connect();
        await insforge.realtime.subscribe(`chat:${currentChatId}`);
        
        const handleNewMessage = (payload: any) => {
          // Solo agregar si el remitente NO es visitor
          if (payload.sender !== 'visitor') {
            setMessages((prev) => prev.some(m => m.id === payload.id) ? prev : [...prev, payload as ChatMessage]);
            scrollToBottom();
          }
        };

        insforge.realtime.on('new_message', handleNewMessage);

        setIsInitializing(false);

        return () => {
          insforge.realtime.off('new_message', handleNewMessage);
          insforge.realtime.unsubscribe(`chat:${currentChatId}`);
        };
      } else {
        setIsInitializing(false);
      }
    };

    initChat();
  }, []);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatId) return;

    const messageText = inputValue.trim();
    setInputValue(''); // Optimista

    // Add optimistically
    const tempMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'visitor',
      content: messageText,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await insforge.database.from('chat_messages').insert([
        {
          chat_id: chatId,
          sender: 'visitor',
          content: messageText
        }
      ]);
      
      // Update last_message_at in live_chats
      await insforge.database
        .from('live_chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', chatId);

      // Publicar evento en tiempo real para el admin
      await insforge.realtime.publish(`chat:${chatId}`, 'new_message', tempMsg);
      await insforge.realtime.publish('admin_chats', 'chat_updated', { id: chatId });

    } catch (err) {
      console.error('Error enviando mensaje:', err);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[#f8f9fa] dark:bg-[#0d0d0d]">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#f8f9fa] dark:bg-[#0d0d0d] text-black dark:text-white relative">
      
      {/* Header */}
      <header className="px-4 py-3 border-b border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <Bot className="text-blue-500" size={20} />
        </div>
        <div>
          <h2 className="font-semibold leading-tight">Jhonatan (Admin)</h2>
          <div className="flex items-center gap-1.5 text-xs text-black/50 dark:text-white/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-black/40 dark:text-white/40 space-y-3">
            <MessageCircle size={48} className="opacity-20" />
            <p className="max-w-[250px] text-sm">
              {isEs 
                ? '¡Hola! Escríbeme y si estoy en línea te responderé por aquí.'
                : 'Hi! Send me a message and if I am online I will reply right here.'}
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isAdmin = msg.sender === 'admin';
          return (
            <div key={msg.id || i} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] flex gap-2 ${isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto ${isAdmin ? 'bg-blue-500/20 text-blue-500' : 'bg-black/10 dark:bg-white/10'}`}>
                  {isAdmin ? <Bot size={14} /> : <User size={14} />}
                </div>
                
                {/* Bubble */}
                <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  isAdmin 
                    ? 'bg-white dark:bg-[#1e1e1e] border border-black/5 dark:border-white/5 rounded-bl-sm' 
                    : 'bg-blue-500 text-white rounded-br-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/50 dark:bg-black/20 border-t border-black/10 dark:border-white/10 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-2xl mx-auto relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isEs ? 'Escribe un mensaje...' : 'Type a message...'}
            className="flex-1 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-full px-5 py-3 pr-12 outline-none focus:border-blue-500/50 shadow-inner transition-colors"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 bottom-1.5 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
          >
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>

    </div>
  );
}
