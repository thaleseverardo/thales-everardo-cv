import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  Mail,
  MessageSquare,
  MessageCircle,
  Linkedin,
  Phone,
  Handshake,
  Sun,
  Moon,
  List,
  Layers,
  Search,
  X,
  AlertTriangle,
  RotateCcw,
  Settings,
  Globe,
  ChevronDown,
  Volume2,
  VolumeX,
  DownloadCloud,
  CheckCircle2,
  LogIn,
  User,
  LogOut,
  Smartphone,
  MonitorSmartphone,
  ChevronRight,
  Share,
  PlusSquare,
} from 'lucide-react';
import { SystemState, AppLanguage, ViewLayout, ProfileLens } from '../../types';
import { PROFILE_LENSES_CONFIG } from '../../data/curriculumData';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { useAuth } from '../../hooks/useAuth';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { t } from '../../i18n/translations';

import thalesAvatar from '../../assets/images/thales_avatar_250x250.webp?inline';

interface ControlPanelProps {
  systemState: SystemState;
  updateState: (updates: Partial<SystemState>) => void;
  onOpenContact: () => void;
  onOpenResume: () => void;
}

const LOCALIZED_LANGUAGE_NAMES: Record<AppLanguage, Record<AppLanguage, string>> = {
  PT: { PT: 'Português', EN: 'Inglês', ES: 'Espanhol', FR: 'Francês' },
  EN: { PT: 'Portuguese', EN: 'English', ES: 'Spanish', FR: 'French' },
  ES: { PT: 'Portugués', EN: 'Inglés', ES: 'Español', FR: 'Francés' },
  FR: { PT: 'Portugais', EN: 'Anglais', ES: 'Espagnol', FR: 'Français' },
};

const GuestAvatarToken: React.FC<{ sizeClass?: string }> = ({ sizeClass = 'w-11 h-11' }) => (
  <div
    className={`${sizeClass} rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden transition-all duration-300 ${
      'bg-gradient-to-b from-slate-100 to-slate-200/90 border border-slate-300/80 shadow-xs dark:from-zinc-800/90 dark:via-zinc-850 dark:to-zinc-950 dark:border-white/10 dark:shadow-inner'
    }`}
  >
    {/* Linha de reflexo especular no topo */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    <svg className="w-5 h-5 text-slate-500 dark:text-zinc-400 drop-shadow-xs" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
      className={`${sizeClass} rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white font-sans font-bold ${textSizeClass} flex items-center justify-center shrink-0 border border-white/20 shadow-md shadow-blue-900/30 tracking-tight`}
    >
      {initial}
    </div>
  );
};

