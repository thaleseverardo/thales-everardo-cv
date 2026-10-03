import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { AppLanguage, AppTheme } from '../../types';
import { t } from '../../i18n/translations';
import { useAuth } from '../../hooks/useAuth';
import { revokeAccessAndPurgeUserData } from '../../services/firebaseAuth';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  theme: AppTheme;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
}) => {
  const { user } = useAuth();
  const [confirmingRevoke, setConfirmingRevoke] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  if (!isOpen) return null;

  const handleRevoke = async () => {
    setIsPurging(true);
    try {
      const ok = await revokeAccessAndPurgeUserData(user);
      if (ok) {
        alert(t(language, 'privacy.purgeSuccessAlert'));
        onClose();
      } else {
        alert(t(language, 'privacy.purgeErrorAlert'));
      }
    } catch {
      alert(t(language, 'privacy.purgeCommErrorAlert'));
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/80 md:backdrop-blur-xs font-sans animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full h-dvh md:h-auto md:max-h-[90vh] md:max-w-lg rounded-none md:rounded-2xl border-0 md:border flex flex-col overflow-hidden transition-all shadow-2xl ${
          theme === 'dark'
            ? 'bg-zinc-950 md:border-zinc-800 text-zinc-100 shadow-black/80'
            : 'bg-white md:border-zinc-200 text-zinc-900 shadow-zinc-300/40'
        }`}
      >
        {/* CABEÇALHO (COM SUPORTE A SAFE AREA NO MOBILE) */}
        <div
          className={`px-5 md:px-6 pt-[max(1.125rem,env(safe-area-inset-top,0px))] pb-4 md:py-4 border-b flex items-start justify-between gap-3 shrink-0 ${
            theme === 'dark' ? 'border-zinc-800/80 bg-zinc-900/40' : 'border-zinc-100 bg-zinc-50/50'
          }`}
        >
          <div className="min-w-0 pr-2">
            <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug">
              {t(language, 'privacy.modalTitle')}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5 leading-normal">
              {t(language, 'privacy.modalSubtitle')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 mt-0.5"
            aria-label={t(language, 'auth.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTEÚDO SCROLLÁVEL */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans leading-relaxed text-zinc-600 dark:text-zinc-300 flex-1">
          {/* DECLARAÇÃO DE RESPONSABILIDADE FORMAL EM CARD EDITORIAL */}
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed font-sans ${
              theme === 'dark'
                ? 'bg-zinc-900/50 border-zinc-800/70 text-zinc-300'
                : 'bg-zinc-50 border-zinc-200/80 text-zinc-600'
            }`}
          >
            {t(language, 'privacy.editorialCard')}
          </div>

          {/* CLÁUSULAS JURÍDICAS */}
          <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
            <div>
              <h3 className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">
                {t(language, 'privacy.section1Title')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t(language, 'privacy.section1Desc')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">
                {t(language, 'privacy.section2Title')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t(language, 'privacy.section2Desc')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">
                {t(language, 'privacy.section3Title')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t(language, 'privacy.section3Desc')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">
                {t(language, 'privacy.section4Title')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t(language, 'privacy.section4Desc')}
              </p>
            </div>
          </div>

          {/* BOTÃO E ALERTA DE EXPURGO COM AVISO DE AÇÃO IRREVERSÍVEL */}
          {user && (
            <div className="pt-2">
              {confirmingRevoke ? (
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-rose-600 dark:text-rose-400 leading-snug">
                        {t(language, 'privacy.confirmTitle')}
                      </div>
                      <p className="text-[11px] text-rose-700/90 dark:text-rose-300/90 leading-relaxed font-sans">
                        {t(language, 'privacy.confirmDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isPurging}
                      onClick={handleRevoke}
                      className="flex-1 h-8.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer active:scale-95 disabled:opacity-50 shadow-xs"
                    >
                      {isPurging ? t(language, 'privacy.purging') : t(language, 'privacy.confirmBtn')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingRevoke(false)}
                      className="h-8.5 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium text-xs hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer active:scale-95"
                    >
                      {t(language, 'privacy.cancelBtn')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingRevoke(true)}
                  className="w-full h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-rose-500/10 hover:border-rose-500/30 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t(language, 'auth.revokeData')}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* RODAPÉ (COM SUPORTE A SAFE AREA NO MOBILE) */}
        <div
          className={`px-5 sm:px-6 pt-3.5 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:py-3.5 border-t flex items-center justify-between gap-3 shrink-0 ${
            theme === 'dark' ? 'border-zinc-800/80 bg-zinc-900/30' : 'border-zinc-100 bg-zinc-50/50'
          }`}
        >
          <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-sans truncate">
            {t(language, 'privacy.footerNotice')}
          </div>

          <button
            onClick={onClose}
            className="h-8.5 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-semibold font-sans transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
          >
            {t(language, 'privacy.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
