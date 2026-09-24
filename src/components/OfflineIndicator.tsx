import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

import { AppLanguage, AppTheme } from '../types';

interface OfflineIndicatorProps {
  language: AppLanguage;
  theme?: AppTheme;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language, theme }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-14 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-500 text-zinc-950 px-3.5 py-2 text-xs font-mono font-bold shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>
        {language === 'PT'
          ? 'Modo Offline Ativo — Cache local PWA em execução.'
          : 'Offline Mode Active — Local PWA cache running.'}
      </span>
    </div>
  );
};
