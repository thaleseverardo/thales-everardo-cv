import React from 'react';
import { X, ShieldCheck, Linkedin, ExternalLink } from 'lucide-react';
import { AppLanguage, AppTheme } from '../../types';
import { AuthContactGate } from '../molecules/AuthContactGate';
import { PROFILE_DATA } from '../../data/curriculumData';

interface ContactAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  theme: AppTheme;
}

export const ContactAuthModal: React.FC<ContactAuthModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
}) => {
  if (!isOpen) return null;

  const isPT = language === 'PT';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-zinc-950 border-zinc-800 text-zinc-100 shadow-black/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/20'
        }`}
      >
        {/* CABEÇALHO LIMPO */}
        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-zinc-800 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-900/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold tracking-tight">
                {isPT ? 'Canais de Contato Direto' : 'Direct Contact Channels'}
              </h2>
              <p className="text-[11px] font-sans opacity-60">
                {isPT ? 'Autenticação necessária para WhatsApp e E-mail' : 'Verification required for WhatsApp & Email'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* CORPO DO MODAL: CONTATOS PROTEGIDOS + LINKEDIN LIVRE */}
        <div className="p-5 space-y-4">
          {/* CONTATOS PROTEGIDOS: WHATSAPP, TELEFONE E E-MAIL */}
          <AuthContactGate language={language} theme={theme} />

          {/* LINKEDIN: CANAL PÚBLICO DIRETO (SEM LOGIN) */}
          <div className="pt-2 border-t dark:border-zinc-800 border-slate-100 flex items-center justify-between">
            <span className="text-xs font-sans opacity-60">
              {isPT ? 'Canal institucional público:' : 'Public institutional profile:'}
            </span>
            <a
              href={PROFILE_DATA.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-blue-600 dark:text-cyan-400"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
