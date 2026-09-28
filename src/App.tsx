import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { SystemState, AppTheme } from './types';
import { ControlPanel } from './components/organisms/ControlPanel';
import { ViewFilterToolbar } from './components/molecules/ViewFilterToolbar';
import { SidebarNavigation } from './components/organisms/SidebarNavigation';
import { NodeInspector } from './components/organisms/NodeInspector';
import { FooterBar } from './components/organisms/FooterBar';
import { OfflineIndicator } from './components/atoms/OfflineIndicator';
import { CURRICULUM_NODES } from './data/curriculumData';
import { getStoredPreferences, updateStoredPreferences } from './utils/storageUtils';
import { detectLocalLanguage, BCP47_TAGS } from './utils/geoLanguageUtils';
import { t } from './i18n/translations';

const SystemCanvas = lazy(() =>
  import('./components/templates/SystemCanvas').then((m) => ({ default: m.SystemCanvas }))
);
const ExecutiveTimelineView = lazy(() =>
  import('./components/templates/ExecutiveTimelineView').then((m) => ({ default: m.ExecutiveTimelineView }))
);
const ResumeView = lazy(() =>
  import('./components/templates/ResumeView').then((m) => ({ default: m.ResumeView }))
);
const ContactAuthModal = lazy(() =>
  import('./components/organisms/ContactAuthModal').then((m) => ({ default: m.ContactAuthModal }))
);
const PrivacyPolicyModal = lazy(() =>
  import('./components/organisms/PrivacyPolicyModal').then((m) => ({ default: m.PrivacyPolicyModal }))
);

function applyThemeDOM(theme: AppTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Supressão atômica de transições assíncronas no milissegundo do re-skinning (padrão Vercel / next-themes)
  const style = document.createElement('style');
  style.appendChild(
    document.createTextNode(
      '*, *::before, *::after { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; -ms-transition: none !important; transition: none !important; }'
    )
  );
  document.head.appendChild(style);

  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }

  // Força cálculo de estilo síncrono no mesmo frame
  window.getComputedStyle(style).opacity;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    });
  });
}

