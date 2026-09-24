import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { AppLanguage, AppTheme } from '../../types';
import { t } from '../../i18n/translations';

interface OfflineIndicatorProps {
  language: AppLanguage;
  theme?: AppTheme;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-14 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-500 text-zinc-950 px-3.5 py-2 text-xs font-mono font-bold shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>{t(language, 'pwa.offlineMode')}</span>
    </div>
  );
};
