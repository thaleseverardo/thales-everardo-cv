import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Mail,
  MessageSquare,
  Handshake,
  MessageCircle,
  Linkedin,
  Phone,
  Sun,
  Moon,
  List,
  Layers,
  Search,
  X,
  AlertTriangle,
  RotateCcw,
  Menu,
  Settings,
  Globe,
  Volume2,
  VolumeX,
  DownloadCloud,
  CheckCircle2,
  LogIn,
  LogOut,
  ShieldCheck,
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
  const { isAuthenticated, user, signInWithGoogle, signOut } = useAuth();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [radialOpen, setRadialOpen] = useState(false);
  const radialMenuRef = useRef<HTMLDivElement>(null);

  const leftColRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
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
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSettingsOpen(false);
    };

    if (settingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
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

  const languagesList: { code: AppLanguage; label: string; region: string }[] = [
    { code: 'PT', label: 'Português', region: 'BR' },
    { code: 'EN', label: 'English', region: 'US' },
    { code: 'ES', label: 'Español', region: 'ES' },
    { code: 'FR', label: 'Français', region: 'FR' },
  ];

  return (
    <>
      {/* 1. HEADER LIMPO: IDENTIDADE + CURRÍCULO + PREFERÊNCIAS */}
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
          {/* Canto Esquerdo: Identidade Visual */}
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

          {/* Canto Direito: CURRÍCULO (SEMPRE VISÍVEL) + PREFERÊNCIAS */}
          <div className="flex items-center justify-end gap-2.5 shrink-0">
            {/* BOTÃO CURRÍCULO */}
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

            {/* WIDGET DE PREFERÊNCIAS / SETTINGS NO HEADER */}
            <div className="relative shrink-0" ref={settingsMenuRef}>
              <button
                type="button"
                aria-label={t(language, 'nav.preferences')}
                aria-haspopup="true"
                aria-expanded={settingsOpen}
                onClick={() => {
                  setSettingsOpen((prev) => !prev);
                  play('click');
                }}
                className={`h-9 px-3 rounded-lg border transition-all shrink-0 font-mono text-xs flex items-center gap-2 shadow-2xs cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-500 ${
                  settingsOpen
                    ? theme === 'dark'
                      ? 'bg-zinc-800 border-cyan-500/50 text-cyan-300 shadow-md'
                      : 'bg-blue-50 border-blue-300 text-blue-800 shadow-md'
                    : theme === 'dark'
                    ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                )}
                <span className="opacity-30 opt-mono">•</span>
                <span className="font-bold text-[11px] opacity-90 opt-mono">{language}</span>
                <span className="opacity-30 opt-mono">•</span>
                <Settings className="w-3.5 h-3.5 opacity-80 shrink-0" />
              </button>

              {/* POPOVER HARMONIZADO */}
              {settingsOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-76 sm:w-80 rounded-xl border p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    theme === 'dark'
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-200 shadow-black/80'
                      : 'bg-white border-slate-200 text-slate-800 shadow-slate-400/25'
                  }`}
                >
                  {/* 1. CABEÇALHO */}
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b dark:border-zinc-800/80 border-slate-100">
                    <span className="font-mono text-xs font-bold flex items-center gap-2 tracking-wide opacity-90">
                      <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span>{t(language, 'nav.preferences')}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSettingsOpen(false)}
                      className="w-9 h-9 -mr-2 -my-1 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-hidden"
                      aria-label="Fechar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 2. CONTA & ACESSO */}
                  <div className="space-y-1 mb-2.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>{t(language, 'nav.account')}</span>
                    </div>

                    {isAuthenticated ? (
                      <div
                        className={`flex items-center justify-between p-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-zinc-900/60 border-zinc-800'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          {user?.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt=""
                              className="w-6 h-6 rounded-full shrink-0 border border-emerald-500/40"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-[11px] font-sans font-semibold truncate leading-tight">
                              {user?.displayName || t(language, 'nav.verifiedSession')}
                            </div>
                            <div className="text-[9px] font-mono opacity-60 truncate">
                              {user?.email || ''}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            await signOut();
                            play('click');
                          }}
                          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-colors shrink-0 cursor-pointer"
                          title={t(language, 'nav.signOut')}
                        >
                          <LogOut className="w-3 h-3" />
                          <span>{t(language, 'nav.signOut')}</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await signInWithGoogle();
                            play('success');
                          } catch {}
                        }}
                        className={`w-full flex items-center justify-start p-2 rounded-lg border transition-all cursor-pointer ${
                          theme === 'dark'
                            ? 'bg-blue-600/10 hover:bg-blue-600/20 border-blue-500/40 text-cyan-300'
                            : 'bg-blue-50 hover:bg-blue-100/80 border-blue-300 text-blue-700 shadow-2xs'
                        }`}
                      >
                        <LogIn className="w-4 h-4 shrink-0 text-blue-600 dark:text-cyan-400 mr-2" />
                        <div className="min-w-0 text-left">
                          <div className="text-xs font-sans font-bold leading-tight">
                            {t(language, 'nav.signInGoogle')}
                          </div>
                          <div className="text-[10px] font-sans opacity-70 leading-tight">
                            {t(language, 'nav.unlockContactsHint')}
                          </div>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* 3. IDIOMA */}
                  <div className="space-y-1 mb-2.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 flex items-center gap-1.5 font-bold">
                      <Globe className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                      <span>{t(language, 'nav.language')}</span>
                    </div>
                    <div data-testid="language-switcher" className="grid grid-cols-2 gap-1.5">
                      {languagesList.map((langItem) => {
                        const isSelected = language === langItem.code;
                        return (
                          <button
                            key={langItem.code}
                            data-testid={`language-toggle-${langItem.code.toLowerCase()}`}
                            onClick={() => handleToggleLanguage(langItem.code)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer focus:outline-hidden ${
                              isSelected
                                ? theme === 'dark'
                                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-bold shadow-2xs'
                                  : 'bg-blue-50 border-blue-400 text-blue-700 font-bold shadow-2xs'
                                : theme === 'dark'
                                ? 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/60 text-zinc-300'
                                : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="font-sans font-medium text-[11px]">{langItem.label}</span>
                            <span className="font-mono text-[10px] font-bold opacity-70">{langItem.code}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. APARÊNCIA */}
                  <div className="space-y-1 mb-2.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 font-bold">
                      {t(language, 'nav.theme')}
                    </div>
                    <div className="grid grid-cols-2 p-0 h-8 rounded-lg border overflow-hidden bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-2xs">
                      <button
                        data-testid="theme-toggle"
                        onClick={() => {
                          if (theme !== 'light') handleToggleTheme();
                        }}
                        className={`h-full text-xs font-sans flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus:outline-hidden ${
                          theme === 'light'
                            ? 'bg-white text-blue-600 font-bold border-r border-slate-200'
                            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[11px]">{t(language, 'nav.themeLight')}</span>
                      </button>
                      <button
                        onClick={() => {
                          if (theme !== 'dark') handleToggleTheme();
                        }}
                        className={`h-full text-xs font-sans flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus:outline-hidden ${
                          theme === 'dark'
                            ? 'bg-zinc-800 text-cyan-300 font-bold border-l border-zinc-700'
                            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px]">{t(language, 'nav.themeDark')}</span>
                      </button>
                    </div>
                  </div>

                  {/* 5. SOM */}
                  <div className="flex items-center justify-between py-1.5 border-t dark:border-zinc-800/80 border-slate-100">
                    <span className="flex items-center gap-2 text-xs font-sans text-slate-700 dark:text-zinc-300">
                      {soundEnabled ? (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5 opacity-40" />
                      )}
                      <span className="font-medium text-[11px]">{t(language, 'nav.sound')}</span>
                    </span>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={soundEnabled}
                      onClick={handleToggleSound}
                      className={`relative inline-flex h-4.5 w-8.5 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        soundEnabled
                          ? 'bg-blue-600 dark:bg-emerald-500'
                          : 'bg-slate-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          soundEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 6. FERRAMENTAS / INSTALAÇÃO PWA */}
                  <div className="space-y-1 pt-1.5 border-t dark:border-zinc-800/80 border-slate-100">
                    <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 font-bold">
                      {t(language, 'nav.tools')}
                    </div>

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
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-sans transition-colors cursor-pointer ${
                        isInstalled
                          ? 'opacity-60 cursor-default bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : theme === 'dark'
                          ? 'bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-emerald-400 border-zinc-800'
                          : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 hover:text-emerald-700 border-slate-200'
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
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                        {isInstalled ? 'OFFLINE' : 'PWA'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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
            {/* BOTÃO CURRÍCULO MOBILE (SEMPRE VISÍVEL NO TOPO) */}
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

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border h-9 w-9 flex items-center justify-center cursor-pointer ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              aria-label="Menu de opções"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* GAVETA MOBILE */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-t px-4 py-3.5 space-y-3 font-mono text-xs ${
              theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => updateState({ searchTerm: e.target.value })}
                placeholder={t(language, 'nav.filterPlaceholder')}
                className={`w-full pl-9 pr-3 h-9 rounded-lg border text-xs font-mono focus:outline-hidden ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {allLenses.map((lensKey) => (
                <button
                  key={lensKey}
                  onClick={() => {
                    handleSelectLens(lensKey);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border cursor-pointer ${
                    profileLens === lensKey
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  {language === 'PT'
                    ? PROFILE_LENSES_CONFIG[lensKey].shortLabelPT
                    : PROFILE_LENSES_CONFIG[lensKey].shortLabelEN}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-1 border-t dark:border-zinc-800/80 border-slate-200">
              <button
                onClick={handleToggleSound}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-sans font-medium transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                    : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <VolumeX className="w-4 h-4 opacity-40 shrink-0" />
                )}
                <span>{t(language, 'nav.sound')}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t dark:border-zinc-800/80 border-slate-200">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-stretch h-9 rounded-lg border overflow-hidden border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 shadow-2xs">
                  <button
                    onClick={() => {
                      handleToggleViewLayout('GRAPH');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-1.5 h-full px-3 text-xs font-semibold cursor-pointer ${
                      viewLayout === 'GRAPH'
                        ? theme === 'dark'
                          ? 'bg-zinc-800 text-cyan-300 border-r border-zinc-700'
                          : 'bg-white text-blue-600 border-r border-slate-200'
                        : 'opacity-60'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t(language, 'nav.graphView')}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleToggleViewLayout('TIMELINE');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-1.5 h-full px-3 text-xs font-semibold cursor-pointer ${
                      viewLayout === 'TIMELINE'
                        ? theme === 'dark'
                          ? 'bg-zinc-800 text-cyan-300 border-l border-zinc-700'
                          : 'bg-white text-blue-600 border-l border-slate-200'
                        : 'opacity-60'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>{t(language, 'nav.timelineView')}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {(['PT', 'EN', 'ES', 'FR'] as const).map((code) => (
                  <button
                    key={code}
                    onClick={() => handleToggleLanguage(code)}
                    className={`px-2 py-1 rounded border text-[11px] font-bold cursor-pointer ${
                      language === code ? 'bg-blue-600 text-white border-blue-600' : 'opacity-60'
                    }`}
                  >
                    {code}
                  </button>
                ))}
                <button
                  onClick={handleToggleTheme}
                  className="p-1.5 ml-1 rounded border text-amber-400 cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. TOOLBAR FLUTUANTE SOBRE O CANVAS (DESAFOGADA, DEDICADA A CONTEÚDO) */}
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

          {/* CAMPO DE BUSCA AMPLO E DESAFOGADO */}
          <div className="relative flex-1 min-w-56 shadow-2xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => updateState({ searchTerm: e.target.value })}
              placeholder={t(language, 'nav.filterPlaceholder')}
              className="toolbar-search-field"
              aria-label={t(language, 'nav.filterPlaceholder')}
            >
            </input>
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

      {/* 3. SPEED-DIAL RADIAL EM ARCO (BLINDADO PARA DESKTOP E MOBILE) */}
      {/* BACKDROP MOBILE ANTI-TOQUE ACIDENTAL */}
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
        {/* PONTE DE HIT-TEST INVISÍVEL (IMPEDE QUE O MOUSE PERCA O HOVER NO VÃO ENTRE OS BOTÕES) */}
        <div className="absolute -top-16 -left-16 w-38 h-38 pointer-events-none group-hover:pointer-events-auto rounded-tl-full" />

        {/* SATÉLITE 1: E-MAIL (TOPO-DIREITA DO ARCO) */}
        <button
          type="button"
          onClick={() => {
            setRadialOpen(false);
            onOpenContact();
            play('click');
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
            E-mail
          </span>
        </button>

        {/* SATÉLITE 2: LINKEDIN (TOPO-ESQUERDA DO ARCO) */}
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

        {/* SATÉLITE 3: TELEFONE (MEIO-ESQUERDA DO ARCO) */}
        <a
          href="tel:+5511962969508"
          onClick={() => {
            setRadialOpen(false);
            play('click');
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
            {language === 'PT' ? 'Ligar' : language === 'ES' ? 'Llamar' : language === 'FR' ? 'Appeler' : 'Call'}
          </span>
        </a>

        {/* SATÉLITE 4: WHATSAPP (BASE-ESQUERDA DO ARCO) */}
        <a
          href="https://wa.me/5511962969508"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setRadialOpen(false);
            play('click');
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
            WhatsApp
          </span>
        </a>

        {/* ESFERA PRINCIPAL AZUL RADIAL (MINIMALISTA: HANDSHAKE + CONTATO) */}
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
          {/* ÍCONE HANDSHAKE */}
          <Handshake className="w-6 h-6 transition-transform group-hover:scale-110" />

          {/* PALAVRA ÚNICA: CONTATO */}
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider mt-1">
            {language === 'PT' ? 'CONTATO' : language === 'ES' ? 'CONTACTO' : 'CONTACT'}
          </span>
        </button>
      </div>

      {/* GUIA PWA IOS */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-sm rounded-xl p-5 shadow-2xl border ${
              theme === 'dark'
                ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b dark:border-zinc-800 border-slate-200">
              <h3 className="font-mono text-xs font-bold flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>{t(language, 'pwa.iosTitle')}</span>
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded hover:bg-zinc-800/40 text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 font-sans text-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                <Share className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.iosStep1')}</div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border border-slate-200">
                <PlusSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>{t(language, 'pwa.iosStep2')}</div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-md bg-blue-600 py-2 text-xs font-mono font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
            >
              {t(language, 'pwa.iosGotIt')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
