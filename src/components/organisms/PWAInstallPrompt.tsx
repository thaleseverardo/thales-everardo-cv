import React, { useState, useEffect } from 'react';
import { DownloadCloud, Smartphone, X, Share, PlusSquare, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { AppLanguage, AppTheme } from '../../types';
import { t } from '../../i18n/translations';
import {
  getStoredPreferences,
  updateStoredPreferences,
  getSessionPreferences,
  updateSessionPreferences,
} from '../../utils/storageUtils';

interface PWAInstallPromptProps {
  language: AppLanguage;
  theme: AppTheme;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ language, theme }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [visible, setVisible] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (isInstalled) return;

    const prefs = getStoredPreferences();
    if (prefs.pwaNeverAsk) return;

    const sessionPrefs = getSessionPreferences();
    if (sessionPrefs.pwaDismissed) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  const handleNotNow = () => {
    setVisible(false);
    updateSessionPreferences({ pwaDismissed: true });
  };

  const handleNeverAskAgain = () => {
    setVisible(false);
    updateStoredPreferences({ pwaNeverAsk: true });
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setVisible(false);
      }
    } else {
      setShowIOSGuide(true);
    }
  };

  if (isInstalled || !visible) return null;

  return (
    <>
      <aside
        aria-live="polite"
        className={`fixed bottom-12 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 rounded-xl border p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 ${
          theme === 'dark'
            ? 'bg-zinc-950/95 border-zinc-800 text-zinc-100'
            : 'bg-white/95 border-slate-300 text-slate-900 shadow-slate-300/50'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg shrink-0 ${
                theme === 'dark'
                  ? 'bg-blue-950/80 border border-blue-800/60 text-cyan-400'
                  : 'bg-blue-50 border border-blue-200 text-blue-700'
              }`}
            >
              {isIOS ? <Smartphone className="w-5 h-5" /> : <DownloadCloud className="w-5 h-5" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-blue-600 dark:text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t(language, 'pwa.installBadge')}</span>
              </div>
              <h4 className="font-sans font-bold text-xs sm:text-sm tracking-tight">
                {t(language, 'pwa.installTitle')}
              </h4>
              <p className="font-sans text-xs opacity-75 leading-relaxed">
                {t(language, 'pwa.installDesc')}
              </p>
            </div>
          </div>

          <button
            onClick={handleNotNow}
            className="p-1 rounded-md opacity-50 hover:opacity-100 transition-opacity shrink-0"
            aria-label={t(language, 'pwa.notNow')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 pt-3 border-t dark:border-zinc-800 border-slate-200">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleNeverAskAgain}
              className="text-[10px] font-mono opacity-50 hover:opacity-100 hover:underline transition-opacity"
            >
              {t(language, 'pwa.neverAsk')}
            </button>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleNotNow}
                className="px-2.5 py-1.5 rounded-md font-mono text-xs opacity-70 hover:opacity-100 transition-opacity"
              >
                {t(language, 'pwa.notNow')}
              </button>

              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xs transition-colors shrink-0"
              >
                {isIOS ? <Smartphone className="w-3.5 h-3.5" /> : <DownloadCloud className="w-3.5 h-3.5" />}
                <span>{t(language, 'pwa.installButton')}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-sm rounded-xl p-5 shadow-2xl border ${
              theme === 'dark'
                ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b dark:border-zinc-800 border-slate-200">
              <h3 className="font-mono text-xs font-bold flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>{t(language, 'pwa.iosTitle')}</span>
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded hover:bg-zinc-800/40 text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 font-sans text-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                <Share className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.iosStep1')}</div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                <PlusSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.iosStep2')}</div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIOSGuide(false);
                handleNotNow();
              }}
              className="mt-5 w-full rounded-md bg-blue-600 py-2 text-xs font-mono font-bold text-white hover:bg-blue-500 transition-colors"
            >
              {t(language, 'pwa.iosGotIt')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
