import React from 'react';
import { Sparkles, HelpCircle, X, CheckCircle2 } from 'lucide-react';
import { AppLanguage, AppTheme } from '../types';
import { PROFILE_DATA } from '../data/curriculumData';

interface ExecutiveOnboardingBannerProps {
  language: AppLanguage;
  theme: AppTheme;
  onDismiss: () => void;
  isDismissed: boolean;
}

export const ExecutiveOnboardingBanner: React.FC<ExecutiveOnboardingBannerProps> = ({
  language,
  theme,
  onDismiss,
  isDismissed,
}) => {
  const isPT = language === 'PT';

  if (isDismissed) {
    return (
      <div
        className={`px-4 py-1.5 border-b text-xs flex items-center justify-between transition-colors select-none ${
          theme === 'dark'
            ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
            : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
          <span>
            {isPT
              ? 'Resumo Executivo para Recrutadores (30 segundos):'
              : 'Executive Brief for Technical Recruiters (30-second scan):'}
          </span>
          <button
            onClick={onDismiss}
            className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold ml-1"
          >
            {isPT ? 'Expandir Resumo' : 'Expand Brief'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`border-b transition-colors relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-zinc-950/90 border-zinc-800/80 text-zinc-200'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-start justify-between gap-4">
          {/* Main Onboarding Narrative */}
          <div className="space-y-1.5 max-w-4xl">
            {/* Header with badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                  theme === 'dark'
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isPT ? 'RESUMO EXECUTIVO // 30 SEGUNDOS' : 'EXECUTIVE BRIEF // 30-SECOND SCAN'}
              </span>
              <span className="text-xs font-mono opacity-40">•</span>
              <span className="text-xs opacity-75 font-medium font-mono">
                {isPT
                  ? 'São Paulo, Brasil · Disponível para Remoto Global & Relocation'
                  : 'São Paulo, Brazil · Open to Global Remote & Relocation'}
              </span>
            </div>

            {/* Clear Value Proposition */}
            <div className="text-xs sm:text-sm font-sans leading-relaxed">
              <p>
                <strong className={theme === 'dark' ? 'text-cyan-400' : 'text-blue-700'}>
                  {isPT ? 'O que Thales resolve em produção:' : 'Business problem solved in production:'}
                </strong>{' '}
                {isPT ? PROFILE_DATA.executiveElevatorPitch.pt : PROFILE_DATA.executiveElevatorPitch.en}
              </p>
            </div>

            {/* Quick Tip */}
            <div className="flex items-center gap-2 text-xs pt-0.5 font-mono opacity-70">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
              <span>
                {isPT
                  ? 'Use as Lentes de Perfil na barra superior ou busque por tecnologias (ex: T-SQL, C#, EDA, SIP).'
                  : 'Use the Profile Lenses in the top header or search skills (e.g., T-SQL, C#, EDA, SIP).'}
              </span>
            </div>
          </div>

          {/* Dismiss button */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onDismiss}
              className={`p-1.5 rounded hover:opacity-80 transition-colors ${
                theme === 'dark' ? 'text-zinc-500 hover:bg-zinc-800' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title={isPT ? 'Recolher resumo' : 'Collapse brief'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
