import React from 'react';
import {
  Terminal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SystemState } from '../../types';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { t } from '../../i18n/translations';

interface FooterBarProps {
  systemState: SystemState;
  updateState: (updates: Partial<SystemState>) => void;
  onOpenCLI: () => void;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  systemState,
  updateState,
  onOpenCLI,
}) => {
  const { soundEnabled, language, theme } = systemState;
  const { play } = useSoundEffects(soundEnabled);

  const toggleSound = () => {
    updateState({ soundEnabled: !soundEnabled });
    play('click');
  };

  return (
    <footer
      className={`border-t sticky bottom-0 z-30 h-auto min-h-9 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom,0px))] px-4 sm:px-6 select-none transition-colors backdrop-blur-md flex items-center justify-between text-[11px] font-mono gap-2 ${
        theme === 'dark'
          ? 'bg-[#09090b]/95 border-zinc-800/80 text-zinc-400'
          : 'bg-white/95 border-slate-200 text-slate-600 shadow-2xs'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-zinc-200 dark:text-zinc-300 truncate">
          Thales Everardo // SYSTEM ARCHITECTURE PORTFOLIO
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={toggleSound}
          className="opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1"
          title={soundEnabled ? t(language, 'footer.muteAudio') : t(language, 'footer.unmuteAudio')}
        >
          {soundEnabled ? <Volume2 className="w-3 h-3 text-emerald-500" /> : <VolumeX className="w-3 h-3" />}
        </button>

        <button
          onClick={() => {
            onOpenCLI();
            play('click');
          }}
          className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
          title={t(language, 'footer.terminal')}
        >
          <Terminal className="w-3 h-3" />
          <span>CLI</span>
          <kbd className="opacity-50 text-[10px] hidden sm:inline">[Ctrl+K]</kbd>
        </button>
      </div>
    </footer>
  );
};