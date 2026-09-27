import React from 'react';
import { Smartphone, DownloadCloud, X, Share, PlusSquare } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border ${
          theme === 'dark'
            ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b dark:border-zinc-800 border-slate-200">
          <h3 className="text-sm font-bold flex items-center gap-2">
            {isIOS ? <Smartphone className="w-4 h-4 text-emerald-400" /> : <DownloadCloud className="w-4 h-4 text-blue-600 dark:text-cyan-400" />}
            <span>{isIOS ? t(language, 'pwa.iosTitle') : t(language, 'pwa.guideTitle')}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800/40 text-zinc-400 cursor-pointer"
            aria-label={t(language, 'auth.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          {isIOS ? (
            <>
              <div className="flex items-start gap-3 p-3 rounded-xl dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                <Share className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.iosStep1')}</div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                <PlusSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.iosStep2')}</div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 p-3 rounded-xl dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                <DownloadCloud className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.guideDesktopStep')}</div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                <Smartphone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.guideMobileStep')}</div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
        >
          {t(language, 'pwa.iosGotIt')}
        </button>
      </div>
    </div>
  );
};