export const ControlPanel: React.FC<ControlPanelProps> = ({
  systemState,
  updateState,
  onOpenContact,
  onOpenResume,
}) => {
  const [langAccordionOpen, setLangAccordionOpen] = useState(false);
  const {
    failureInjected,
    soundEnabled,
    language,
    theme,
    viewLayout,
    profileLens,
    searchTerm,
  } = systemState;

  const { play } = useSoundEffects(soundEnabled);
  const { isAuthenticated, user, contact, signOut } = useAuth();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [radialOpen, setRadialOpen] = useState(false);
  const radialMenuRef = useRef<HTMLDivElement>(null);
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
    const handleRadialClickOutside = (event: MouseEvent | TouchEvent) => {
      if (radialMenuRef.current && !radialMenuRef.current.contains(event.target as Node)) {
        setRadialOpen(false);
      }
    };
    const handleRadialKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRadialOpen(false);
    };

    if (radialOpen) {
      document.addEventListener("mousedown", handleRadialClickOutside);
      document.addEventListener("touchstart", handleRadialClickOutside, { passive: true });
      document.addEventListener("keydown", handleRadialKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleRadialClickOutside);
      document.removeEventListener("touchstart", handleRadialClickOutside);
      document.removeEventListener("keydown", handleRadialKeyDown);
    };
  }, [radialOpen]);

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
    play('click');
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    updateState({ theme: nextTheme });
    play('click');
  };

  const handleToggleSound = () => {
    updateState({ soundEnabled: !soundEnabled });
    play('click');
  };

  const handleToggleViewLayout = (newLayout: ViewLayout) => {
    if (viewLayout === newLayout) return;
    updateState({ viewLayout: newLayout });
    play('toggle');
  };

  const handleSelectLens = (lens: ProfileLens) => {
    updateState({ profileLens: lens });
    play('click');
  };

  const handlePanicToggle = () => {
    if (failureInjected) {
      updateState({
        failureInjected: false,
        systemHealth: 'HEALTHY',
        failureReason: undefined,
        recoveredCount: systemState.recoveredCount + 1,
      });
      play('heal');
    } else {
      updateState({
        failureInjected: true,
        systemHealth: 'CRITICAL',
        failureReason: 'CIRCUIT_BREAKER_TRIPPED // INGESTION BUFFER SATURATION',
      });
      play('alert');
    }
  };

  const userInitial = (user?.displayName || user?.email || 'U')[0].toUpperCase();

  return (
    <>
      {/* 1. HEADER EXECUTIVO: IDENTIDADE + CURRÍCULO + MENU DE AJUSTES */}
      <header
        className={`border-b sticky top-0 z-40 transition-colors select-none ${
          theme === 'dark'
            ? 'bg-[#09090b] border-zinc-800 text-zinc-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
        }`}
      >
        {failureInjected && (
          <div className="bg-rose-950 border-b border-rose-600/40 text-rose-200 text-xs py-1.5 px-4 sm:px-6 flex items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-2 truncate">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
              <span className="font-bold text-rose-300">
                {t(language, 'incident.badge')}
              </span>
              <span className="truncate">
                {t(language, 'incident.desc')}
              </span>
            </div>
            <button
              onClick={handlePanicToggle}
              className="flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded-md font-bold text-[11px] transition-colors shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 animate-spin" />
              {t(language, 'incident.autoHeal')}
            </button>
          </div>
        )}

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
            <button
              type="button"
              onClick={() => {
                onOpenResume();
                play('click');
              }}
              className="header-btn-secondary"
              aria-label={t(language, 'nav.cvButton')}
            >
              <FileText className="w-3.5 h-3.5 opacity-70 shrink-0" />
              <span className="opt-mono">{t(language, 'nav.cvButton')}</span>
            </button>

            {/* GATILHO DO MENU UNIFICADO (DESKTOP // SEMPRE ÍCONE SETTINGS) */}
            <button
              type="button"
              onClick={() => {
                setSettingsOpen((prev) => !prev);
                play('click');
              }}
              className={`h-9 px-3 rounded-lg border text-xs font-sans font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                settingsOpen
                  ? 'bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
              }`}
              aria-expanded={settingsOpen}
              aria-label={t(language, 'nav.preferences')}
            >
              <Settings className="w-4 h-4 opacity-75" />
              <span className="font-mono text-[11px] font-bold">{language}</span>
            </button>
          </div>
        </div>

        {/* HEADER MOBILE */}
        <div className="w-full px-4 h-16 flex md:hidden items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-slate-300 dark:border-zinc-700 shrink-0 shadow-xs">
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
              <span className="font-sans font-bold text-xs sm:text-sm tracking-tight block truncate text-zinc-900 dark:text-zinc-100">
                Thales Everardo
              </span>
              <div className="text-[10px] font-sans opacity-65 leading-tight flex items-center gap-1 truncate">
                <span className="font-medium text-blue-600 dark:text-cyan-400 truncate">Staff Engineer</span>
                <span className="opacity-40">•</span>
                <span className="truncate">{t(language, 'nav.architectTitle')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onOpenResume();
                play('click');
              }}
              className={`h-9 px-3 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
              }`}
              aria-label={t(language, 'nav.cvButton')}
            >
              <FileText className="w-3.5 h-3.5 opacity-70 shrink-0" />
              <span className="opt-mono">{t(language, 'nav.cvButton')}</span>
            </button>

            {/* GATILHO DO MENU UNIFICADO (MOBILE // SEMPRE ÍCONE SETTINGS) */}
            <button
              type="button"
              onClick={() => {
                setSettingsOpen((prev) => !prev);
                play('click');
              }}
              className={`p-2 rounded-lg border h-9 w-9 flex items-center justify-center cursor-pointer shadow-2xs transition-all active:scale-95 ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
              aria-label={t(language, 'nav.preferences')}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MENU UNIFICADO (DROPDOWN NO DESKTOP / BOTTOM SHEET NATIVO NO MOBILE) */}
      {settingsOpen && (
        <>
          {/* BACKDROP SUTIL (APENAS DESKTOP) */}
          <div
            className="hidden md:block fixed inset-0 z-45 bg-black/40 backdrop-blur-2xs transition-opacity"
            onClick={() => setSettingsOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={settingsPopoverRef}
            className={`fixed md:absolute z-50 transition-all font-sans ${
              /* Mobile: Página Completa Nativa com Safe Area */
              'inset-0 w-full h-[100dvh] rounded-none border-none p-0 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200'
            } ${
              /* Desktop: Dropdown flutuante ancorado no topo */
              'md:inset-auto md:top-20 md:right-8 md:w-80 md:h-auto md:rounded-2xl md:border md:p-3 md:shadow-2xl md:shadow-black/70 md:animate-in md:fade-in md:zoom-in-95'
            } ${
              theme === 'dark'
                ? 'bg-zinc-950 md:bg-zinc-900 md:border-zinc-800 text-zinc-100'
                : 'bg-slate-100 md:bg-white md:border-slate-200 text-slate-900'
            }`}
          >
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
                      play('click');
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
                    play('click');
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
                      <span className="text-[10px] font-mono opacity-60 uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800">
                        {language}
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
                            <span
                              className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                              }`}
                            >
                              {langCode}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SEÇÃO: APARÊNCIA COM CELESTIAL SWITCH */}
                <div className="flex items-center justify-between py-2.5 px-1 border-t border-slate-100 dark:border-zinc-800/80">
                  <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    {t(language, 'nav.theme')}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={theme === 'dark'}
                    onClick={handleToggleTheme}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full p-0.5 border transition-colors duration-300 focus:outline-hidden ${
                      theme === 'dark'
                        ? 'bg-zinc-950 border-zinc-800 shadow-inner'
                        : 'bg-slate-200/80 border-slate-300 shadow-inner'
                    }`}
                    aria-label={theme === 'dark' ? t(language, 'nav.themeDark') : t(language, 'nav.themeLight')}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500/70 absolute left-1.5 pointer-events-none" />
                    <Moon className="w-3.5 h-3.5 text-cyan-400/70 absolute right-1.5 pointer-events-none" />

                    <span
                      className={`pointer-events-none flex items-center justify-center h-6 w-6 transform rounded-full shadow-md transition-transform duration-300 ease-in-out z-10 ${
                        theme === 'dark'
                          ? 'translate-x-7 bg-zinc-900 text-cyan-300 border border-zinc-700/80'
                          : 'translate-x-0 bg-white text-amber-500 border border-slate-200'
                      }`}
                    >
                      {theme === 'dark' ? (
                        <Moon className="w-3 h-3 fill-current" />
                      ) : (
                        <Sun className="w-3 h-3 fill-current" />
                      )}
                    </span>
                  </button>
                </div>

                {/* SEÇÃO: EFEITOS SONOROS COM DUAL-ICON SWITCH */}
                <div className="flex items-center justify-between py-2.5 px-1 border-t border-slate-100 dark:border-zinc-800/80">
                  <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    {t(language, 'nav.audioFx')}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundEnabled}
                    onClick={handleToggleSound}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full p-0.5 border transition-colors duration-300 focus:outline-hidden ${
                      theme === 'dark'
                        ? 'bg-zinc-950 border-zinc-800 shadow-inner'
                        : 'bg-slate-200/80 border-slate-300 shadow-inner'
                    }`}
                    aria-label={t(language, 'nav.audioFx')}
                  >
                    <VolumeX className="w-3.5 h-3.5 text-rose-500/60 dark:text-rose-400/60 absolute left-1.5 pointer-events-none" />
                    <Volume2 className="w-3.5 h-3.5 text-emerald-500/70 absolute right-1.5 pointer-events-none" />

                    <span
                      className={`pointer-events-none flex items-center justify-center h-6 w-6 transform rounded-full shadow-md transition-transform duration-300 ease-in-out z-10 ${
                        soundEnabled
                          ? theme === 'dark'
                            ? 'translate-x-7 bg-zinc-900 text-emerald-400 border border-zinc-700/80'
                            : 'translate-x-7 bg-white text-emerald-600 border border-slate-200'
                          : theme === 'dark'
                          ? 'translate-x-0 bg-zinc-900 text-rose-400 border border-zinc-700/80'
                          : 'translate-x-0 bg-white text-rose-600 border border-slate-200'
                      }`}
                    >
                      {soundEnabled ? (
                        <Volume2 className="w-3 h-3 fill-current" />
                      ) : (
                        <VolumeX className="w-3 h-3 fill-current" />
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* CARD 3: APLICATIVO STANDALONE / PWA (AJUSTE FINO PADRÃO APP STORE) */}
              <button
                type="button"
                disabled={isInstalled}
                onClick={async () => {
                  if (isInstalled) return;
                  if (isInstallable && !isIOS) {
                    const ok = await install();
                    if (ok) return;
                  }
                  setShowInstallGuide(true);
                }}
                className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer group ${
                  isInstalled
                    ? 'opacity-85 cursor-default bg-zinc-900/60 border-zinc-800/80 text-zinc-200'
                    : theme === 'dark'
                    ? 'bg-zinc-900/90 hover:bg-zinc-800/90 border-zinc-800 text-zinc-200 hover:border-zinc-700 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5 text-left min-w-0 pr-2">
                  {/* ÍCONE DO APP SQUIRCLE ESTILO IOS/MACOS (FUNDO AZUL INTEGRADO) */}
                  <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0 shadow-md shadow-blue-600/20 ring-1 ring-black/10 dark:ring-white/15 bg-[#2072e7] flex items-center justify-center">
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{t(language, 'pwa.statusBadgeInstalled')}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all group-hover:scale-105 active:scale-95">
                      {t(language, 'pwa.statusBadge')}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* 3. TOOLBAR FLUTUANTE SOBRE O CANVAS (SOMENTE CONTROLES DE NAVEGAÇÃO) */}
      <div className="hidden md:flex w-full px-5 sm:px-8 pt-4 pb-2 z-30 relative pointer-events-none">
        <div className="w-full flex items-center justify-between gap-3 pointer-events-auto">
          {/* SELETOR DE MODO */}
          <div className="segmented-control divide-x divide-slate-200 dark:divide-zinc-800" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={viewLayout === 'GRAPH'}
              onClick={() => handleToggleViewLayout('GRAPH')}
              className={`segmented-btn ${viewLayout === 'GRAPH' ? 'segmented-btn-active' : ''}`}
              aria-label={t(language, 'nav.graphView')}
            >
              <Layers className={`w-3.5 h-3.5 shrink-0 ${viewLayout === 'GRAPH' ? 'text-blue-600 dark:text-cyan-400' : 'opacity-60'}`} />
              <span className="opt-mono">{t(language, 'nav.graphView')}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewLayout === 'TIMELINE'}
              onClick={() => handleToggleViewLayout('TIMELINE')}
              className={`segmented-btn ${viewLayout === 'TIMELINE' ? 'segmented-btn-active' : ''}`}
              aria-label={t(language, 'nav.timelineView')}
            >
              <List className={`w-3.5 h-3.5 shrink-0 ${viewLayout === 'TIMELINE' ? 'text-blue-600 dark:text-cyan-400' : 'opacity-60'}`} />
              <span className="opt-mono">{t(language, 'nav.timelineView')}</span>
            </button>
          </div>

          {/* BARRA DE CATEGORIAS */}
          <div role="tablist" className="segmented-control divide-x divide-slate-200 dark:divide-zinc-800">
            {allLenses.map((lensKey) => {
              const lens = PROFILE_LENSES_CONFIG[lensKey];
              const isActive = profileLens === lensKey;

              return (
                <button
                  key={lensKey}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectLens(lensKey)}
                  className={`segmented-btn ${isActive ? 'segmented-btn-active' : ''}`}
                >
                  <span className="opt-mono">
                    {lensKey === 'ALL'
                      ? t(language, 'lens.all')
                      : lensKey === 'ARCHITECTURE'
                      ? t(language, 'lens.architecture')
                      : lensKey === 'DATA'
                      ? t(language, 'lens.data')
                      : lensKey === 'SOFTWARE_ENG'
                      ? t(language, 'lens.software')
                      : t(language, 'lens.database')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CAMPO DE BUSCA AMPLO */}
          <div className="relative flex-1 min-w-56 shadow-2xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => updateState({ searchTerm: e.target.value })}
              placeholder={t(language, 'nav.filterPlaceholder')}
              className="toolbar-search-field"
              aria-label={t(language, 'nav.filterPlaceholder')}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => updateState({ searchTerm: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 cursor-pointer"
                aria-label={t(language, "nav.clearSearch")}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. SPEED-DIAL RADIAL EM ARCO (SATÉLITES COM TRAVA DE CLIQUE) */}
      {radialOpen && (
        <div
          onClick={() => setRadialOpen(false)}
          className="fixed inset-0 z-35 bg-black/20 backdrop-blur-[1px] md:hidden animate-in fade-in duration-150"
          aria-hidden="true"
        />
      )}

      <div
        ref={radialMenuRef}
        className="fixed bottom-[max(4rem,calc(3.5rem+env(safe-area-inset-bottom,0px)))] right-5 sm:bottom-16 sm:right-8 z-40 select-none group"
      >
        <div className="absolute -top-16 -left-16 w-38 h-38 pointer-events-none group-hover:pointer-events-auto rounded-tl-full" />

        {/* SATÉLITE 1: E-MAIL (PROTEGIDO / FIRESTORE) */}
        <button
          type="button"
          onClick={() => {
            setRadialOpen(false);
            if (isAuthenticated && contact?.email) {
              window.location.href = `mailto:${contact.email}`;
              play('click');
            } else {
              onOpenContact();
              play('alert');
            }
          }}
          aria-label="E-mail"
          className={`absolute -top-14 left-9 w-11 h-11 rounded-full border shadow-xl flex items-center justify-center cursor-pointer transition-all duration-200 ease-out group/sat ${
            radialOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-50 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto delay-150 group-hover:delay-0'
          } ${
            theme === 'dark'
              ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-700 hover:scale-110 shadow-md shadow-black/50'
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:scale-110 shadow-slate-400/30'
          }`}
        >
          <Mail className="w-5 h-5 opacity-80" />
          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-md opacity-0 group-hover/sat:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
            {isAuthenticated ? "E-mail" : "🔒 E-mail"}
          </span>
        </button>

        {/* SATÉLITE 2: LINKEDIN (100% PÚBLICO) */}
        <a
          href="https://br.linkedin.com/in/thaleseareis"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setRadialOpen(false);
            play('click');
          }}
          aria-label="LinkedIn"
          className={`absolute -top-12.5 -left-3.5 w-11 h-11 rounded-full border shadow-xl flex items-center justify-center cursor-pointer transition-all duration-200 delay-50 ease-out group/sat ${
            radialOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-50 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto delay-150 group-hover:delay-50'
          } ${
            theme === 'dark'
              ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-blue-400 hover:border-blue-500/50 hover:scale-110 shadow-md shadow-black/50'
              : 'bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-400 hover:scale-110 shadow-slate-400/30'
          }`}
        >
          <Linkedin className="w-5 h-5 text-blue-500 dark:text-cyan-400" />
          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-md opacity-0 group-hover/sat:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
            LinkedIn
          </span>
        </a>

        {/* SATÉLITE 3: TELEFONE (PROTEGIDO / FIRESTORE) */}
        <button
          type="button"
          onClick={() => {
            setRadialOpen(false);
            if (isAuthenticated && contact?.phone) {
              const cleanPhone = contact.phone.replace(/[^0-9]/g, "");
              window.location.href = `tel:+${cleanPhone}`;
              play('click');
            } else {
              onOpenContact();
              play('alert');
            }
          }}
          aria-label={language === 'PT' ? 'Ligar' : 'Phone'}
          className={`absolute -top-3.5 -left-12.5 w-11 h-11 rounded-full border shadow-xl flex items-center justify-center cursor-pointer transition-all duration-200 delay-100 ease-out group/sat ${
            radialOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-50 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto delay-150 group-hover:delay-100'
          } ${
            theme === 'dark'
              ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-500/50 hover:scale-110 shadow-md shadow-black/50'
              : 'bg-white border-slate-200 text-slate-700 hover:text-amber-600 hover:border-amber-400 hover:scale-110 shadow-slate-400/30'
          }`}
        >
          <Phone className="w-5 h-5 text-amber-500" />
          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-md opacity-0 group-hover/sat:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
            {isAuthenticated ? (language === 'PT' ? 'Ligar' : language === 'ES' ? 'Llamar' : language === 'FR' ? 'Appeler' : 'Call') : "🔒 " + (language === 'PT' ? 'Ligar' : 'Call')}
          </span>
        </button>

        {/* SATÉLITE 4: WHATSAPP (PROTEGIDO / FIRESTORE) */}
        <button
          type="button"
          onClick={() => {
            setRadialOpen(false);
            if (isAuthenticated && contact?.phone) {
              const cleanPhone = contact.phone.replace(/[^0-9]/g, "");
              window.open(`https://wa.me/${cleanPhone}`, "_blank", "noopener,noreferrer");
              play('click');
            } else {
              onOpenContact();
              play('alert');
            }
          }}
          aria-label="WhatsApp"
          className={`absolute top-9 -left-14 w-11 h-11 rounded-full border shadow-xl flex items-center justify-center cursor-pointer transition-all duration-200 delay-150 ease-out group/sat ${
            radialOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-50 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto delay-150 group-hover:delay-150'
          } ${
            theme === 'dark'
              ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/50 hover:scale-110 shadow-md shadow-black/50'
              : 'bg-white border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-400 hover:scale-110 shadow-slate-400/30'
          }`}
        >
          <MessageCircle className="w-5 h-5 text-emerald-500" />
          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-md opacity-0 group-hover/sat:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
            {isAuthenticated ? "WhatsApp" : "🔒 WhatsApp"}
          </span>
        </button>

        {/* ESFERA PRINCIPAL AZUL RADIAL */}
        <button
          type="button"
          onClick={() => {
            setRadialOpen((prev) => !prev);
            play('click');
          }}
          className={`relative w-19 h-19 sm:w-20 sm:h-20 rounded-full text-white shadow-xl shadow-black/50 hover:shadow-2xl hover:shadow-black/60 transition-all cursor-pointer border flex flex-col items-center justify-center select-none ${
            radialOpen
              ? 'bg-blue-700 border-white/80 ring-2 ring-blue-500/40 scale-105'
              : 'bg-blue-600 hover:bg-blue-500 border-blue-400/30 hover:scale-105 active:scale-95'
          }`}
          aria-expanded={radialOpen}
          aria-label={language === 'PT' ? 'Contato' : language === 'ES' ? 'Contacto' : 'Contact'}
        >
          <Handshake className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider mt-1">
            {language === 'PT' ? 'CONTATO' : language === 'ES' ? 'CONTACTO' : 'CONTACT'}
          </span>
        </button>
      </div>

      {/* MODAL IN-APP DE INSTALAÇÃO DO PWA (SEM ALERT DO NAVEGADOR) */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-150">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border ${
              theme === 'dark'
                ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b dark:border-zinc-800 border-slate-200">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <DownloadCloud className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>{isIOS ? t(language, 'pwa.iosTitle') : t(language, 'pwa.guideTitle')}</span>
              </h3>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="p-1 rounded-lg hover:bg-zinc-800/40 text-zinc-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-xl dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                    <Share className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>{t(language, 'pwa.iosStep1')}</div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                    <PlusSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>{t(language, 'pwa.iosStep2')}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-xl dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                    <DownloadCloud className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>{t(language, 'pwa.guideDesktopStep')}</div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                    <Smartphone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>{t(language, 'pwa.guideMobileStep')}</div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
            >
              {t(language, 'pwa.iosGotIt')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
