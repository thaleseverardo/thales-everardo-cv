import React, { useState } from 'react';
import { DownloadCloud, Smartphone, X, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { AppLanguage, AppTheme } from '../../types';
import { t } from '../../i18n/translations';

interface PWAInstallButtonProps {
  language: AppLanguage;
  theme: AppTheme;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language, theme }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all shadow-sm ${
          theme === 'dark'
            ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-400 hover:text-emerald-300'
            : 'bg-white hover:bg-slate-100 border border-slate-300 text-emerald-700 hover:text-emerald-800 shadow-sm'
        }`}
        title={t(language, 'pwa.installButton')}
      >
        <DownloadCloud className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t(language, 'pwa.installButton')}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all ${
            theme === 'dark'
              ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-400'
              : 'bg-white hover:bg-slate-100 border border-slate-300 text-emerald-700 shadow-sm'
          }`}
          title={t(language, 'pwa.iosTitle')}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t(language, 'pwa.installIos')}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div
              className={`w-full max-w-sm rounded-xl p-5 shadow-2xl border ${
                theme === 'dark'
                  ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="font-mono text-sm font-bold flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>{t(language, 'pwa.iosTitle')}</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 font-sans text-xs">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <Share className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>{t(language, 'pwa.iosStep1')}</div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>{t(language, 'pwa.iosStep2')}</div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-md bg-emerald-600 py-2 text-xs font-mono font-bold text-white hover:bg-emerald-500 transition-colors"
              >
                {t(language, 'pwa.iosGotIt')}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => {
        setShowIOSGuide(true);
      }}
      className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all ${
        theme === 'dark'
          ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-emerald-400'
          : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-emerald-700 shadow-sm'
      }`}
      title={t(language, 'pwa.offlineMode')}
    >
      <DownloadCloud className="w-3.5 h-3.5 text-emerald-400" />
      <span>PWA READY</span>
    </button>
  );
};
