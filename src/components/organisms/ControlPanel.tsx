import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Mail,
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
  Terminal,
} from 'lucide-react';
import { SystemState, AppLanguage, ViewLayout, ProfileLens } from '../../types';
import { PROFILE_LENSES_CONFIG } from '../../data/curriculumData';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { PWAInstallButton } from '../molecules/PWAInstallButton';
import { t } from '../../i18n/translations';
import { Button } from '../atoms/Button';

import thalesAvatar from '../../assets/images/thales_avatar_250x250.webp?inline';

interface ControlPanelProps {
  systemState: SystemState;
  updateState: (updates: Partial<SystemState>) => void;
  onOpenCLI: () => void;
  onOpenContact: () => void;
  onOpenResume: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  systemState,
  updateState,
  onOpenCLI,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
      {/* 1. HEADER LIMPO: IDENTIFICAÇÃO + PAR ESTÉTICO (CURRÍCULO & CONTATAR) */}
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
              <h1 className="font-mono font-bold text-[15px] sm:text-base tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                <span>THALES </span>
                {showFullName ? <span>EVERARDO ALBUQUERQUE </span> : <span>EVERARDO </span>}
                <span>REIS</span>
              </h1>

              <div className="text-xs font-sans opacity-70 leading-normal flex flex-wrap items-baseline gap-x-1.5 pt-0.5">
                <span className="whitespace-nowrap">{t(language, 'nav.staffTitle')}</span>
                <span className="whitespace-nowrap flex items-baseline gap-1">
                  <span className="opacity-40">&</span>
                  <span>{t(language, 'nav.architectTitle')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Canto Direito: Par Estético Rigorosamente Padronizado */}
          <div className="flex items-center justify-end gap-2.5 shrink-0">
            {/* BOTÃO CURRÍCULO (SECUNDÁRIO) */}
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

            {/* BOTÃO CONTATAR (PRIMÁRIO AZUL VIBRANTE) */}
            <button
              type="button"
              onClick={() => {
                onOpenContact();
                play('click');
              }}
              className="header-btn-primary"
              aria-label={t(language, 'nav.contactButton')}
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="opt-mono">{t(language, 'nav.contactButton')}</span>
            </button>
          </div>
        </div>

        {/* HEADER MOBILE */}
        <div className="w-full px-4 h-16 flex md:hidden items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-slate-300 dark:border-zinc-700 shrink-0 shadow-xs">
              <img
                src={thalesAvatar}
                alt="Thales Everardo"
                width={44}
                height={44}
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
            <div className="min-w-0">
              <span className="font-mono font-bold text-xs sm:text-sm tracking-tight block truncate">
                Thales Everardo
              </span>
              <div className="text-[10px] font-sans opacity-60 leading-tight flex flex-wrap items-baseline gap-x-1">
                <span className="whitespace-nowrap">{t(language, 'nav.staffTitle')}</span>
                <span className="whitespace-nowrap flex items-baseline gap-0.5">
                  <span className="opacity-40">&</span>
                  <span>{t(language, 'nav.architectTitle')}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              icon={<Mail className="w-3.5 h-3.5" />}
              onClick={() => {
                onOpenContact();
                play('click');
              }}
              className="shadow-xs cursor-pointer h-9 px-3 text-xs uppercase"
            >
              {t(language, 'nav.contactButton')}
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border h-9 w-9 flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              aria-label="Menu"
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

