'use client';

import React, { useState } from 'react';
import { Award, Plus, Search, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminCertificates() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'es';
  const [searchTerm, setSearchTerm] = useState('');

  // Static mock data until we connect the DB
  const certificates = [
    {
      id: 1,
      title: "Desarrollo Web Completo",
      issuer: "Alura Latam",
      date: "Octubre 2023",
      status: "published"
    },
    {
      id: 2,
      title: "CCNA: Introduction to Networks",
      issuer: "Cisco Networking Academy",
      date: "Marzo 2024",
      status: "draft"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Certificados</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Gestiona los certificados y acreditaciones de tu portafolio.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-xl transition-colors shadow-lg shadow-yellow-500/20">
          <Plus size={18} />
          <span>Nuevo Certificado</span>
        </button>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" size={18} />
          <input
            type="text"
            placeholder="Buscar certificados por título o emisor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 pl-10 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/5 dark:bg-white/5 text-xs uppercase text-black/50 dark:text-white/50 tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Título del Certificado</th>
                <th className="px-6 py-4 font-medium">Emisor</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                        <Award size={18} />
                      </div>
                      <span className="font-medium text-black dark:text-white">{cert.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-black/70 dark:text-white/70">
                    {cert.issuer}
                  </td>
                  <td className="px-6 py-4 text-black/70 dark:text-white/70">
                    {cert.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      cert.status === 'published' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/60'
                    }`}>
                      {cert.status === 'published' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {cert.status === 'published' ? 'Público' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-red-500/70 hover:text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {certificates.length === 0 && (
          <div className="p-12 text-center text-black/50 dark:text-white/50">
            No se encontraron certificados.
          </div>
        )}
      </div>
    </div>
  );
}
