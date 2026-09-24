import { useCallback } from 'react';
import { playSound, SoundType } from '../utils/audio';

/**
 * Centralized custom hook for interface sound effects.
 * Eliminates repetitive playSound(type, soundEnabled) calls and ensures
 * audio feedback stays synchronized with global user preferences.
 */
export function useSoundEffects(soundEnabled: boolean = true) {
  const play = useCallback(
    (type: SoundType) => {
      playSound(type, soundEnabled);
    },
    [soundEnabled]
  );

  return { play };
}
