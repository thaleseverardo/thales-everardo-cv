/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { SystemState, AppTheme } from './types';
import { ControlPanel } from './components/organisms/ControlPanel';
import { SidebarNavigation } from './components/organisms/SidebarNavigation';
import { NodeInspector } from './components/organisms/NodeInspector';
import { FooterBar } from './components/organisms/FooterBar';
import { OfflineIndicator } from './components/atoms/OfflineIndicator';

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

const ViewFallbackSkeleton: React.FC<{ theme: AppTheme }> = ({ theme }) => (
  <div
    className={`w-full h-full flex-1 flex flex-col items-center justify-center p-8 animate-pulse ${
      theme === 'dark' ? 'bg-[#09090b]' : 'bg-slate-50'
    }`}
  >
    <div className="w-9 h-9 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
    <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 dark:text-zinc-400">
      CARREGANDO ARQUITETURA...
    </span>
  </div>
);

function applyThemeDOM(theme: AppTheme) {
  if (typeof document === 'undefined') return;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
}
import { CURRICULUM_NODES } from './data/curriculumData';
import { getStoredPreferences, updateStoredPreferences } from './utils/storageUtils';
import { detectLocalLanguage, BCP47_TAGS } from './utils/geoLanguageUtils';
import { t } from './i18n/translations';

function getInitialTheme(): AppTheme {
  if (typeof window === 'undefined') return 'light';
  try {
    const prefs = getStoredPreferences();
    if (prefs.theme === 'dark' || prefs.theme === 'light') {
      return prefs.theme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (e) {}
  return 'light';
}

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
      language: detectLocalLanguage(), // PT para lusófonos, ES para hispanófonos, FR para francófonos, EN padrão
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
    setSystemState((prev) => {
      const next = { ...prev, ...updates };

      if (updates.language) {
        updateStoredPreferences({ language: updates.language });
      }

      if (updates.theme) {
        updateStoredPreferences({ theme: updates.theme });
        applyThemeDOM(updates.theme);
      }

      return next;
    });
  }, []);

  // Sincroniza a tag BCP 47 no HTML (pt-BR, es-ES, fr-FR, en-US)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = BCP47_TAGS[systemState.language] || 'en-US';
    }
  }, [systemState.language]);

  useEffect(() => {
    applyThemeDOM(systemState.theme);
  }, [systemState.theme]);

  // Global Keyboard Shortcuts (Ctrl+K para CLI, ESC para modais)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isContactOpen) setIsContactOpen(false);
        else if (systemState.activeNodeId) updateState({ activeNodeId: null });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isContactOpen, systemState.activeNodeId, updateState]);

  return (
    <div
      className={`min-h-[100dvh] flex flex-col font-sans selection:bg-cyan-500/25 selection:text-cyan-300 antialiased transition-colors ${
        systemState.theme === 'dark' ? 'bg-[#09090b] text-zinc-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-mono focus:text-xs focus:rounded-md focus:shadow-xl focus:outline-hidden"
      >
        {t(systemState.language, 'nav.skipContent')}
      </a>

      <OfflineIndicator language={systemState.language} theme={systemState.theme} />

      <ControlPanel
        systemState={systemState}
        updateState={updateState}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* ÁREA MESTRE: MENU LATERAL COM OVERLAY + CONTEÚDO */}
      <div className="flex-1 flex relative">
        <SidebarNavigation
          viewLayout={systemState.viewLayout}
          onSelectView={(layout) => updateState({ viewLayout: layout })}
          language={systemState.language}
          theme={systemState.theme}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 w-full min-w-0 pl-14 sm:pl-16 relative flex flex-col focus:outline-hidden"
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

      <FooterBar
        systemState={systemState}
        updateState={updateState}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />
    </div>
  );
}
