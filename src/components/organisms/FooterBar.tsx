import React from 'react';
import {
  Linkedin,
  Github,
  Youtube,
  Twitter,
} from 'lucide-react';
import { SystemState } from '../../types';
import { t } from '../../i18n/translations';

interface FooterBarProps {
  systemState: SystemState;
  updateState?: (updates: Partial<SystemState>) => void;
  onOpenPrivacy?: () => void;
}

export const FooterBar: React.FC<FooterBarProps> = ({ systemState, onOpenPrivacy }) => {
  const { language, theme } = systemState;

  const currentYear = new Date().getFullYear();
  const comingSoonText = t(language, 'footer.comingSoon');

  return (
    <footer
      className={`border-t sticky bottom-0 z-30 h-12 py-2 px-4 sm:px-8 select-none transition-colors backdrop-blur-md flex items-center justify-between gap-4 text-xs ${
        theme === 'dark'
          ? 'bg-[#09090b]/90 border-zinc-800/80 text-zinc-400'
          : 'bg-white/90 border-slate-200 text-slate-600 shadow-2xs'
      }`}
    >
      {/* IDENTIDADE INSTITUCIONAL */}
      <div className="flex items-center gap-2 font-sans truncate">
        <span className="font-semibold text-slate-800 dark:text-zinc-200 tracking-tight">
          © {currentYear} Thales Everardo
        </span>
        <span className="opacity-30 hidden sm:inline">•</span>
        <span className="text-[11px] opacity-60 hidden sm:inline">
{t(language, 'footer.subtitle')}
        </span>
        <span className="opacity-30 hidden sm:inline">•</span>
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="text-[11px] opacity-70 hover:opacity-100 hover:underline transition-opacity cursor-pointer font-sans"
        >
          {t(language, 'footer.privacyLink')}
        </button>
      </div>

      {/* BANDEJA DE REDES SOCIAIS (ÍCONES MINIMALISTAS SEM BORDA/FUNDO) */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* LINKEDIN (ATIVO) */}
        <a
          href="https://br.linkedin.com/in/thaleseverardo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="relative group p-1.5 rounded-md transition-colors cursor-pointer text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100/80 dark:hover:bg-zinc-800/60"
        >
          <Linkedin className="w-4 h-4" />
          <span className="tooltip-bubble">LinkedIn</span>
        </a>

        {/* GITHUB (ATIVO) */}
        <a
          href="https://github.com/thaleseverardo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="relative group p-1.5 rounded-md transition-colors cursor-pointer text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100/80 dark:hover:bg-zinc-800/60"
        >
          <Github className="w-4 h-4" />
          <span className="tooltip-bubble">GitHub</span>
        </a>

        {/* YOUTUBE (INATIVO) */}
        <div
          aria-label={`YouTube (${comingSoonText})`}
          className="relative group p-1.5 rounded-md opacity-25 cursor-not-allowed text-slate-400 dark:text-zinc-600 select-none"
        >
          <Youtube className="w-4 h-4" />
          <span className="tooltip-bubble">YouTube ({comingSoonText})</span>
        </div>

        {/* X / TWITTER (INATIVO) */}
        <div
          aria-label={`X (${comingSoonText})`}
          className="relative group p-1.5 rounded-md opacity-25 cursor-not-allowed text-slate-400 dark:text-zinc-600 select-none"
        >
          <Twitter className="w-4 h-4" />
          <span className="tooltip-bubble">X ({comingSoonText})</span>
        </div>
      </div>
    </footer>
  );
};
