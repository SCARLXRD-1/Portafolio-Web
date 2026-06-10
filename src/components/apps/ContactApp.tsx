'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { insforge } from '@/lib/insforge';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function ContactApp() {
  const t = useTranslations('Dock');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    try {
      const { error } = await insforge.database
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: 'Contacto desde Portafolio',
          message: formData.message,
          status: 'unread'
        }]);

      if (error) throw error;
      
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      alert('Error enviando mensaje: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#0d0d0d]/90 text-white overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Mail className="text-purple-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('contact')}</h1>
            <p className="text-white/50 mt-1">Ponte en contacto conmigo para colaboraciones o consultas.</p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Contact Form */}
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            {isSuccess ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">¡Mensaje Enviado!</h3>
                <p className="text-white/60 max-w-sm">
                  Gracias por contactarme. He recibido tu mensaje y te responderé lo más pronto posible al correo {formData.email || 'proporcionado'}.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form 
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="name">Nombre</label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="h-10 w-full bg-white/5 rounded-lg border border-white/10 px-3 text-sm text-white focus:outline-none focus:border-purple-500/50" 
                    placeholder="Tu nombre"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="h-10 w-full bg-white/5 rounded-lg border border-white/10 px-3 text-sm text-white focus:outline-none focus:border-purple-500/50" 
                    placeholder="tu@email.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="message">Mensaje</label>
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white/5 rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none" 
                    placeholder="Escribe tu mensaje aquí..."
                    disabled={isSubmitting}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors border border-purple-400 mt-4 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            )}
          </div>

          {/* Social Links */}
          <div className="w-full md:w-64 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-white/90">Redes Sociales</h3>
              <div className="space-y-3">
                {[
                  { icon: <GithubIcon size={18} />, label: 'GitHub', href: 'https://github.com/SCARLXRD-1' },
                  { icon: <LinkedinIcon size={18} />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/jhonatan-jimenez-ak/' },
                  { icon: <TwitterIcon size={18} />, label: 'Twitter', href: '#' }
                ].map((social, idx) => (
                  <a 
                    key={idx} 
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                  >
                    <div className="text-white/60 group-hover:text-purple-400 transition-colors">
                      {social.icon}
                    </div>
                    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
