'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { 
  Send, 
  MessageCircle, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Radio, 
  FileText, 
  Code2, 
  Briefcase, 
  Mail 
} from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { useSystemSounds } from '@/hooks/useSystemSounds';
import { useWindowStore } from '@/store/useWindowStore';

interface ChatMessage {
  id: string;
  sender: 'visitor' | 'admin' | 'ai';
  content: string;
  created_at: string;
}

export default function ChatApp() {
  const locale = useLocale();
  const isEs = locale === 'es';
  const [mode, setMode] = useState<'ai' | 'live'>('ai');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { playClick, playOpen } = useSystemSounds();
  const openWindow = useWindowStore((state) => state.openWindow);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isInitializing, isAiTyping]);

  // Mensaje de bienvenida inicial de Akashi AI (solo si está vacío)
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 0) return prev;
      return [{
        id: 'ai-welcome',
        sender: 'ai',
        content: isEs
          ? '¡Hola! Soy Akashi AI 🤖, el asistente virtual de Jhonatan. Pregúntame sobre sus proyectos, stack tecnológico, experiencia laboral o cómo contactarlo.'
          : 'Hello! I am Akashi AI 🤖, Jhonatan\'s virtual assistant. Ask me anything about his projects, tech stack, work experience, or how to reach him.',
        created_at: new Date().toISOString(),
      }];
    });
  }, [isEs]);

  // Inicializar Chat con InsForge
  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      let currentChatId = typeof window !== 'undefined' ? localStorage.getItem('live_chat_id') : null;

      if (!currentChatId) {
        try {
          const { data, error } = await insforge.database
            .from('live_chats')
            .insert([{ visitor_name: 'Visitante Web' }])
            .select()
            .single();

          if (data && !error && isMounted) {
            currentChatId = data.id as string;
            if (currentChatId) {
              localStorage.setItem('live_chat_id', currentChatId);
            }
          }
        } catch {
          // Continuar en modo local si la BD no responde
        }
      }

      if (isMounted) setChatId(currentChatId);

      if (currentChatId && isMounted) {
        try {
          const { data: history } = await insforge.database
            .from('chat_messages')
            .select('*')
            .eq('chat_id', currentChatId)
            .order('created_at', { ascending: true });

          if (history && history.length > 0 && isMounted) {
            setMessages((prev) => {
              const existingIds = new Set(prev.map(m => m.id));
              const uniqueHistory = (history as ChatMessage[]).filter(h => !existingIds.has(h.id));
              return [...prev, ...uniqueHistory];
            });
          }
        } catch {}
      }

      if (isMounted) setIsInitializing(false);
    };

    initChat();
    return () => { isMounted = false; };
  }, []);

  // Motor de respuestas contextuales de Akashi AI
  const generateAiResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    // Proyectos
    if (q.includes('proyecto') || q.includes('project') || q.includes('portafolio') || q.includes('portfolio') || q.includes('app')) {
      return isEs
        ? '🚀 Los proyectos principales de Jhonatan incluyen:\n• **AKASHI OS:** Este sistema operativo web construido con Next.js 15, TypeScript y BaaS InsForge.\n• **CMS Administrativo:** Panel de control protegido con GitHub OAuth para gestionar contenido en tiempo real.\n• **Aplicaciones Web & Móviles:** Diseños de alta fidelidad con React Native y Tailwind CSS.\n\nPuedes explorar todos los detalles abriendo la carpeta de **Proyectos** en el escritorio.'
        : '🚀 Jhonatan\'s featured projects include:\n• **AKASHI OS:** This full web operating system built with Next.js 15, TypeScript, and InsForge BaaS.\n• **Administrative CMS:** Dashboard secured with GitHub OAuth for real-time content management.\n• **Web & Mobile Apps:** High-fidelity UI with React Native and Tailwind CSS.\n\nYou can explore all details in the **Projects** folder on the desktop.';
    }

    // Tecnologías y Habilidades
    if (q.includes('skill') || q.includes('habilidad') || q.includes('tecnolog') || q.includes('stack') || q.includes('lenguaje') || q.includes('react') || q.includes('next')) {
      return isEs
        ? '⚡ **Core Tech Stack de Jhonatan:**\n• **Frontend:** Next.js 14/15, React 19, TypeScript, Tailwind CSS, Framer Motion.\n• **Backend & BaaS:** Node.js, PostgreSQL, InsForge, REST APIs, Autenticación JWT.\n• **Móvil:** React Native & Expo.\n• **Herramientas:** Git, Docker, Linux, Figma to Code.\n\nPosee un enfoque especial en rendimiento, accesibilidad y diseño de interfaces interactivas.'
        : '⚡ **Jhonatan\'s Core Tech Stack:**\n• **Frontend:** Next.js 14/15, React 19, TypeScript, Tailwind CSS, Framer Motion.\n• **Backend & BaaS:** Node.js, PostgreSQL, InsForge, REST APIs, JWT Auth.\n• **Mobile:** React Native & Expo.\n• **Tools:** Git, Docker, Linux, Figma to Code.\n\nWith a strong focus on performance, accessibility, and interactive design.';
    }

    // CV y Currículum
    if (q.includes('cv') || q.includes('curriculum') || q.includes('resume') || q.includes('descargar') || q.includes('download')) {
      return isEs
        ? '📄 Puedes visualizar y descargar el CV de Jhonatan directamente haciendo doble clic en el acceso directo **Currículum.pdf** en el escritorio, o pulsando el botón de **Modo Reclutador** en la barra superior. ¡Está disponible tanto en Español como en Inglés!'
        : '📄 You can view and download Jhonatan\'s Resume directly by double-clicking the **Resume.pdf** desktop shortcut, or by clicking **Recruiter Mode** on the top bar. It is available in both English and Spanish!';
    }

    // Contacto y Correo
    if (q.includes('contacto') || q.includes('contact') || q.includes('correo') || q.includes('email') || q.includes('contrat') || q.includes('hire') || q.includes('hablar')) {
      return isEs
        ? '✉️ Puedes contactar a Jhonatan directamente por correo a **jobathanjimenez1265@gmail.com** o abriendo la aplicación de **Contacto** en el Dock. Actualmente está disponible para contrataciones remotas y proyectos freelance.'
        : '✉️ You can reach Jhonatan directly at **jobathanjimenez1265@gmail.com** or by opening the **Contact** app in the Dock. He is currently open to remote roles and freelance projects.';
    }

    // IA y Machine Learning
    if (q.includes('ia') || q.includes('ai') || q.includes('machine learning') || q.includes('inteligencia')) {
      return isEs
        ? '🤖 Jhonatan integra activamente soluciones de Inteligencia Artificial en sus proyectos web, aprovechando gateways de LLMs (Gemini, Claude, GPT), prompts contextuales, automatización de código y flujos asistidos por agentes.'
        : '🤖 Jhonatan actively integrates AI solutions into web projects, leveraging LLM gateways (Gemini, Claude, GPT), contextual prompting, code automation, and agentic workflows.';
    }

    // Respuesta general
    return isEs
      ? 'Entendido. Jhonatan es Ingeniero de Software enfocado en desarrollo Web y Móvil de alto impacto. ¿Te gustaría saber más sobre sus **proyectos**, su **stack tecnológico**, o cómo **descargar su currículum**?'
      : 'Understood! Jhonatan is a Software Engineer focused on high-impact Web & Mobile development. Would you like to know more about his **projects**, **tech stack**, or how to **download his resume**?';
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    playClick();
    setInputValue('');

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'visitor',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Guardar en InsForge si está disponible
    if (chatId) {
      try {
        await insforge.database.from('chat_messages').insert([
          { chat_id: chatId, sender: 'visitor', content: text }
        ]);
        await insforge.database
          .from('live_chats')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', chatId);
      } catch {}
    }

    // Si estamos en modo AI (o por defecto), generar respuesta de Akashi AI
    if (mode === 'ai') {
      setIsAiTyping(true);
      setTimeout(async () => {
        const responseText = generateAiResponse(text);
        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'ai',
          content: responseText,
          created_at: new Date().toISOString(),
        };

        setIsAiTyping(false);
        setMessages((prev) => [...prev, aiMsg]);
        playOpen();
      }, 700);
    }
  };

  const quickPills = [
    { label: isEs ? '🚀 Proyectos clave' : '🚀 Key Projects', query: isEs ? '¿Cuáles son tus proyectos destacados?' : 'What are your featured projects?' },
    { label: isEs ? '⚡ Stack tecnológico' : '⚡ Tech Stack', query: isEs ? '¿Qué tecnologías dominas?' : 'What technologies do you use?' },
    { label: isEs ? '📄 Ver CV' : '📄 View Resume', query: isEs ? '¿Cómo puedo ver o descargar tu CV?' : 'How can I view or download your CV?' },
    { label: isEs ? '✉️ Contactar' : '✉️ Contact', query: isEs ? '¿Cómo puedo contactarte para trabajar?' : 'How can I contact you to work together?' },
  ];

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-zinc-950 text-white">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-white relative select-none">
      {/* Header con alternador de modo */}
      <header className="px-4 py-2.5 border-b border-white/10 bg-zinc-900/80 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
            {mode === 'ai' ? <Sparkles size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
          </div>
          <div>
            <h2 className="font-bold text-xs sm:text-sm text-white leading-tight">
              {mode === 'ai' ? 'Akashi AI (Asistente)' : 'Chat con Jhonatan'}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{mode === 'ai' ? (isEs ? 'Respuesta inmediata' : 'Instant replies') : (isEs ? 'En vivo' : 'Live')}</span>
            </div>
          </div>
        </div>

        {/* Selector AI vs Live */}
        <div className="flex items-center bg-zinc-800/80 p-0.5 rounded-lg border border-white/5 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => { playClick(); setMode('ai'); }}
            className={`px-2 py-1 rounded-md transition-colors ${
              mode === 'ai' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            AI
          </button>
          <button
            type="button"
            onClick={() => { playClick(); setMode('live'); }}
            className={`px-2 py-1 rounded-md transition-colors ${
              mode === 'live' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isEs ? 'Admin' : 'Live'}
          </button>
        </div>
      </header>

      {/* Sugerencias Rápidas (Pills) */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900/40 border-b border-white/5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {quickPills.map((pill) => (
          <button
            key={pill.label}
            type="button"
            onClick={() => handleSendMessage(pill.query)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-300 hover:text-white transition-colors"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Historial de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'visitor';
          const isAI = msg.sender === 'ai';

          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[80%] flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-auto text-xs ${
                    isUser
                      ? 'bg-zinc-800 text-zinc-300'
                      : isAI
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
                  }`}
                >
                  {isUser ? <User size={13} /> : isAI ? <Sparkles size={13} /> : <Bot size={13} />}
                </div>

                {/* Burbuja */}
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-md whitespace-pre-wrap ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-zinc-900/90 border border-white/10 text-zinc-200 rounded-bl-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Indicador de escribiendo */}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-white/10 px-3 py-2 rounded-2xl text-xs text-zinc-400">
              <Sparkles size={12} className="animate-spin text-blue-400" />
              <span>Akashi AI está escribiendo...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input de texto */}
      <div className="p-3 bg-zinc-900/70 border-t border-white/10 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 max-w-2xl mx-auto relative"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              mode === 'ai'
                ? isEs ? 'Pregúntale algo a Akashi AI...' : 'Ask Akashi AI anything...'
                : isEs ? 'Escribe un mensaje para Jhonatan...' : 'Type a message for Jhonatan...'
            }
            className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-4 py-2.5 pr-11 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-1.5 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-40 disabled:bg-zinc-800 hover:bg-blue-500 transition-colors shadow-sm"
          >
            <Send size={13} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
