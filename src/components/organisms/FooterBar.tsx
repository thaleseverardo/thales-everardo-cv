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
      className={`border-t relative z-20 py-3.5 sm:py-2.5 px-4 sm:px-8 select-none backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-xs w-full ${
        theme === 'dark'
          ? 'bg-[#111115]/95 border-zinc-800/80 text-zinc-400 backdrop-blur-md'
          : 'bg-white/95 border-zinc-200 text-zinc-600 shadow-xs backdrop-blur-md'
      }`}
    >
      {/* IDENTIDADE INSTITUCIONAL COMPLETA (SEM CORTES NO MOBILE) */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 font-sans text-center sm:text-left">
        <span className="font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight text-xs">
          © {currentYear} Thales Everardo
        </span>
        <span className="opacity-30">•</span>
        <span className="text-[11px] opacity-60">
          {t(language, 'footer.subtitle')}
        </span>
        <span className="opacity-30">•</span>
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:underline transition-colors cursor-pointer font-medium"
        >
          {t(language, 'footer.privacyLink')}
        </button>
      </div>

      {/* BANDEJA DE REDES SOCIAIS (CENTRALIZADA NO MOBILE, LIVRE DA ZONA DO FAB) */}
      <div className="flex items-center justify-center gap-3 shrink-0 sm:pr-24">
        {/* LINKEDIN (ATIVO) */}
        <a
          href="https://br.linkedin.com/in/thaleseverardo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="relative group p-1.5 rounded-md transition-colors cursor-pointer text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60"
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
          className="relative group p-1.5 rounded-md transition-colors cursor-pointer text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60"
        >
          <Github className="w-4 h-4" />
          <span className="tooltip-bubble">GitHub</span>
        </a>

        {/* YOUTUBE (INATIVO) */}
        <div
          aria-label={`YouTube (${comingSoonText})`}
          className="relative group p-1.5 rounded-md opacity-25 cursor-not-allowed text-zinc-400 dark:text-zinc-600 select-none"
        >
          <Youtube className="w-4 h-4" />
          <span className="tooltip-bubble">YouTube ({comingSoonText})</span>
        </div>

        {/* X / TWITTER (INATIVO) */}
        <div
          aria-label={`X (${comingSoonText})`}
          className="relative group p-1.5 rounded-md opacity-25 cursor-not-allowed text-zinc-400 dark:text-zinc-600 select-none"
        >
          <Twitter className="w-4 h-4" />
          <span className="tooltip-bubble">X ({comingSoonText})</span>
        </div>
      </div>
    </footer>
  );
};
