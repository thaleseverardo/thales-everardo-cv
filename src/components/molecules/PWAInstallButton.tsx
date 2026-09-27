import React, { useState } from 'react';
import { DownloadCloud, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { AppLanguage, AppTheme } from '../../types';
import { t } from '../../i18n/translations';
import { PWAInstallGuideModal } from './PWAInstallGuideModal';

interface PWAInstallButtonProps {
  language: AppLanguage;
  theme: AppTheme;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language, theme }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

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

  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all ${
          theme === 'dark'
            ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-400'
            : 'bg-white hover:bg-slate-100 border border-slate-300 text-emerald-700 shadow-sm'
        }`}
        title={isIOS ? t(language, 'pwa.iosTitle') : t(language, 'pwa.installActionTitle')}
      >
        {isIOS ? <Smartphone className="w-3.5 h-3.5" /> : <DownloadCloud className="w-3.5 h-3.5 text-emerald-400" />}
        <span className="hidden sm:inline">{isIOS ? t(language, 'pwa.installIos') : 'PWA READY'}</span>
      </button>

      <PWAInstallGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        isIOS={isIOS}
        language={language}
        theme={theme}
      />
    </>
  );
};