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
} from 'lucide-react';
import { SystemState, AppLanguage, ViewLayout, ProfileLens } from '../types';
import { PROFILE_LENSES_CONFIG, PROFILE_DATA } from '../data/curriculumData';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { PWAInstallButton } from './PWAInstallButton';

// Imagem embutida em Base64 nativa pelo Vite (?inline)
import thalesAvatarInline from '../assets/images/thales_avatar_250x250.png?inline';

const THALES_AVATAR_BASE64: string = thalesAvatarInline;

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
  const isPT = language === 'PT';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitora a largura real da coluna esquerda para colapsar o nome sem colisão
  const leftColRef = useRef<HTMLDivElement>(null);
  const [showFullName, setShowFullName] = useState(false);

  useEffect(() => {
    if (!leftColRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // "THALES EVERARDO ALBUQUERQUE REIS" precisa de pelo menos 360px com o avatar maior
        setShowFullName(entry.contentRect.width >= 360);
      }
    });
    observer.observe(leftColRef.current);
    return () => observer.disconnect();
  }, []);

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
        failureReason: isPT
          ? 'CIRCUIT_BREAKER_ACIONADO // BUFFER DE INGESTÃO SATURADO'
          : 'CIRCUIT_BREAKER_TRIPPED // INGESTION BUFFER SATURATION',
      });
      play('alert');
    }
  };

  return (
    <header
      className={`border-b sticky top-0 z-40 transition-colors select-none ${
        theme === 'dark'
          ? 'bg-[#09090b]/95 border-zinc-800/90 text-zinc-100 backdrop-blur-md'
          : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-md shadow-xs'
      }`}
    >
      {/* Banner de Incidente Simulado */}
      {failureInjected && (
        <div className="bg-rose-950/90 border-b border-rose-600/40 text-rose-200 text-xs py-1.5 px-4 sm:px-6 flex items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2 truncate">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
            <span className="font-bold text-rose-300">
              {isPT ? 'INCIDENTE SIMULADO:' : 'SIMULATED INCIDENT:'}
            </span>
            <span className="truncate">
              {isPT ? 'Circuit breaker aberto · Roteamento em failover ativo' : 'Circuit breaker open · Active failover engaged'}
            </span>
          </div>
          <button
            onClick={handlePanicToggle}
            className="flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-[11px] transition-colors shrink-0"
          >
            <RotateCcw className="w-3 h-3 animate-spin" />
            {isPT ? 'AUTO-RECUPERAR' : 'AUTO-HEAL'}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DESKTOP: HEADER 50% MAIS ALTO (84px) COM ESPAÇAMENTO EXECUTIVO           */}
      {/* ========================================================================= */}
      <div className="w-full px-5 sm:px-8 h-[84px] hidden md:flex items-center justify-between gap-4 lg:gap-8">
        
        {/* ----------------------------------------------------------------------- */}
        {/* 1º TERÇO (ESQUERDA): Avatar Amplo de 48px + Nome Nobre + Cargos          */}
        {/* ----------------------------------------------------------------------- */}
        <div
          ref={leftColRef}
          className="flex-1 flex items-center justify-start gap-3.5 min-w-[180px] overflow-hidden"
        >
          {/* Avatar com 48px de diâmetro (presença visual de liderança) */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-300 dark:border-zinc-700 shrink-0 shadow-sm">
            <img
              src={THALES_AVATAR_BASE64}
              alt="Thales Reis"
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
          </div>

          <div className="min-w-0 flex flex-col justify-center">
            {/* Nome com colapso inteligente medido */}
            <h1 className="font-mono font-bold text-[15px] sm:text-base tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
              <span>THALES </span>
              {showFullName && <span>EVERARDO ALBUQUERQUE </span>}
              <span>REIS</span>
            </h1>

            {/* Quebra atômica por cargo com entrelinha arejada */}
            <div className="text-xs sm:text-[12px] font-sans opacity-70 leading-normal flex flex-wrap items-baseline gap-x-1.5 pt-0.5">
              <span className="whitespace-nowrap">
                {isPT ? 'Engenheiro de Software Staff' : 'Staff Software Engineer'}
              </span>
              <span className="whitespace-nowrap flex items-baseline gap-1">
                <span className="opacity-40">&</span>
                <span>{isPT ? 'Arquiteto de Sistemas' : 'System Architect'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* 2º TERÇO (CENTRO): Lentes & Filtro com Paddiing Nobre e Ergonômico       */}
        {/* ----------------------------------------------------------------------- */}
        <div className="flex-shrink-0 flex items-center justify-center gap-2.5">
          {/* Segmented Lens Tabs com altura confortável */}
          <div
            role="tablist"
            className={`flex items-center p-1 rounded-xl border text-xs font-mono shrink-0 ${
              theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-slate-100 border-slate-300'
            }`}
          >
            {allLenses.map((lensKey) => {
              const lens = PROFILE_LENSES_CONFIG[lensKey];
              const isActive = profileLens === lensKey;
              return (
                <button
                  key={lensKey}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectLens(lensKey)}
                  className={`px-3 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap text-xs ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-zinc-800 text-cyan-300 font-bold shadow-xs border border-zinc-700'
                        : 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200'
                      : 'opacity-65 hover:opacity-100'
                  }`}
                >
                  <span className="hidden 2xl:inline">
                    {isPT ? lens.labelPT : lens.labelEN}
                  </span>
                  <span className="2xl:hidden">
                    {isPT ? lens.shortLabelPT : lens.shortLabelEN}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search com altura confortável */}
          <div className="relative w-32 lg:w-40 focus-within:w-48 transition-all duration-200 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => updateState({ searchTerm: e.target.value })}
              placeholder={isPT ? 'Filtrar...' : 'Filter...'}
              className={`w-full pl-9 pr-6 py-1.5 sm:py-2 rounded-lg text-xs font-mono border focus:outline-hidden transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-cyan-500 placeholder:text-zinc-500'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600 placeholder:text-slate-400'
              }`}
            />
            {searchTerm && (
              <button
                onClick={() => updateState({ searchTerm: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* 3º TERÇO (DIREITA): Ações com Altura Uniforme e Amplo Espaçamento       */}
        {/* ----------------------------------------------------------------------- */}
        <div className="flex-1 flex items-center justify-end gap-2 lg:gap-2.5 shrink-0 min-w-0">
          {/* Alternador de Visualização (Graph / Timeline) */}
          <div
            className={`flex items-center p-1 rounded-xl border text-xs font-mono shrink-0 ${
              theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <button
              onClick={() => handleToggleViewLayout('GRAPH')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs ${
                viewLayout === 'GRAPH'
                  ? theme === 'dark'
                    ? 'bg-zinc-800 text-cyan-300 font-bold border border-zinc-700 shadow-xs'
                    : 'bg-white text-blue-700 font-bold border border-slate-200 shadow-xs'
                  : 'opacity-65 hover:opacity-100'
              }`}
              title={isPT ? 'Topologia de Rede' : 'System Graph'}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{isPT ? 'Grafo' : 'Graph'}</span>
            </button>
            <button
              onClick={() => handleToggleViewLayout('TIMELINE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs ${
                viewLayout === 'TIMELINE'
                  ? theme === 'dark'
                    ? 'bg-zinc-800 text-cyan-300 font-bold border border-zinc-700 shadow-xs'
                    : 'bg-white text-blue-700 font-bold border border-slate-200 shadow-xs'
                  : 'opacity-65 hover:opacity-100'
              }`}
              title={isPT ? 'Linha do Tempo' : 'Timeline'}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{isPT ? 'Timeline' : 'Timeline'}</span>
            </button>
          </div>

          {/* Download CV */}
          <button
            onClick={() => {
              onOpenResume();
              play('click');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-semibold border transition-colors shrink-0 shadow-2xs ${
              theme === 'dark'
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 opacity-70" />
            <span>CV</span>
          </button>

          {/* Handshake Contact CTA */}
          <button
            onClick={() => {
              onOpenContact();
              play('click');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xs transition-colors shrink-0"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{isPT ? 'CONTATAR' : 'HANDSHAKE'}</span>
          </button>

          {/* Seletor de Idioma */}
          <div
            data-testid="language-switcher"
            className={`flex items-center p-1 rounded-lg border text-xs font-mono shrink-0 ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <button
              data-testid="language-toggle-pt"
              onClick={() => handleToggleLanguage('PT')}
              className={`px-2 py-1 rounded-md font-bold transition-all ${
                language === 'PT'
                  ? theme === 'dark' ? 'bg-zinc-800 text-cyan-400 shadow-2xs' : 'bg-white text-blue-700 shadow-2xs'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              PT
            </button>
            <button
              data-testid="language-toggle-en"
              onClick={() => handleToggleLanguage('EN')}
              className={`px-2 py-1 rounded-md font-bold transition-all ${
                language === 'EN'
                  ? theme === 'dark' ? 'bg-zinc-800 text-cyan-400 shadow-2xs' : 'bg-white text-blue-700 shadow-2xs'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              EN
            </button>
          </div>

          {/* Alternador de Tema */}
          <button
            data-testid="theme-toggle"
            onClick={handleToggleTheme}
            className={`p-2.5 rounded-lg border transition-colors shrink-0 shadow-2xs ${
              theme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE: HEADER CONFORTÁVEL DE 64px (h-16)                                 */}
      {/* ========================================================================= */}
      <div className="w-full px-4 h-16 flex md:hidden items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-slate-300 dark:border-zinc-700 shrink-0 shadow-xs">
            <img
              src={THALES_AVATAR_BASE64}
              alt="Thales Reis"
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
          </div>
          <div className="min-w-0">
            <span className="font-mono font-bold text-xs sm:text-sm tracking-tight block truncate">
              THALES REIS
            </span>
            <div className="text-[10px] font-sans opacity-60 leading-tight flex flex-wrap items-baseline gap-x-1">
              <span className="whitespace-nowrap">
                {isPT ? 'Engenheiro de Software Staff' : 'Staff Software Engineer'}
              </span>
              <span className="whitespace-nowrap flex items-baseline gap-0.5">
                <span className="opacity-40">&</span>
                <span>{isPT ? 'Arquiteto de Sistemas' : 'System Architect'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              onOpenContact();
              play('click');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{isPT ? 'CONTATO' : 'HANDSHAKE'}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
            aria-label="Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gaveta Mobile Suspensa */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 py-3.5 space-y-3 font-mono text-xs ${
            theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {/* Busca no Mobile */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => updateState({ searchTerm: e.target.value })}
              placeholder={isPT ? 'Buscar tecnologia, cargo...' : 'Search stack, feat, role...'}
              className={`w-full pl-9 pr-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Lentes no Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {allLenses.map((lensKey) => (
              <button
                key={lensKey}
                onClick={() => {
                  handleSelectLens(lensKey);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border ${
                  profileLens === lensKey
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    : 'bg-white border-slate-300 text-slate-600'
                }`}
              >
                {isPT ? PROFILE_LENSES_CONFIG[lensKey].shortLabelPT : PROFILE_LENSES_CONFIG[lensKey].shortLabelEN}
              </button>
            ))}
          </div>

          {/* Ações e Utilitários no Mobile */}
          <div className="flex items-center justify-between pt-2 border-t dark:border-zinc-800/80 border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleToggleViewLayout(viewLayout === 'GRAPH' ? 'TIMELINE' : 'GRAPH');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
              >
                {viewLayout === 'GRAPH' ? <List className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                <span>{viewLayout === 'GRAPH' ? (isPT ? 'Ver Linha do Tempo' : 'View Timeline') : (isPT ? 'Ver Grafo' : 'View Graph')}</span>
              </button>
              <PWAInstallButton language={language} theme={theme} />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleLanguage(language === 'PT' ? 'EN' : 'PT')}
                className="px-2.5 py-1 rounded-md border text-xs font-bold"
              >
                {language === 'PT' ? 'EN' : 'PT'}
              </button>
              <button
                onClick={handleToggleTheme}
                className="p-1.5 rounded-md border"
                aria-label="Tema"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
              </button>
              <button
                onClick={() => {
                  onOpenResume();
                  setMobileMenuOpen(false);
                }}
                className="text-blue-600 dark:text-cyan-400 underline font-bold text-xs"
              >
                {isPT ? 'Baixar CV' : 'Resume'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};