import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, FileText, Loader2, X } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { useBrowserStore } from './BrowserApp';
import { useWindowStore } from '@/store/useWindowStore';
import { useTranslations, useLocale } from 'next-intl';

export default function CertificatesApp() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<{ url: string, type: 'pdf' | 'image' } | null>(null);
  const t = useTranslations('Dock');
  const locale = useLocale();
  const isEs = locale === 'es';
  
  const { navigate } = useBrowserStore();
  const { openWindow } = useWindowStore();

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data } = await insforge.database
          .from('certificates')
          .select('*')
          .eq('status', 'published')
          .order('sort_order', { ascending: true });
        if (data) setCertificates(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const handleOpenExternal = (url: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const handleViewFile = (url: string) => {
    if (!url) return;
    const isPdf = url.toLowerCase().includes('.pdf');
    setSelectedFile({ url, type: isPdf ? 'pdf' : 'image' });
  };

  return (
    <div className="w-full min-h-full p-6 md:p-10 bg-white/50 dark:bg-[#121212]/80 transition-colors relative">
      {/* File Viewer Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white dark:bg-[#1e1e1e] border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-4 py-3 border-b border-black/10 dark:border-white/10 bg-[#f8f9fa] dark:bg-[#252525]">
              <span className="font-semibold text-sm">{isEs ? 'Visualizador de Certificado' : 'Certificate Viewer'}</span>
              <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-black/5 dark:bg-black/40">
              {selectedFile.type === 'pdf' ? (
                <iframe src={`${selectedFile.url}#toolbar=0`} className="w-full h-full border-none" title="PDF Viewer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
                  <img src={selectedFile.url} alt="Certificado" className="max-w-full max-h-full object-contain shadow-md rounded" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <Award size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">{t('certificates')}</h1>
            <p className="text-black/60 dark:text-white/60 mt-1">{isEs ? 'Validación de habilidades y conocimientos adquiridos.' : 'Validation of acquired skills and knowledge.'}</p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl bg-black/5 dark:bg-white/5">
            <Award size={48} className="text-black/20 dark:text-white/20 mb-4" />
            <h3 className="text-xl font-medium text-black dark:text-white mb-1">{isEs ? 'No hay certificados' : 'No certificates'}</h3>
            <p className="text-black/50 dark:text-white/50 text-sm text-center max-w-md">
              {isEs ? 'Aún no se han añadido certificados a la plataforma.' : 'No certificates have been added to the platform yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col p-6 rounded-3xl bg-white/60 dark:bg-[#1e1e1e]/60 border border-black/5 dark:border-white/5 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Award size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    {cert.file_url && (
                      <button 
                        onClick={() => handleViewFile(cert.file_url)}
                        className="p-2 text-black/60 hover:text-emerald-600 dark:text-white/60 dark:hover:text-emerald-400 bg-black/5 hover:bg-emerald-500/10 dark:bg-white/5 dark:hover:bg-emerald-500/10 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
                        title={isEs ? "Ver documento" : "View document"}
                      >
                        <FileText size={18} />
                        <span className="hidden sm:inline">{isEs ? 'Ver Documento' : 'View Document'}</span>
                      </button>
                    )}
                    {cert.url && (
                      <button 
                        onClick={() => handleOpenExternal(cert.url)}
                        className="p-2 text-black/40 hover:text-blue-500 dark:text-white/40 dark:hover:text-blue-400 bg-black/5 hover:bg-blue-500/10 dark:bg-white/5 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                        title={isEs ? "Verificación externa" : "External verification"}
                      >
                        <ExternalLink size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-black dark:text-white leading-tight mb-2">
                  {cert.title}
                </h3>
                <p className="text-sm font-medium text-black/60 dark:text-white/60 mb-4">
                  {cert.issuer}
                </p>

                <div className="mt-auto pt-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-black/50 dark:text-white/50">
                    <Calendar size={14} />
                    <span>{cert.date}</span>
                  </div>
                </div>

                {cert.skills && cert.skills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-2">
                    {cert.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