function getInitialTheme(): AppTheme {
  if (typeof window === 'undefined') return 'light';
  try {
    const prefs = getStoredPreferences();
    if (prefs.theme === 'dark' || prefs.theme === 'light') return prefs.theme;
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch {}
  return 'light';
}

const ViewFallbackSkeleton: React.FC<{ theme: AppTheme }> = ({ theme }) => (
  <div
    className={`w-full h-full flex-1 flex flex-col items-center justify-center p-8 animate-pulse ${
      theme === 'dark' ? 'bg-[#09090b]' : 'bg-zinc-100/70'
    }`}
  >
    <div className="w-9 h-9 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
    <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 dark:text-zinc-400">
      CARREGANDO ARQUITETURA...
    </span>
  </div>
);

export default function App() {
  const [systemState, setSystemState] = useState<SystemState>(() => {
    const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768;

    return {
      mode: 'DIGITAL_ARCHITECTURE',
      rps: 10000,
      isLatencyOptimized: true,
      isPurgeExecuted: true,
      isSyncActive: true,
      activeNodeId: null,
      systemHealth: 'HEALTHY',
      language: detectLocalLanguage(),
      theme: getInitialTheme(),
      profileLens: 'ALL',
      viewLayout: isMobileScreen ? 'TIMELINE' : 'GRAPH',
      onboardingDismissed: true,
      searchTerm: '',
      selectedTag: null,
    };
  });

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const updateState = useCallback((updates: Partial<SystemState>) => {
    if (updates.theme) {
      updateStoredPreferences({ theme: updates.theme });
      applyThemeDOM(updates.theme);
    }
    if (updates.language) {
      updateStoredPreferences({ language: updates.language });
    }
    setSystemState((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = BCP47_TAGS[systemState.language] || 'en-US';
    }
  }, [systemState.language]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isContactOpen) setIsContactOpen(false);
        else if (isPrivacyOpen) setIsPrivacyOpen(false);
        else if (systemState.activeNodeId) updateState({ activeNodeId: null });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isContactOpen, isPrivacyOpen, systemState.activeNodeId, updateState]);

  return (
    <div
      className={`h-dvh w-full flex flex-col font-sans antialiased overflow-hidden ${
        systemState.theme === 'dark' ? 'bg-[#09090b] text-zinc-100' : 'bg-zinc-100/70 text-zinc-900'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-mono focus:text-xs focus:rounded-md focus:shadow-xl focus:outline-hidden"
      >
        {t(systemState.language, 'nav.skipContent')}
      </a>

      <OfflineIndicator language={systemState.language} theme={systemState.theme} />

      {/* HEADER FIXO DO APP SHELL */}
      <div className="shrink-0">
        <ControlPanel
          systemState={systemState}
          updateState={updateState}
          onOpenContact={() => setIsContactOpen(true)}
        />
      </div>

      {/* ÁREA CENTRAL DO APP SHELL: SIDEBAR À ESQUERDA + PAINEL COM SCROLL PRÓPRIO À DIREITA */}
      <div className="flex-1 flex min-h-0 w-full overflow-hidden relative">
        <SidebarNavigation
          viewLayout={systemState.viewLayout}
          onSelectView={(layout) => updateState({ viewLayout: layout })}
          language={systemState.language}
          theme={systemState.theme}
          onOpenContact={() => setIsContactOpen(true)}
        />

        {/* CONTAINER COM SCROLL INTERNO DEDICADO (SEM NENHUM SCROLL HORIZONTAL DA JANELA) */}
        <div
          id="main-scroll-container"
          className={`flex-1 min-w-0 h-full flex flex-col relative pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-0 ${
            systemState.viewLayout === 'GRAPH'
              ? 'overflow-hidden'
              : 'overflow-y-auto overflow-x-hidden'
          }`}
        >
          {/* BARRA DE FILTROS NA ÁREA AZUL (À DIREITA DA SIDEBAR, NUNCA INVADINDO A ÁREA VERDE) */}
          {systemState.viewLayout !== 'RESUME' && (
            <ViewFilterToolbar
              systemState={systemState}
              updateState={updateState}
            />
          )}

          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 min-w-0 flex flex-col focus:outline-hidden"
          >
            <Suspense fallback={<ViewFallbackSkeleton theme={systemState.theme} />}>
              {systemState.viewLayout === 'GRAPH' ? (
                <SystemCanvas
                  systemState={systemState}
                  updateState={updateState}
                  onSelectNode={(nodeId) => updateState({ activeNodeId: nodeId })}
                />
              ) : systemState.viewLayout === 'TIMELINE' ? (
                <ExecutiveTimelineView
                  nodes={CURRICULUM_NODES}
                  onSelectNode={(nodeId) => updateState({ activeNodeId: nodeId })}
                  language={systemState.language}
                  theme={systemState.theme}
                  profileLens={systemState.profileLens}
                  searchTerm={systemState.searchTerm}
                  selectedTag={systemState.selectedTag}
                  onClearFilter={() => updateState({ searchTerm: '', profileLens: 'ALL', selectedTag: null })}
                />
              ) : (
                <ResumeView
                  language={systemState.language}
                  theme={systemState.theme}
                  onOpenContact={() => setIsContactOpen(true)}
                  onOpenPrivacy={() => setIsPrivacyOpen(true)}
                />
              )}
            </Suspense>
          </main>

          <FooterBar
            systemState={systemState}
            updateState={updateState}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        </div>
      </div>

      <NodeInspector
        nodeId={systemState.activeNodeId}
        onClose={() => updateState({ activeNodeId: null })}
        systemState={systemState}
        updateState={updateState}
        onSelectNode={(id) => updateState({ activeNodeId: id })}
        onOpenContact={() => {
          updateState({ activeNodeId: null });
          setIsContactOpen(true);
        }}
      />

      {isContactOpen && (
        <Suspense fallback={null}>
          <ContactAuthModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
            language={systemState.language}
            theme={systemState.theme}
          />
        </Suspense>
      )}

      {isPrivacyOpen && (
        <Suspense fallback={null}>
          <PrivacyPolicyModal
            isOpen={isPrivacyOpen}
            onClose={() => setIsPrivacyOpen(false)}
            language={systemState.language}
            theme={systemState.theme}
          />
        </Suspense>
      )}
    </div>
  );
}
