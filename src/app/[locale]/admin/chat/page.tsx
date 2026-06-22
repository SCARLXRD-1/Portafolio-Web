'use client';

import React, { useState, useEffect, useRef } from 'react';
import { insforge } from '@/lib/insforge';
import { User, Send, Loader2, MessageCircle } from 'lucide-react';

interface LiveChat {
  id: string;
  visitor_name: string;
  status: string;
  created_at: string;
  last_message_at: string;
}

interface ChatMessage {
  id: string;
  chat_id: string;
  sender: 'visitor' | 'admin';
  content: string;
  created_at: string;
}

export default function AdminChatPage() {
  const [chats, setChats] = useState<LiveChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<LiveChat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar chats
  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await insforge.database
        .from('live_chats')
        .select('*')
        .order('last_message_at', { ascending: false });
      
      if (data) setChats(data);
      setIsLoading(false);
    };

    fetchChats();

    // Suscribirse a nuevos chats o actualizaciones
    const setupRealtime = async () => {
      try {
        await insforge.realtime.connect();
        await insforge.realtime.subscribe('admin_chats');
        insforge.realtime.on('chat_updated', fetchChats);
      } catch (e) {
        console.warn('Realtime (admin_chats) falló:', e);
      }
    };
    setupRealtime();

    // Polling de respaldo general cada 5 segundos
    const generalPoll = setInterval(() => {
      fetchChats();
    }, 5000);

    return () => {
      clearInterval(generalPoll);
      try {
        insforge.realtime.off('chat_updated', fetchChats);
        insforge.realtime.unsubscribe('admin_chats');
      } catch (e) {}
    };
  }, []);

  // Cargar mensajes del chat seleccionado
  const fetchMessages = async () => {
    if (!selectedChat) return;
    const { data } = await insforge.database
      .from('chat_messages')
      .select('*')
      .eq('chat_id', selectedChat.id)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewMessage = (payload: any) => {
    const newMsg = payload as ChatMessage;
    setMessages(prev => {
      if (prev.some(m => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    if (!selectedChat) return;

    fetchMessages();

    const setupChatRealtime = async () => {
      try {
        await insforge.realtime.connect();
        await insforge.realtime.subscribe(`chat:${selectedChat.id}`);
        insforge.realtime.on('new_message', handleNewMessage);
      } catch (e) {
        console.warn(`Realtime (chat:${selectedChat.id}) falló:`, e);
      }
    };
    setupChatRealtime();

    // Polling de respaldo cada 3 segundos
    const pollInterval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => {
      clearInterval(pollInterval);
      try {
        insforge.realtime.off('new_message', handleNewMessage);
        insforge.realtime.unsubscribe(`chat:${selectedChat.id}`);
      } catch (e) {}
    };
  }, [selectedChat]);

  const handleSendMessage = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedChat) return;

    const msg = inputValue.trim();
    setInputValue('');

    const tempMsg: ChatMessage = {
      id: crypto.randomUUID(),
      chat_id: selectedChat.id,
      sender: 'admin',
      content: msg,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    await insforge.database.from('chat_messages').insert([
      { chat_id: selectedChat.id, sender: 'admin', content: msg }
    ]);
    
    await insforge.database
      .from('live_chats')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', selectedChat.id);

    await insforge.realtime.publish(`chat:${selectedChat.id}`, 'new_message', tempMsg);
    await insforge.realtime.publish('admin_chats', 'chat_updated', { id: selectedChat.id });
  };

  const closeChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    await insforge.database.from('live_chats').update({ status: 'closed' }).eq('id', chatId);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Chat en Vivo</h1>
        <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Comunícate en tiempo real con los visitantes del portafolio.</p>
      </header>

      <div className="flex-1 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-black/10 dark:border-white/10 shadow-sm overflow-hidden flex h-[600px]">
        
        {/* Sidebar (Lista de Chats) */}
        <div className="w-80 border-r border-black/10 dark:border-white/10 flex flex-col bg-black/5 dark:bg-white/5 shrink-0">
          <div className="p-4 border-b border-black/10 dark:border-white/10">
            <h2 className="font-semibold">Conversaciones</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading && (
              <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
            )}
            
            {!isLoading && chats.length === 0 && (
              <div className="p-4 text-sm text-black/50 dark:text-white/50 text-center">No hay chats activos.</div>
            )}
            
            {!isLoading && chats.length > 0 && chats.map(chat => (
                <div 
                  key={chat.id}
                  className={`border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-white dark:bg-black border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setSelectedChat(chat)}
                      className="w-full text-left p-4 pb-2 cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm truncate">{chat.visitor_name}</span>
                        <span className="text-[10px] text-black/40 dark:text-white/40">
                          {new Date(chat.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </button>
                    <div className="flex items-center justify-between px-4 pb-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${chat.status === 'active' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-black/10 dark:bg-white/10'}`}>
                        {chat.status}
                      </span>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); closeChat(e, chat.id); }}
                        className="text-[10px] text-red-500 hover:underline"
                      >
                        Cerrar Chat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Área de Mensajes */}
        <div className="w-2/3 flex flex-col bg-[#f8f9fa] dark:bg-[#121212]">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1a1a] flex justify-between items-center">
                <div className="font-semibold flex items-center gap-2">
                  <User size={18} />
                  Chat con {selectedChat.visitor_name}
                </div>
                {selectedChat.status === 'closed' && (
                  <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-gray-500">Cerrado</span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-[15px] ${
                        isAdmin 
                          ? 'bg-blue-500 text-white rounded-br-sm' 
                          : 'bg-white dark:bg-[#252525] border border-black/10 dark:border-white/10 rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {selectedChat.status === 'active' ? (
                <div className="p-4 bg-white dark:bg-[#1a1a1a] border-t border-black/10 dark:border-white/10">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      placeholder="Escribe una respuesta..."
                      className="flex-1 bg-[#f8f9fa] dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Send size={16} /> Enviar
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-4 text-center text-black/40 dark:text-white/40 text-sm border-t border-black/10 dark:border-white/10">
                  Este chat ha sido cerrado.
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-black/30 dark:text-white/30">
              <MessageCircle size={64} className="mb-4" />
              <p>Selecciona una conversación para empezar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
