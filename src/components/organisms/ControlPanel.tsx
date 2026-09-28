import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import {
  ArrowLeft,
  FileText,
  Sun,
  Moon,
  List,
  Layers,
  Search,
  X,
  Settings,
  ChevronDown,
  Check,
  LogOut,
  Globe,
} from 'lucide-react';
import { SystemState, AppLanguage, ViewLayout, ProfileLens } from '../../types';
import { PROFILE_LENSES_CONFIG } from '../../data/curriculumData';
import { useAuth } from '../../hooks/useAuth';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { t, LOCALIZED_LANGUAGE_NAMES } from '../../i18n/translations';
import { SpeedDialContact } from '../molecules/SpeedDialContact';
import { PWAInstallGuideModal } from '../molecules/PWAInstallGuideModal';

import thalesAvatar from '../../assets/images/thales_avatar_250x250.webp';

interface ControlPanelProps {
  systemState: SystemState;
  updateState: (updates: Partial<SystemState>) => void;
  onOpenContact: () => void;
}

const GuestAvatarToken: React.FC<{ sizeClass?: string }> = ({ sizeClass = 'w-11 h-11' }) => (
  <div
    className={`${sizeClass} rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden transition-all duration-300 ${
      'bg-linear-to-b from-zinc-100 to-zinc-200/90 border border-zinc-300/80 shadow-xs dark:from-zinc-800/90 dark:via-zinc-850 dark:to-zinc-950 dark:border-white/10 dark:shadow-inner'
    }`}
  >
    {/* Linha de reflexo especular no topo */}
    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    <svg className="w-5 h-5 text-zinc-500 dark:text-zinc-400 drop-shadow-xs" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 100-8 4 4 0 000 8z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const UserAvatar: React.FC<{
  photoURL?: string | null;
  name?: string | null;
  email?: string | null;
  sizeClass?: string;
  textSizeClass?: string;
}> = ({ photoURL, name, email, sizeClass = 'w-5 h-5', textSizeClass = 'text-[10px]' }) => {
  const [hasError, setHasError] = useState(false);
  const initial = (name || email || 'U')[0].toUpperCase();

  if (photoURL && !hasError) {
    return (
      <img
        src={photoURL}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`${sizeClass} rounded-full object-cover border border-slate-200 dark:border-zinc-700 shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-linear-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white font-sans font-bold ${textSizeClass} flex items-center justify-center shrink-0 border border-white/20 shadow-md shadow-blue-900/30 tracking-tight`}
    >
      {initial}
    </div>
  );
};

export const ControlPanel: React.FC<ControlPanelProps> = ({
  systemState,
  updateState,
  onOpenContact,
}) => {
  const [langAccordionOpen, setLangAccordionOpen] = useState(false);
  const {
    language,
    theme,
    viewLayout,
    profileLens,
    searchTerm,
  } = systemState;

  const { isAuthenticated, user, contact, signOut } = useAuth();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [radialOpen, setRadialOpen] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const settingsPopoverRef = useRef<HTMLDivElement>(null);

  const leftColRef = useRef<HTMLDivElement>(null);
  const [showFullName, setShowFullName] = useState(true);

  useEffect(() => {
    if (!leftColRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setShowFullName(entry.contentRect.width >= 320);
      }
    });
    observer.observe(leftColRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleSettingsClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      // Impede o fechamento acidental se o clique ocorrer dentro do menu ou no gatilho
      if (
        (settingsPopoverRef.current && settingsPopoverRef.current.contains(target)) ||
        (settingsMenuRef.current && settingsMenuRef.current.contains(target))
      ) {
        return;
      }
      setSettingsOpen(false);
    };
    const handleSettingsKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };

    if (settingsOpen) {
      document.addEventListener("mousedown", handleSettingsClickOutside);
      document.addEventListener("touchstart", handleSettingsClickOutside, { passive: true });
      document.addEventListener("keydown", handleSettingsKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleSettingsClickOutside);
      document.removeEventListener("touchstart", handleSettingsClickOutside);
      document.removeEventListener("keydown", handleSettingsKeyDown);
    };
  }, [settingsOpen]);

  const allLenses: ProfileLens[] = ['ALL', 'ARCHITECTURE', 'DATA', 'SOFTWARE_ENG', 'DATABASE'];

  const handleToggleLanguage = (newLang: AppLanguage) => {
    if (language === newLang) return;
    updateState({ language: newLang });
      };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    flushSync(() => {
      updateState({ theme: nextTheme });
    });
  };

    const handleToggleViewLayout = (newLayout: ViewLayout) => {
    if (viewLayout === newLayout) return;
    updateState({ viewLayout: newLayout });
      };

  const handleSelectLens = (lens: ProfileLens) => {
    updateState({ profileLens: lens });
      };

    const userInitial = (user?.displayName || user?.email || 'U')[0].toUpperCase();

  return (
    <>
      {/* 1. HEADER EXECUTIVO: IDENTIDADE + CURRÍCULO + MENU DE AJUSTES */}
      <header
        className={`border-b sticky top-0 z-40 select-none ${
          theme === 'dark'
            ? 'bg-[#111115]/95 border-zinc-800/80 text-zinc-100 backdrop-blur-md'
            : 'bg-white/95 border-zinc-200 text-zinc-900 shadow-xs backdrop-blur-md'
        }`}
      >
        {/* HEADER DESKTOP */}
        <div className="w-full px-5 sm:px-8 h-18 hidden md:flex items-center justify-between gap-4">
          <div
            ref={leftColRef}
            className="flex items-center justify-start gap-3.5 min-w-48 overflow-hidden"
          >
            <div className="relative w-13 h-13 rounded-full overflow-hidden border-2 border-slate-300 dark:border-zinc-700 shrink-0 shadow-xs">
              <img
                src={thalesAvatar}
                alt="Thales Everardo"
                width={52}
                height={52}
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <h1 className="font-sans font-bold text-[15px] sm:text-base tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                <span>Thales Everardo </span>
                {showFullName && <span className="text-zinc-500 dark:text-zinc-400 font-medium">Albuquerque Reis</span>}
              </h1>

              <div className="text-xs font-sans opacity-70 leading-normal flex items-center gap-1.5 pt-0.5">
                <span className="font-medium text-blue-600 dark:text-cyan-400">{t(language, 'nav.staffTitle')}</span>
                <span className="opacity-40">•</span>
                <span>{t(language, 'nav.architectTitle')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 shrink-0" ref={settingsMenuRef}>
            {/* INDICADOR TEXTUAL DE IDIOMA ATIVO (LABEL INFORMATIVO, NÃO-CLICÁVEL) */}
            <div className="flex items-center gap-1.5 px-1 font-mono text-xs font-semibold text-slate-500 dark:text-zinc-400 select-none">
              <Globe className="w-4 h-4 text-slate-400 dark:text-zinc-500 opacity-80 shrink-0" />
              <span className="tracking-wider">{language}</span>
            </div>

            {/* GATILHO DEDICADO DE CONFIGURAÇÕES (+30% MAIOR) */}
            <button
              type="button"
              onClick={() => {
                setSettingsOpen((prev) => !prev);
              }}
              className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                settingsOpen
                  ? 'bg-slate-200/70 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100'
                  : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
              aria-expanded={settingsOpen}
              aria-label={t(language, 'nav.preferences')}
            >
              <Settings className="w-5.25 h-5.25 opacity-80 shrink-0" />
            </button>
          </div>
        </div>

        {/* HEADER MOBILE */}
        <div className="w-full px-4 h-16 flex md:hidden items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="relative w-12.5 h-12.5 rounded-full overflow-hidden border-2 border-slate-300 dark:border-zinc-700 shrink-0 shadow-xs">
              <img
                src={thalesAvatar}
                alt="Thales Everardo"
                width={50}
                height={50}
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
            <div className="min-w-0">
              <span className="font-sans font-bold text-[15px] sm:text-base tracking-tight block truncate text-zinc-900 dark:text-zinc-100 leading-snug">
                Thales Everardo Albuquerque Reis
              </span>
              <div className="text-[11px] font-sans opacity-70 leading-tight flex items-center gap-1 truncate pt-0.5">
                <span className="font-medium text-blue-600 dark:text-cyan-400 truncate">Staff Engineer</span>
                <span className="opacity-40">•</span>
                <span className="truncate">{t(language, 'nav.architectTitle')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* INDICADOR TEXTUAL DE IDIOMA ATIVO (MOBILE) */}
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-500 dark:text-zinc-400 select-none">
              <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 opacity-80 shrink-0" />
              <span className="tracking-wider">{language}</span>
            </div>

            {/* GATILHO DEDICADO DE CONFIGURAÇÕES (+30% MAIOR) (MOBILE) */}
            <button
              type="button"
              onClick={() => {
                setSettingsOpen((prev) => !prev);
              }}
              className={`h-9 w-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors active:scale-95 ${
                settingsOpen
                  ? 'bg-slate-200/70 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100'
                  : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
              aria-label={t(language, 'nav.preferences')}
            >
              <Settings className="w-5.25 h-5.25 opacity-80 shrink-0" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MENU UNIFICADO (DROPDOWN NO DESKTOP / BOTTOM SHEET NATIVO NO MOBILE) */}
      {settingsOpen && (
        <>
          {/* BACKDROP UNIVERSAL (Z-59: COBRE CONTEÚDO E BOTTOM BAR NO MOBILE) */}
          <div
            className="fixed inset-0 z-59 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setSettingsOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={settingsPopoverRef}
            className={`fixed md:absolute z-60 font-sans ${
              /* Mobile: Bottom Sheet Nativa com Altura Orgânica e Puxador */
              'inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 p-0 overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl'
            } ${
              /* Desktop: Dropdown flutuante ancorado no topo */
              'md:inset-auto md:top-20 md:right-8 md:w-87.5 md:h-auto md:max-h-none md:rounded-3xl md:border md:p-3.5 md:shadow-2xl md:shadow-black/80 md:animate-in md:fade-in md:zoom-in-95'
            } ${
              theme === 'dark'
                ? 'bg-[#0e0e12] md:bg-zinc-900 md:border-zinc-800 text-zinc-100'
                : 'bg-white md:border-zinc-200 text-zinc-900'
            }`}
          >
            {/* PUXADOR TÁTIL DO BOTTOM SHEET (EXCLUSIVO MOBILE) */}
            <div className="md:hidden pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
            {/* CABEÇALHO NATIVO DA PÁGINA (EXCLUSIVO MOBILE) */}
            <div
              className={`md:hidden sticky top-0 z-20 h-14 px-4 border-b flex items-center justify-between backdrop-blur-md shrink-0 select-none ${
                theme === 'dark' ? 'bg-zinc-950/95 border-zinc-800 text-zinc-100' : 'bg-white/95 border-slate-200 text-slate-900 shadow-2xs'
              }`}
            >
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
                }`}
                aria-label="Voltar"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <h2 className="font-sans font-bold text-sm tracking-tight">
                {t(language, 'nav.preferences')}
              </h2>

              <div className="w-9" /> {/* Espaçador simétrico */}
            </div>

            {/* CONTEÚDO EM CARTÕES AGRUPADOS (SEM CONTAINERS DUPLOS) */}
            <div className="p-4 md:p-0 space-y-3 pb-[max(2.5rem,calc(1.5rem+env(safe-area-inset-bottom,0px)))] md:pb-0">
              {/* CARD 1: PERFIL / CONTA (CARTÃO ÚNICO MAIOR E ELEGANTE) */}
              {isAuthenticated ? (
                <div
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    theme === 'dark'
                      ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <UserAvatar
                      photoURL={user?.photoURL}
                      name={user?.displayName}
                      email={user?.email}
                      sizeClass="w-11 h-11"
                      textSizeClass="text-sm font-bold"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate leading-snug">
                        {user?.displayName || (user?.email ? user.email.split('@')[0] : t(language, 'nav.account'))}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                        {user?.email || ''}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      await signOut();
                                          }}
                    aria-label={t(language, 'nav.signOut')}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer focus:outline-none"
                    title={t(language, 'nav.signOut')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSettingsOpen(false);
                    onOpenContact();
                                      }}
                  className={`w-full flex items-center p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 text-zinc-100 hover:border-zinc-700 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5 text-left">
                    <GuestAvatarToken sizeClass="w-11 h-11" />
                    <div>
                      <div className="text-sm font-semibold leading-snug text-slate-900 dark:text-zinc-100">
                        {t(language, 'auth.signIn')}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        {t(language, 'nav.unlockContactsHint')}
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {/* CARD 2: PREFERÊNCIAS DO SISTEMA (IDIOMA, APARÊNCIA, ÁUDIO) */}
              <div
                className={`p-3.5 rounded-2xl border space-y-1 ${
                  theme === 'dark'
                    ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-900 shadow-xs'
                }`}
              >
                {/* SEÇÃO: IDIOMA EM FORMATO SANFONA */}
                <div className="border-t first:border-t-0 md:first:border-t border-slate-100 dark:border-zinc-800/80 py-1">
                  <button
                    type="button"
                    onClick={() => setLangAccordionOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between py-2 px-1 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer select-none"
                    aria-expanded={langAccordionOpen}
                  >
                    <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                      {t(language, 'nav.language')}
                    </span>

                    <span className="flex items-center gap-1.5 font-sans text-xs font-semibold text-slate-800 dark:text-zinc-200">
                      <span className="text-blue-600 dark:text-cyan-400 font-medium">
                        {LOCALIZED_LANGUAGE_NAMES[language][language]}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                          langAccordionOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </span>
                  </button>

                  {/* CONTEÚDO EXPANSÍVEL DA SANFONA */}
                  {langAccordionOpen && (
                    <div className="mt-1 mb-2 p-1.5 rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/80 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                      {(['PT', 'EN', 'ES', 'FR'] as const).map((langCode) => {
                        const isSelected = language === langCode;
                        const label = LOCALIZED_LANGUAGE_NAMES[language][langCode];
                        return (
                          <button
                            key={langCode}
                            onClick={() => {
                              handleToggleLanguage(langCode);
                              setLangAccordionOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200/60 dark:hover:bg-zinc-800/70'
                            }`}
                          >
                            <span className="tracking-tight">{label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SEÇÃO: APARÊNCIA SLIM SWITCH (PADRÃO APPLE HIG / LINEAR) */}
                <div className="flex items-center justify-between py-2.5 px-1 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {t(language, 'nav.theme')}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={theme === 'dark'}
                    onClick={handleToggleTheme}
                    className={`relative inline-flex h-5.5 w-10.5 min-h-5.5 max-h-5.5 min-w-10.5 max-w-10.5 shrink-0 cursor-pointer items-center rounded-full p-0.5 border transition-colors duration-200 focus:outline-hidden touch-target-expand ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border-zinc-700/90 shadow-inner'
                        : 'bg-zinc-200 border-zinc-300/90 shadow-inner'
                    }`}
                    aria-label={theme === 'dark' ? t(language, 'nav.themeDark') : t(language, 'nav.themeLight')}
                  >
                    <span
                      className={`pointer-events-none flex items-center justify-center h-4.5 w-4.5 rounded-full shadow-xs transition-transform duration-200 ease-in-out ${
                        theme === 'dark'
                          ? 'translate-x-5 bg-zinc-950 text-blue-400 border border-zinc-700/80'
                          : 'translate-x-0 bg-white text-amber-500 border border-zinc-200'
                      }`}
                    >
                      {theme === 'dark' ? (
                        <Moon className="w-2.5 h-2.5 fill-current" />
                      ) : (
                        <Sun className="w-2.5 h-2.5 fill-current" />
                      )}
                    </span>
                  </button>
                </div>

                
              </div>

              {/* CARD 3: APLICATIVO STANDALONE / PWA (AJUSTE FINO COMERCIAL AAA) */}
              <button
                type="button"
                disabled={isInstalled}
                onClick={async () => {
                  if (isInstalled) return;
                  if (isInstallable && !isIOS) {
                    const ok = await install();
                    if (ok) return;
                  }
                  setSettingsOpen(false);
                  setShowInstallGuide(true);
                }}
                className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer group ${
                  isInstalled
                    ? theme === 'dark'
                      ? 'opacity-90 cursor-default bg-zinc-900/90 border-zinc-800 text-zinc-100 shadow-sm'
                      : 'opacity-95 cursor-default bg-white border-slate-200 text-slate-900 shadow-xs'
                    : theme === 'dark'
                    ? 'bg-zinc-900/90 hover:bg-zinc-800/90 border-zinc-800 text-zinc-100 hover:border-zinc-700 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5 text-left min-w-0 pr-2">
                  {/* ÍCONE SQUIRCLE DO APP (AZUL NATIVO #2072e7) */}
                  <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0 shadow-md shadow-blue-600/15 ring-1 ring-black/5 dark:ring-white/15 bg-[#2072e7] flex items-center justify-center">
                    <img
                      src={`${import.meta.env.BASE_URL}icon.svg`}
                      alt="App Icon"
                      width={44}
                      height={44}
                      className="w-full h-full object-cover scale-110"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate leading-snug">
                      {isInstalled ? t(language, 'nav.appInstalled') : t(language, 'pwa.installActionTitle')}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                      {isInstalled ? t(language, 'pwa.cardSubtitleInstalled') : t(language, 'pwa.cardSubtitle')}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isInstalled ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{t(language, 'pwa.statusBadgeInstalled')}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors group-hover:bg-blue-500 active:scale-95">
                      {t(language, 'pwa.statusBadge')}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </>
      )}



      {/* 4. SPEED-DIAL RADIAL EM ARCO */}
      <SpeedDialContact
        isOpen={radialOpen}
        onToggle={setRadialOpen}
        isAuthenticated={isAuthenticated}
        contact={contact}
        language={language}
        theme={theme}
        onOpenContactModal={onOpenContact}
      />

      {/* MODAL IN-APP DE INSTALAÇÃO DO PWA */}
      <PWAInstallGuideModal
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
        isIOS={isIOS}
        language={language}
        theme={theme}
      />
    </>
  );
};
