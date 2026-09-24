/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SystemState } from './types';
import { ControlPanel } from './components/ControlPanel';
import { SystemCanvas } from './components/SystemCanvas';
import { ExecutiveTimelineView } from './components/ExecutiveTimelineView';
import { NodeInspector } from './components/NodeInspector';
import { CLIOverlay } from './components/CLIOverlay';
import { HandshakeModal } from './components/HandshakeModal';
import { RawResumeModal } from './components/RawResumeModal';
import { FooterBar } from './components/FooterBar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { CURRICULUM_NODES } from './data/curriculumData';

export default function App() {
  const [systemState, setSystemState] = useState<SystemState>(() => {
    const isBrowserPT =
      typeof navigator !== 'undefined' &&
      (navigator.language.startsWith('pt') || navigator.languages?.some((l) => l.startsWith('pt')));

    // Mobile-first UX: screens under 768px default to TIMELINE layout for optimal thumb ergonomics
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
      language: isBrowserPT ? 'PT' : 'EN',
      theme: 'dark',
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

  const updateState = useCallback((updates: Partial<SystemState>) => {
    setSystemState((prev) => {
      const next = { ...prev, ...updates };
      if (updates.theme && typeof document !== 'undefined') {
        if (updates.theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      }
      return next;
    });
  }, []);

  // Sync initial theme
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (systemState.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  }, [systemState.theme]);

  // Global Keyboard Shortcuts (Ctrl+K or Cmd+K for CLI, ESC for drawers/modals)
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
      <OfflineIndicator language={systemState.language} theme={systemState.theme} />

      {/* Unified Executive Header */}
      <ControlPanel
        systemState={systemState}
        updateState={updateState}
        onOpenCLI={() => setIsCLIOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Core Architectural Presentation */}
      <main className="flex-1 relative flex flex-col">
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

      {/* Inspector Drawer */}
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

      {/* Cybernetic CLI Overlay */}
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

      {/* Handshake & Hiring Modal */}
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

      {/* Clean ATS Resume Modal */}
      <RawResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        soundEnabled={systemState.soundEnabled}
        language={systemState.language}
        theme={systemState.theme}
      />

      {/* Discrete Status Bar */}
      <FooterBar
        systemState={systemState}
        updateState={updateState}
        onOpenCLI={() => setIsCLIOpen(true)}
      />
    </div>
  );
}