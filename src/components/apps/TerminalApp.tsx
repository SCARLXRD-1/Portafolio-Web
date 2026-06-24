'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useWindowStore } from '@/store/useWindowStore';
import { useThemeStore } from '@/store/useThemeStore';
import { insforge } from '@/lib/insforge';

interface CommandLog {
  command: string;
  output: React.ReactNode;
  id: number;
}

export default function TerminalApp() {
  const t = useTranslations('Terminal');
  const locale = useLocale();
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [cvUrls, setCvUrls] = useState<{es: string, en: string}>({es: '', en: ''});
  const bottomRef = useRef<HTMLDivElement>(null);
  const openWindow = useWindowStore((state) => state.openWindow);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    const loadCVs = async () => {
      try {
        const { data } = await insforge.database
          .from('profile_settings')
          .select('cv_url_es, cv_url_en')
          .eq('id', '00000000-0000-0000-0000-000000000001')
          .single();
        if (data) {
          setCvUrls({ es: data.cv_url_es || '', en: data.cv_url_en || '' });
        }
      } catch (e) {}
    };
    loadCVs();
  }, []);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    let output: React.ReactNode = null;

    const commandParts = trimmed.split(' ');
    const baseCmd = commandParts[0];
    const args = commandParts.slice(1).join(' ');

    switch (baseCmd) {
      case 'help':
        output = <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">{t('helpText')}</pre>;
        break;
      case 'projects':
      case 'about':
      case 'skills':
      case 'contact':
      case 'certificates':
      case 'experiments':
      case 'experience':
      case 'settings':
      case 'browser':
        openWindow(baseCmd as any);
        output = <span className="text-emerald-400">Opening {baseCmd}...</span>;
        break;
      case 'whoami':
        output = <span className="text-gray-300">invitado (guest) - Acceso limitado.</span>;
        break;
      case 'date':
        output = <span className="text-gray-300">{new Date().toString()}</span>;
        break;
      case 'sudo':
        output = <span className="text-red-400">nice try. This incident will be reported.</span>;
        break;
      case 'echo':
        output = <span className="text-gray-300">{args}</span>;
        break;
      case 'github':
        window.open('https://github.com/SCARLXRD-1', '_blank');
        output = <span className="text-emerald-400">Opening GitHub...</span>;
        break;
      case 'theme':
        if (args === 'dark') {
          setTheme('dark');
          output = <span className="text-gray-300">Theme changed to dark.</span>;
        } else if (args === 'light') {
          setTheme('light');
          output = <span className="text-gray-300">Theme changed to light.</span>;
        } else {
          output = <span className="text-red-400">Usage: theme [dark|light]</span>;
        }
        break;
      case 'fetch':
        if (args === 'cv') {
          const cvUrl = locale === 'en' ? cvUrls.en : cvUrls.es;
          if (!cvUrl) {
            output = <span className="text-red-400">CV not available / CV no disponible.</span>;
          } else {
            output = (
              <div className="text-gray-300 font-mono">
                <div>Resolving cv.pdf... 100%</div>
                <div>Downloading [====================] 100%</div>
                <div className="text-emerald-400 mt-1">CV successfully fetched. Opening...</div>
              </div>
            );
            setTimeout(() => window.open(cvUrl, '_blank'), 1000);
          }
        } else {
          output = <span className="text-red-400">Usage: fetch cv</span>;
        }
        break;
      case 'neofetch':
        output = (
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2 mb-2">
            <pre className="text-emerald-400 font-bold leading-tight">
{`    /\\    
   /  \\   
  /____\\  
 /      \\ 
/________\\`}
            </pre>
            <div className="text-gray-300">
              <div><span className="text-emerald-500 font-bold">akashi</span>@<span className="text-emerald-500 font-bold">os</span></div>
              <div className="text-white/30">----------------</div>
              <div><span className="text-emerald-500 font-bold">OS:</span> AkashiOS v1.0</div>
              <div><span className="text-emerald-500 font-bold">Host:</span> Web Browser</div>
              <div><span className="text-emerald-500 font-bold">Uptime:</span> Always up</div>
              <div><span className="text-emerald-500 font-bold">Packages:</span> 42 (npm)</div>
              <div><span className="text-emerald-500 font-bold">Shell:</span> bash</div>
              <div><span className="text-emerald-500 font-bold">Theme:</span> custom-glassmorphism</div>
              <div><span className="text-emerald-500 font-bold">Terminal:</span> web-term</div>
              <div className="flex gap-1 mt-2">
                <div className="w-4 h-4 bg-black"></div>
                <div className="w-4 h-4 bg-red-500"></div>
                <div className="w-4 h-4 bg-green-500"></div>
                <div className="w-4 h-4 bg-yellow-500"></div>
                <div className="w-4 h-4 bg-blue-500"></div>
                <div className="w-4 h-4 bg-purple-500"></div>
                <div className="w-4 h-4 bg-cyan-500"></div>
                <div className="w-4 h-4 bg-white"></div>
              </div>
            </div>
          </div>
        );
        break;
      case 'clear':
        setLogs([]);
        setInput('');
        return;
      default:
        output = <span className="text-red-400">{t('notFound', { command: trimmed })}</span>;
        break;
    }

    setLogs((prev) => [...prev, { command: trimmed, output, id: Date.now() }]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black/80 font-mono text-sm p-4 overflow-hidden rounded-b-xl border-t border-white/5">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
        {/* Welcome Message */}
        <div className="mb-4 text-emerald-400/90 font-medium tracking-wide">
          <p>{t('welcome')}</p>
          <p className="text-gray-500 text-xs mt-1">Akashi OS v1.0.0-beta</p>
        </div>

        {/* Logs */}
        <div className="flex flex-col gap-3">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-emerald-500 font-bold">{t('prompt')}</span>
                <span>{log.command}</span>
              </div>
              <div className="pl-4">{log.output}</div>
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input Line */}
      <div className="flex items-center gap-2 mt-4 text-gray-300">
        <span className="text-emerald-500 font-bold whitespace-nowrap">{t('prompt')}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          className="flex-1 bg-transparent outline-none border-none text-white focus:ring-0 p-0"
        />
      </div>
    </div>
  );
}
