'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  FileText, 
  Loader2, 
  Languages, 
  AlertCircle 
} from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { useSystemSounds } from '@/hooks/useSystemSounds';

export default function CVViewerApp() {
  const t = useTranslations('CVViewer');
  const locale = useLocale();
  const [selectedLang, setSelectedLang] = useState<'es' | 'en'>(locale === 'es' ? 'es' : 'en');
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [cvUrls, setCvUrls] = useState<{ es: string; en: string }>({ es: '', en: '' });
  const { playClick } = useSystemSounds();

  useEffect(() => {
    const fetchCvUrls = async () => {
      try {
        setLoading(true);
        const { data } = await insforge.database
          .from('profile_settings')
          .select('cv_url_es, cv_url_en')
          .eq('id', '00000000-0000-0000-0000-000000000001')
          .single();
        if (data) {
          setCvUrls({ es: data.cv_url_es || '', en: data.cv_url_en || '' });
        }
      } catch {
        // Fallback silencioso si no hay conexión
      } finally {
        setLoading(false);
      }
    };
    fetchCvUrls();
  }, []);

  const activeUrl = selectedLang === 'es' 
    ? (cvUrls.es || cvUrls.en) 
    : (cvUrls.en || cvUrls.es);

  const handleZoomIn = () => {
    playClick();
    setZoom((prev) => Math.min(prev + 15, 175));
  };

  const handleZoomOut = () => {
    playClick();
    setZoom((prev) => Math.max(prev - 15, 60));
  };

  const handleResetZoom = () => {
    playClick();
    setZoom(100);
  };

  const handleDownload = () => {
    playClick();
    if (!activeUrl) return;
    const link = document.createElement('a');
    link.href = activeUrl;
    link.download = `CV_Jhonatan_Jimenez_${selectedLang.toUpperCase()}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenExternal = () => {
    playClick();
    if (activeUrl) {
      window.open(activeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-white select-none">
      {/* Barra de herramientas superior */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-zinc-900/90 border-b border-white/10 backdrop-blur-md">
        {/* Selector de idioma */}
        <div className="flex items-center gap-1.5 bg-zinc-800/80 p-0.5 rounded-lg border border-white/5">
          <Languages size={14} className="ml-2 text-zinc-400" />
          <button
            type="button"
            onClick={() => { playClick(); setSelectedLang('es'); }}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
              selectedLang === 'es' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => { playClick(); setSelectedLang('en'); }}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
              selectedLang === 'en' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            EN
          </button>
        </div>

        {/* Controles de zoom */}
        <div className="flex items-center gap-1 bg-zinc-800/80 p-0.5 rounded-lg border border-white/5 text-xs text-zinc-300">
          <button
            type="button"
            onClick={handleZoomOut}
            title={t('zoomOut')}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <ZoomOut size={14} />
          </button>
          <span className="w-12 text-center font-mono font-medium text-zinc-200">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            title={t('zoomIn')}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <ZoomIn size={14} />
          </button>
          <div className="w-px h-3.5 bg-white/10 mx-0.5" />
          <button
            type="button"
            onClick={handleResetZoom}
            title={t('resetZoom')}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white"
          >
            <RotateCcw size={12} />
          </button>
        </div>

        {/* Acciones principales */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!activeUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600/90 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm"
          >
            <Download size={14} />
            <span className="hidden sm:inline">{t('download')}</span>
          </button>
          <button
            type="button"
            onClick={handleOpenExternal}
            disabled={!activeUrl}
            title={t('openExternal')}
            className="p-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none border border-white/10 transition-colors"
          >
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Área del visor de PDF */}
      <div className="flex-1 overflow-auto bg-zinc-900/60 p-2 sm:p-4 flex items-start justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <span className="text-xs">Cargando documento...</span>
          </div>
        ) : activeUrl ? (
          <div 
            className="w-full h-full max-w-4xl min-h-[500px] flex justify-center transition-transform duration-150"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
          >
            <iframe
              src={`${activeUrl}#toolbar=0&navpanes=0`}
              title="Currículum Vitae PDF"
              className="w-full h-full min-h-[550px] rounded-lg border border-white/10 shadow-2xl bg-zinc-800"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center p-6 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-base font-semibold text-white">
              {t('noCvTitle')}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t('noCvDesc')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
