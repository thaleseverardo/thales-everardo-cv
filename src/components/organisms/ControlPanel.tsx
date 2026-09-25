import React, { useState, useRef, useEffect } from 'react';
import {
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
  Volume2,
  VolumeX,
  DownloadCloud,
  CheckCircle2,
  LogIn,
  User,
  LogOut,
  Smartphone,
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

export const ControlPanel: React.FC<ControlPanelProps> = ({
  systemState,
  updateState,
  onOpenContact,
  onOpenResume,
}) => {
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
  const [showIOSGuide, setShowIOSGuide] = useState(false);
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

            {/* GATILHO DO MENU UNIFICADO (DESKTOP) */}
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
              {isAuthenticated ? (
                user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {userInitial}
                  </div>
                )
              ) : (
                <Globe className="w-3.5 h-3.5 opacity-70" />
              )}
              <span className="font-mono text-[11px] font-bold">{language}</span>
              <Settings className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>

        {/* HEADER MOBILE */}
        <div className="w-full px-4 h-16 flex md:hidden items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-300 dark:border-zinc-700 shrink-0 shadow-xs">
              <img
                src={thalesAvatar}
                alt="Thales Everardo"
                width={40}
                height={40}
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

            {/* GATILHO DO MENU UNIFICADO (MOBILE) */}
            <button
              type="button"
              onClick={() => {
                setSettingsOpen((prev) => !prev);
                play('click');
              }}
              className={`p-2 rounded-lg border h-9 w-9 flex items-center justify-center cursor-pointer ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              aria-label={t(language, 'nav.preferences')}
            >
              {isAuthenticated ? (
                user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {userInitial}
                  </div>
                )
              ) : (
                <Settings className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. MENU UNIFICADO (DROPDOWN NO DESKTOP / BOTTOM SHEET NATIVO NO MOBILE) */}
      {settingsOpen && (
        <>
          {/* BACKDROP SUTIL */}
          <div
            className="fixed inset-0 z-45 bg-black/40 backdrop-blur-2xs transition-opacity"
            onClick={() => setSettingsOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={settingsPopoverRef}
            className={`fixed md:absolute z-50 transition-all font-sans ${
              /* Mobile: Bottom Sheet que sobe do rodapé */
              'inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl border-t p-5 pb-8 shadow-2xl overflow-y-auto animate-in slide-in-from-bottom duration-200'
            } ${
              /* Desktop: Dropdown ancorado no topo-direito */
              'md:inset-auto md:top-20 md:right-8 md:w-80 md:rounded-2xl md:border md:p-3 md:pb-3 md:shadow-2xl md:animate-in md:fade-in md:zoom-in-95'
            } ${
              theme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-zinc-100 shadow-black/80'
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/40'
            }`}
          >
            {/* INDICADOR DE TOQUE NO MOBILE (DRAG HANDLE) */}
            <div className="md:hidden w-10 h-1 bg-slate-300 dark:bg-zinc-700 rounded-full mx-auto mb-4" />

            {/* SEÇÃO 1: PERFIL / CONTA */}
            <div className="mb-2">
              {isAuthenticated ? (
                <div
                  className={`flex items-center justify-between p-2.5 rounded-xl border ${
                    theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {user?.displayName || (user?.email ? user.email.split('@')[0] : 'Conta')}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
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
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-zinc-800/80 transition-colors shrink-0 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500/40"
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
                  className={`w-full flex items-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-zinc-950/60 hover:bg-zinc-800 border-zinc-800 text-zinc-100 hover:border-zinc-700'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold leading-tight text-slate-900 dark:text-zinc-100">
                        {t(language, 'auth.signIn')}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        {t(language, 'nav.unlockContactsHint')}
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* SEÇÃO 2: IDIOMA EM LINHA ÚNICA (SEM CARDS GIGANTES) */}
            <div className="flex items-center justify-between py-2 px-1 border-t border-slate-100 dark:border-zinc-800/80">
              <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                {t(language, 'nav.language')}
              </span>
              <div className="grid grid-cols-4 h-7 w-44 rounded-lg border overflow-hidden p-0 bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 divide-x divide-slate-200 dark:divide-zinc-800">
                {(['PT', 'EN', 'ES', 'FR'] as const).map((langCode) => (
                  <button
                    key={langCode}
                    onClick={() => handleToggleLanguage(langCode)}
                    className={`h-full text-[11px] font-mono font-bold transition-colors flex items-center justify-center cursor-pointer ${
                      language === langCode
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {langCode}
                  </button>
                ))}
              </div>
            </div>

            {/* SEÇÃO 3: APARÊNCIA EM LINHA ÚNICA */}
            <div className="flex items-center justify-between py-2 px-1 border-t border-slate-100 dark:border-zinc-800/80">
              <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                {t(language, 'nav.theme')}
              </span>
              <div className="grid grid-cols-2 h-7 w-36 rounded-lg border overflow-hidden p-0 bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 divide-x divide-slate-200 dark:divide-zinc-800">
                <button
                  onClick={() => {
                    if (theme !== 'light') handleToggleTheme();
                  }}
                  className={`h-full text-xs font-sans font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white text-blue-600 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span className="text-[11px]">{t(language, 'nav.themeLight')}</span>
                </button>
                <button
                  onClick={() => {
                    if (theme !== 'dark') handleToggleTheme();
                  }}
                  className={`h-full text-xs font-sans font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-zinc-800 text-cyan-300 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Moon className="w-3 h-3 text-cyan-400" />
                  <span className="text-[11px]">{t(language, 'nav.themeDark')}</span>
                </button>
              </div>
            </div>

            {/* SEÇÃO 4: EFEITOS SONOROS */}
            <div className="flex items-center justify-between py-2 px-1 border-t border-slate-100 dark:border-zinc-800/80">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-zinc-400">
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 opacity-40" />
                )}
                <span>{t(language, 'nav.audioFx')}</span>
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={soundEnabled}
                onClick={handleToggleSound}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  soundEnabled ? 'bg-blue-600 dark:bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    soundEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* SEÇÃO 5: INSTALAR APLICATIVO (PWA) */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80">
              <button
                type="button"
                disabled={isInstalled}
                onClick={async () => {
                  if (isInstalled) return;
                  if (isIOS) {
                    setShowIOSGuide(true);
                    return;
                  }
                  if (isInstallable) {
                    await install();
                  } else {
                    window.alert(t(language, 'pwa.manualNotice'));
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                  isInstalled
                    ? 'opacity-60 cursor-default bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : theme === 'dark'
                    ? 'bg-zinc-950/60 hover:bg-zinc-800/60 text-zinc-300 border-zinc-800'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isInstalled ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : isIOS ? (
                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <DownloadCloud className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  <span className="font-medium text-[11px]">
                    {isInstalled ? t(language, 'nav.appInstalled') : t(language, 'nav.installApp')}
                  </span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                  {isInstalled ? 'OFFLINE' : 'PWA'}
                </span>
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
                    {language === 'PT' ? lens.shortLabelPT : lens.shortLabelEN}
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
                aria-label="Limpar busca"
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
              ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:scale-110 shadow-black/80'
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
              ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-blue-400 hover:border-blue-500/50 hover:scale-110 shadow-black/80'
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
              ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-500/50 hover:scale-110 shadow-black/80'
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
              ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/50 hover:scale-110 shadow-black/80'
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
          className={`relative w-20 h-20 rounded-full text-white shadow-2xl transition-all cursor-pointer border-2 flex flex-col items-center justify-center select-none ${
            radialOpen
              ? 'bg-blue-500 border-white ring-4 ring-blue-500/30 scale-105 shadow-blue-500/50'
              : 'bg-blue-600 hover:bg-blue-500 border-blue-400/40 hover:scale-105 active:scale-95 shadow-blue-600/40 hover:shadow-blue-500/50'
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

      {/* GUIA PWA IOS */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-sans">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border ${
              theme === 'dark'
                ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b dark:border-zinc-800 border-slate-200">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>{t(language, 'pwa.iosTitle')}</span>
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg hover:bg-zinc-800/40 text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                <Share className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.iosStep1')}</div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                <PlusSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.iosStep2')}</div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
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
