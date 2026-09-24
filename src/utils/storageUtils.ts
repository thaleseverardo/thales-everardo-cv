import { AppLanguage, AppTheme } from '../types';

export const REPO_STORAGE_KEY = 'thales-everardo-cv';

export interface UserPreferences {
  theme?: AppTheme;
  language?: AppLanguage;
  pwaNeverAsk?: boolean;
  lastUpdated?: number;
}

export interface SessionPreferences {
  pwaDismissed?: boolean;
}

/**
 * Lê o JSON único de preferências sob a chave do repositório 'thales-everardo-cv'.
 * Realiza migração automática caso existam chaves soltas legadas.
 */
export function getStoredPreferences(): UserPreferences {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(REPO_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }

    // Migração automática de chaves antigas perdidas caso existam
    const legacyTheme = localStorage.getItem('theme_preference') as AppTheme | null;
    const legacyLang = localStorage.getItem('language_preference') as AppLanguage | null;
    const legacyPwa = localStorage.getItem('pwa_prompt_never') === 'true';

    if (legacyTheme || legacyLang || legacyPwa) {
      const migrated: UserPreferences = {
        theme: legacyTheme || undefined,
        language: legacyLang || undefined,
        pwaNeverAsk: legacyPwa || undefined,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(REPO_STORAGE_KEY, JSON.stringify(migrated));

      // Limpeza de chaves soltas no navegador
      localStorage.removeItem('theme_preference');
      localStorage.removeItem('language_preference');
      localStorage.removeItem('pwa_prompt_never');
      localStorage.removeItem('pwa_prompt_dismissed');
      return migrated;
    }
  } catch (e) {}
  return {};
}

/**
 * Atualiza ou insere propriedades no JSON único de preferências no localStorage.
 */
export function updateStoredPreferences(updates: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredPreferences();
    const updated: UserPreferences = {
      ...current,
      ...updates,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(REPO_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
}

/**
 * Lê o JSON único de sessão da aba atual sob 'thales-everardo-cv'.
 */
export function getSessionPreferences(): SessionPreferences {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(REPO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Atualiza o JSON de sessão sob 'thales-everardo-cv'.
 */
export function updateSessionPreferences(updates: Partial<SessionPreferences>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getSessionPreferences();
    const updated = { ...current, ...updates };
    sessionStorage.setItem(REPO_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
}
