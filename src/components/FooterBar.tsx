import React from 'react';
import {
  Terminal,
  Cpu,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SystemState } from '../types';
import { useSoundEffects } from '../hooks/useSoundEffects';

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
  const isPT = language === 'PT';

  const toggleSound = () => {
    updateState({ soundEnabled: !soundEnabled });
    play('click');
  };

  return (
    <footer
      className={`border-t sticky bottom-0 z-30 h-9 px-4 sm:px-6 select-none transition-colors backdrop-blur-md flex items-center justify-between text-[11px] font-mono ${
        theme === 'dark'
          ? 'bg-[#09090b]/95 border-zinc-800/80 text-zinc-400'
          : 'bg-white/95 border-slate-200 text-slate-600 shadow-2xs'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-zinc-200 dark:text-zinc-300">
          THALES REIS // SYSTEM ARCHITECTURE PORTFOLIO
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleSound}
          className="opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1"
          title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Efeitos Sonoros'}
        >
          {soundEnabled ? <Volume2 className="w-3 h-3 text-emerald-500" /> : <VolumeX className="w-3 h-3" />}
        </button>

        <button
          onClick={() => {
            onOpenCLI();
            play('click');
          }}
          className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
          title="Terminal CLI (Ctrl+K)"
        >
          <Terminal className="w-3 h-3" />
          <span>CLI</span>
          <kbd className="opacity-50 text-[10px] hidden sm:inline">[Ctrl+K]</kbd>
        </button>
      </div>
    </footer>
  );
};