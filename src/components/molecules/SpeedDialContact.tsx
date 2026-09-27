import React, { useRef, useEffect, useState } from 'react';
import { Mail, Linkedin, Phone, MessageCircle, Lock, X } from 'lucide-react';
import { AppLanguage, AppTheme } from '../../types';
import { ContactData } from '../../services/firebaseAuth';

interface SpeedDialContactProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  isAuthenticated: boolean;
  contact: ContactData | null;
  language: AppLanguage;
  theme: AppTheme;
  onOpenContactModal: () => void;
}

export const SpeedDialContact: React.FC<SpeedDialContactProps> = ({
  isOpen,
  onToggle,
  isAuthenticated,
  contact,
  language,
  theme,
  onOpenContactModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [footerOverlap, setFooterOverlap] = useState(0);

  // Monitora a entrada do rodapé na viewport para evitar sobreposição ao rolar a página
  useEffect(() => {
    const handleFooterCollision = () => {
      const footer = document.querySelector('footer');
      if (!footer) {
        setFooterOverlap(0);
        return;
      }
      const rect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const overlap = Math.max(0, viewportHeight - rect.top);
      setFooterOverlap(overlap);
    };

    handleFooterCollision();
    window.addEventListener('scroll', handleFooterCollision, { passive: true });
    window.addEventListener('resize', handleFooterCollision);
    return () => {
      window.removeEventListener('scroll', handleFooterCollision);
      window.removeEventListener('resize', handleFooterCollision);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onToggle(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onToggle]);

  return (
    <>
      {/* BACKDROP GLASS/BLUR COBRINDO 100% DO VIEWPORT (INCLUINDO HEADER E SIDEBAR) */}
      {isOpen && (
        <div
          onClick={() => onToggle(false)}
          className="fixed inset-0 z-[48] bg-black/60 dark:bg-black/75 backdrop-blur-md transition-all animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <div
        ref={containerRef}
        className="fixed bottom-[max(1.5rem,calc(1.5rem+env(safe-area-inset-bottom,0px)))] right-5 sm:bottom-8 sm:right-8 z-[49] select-none group"
      >
        <div className="absolute -top-16 -left-16 w-38 h-38 pointer-events-none group-hover:pointer-events-auto rounded-tl-full" />

        {/* SATÉLITE 1: LINKEDIN */}
        <a
          href="https://br.linkedin.com/in/thaleseverardo"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onToggle(false)}
          aria-label="LinkedIn"
          className={`absolute -top-14 left-9 w-11 h-11 rounded-full border shadow-xl flex items-center justify-center cursor-pointer transition-all duration-200 ease-out group/sat ${
            isOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-50 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto delay-150 group-hover:delay-0'
          } ${
            theme === 'dark'
              ? 'bg-zinc-900/90 border-zinc-700/80 text-cyan-400 hover:text-blue-400 hover:scale-110 shadow-2xl shadow-black/80 backdrop-blur-md'
              : 'bg-white/95 border-slate-200 text-blue-600 hover:text-blue-500 hover:scale-110 shadow-slate-400/40 backdrop-blur-md'
          }`}
        >
          <Linkedin className="w-5 h-5 text-blue-500 dark:text-cyan-400 transition-transform group-hover/sat:scale-110" />
          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-md opacity-0 group-hover/sat:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
            LinkedIn
          </span>
        </a>

        {/* SATÉLITE 2: E-MAIL */}
        <button
          type="button"
          onClick={() => {
            onToggle(false);
            if (isAuthenticated && contact?.email) {
              window.location.href = `mailto:${contact.email}`;
            } else {
              onOpenContactModal();
            }
          }}
          aria-label="E-mail"
          className={`absolute -top-12.5 -left-3.5 w-11 h-11 rounded-full border shadow-xl flex items-center justify-center cursor-pointer transition-all duration-200 delay-50 ease-out group/sat ${
            isOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-50 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto delay-150 group-hover:delay-50'
          } ${
            theme === 'dark'
              ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300 hover:text-white hover:scale-110 shadow-2xl shadow-black/80 backdrop-blur-md'
              : 'bg-white/95 border-slate-200 text-slate-700 hover:text-slate-900 hover:scale-110 shadow-slate-400/40 backdrop-blur-md'
          }`}
        >
          {!isAuthenticated && (
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center pointer-events-none bg-slate-100 dark:bg-zinc-900 text-amber-500 dark:text-amber-400 ring-2 ring-white dark:ring-zinc-900 shadow-xs border border-slate-200 dark:border-zinc-700"
            >
              <Lock className="w-2.5 h-2.5" />
            </span>
          )}
          <Mail
            className={`w-5 h-5 transition-all ${
              !isAuthenticated
                ? 'text-slate-400 dark:text-zinc-500 opacity-70 group-hover/sat:opacity-100'
                : 'text-slate-700 dark:text-zinc-200 opacity-90 group-hover/sat:opacity-100'
            }`}
          />
          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-md opacity-0 group-hover/sat:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
            E-mail
          </span>
        </button>

        {/* SATÉLITE 3: TELEFONE */}
        <button
          type="button"
          onClick={() => {
            onToggle(false);
            if (isAuthenticated && contact?.phone) {
              const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
              window.location.href = `tel:+${cleanPhone}`;
            } else {
              onOpenContactModal();
            }
          }}
          aria-label={language === 'PT' ? 'Ligar' : 'Phone'}
          className={`absolute -top-3.5 -left-12.5 w-11 h-11 rounded-full border shadow-xl flex items-center justify-center cursor-pointer transition-all duration-200 delay-100 ease-out group/sat ${
            isOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-50 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto delay-150 group-hover:delay-100'
          } ${
            theme === 'dark'
              ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300 hover:text-amber-400 hover:scale-110 shadow-2xl shadow-black/80 backdrop-blur-md'
              : 'bg-white/95 border-slate-200 text-slate-700 hover:text-amber-600 hover:scale-110 shadow-slate-400/40 backdrop-blur-md'
          }`}
        >
          {!isAuthenticated && (
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center pointer-events-none bg-slate-100 dark:bg-zinc-900 text-amber-500 dark:text-amber-400 ring-2 ring-white dark:ring-zinc-900 shadow-xs border border-slate-200 dark:border-zinc-700"
            >
              <Lock className="w-2.5 h-2.5" />
            </span>
          )}
          <Phone
            className={`w-5 h-5 transition-all ${
              !isAuthenticated
                ? 'text-slate-400 dark:text-zinc-500 opacity-70 group-hover/sat:opacity-100'
                : 'text-amber-500 opacity-100'
            }`}
          />
          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-md opacity-0 group-hover/sat:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
            {language === 'PT' ? 'Ligar' : language === 'ES' ? 'Llamar' : language === 'FR' ? 'Appeler' : 'Call'}
          </span>
        </button>

        {/* SATÉLITE 4: WHATSAPP */}
        <button
          type="button"
          onClick={() => {
            onToggle(false);
            if (isAuthenticated && contact?.phone) {
              const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
              window.open(`https://wa.me/${cleanPhone}`, '_blank', 'noopener,noreferrer');
            } else {
              onOpenContactModal();
            }
          }}
          aria-label="WhatsApp"
          className={`absolute top-9 -left-14 w-11 h-11 rounded-full border shadow-xl flex items-center justify-center cursor-pointer transition-all duration-200 delay-150 ease-out group/sat ${
            isOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-50 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto delay-150 group-hover:delay-150'
          } ${
            theme === 'dark'
              ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300 hover:text-emerald-400 hover:scale-110 shadow-2xl shadow-black/80 backdrop-blur-md'
              : 'bg-white/95 border-slate-200 text-slate-700 hover:text-emerald-600 hover:scale-110 shadow-slate-400/40 backdrop-blur-md'
          }`}
        >
          {!isAuthenticated && (
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center pointer-events-none bg-slate-100 dark:bg-zinc-900 text-amber-500 dark:text-amber-400 ring-2 ring-white dark:ring-zinc-900 shadow-xs border border-slate-200 dark:border-zinc-700"
            >
              <Lock className="w-2.5 h-2.5" />
            </span>
          )}
          <MessageCircle
            className={`w-5 h-5 transition-all ${
              !isAuthenticated
                ? 'text-slate-400 dark:text-zinc-500 opacity-70 group-hover/sat:opacity-100'
                : 'text-emerald-500 opacity-100'
            }`}
          />
          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-md opacity-0 group-hover/sat:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
            WhatsApp
          </span>
        </button>

        {/* ESFERA PRINCIPAL: TIPOGRAFIA CONFORTÁVEL & TRANSIÇÃO PARA ÍCONE 'X' QUANDO ATIVO */}
        <button
          type="button"
          onClick={() => onToggle(!isOpen)}
          className={`relative w-15 h-15 sm:w-17 sm:h-17 rounded-full text-white transition-all duration-200 cursor-pointer flex items-center justify-center select-none shadow-xl ${
            isOpen
              ? 'bg-zinc-900/90 dark:bg-zinc-850/95 border border-white/20 text-white shadow-2xl shadow-black/80 scale-105 ring-4 ring-blue-500/20 backdrop-blur-md'
              : 'bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 border border-white/25 shadow-lg shadow-blue-900/40 hover:scale-105 active:scale-95'
          }`}
          aria-expanded={isOpen}
          aria-label={language === 'PT' ? 'Contato' : language === 'ES' ? 'Contacto' : 'Contact'}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-white transition-transform duration-200 animate-in zoom-in-75" />
          ) : (
            <span className="font-sans text-center leading-tight flex flex-col items-center justify-center pointer-events-none">
              {language === 'PT' ? (
                <>
                  <span className="text-[10px] font-medium opacity-85 tracking-tight">Entrar em</span>
                  <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">Contato</span>
                </>
              ) : language === 'ES' ? (
                <>
                  <span className="text-[10px] font-medium opacity-85 tracking-tight">Iniciar</span>
                  <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">Contacto</span>
                </>
              ) : language === 'FR' ? (
                <>
                  <span className="text-[10px] font-medium opacity-85 tracking-tight">Prendre</span>
                  <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">Contact</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-medium opacity-85 tracking-tight">Get in</span>
                  <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">Touch</span>
                </>
              )}
            </span>
          )}
        </button>
      </div>
    </>
  );
};
