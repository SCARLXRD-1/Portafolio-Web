import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, CheckCircle } from 'lucide-react';

export default function CertificatesApp() {
  const certificates = [
    {
      id: 1,
      title: "Desarrollo Web Completo",
      issuer: "Alura Latam",
      date: "Octubre 2023",
      url: "#",
      skills: ["React", "JavaScript", "HTML/CSS"]
    },
    {
      id: 2,
      title: "CCNA: Introduction to Networks",
      issuer: "Cisco Networking Academy",
      date: "Marzo 2024",
      url: "#",
      skills: ["Redes", "TCP/IP", "Routing"]
    }
  ];

  return (
    <div className="w-full min-h-full p-6 md:p-10 bg-white/50 dark:bg-[#121212]/80 transition-colors">
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
            <h1 className="text-3xl font-bold text-black dark:text-white">Certificados</h1>
            <p className="text-black/60 dark:text-white/60 mt-1">Validación de habilidades y conocimientos adquiridos.</p>
          </div>
        </motion.div>

        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl bg-black/5 dark:bg-white/5">
            <Award size={48} className="text-black/20 dark:text-white/20 mb-4" />
            <h3 className="text-xl font-medium text-black dark:text-white mb-1">No hay certificados</h3>
            <p className="text-black/50 dark:text-white/50 text-sm text-center max-w-md">
              Aún no se han añadido certificados a la plataforma.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Map over certificates here when there is real data */}
          </div>
        )}
      </div>
    </div>
  );
}