            <div className="grid grid-cols-2 gap-2 pt-1 border-t dark:border-zinc-800/80 border-slate-200">
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
                <span>{t(language, 'nav.audioFx')}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCLI();
                  play('click');
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-mono font-medium transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-cyan-400'
                    : 'bg-white border-slate-300 text-blue-700'
                }`}
              >
                <Terminal className="w-4 h-4 shrink-0" />
                <span>{t(language, 'nav.openCli')}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t dark:border-zinc-800/80 border-slate-200">
              <div className="flex items-center gap-2">
                {/* SWITCHER COMPACTO MOBILE COM ZERO-INSET */}
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
                <PWAInstallButton language={language} theme={theme} />
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

      {/* 2. TOOLBAR FLUTUANTE SOBRE O CANVAS (COMPENSAÇÃO ÓPTICA VERTICAL SUB-PIXEL) */}
      <div className="hidden md:flex w-full px-5 sm:px-8 pt-4 pb-2 z-30 relative pointer-events-none">
        <div className="w-full flex items-center justify-between gap-3 pointer-events-auto">
          {/* SELETOR DE MODO: ZERO-INSET COM COMPENSAÇÃO ÓPTICA */}
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

          {/* BARRA DE CATEGORIAS: ZERO-INSET FLUSH PILLS COM COMPENSAÇÃO ÓPTICA */}
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
                  <span className="opt-mono hidden xl:inline">
                    {language === 'PT' ? lens.labelPT : lens.labelEN}
                  </span>
                  <span className="opt-mono xl:hidden">
                    {language === 'PT' ? lens.shortLabelPT : lens.shortLabelEN}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CAMPO DE BUSCA: ALINHAMENTO ÓPTICO DE BASELINE COM A LUPA */}
          <div className="relative flex-1 min-w-44 shadow-2xs">
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

          {/* WIDGET DE PREFERÊNCIAS: ALINHAMENTO ÓPTICO [ 🌙/☀️ • PT • ⚙️ ] */}
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
              {/* LUA / SOL */}
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              )}
              <span className="opacity-30 opt-mono">•</span>
              {/* IDIOMA */}
              <span className="font-bold text-[11px] opacity-90 opt-mono">{language}</span>
              <span className="opacity-30 opt-mono">•</span>
              {/* ENGRENAGEM */}
              <Settings className="w-3.5 h-3.5 opacity-80 shrink-0" />
            </button>

            {/* POPOVER HARMONIZADO */}
            {settingsOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-72 rounded-xl border p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  theme === 'dark'
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-200 shadow-black/80'
                    : 'bg-white border-slate-200 text-slate-800 shadow-slate-400/25'
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b dark:border-zinc-800/80 border-slate-100">
                  <span className="font-mono text-xs font-bold flex items-center gap-2 tracking-wide opacity-90">
                    <Settings className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span>{t(language, 'nav.preferences')}</span>
                  </span>
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-hidden"
                    aria-label="Fechar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* IDIOMA */}
                <div className="space-y-2 mb-3.5">
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
                          className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer focus:outline-hidden ${
                            isSelected
                              ? theme === 'dark'
                                ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-bold shadow-2xs'
                                : 'bg-blue-50 border-blue-400 text-blue-700 font-bold shadow-2xs'
                              : theme === 'dark'
                              ? 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/60 text-zinc-300'
                              : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="font-sans font-medium">{langItem.label}</span>
                          <span className="font-mono text-[10px] font-bold opacity-70">{langItem.code}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TEMA VISUAL */}
                <div className="space-y-2 mb-3.5 pt-3 border-t dark:border-zinc-800/80 border-slate-100">
                  <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 font-bold">
                    {t(language, 'nav.theme')}
                  </div>
                  <div className="grid grid-cols-2 p-0 h-9 rounded-lg border overflow-hidden bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-2xs">
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
                      <span>{t(language, 'nav.themeLight')}</span>
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
                      <span>{t(language, 'nav.themeDark')}</span>
                    </button>
                  </div>
                </div>

                {/* ÁUDIO & SOM */}
                <div className="space-y-2 pt-3 border-t dark:border-zinc-800/80 border-slate-100">
                  <div className="flex items-center justify-between py-1">
                    <span className="flex items-center gap-2 text-xs font-sans text-slate-700 dark:text-zinc-300">
                      {soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <VolumeX className="w-4 h-4 opacity-40" />
                      )}
                      <span className="font-medium">{t(language, 'nav.audioFx')}</span>
                    </span>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={soundEnabled}
                      onClick={handleToggleSound}
                      className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        soundEnabled
                          ? 'bg-blue-600 dark:bg-emerald-500'
                          : 'bg-slate-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          soundEnabled ? 'translate-x-4.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* ATALHO TERMINAL CLI */}
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      onOpenCLI();
                      play('click');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-mono transition-all mt-1 cursor-pointer focus:outline-hidden ${
                      theme === 'dark'
                        ? 'bg-zinc-900/60 border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 text-zinc-300 hover:text-cyan-300'
                        : 'bg-slate-50/80 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span className="font-semibold">{t(language, 'nav.openCli')}</span>
                    </span>
                    <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-slate-200/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-mono">
                      Ctrl+K
                    </kbd>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>    </>
  );
};
