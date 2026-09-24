/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SystemState, AppTheme } from './types';
import { ControlPanel } from './components/organisms/ControlPanel';
import { SystemCanvas } from './components/templates/SystemCanvas';
import { ExecutiveTimelineView } from './components/templates/ExecutiveTimelineView';
import { NodeInspector } from './components/organisms/NodeInspector';
import { CLIOverlay } from './components/organisms/CLIOverlay';
import { HandshakeModal } from './components/organisms/HandshakeModal';
import { RawResumeModal } from './components/organisms/RawResumeModal';
import { FooterBar } from './components/organisms/FooterBar';
import { OfflineIndicator } from './components/atoms/OfflineIndicator';
import { PWAInstallPrompt } from './components/organisms/PWAInstallPrompt';

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
import { detectLocalLanguage, resolveCountryToLanguage, BCP47_TAGS } from './utils/geoLanguageUtils';

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
      failureInjected: false,
      recoveredCount: 0,
      soundEnabled: true,
      language: detectLocalLanguage(), // PT para lusófonos, ES para hispanófonos, FR para francófonos, EN padrão
      theme: getInitialTheme(),
      profileLens: 'ALL',
      viewLayout: isMobileScreen ? 'TIMELINE' : 'GRAPH',
      onboardingDismissed: true,
      searchTerm: '',
      selectedTag: null,
    };
  });

  const [isCLIOpen, setIsCLIOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Verificação em segundo plano por IP com AbortController
  useEffect(() => {
    const controller = new AbortController();

    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('geo') || params.get('country') || params.get('lang')) return;

      const prefs = getStoredPreferences();
      if (prefs.language) return;

      fetch('https://api.country.is/', { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.country) {
            const detected = resolveCountryToLanguage(data.country);
            setSystemState((prev) => 
              prev.language !== detected ? { ...prev, language: detected } : prev
            );
          }
        })
        .catch(() => {});
    } catch (e) {}

    return () => controller.abort();
  }, []);

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
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCLIOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isCLIOpen) setIsCLIOpen(false);
        else if (isContactOpen) setIsContactOpen(false);
        else if (isResumeOpen) setIsResumeOpen(false);
        else if (systemState.activeNodeId) updateState({ activeNodeId: null });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCLIOpen, isContactOpen, isResumeOpen, systemState.activeNodeId, updateState]);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300 antialiased overflow-x-hidden transition-colors ${
        systemState.theme === 'dark' ? 'bg-[#09090b] text-zinc-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-mono focus:text-xs focus:rounded-md focus:shadow-xl focus:outline-hidden"
      >
        {systemState.language === 'PT' ? 'Pular para o conteúdo principal' : systemState.language === 'ES' ? 'Saltar al contenido principal' : systemState.language === 'FR' ? 'Passer au contenu principal' : 'Skip to main content'}
      </a>

      <OfflineIndicator language={systemState.language} theme={systemState.theme} />
      <PWAInstallPrompt language={systemState.language} theme={systemState.theme} />

      <ControlPanel
        systemState={systemState}
        updateState={updateState}
        onOpenCLI={() => setIsCLIOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 relative flex flex-col focus:outline-hidden">
        {systemState.viewLayout === 'GRAPH' ? (
          <SystemCanvas
            systemState={systemState}
            updateState={updateState}
            onSelectNode={(nodeId) => updateState({ activeNodeId: nodeId })}
          />
        ) : (
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
        )}
      </main>

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

      <CLIOverlay
        isOpen={isCLIOpen}
        onClose={() => setIsCLIOpen(false)}
        systemState={systemState}
        updateState={updateState}
        onOpenContact={() => {
          setIsCLIOpen(false);
          setIsContactOpen(true);
        }}
        onOpenResume={() => {
          setIsCLIOpen(false);
          setIsResumeOpen(true);
        }}
      />

      <HandshakeModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onOpenResume={() => {
          setIsContactOpen(false);
          setIsResumeOpen(true);
        }}
        soundEnabled={systemState.soundEnabled}
        language={systemState.language}
        theme={systemState.theme}
      />

      <RawResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        soundEnabled={systemState.soundEnabled}
        language={systemState.language}
        theme={systemState.theme}
      />

      <FooterBar
        systemState={systemState}
        updateState={updateState}
        onOpenCLI={() => setIsCLIOpen(true)}
      />
    </div>
  );
}
