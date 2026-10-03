import React from 'react';
import { Smartphone, Monitor, X, Share, PlusSquare } from 'lucide-react';
import { AppLanguage, AppTheme } from '../../types';
import { t } from '../../i18n/translations';

interface PWAInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  language: AppLanguage;
  theme: AppTheme;
}

export const PWAInstallGuideModal: React.FC<PWAInstallGuideModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  language,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-70 flex items-center justify-center p-0 md:p-4 bg-black/80 font-sans animate-in fade-in duration-150"
    >
      <div
        className={`w-full h-dvh md:h-auto md:max-h-[90vh] md:max-w-sm rounded-none md:rounded-2xl border-0 md:border flex flex-col overflow-hidden shadow-2xl ${
          theme === 'dark'
            ? 'bg-zinc-950 md:border-zinc-800 text-zinc-100 shadow-black/90'
            : 'bg-white md:border-zinc-200 text-zinc-900 shadow-zinc-300/40'
        }`}
      >
        {/* CABEÇALHO COM SAFE-AREA */}
        <div className="px-4 md:px-5 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-3 md:py-3.5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {isIOS ? t(language, 'pwa.iosTitle') : t(language, 'pwa.guideTitle')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label={t(language, 'auth.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CORPO DE INSTRUÇÕES */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3 text-xs">
          {isIOS ? (
            <>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/60 dark:border-zinc-800/80">
                <Share className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.iosStep1')}</div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/60 dark:border-zinc-800/80">
                <PlusSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.iosStep2')}</div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/60 dark:border-zinc-800/80">
                <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{t(language, 'pwa.guideDesktopStep')}</div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/60 dark:border-zinc-800/80">
                <Smartphone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.guideMobileStep')}</div>
              </div>
            </>
          )}
        </div>

        {/* RODAPÉ COM SAFE-AREA */}
        <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] border-t border-zinc-100 dark:border-zinc-800/80 shrink-0">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            {t(language, 'pwa.iosGotIt')}
          </button>
        </div>
      </div>
    </div>
  );
};
