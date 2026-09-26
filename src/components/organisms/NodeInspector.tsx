import React, { useState } from 'react';
import {
  X,
  Zap,
  TrendingUp,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { SystemState, MetricHighlight } from '../../types';
import { CURRICULUM_NODES } from '../../data/curriculumData';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { t, getNodeContent } from '../../i18n/translations';

interface NodeInspectorProps {
  nodeId: string | null;
  onClose: () => void;
  systemState: SystemState;
  updateState: (updates: Partial<SystemState>) => void;
  onSelectNode: (id: string) => void;
  onOpenContact: () => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  nodeId,
  onClose,
  systemState,
  updateState,
  onSelectNode,
  onOpenContact,
}) => {
  if (!nodeId) return null;

  const node = CURRICULUM_NODES.find((n) => n.id === nodeId);
  if (!node) return null;

  const {
    isLatencyOptimized,
    isPurgeExecuted,
    isSyncActive,
    soundEnabled,
    language,
    theme,
  } = systemState;

  const { play } = useSoundEffects(soundEnabled);
  const [activeTab, setActiveTab] = useState<'architecture' | 'logs'>('architecture');

  const currentIndex = CURRICULUM_NODES.findIndex((n) => n.id === nodeId);
  const prevNode = CURRICULUM_NODES[(currentIndex - 1 + CURRICULUM_NODES.length) % CURRICULUM_NODES.length];
  const nextNode = CURRICULUM_NODES[(currentIndex + 1) % CURRICULUM_NODES.length];

  const handleAction = () => {
    if (node.id === 'LATENCY_OPTIMIZER') {
      const next = !isLatencyOptimized;
      updateState({ isLatencyOptimized: next });
      play(next ? 'success' : 'toggle');
    } else if (node.id === 'DATA_PURGE_NODE') {
      const next = !isPurgeExecuted;
      updateState({ isPurgeExecuted: next });
      play(next ? 'purge' : 'toggle');
    } else if (node.id === 'SYNC_GATEWAY') {
      const next = !isSyncActive;
      updateState({ isSyncActive: next });
      play(next ? 'blip' : 'toggle');
    }
  };

  const content = getNodeContent(node, language);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="flex-1" onClick={onClose} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="node-inspector-title"
        className={`w-full max-w-xl h-full flex flex-col shadow-2xl border-l relative overflow-hidden transition-colors ${
          theme === 'dark' ? 'bg-[#09090b] border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div
          className={`flex items-center justify-between px-5 py-3 border-b ${
            theme === 'dark' ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-xs font-bold">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[11px]">
              {node.number}
            </span>
            <span className="opacity-70">{node.layer}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectNode(prevNode.id)}
              className="p-1.5 rounded hover:bg-zinc-800/40 text-zinc-400"
              title={t(language, 'inspector.prevNode')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectNode(nextNode.id)}
              className="p-1.5 rounded hover:bg-zinc-800/40 text-zinc-400"
              title={t(language, 'inspector.nextNode')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded ml-2 hover:bg-zinc-800/40 text-zinc-400 hover:text-white"
              title={t(language, 'inspector.closeEsc')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 pb-3">
          <h2 id="node-inspector-title" className="text-xl font-sans font-bold tracking-tight">{content.shortTitle}</h2>
          <div className="flex items-center gap-4 mt-2 text-xs font-mono opacity-75 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-cyan-400">
              <Building2 className="w-3.5 h-3.5" />
              {node.company}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 opacity-60" />
              {node.period}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 opacity-60" />
              {node.location}
            </span>
          </div>
          <div className="text-xs font-sans opacity-70 mt-1">{content.role}</div>
        </div>

        <div className="px-5 pb-3">
          <div
            className={`p-3.5 rounded-lg border text-xs sm:text-sm font-sans leading-relaxed ${
              theme === 'dark'
                ? 'bg-zinc-900/60 border-zinc-800 text-zinc-200'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <div className="font-mono font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1 text-blue-600 dark:text-cyan-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t(language, 'inspector.roiTitle')}</span>
            </div>
            <p>{content.businessValue}</p>
          </div>
        </div>

        <div
          className={`flex border-b px-5 text-xs font-mono ${
            theme === 'dark' ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'architecture'
                ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            {t(language, 'inspector.tabArchitecture')}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            {t(language, 'inspector.tabLogs')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {node.interactiveAction && (
            <div
              className={`p-3.5 rounded-lg border ${
                theme === 'dark' ? 'bg-zinc-900/80 border-zinc-700' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {t(language, 'inspector.simulationTitle')}
                </span>
              </div>
              <p className="text-xs font-sans opacity-80 mt-1">
                {content.interactiveActionDescription}
              </p>
              <button
                onClick={handleAction}
                className={`mt-2.5 w-full py-2 px-3 rounded font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                  (node.id === 'LATENCY_OPTIMIZER' && isLatencyOptimized) ||
                  (node.id === 'DATA_PURGE_NODE' && isPurgeExecuted) ||
                  (node.id === 'SYNC_GATEWAY' && isSyncActive)
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{content.interactiveActionLabel}</span>
              </button>
            </div>
          )}

          {activeTab === 'architecture' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {content.metricDetails.map((m: MetricHighlight, idx: number) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded border font-mono text-xs ${
                      theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-[10px] opacity-60 uppercase">{m.label}</div>
                    <div className="text-sm font-bold mt-0.5 text-blue-600 dark:text-cyan-400">{m.value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-sans leading-relaxed">
                <div>
                  <h4 className="font-mono font-bold text-xs uppercase opacity-70 mb-1">
                    {t(language, 'inspector.bottleneckTitle')}
                  </h4>
                  <p className="opacity-90">{content.contextProblem}</p>
                </div>

                <div>
                  <h4 className="font-mono font-bold text-xs uppercase opacity-70 mb-1">
                    {t(language, 'inspector.solutionTitle')}
                  </h4>
                  <p className="opacity-90">{content.architecturalSolution}</p>
                </div>

                <div
                  className={`p-3 rounded-lg border italic ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="font-mono font-bold not-italic block text-[11px] mb-1 text-blue-600 dark:text-cyan-400">
                    {t(language, 'inspector.principleTitle')}
                  </span>
                  &ldquo;{content.engineeringLesson}&rdquo;
                </div>
              </div>

              <div>
                <h4 className="font-mono font-bold text-xs uppercase opacity-70 mb-2">
                  {t(language, 'inspector.techStack')}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {node.technologies.map((techItem, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs font-mono border dark:bg-zinc-900 dark:border-zinc-800 bg-slate-100 border-slate-200"
                    >
                      {techItem}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-2">
              <div className="text-[10px] text-zinc-500 mb-2">// TELEMETRY_STREAM: {node.id}</div>
              <div>[00:00:01] CLUSTER_STATE: Active Invariants Verified (ACID OK)</div>
              <div>[00:00:02] THROUGHPUT: {content.metricHighlight}</div>
              <div>[00:00:03] FAILOVER: Circuit Breaker nominal with sub-second health checks</div>
            </div>
          )}
        </div>

        <div
          className={`p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] border-t flex items-center justify-between gap-3 ${
            theme === 'dark' ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded font-mono text-xs font-semibold opacity-70 hover:opacity-100"
          >
            {t(language, 'inspector.close')}
          </button>
          <button
            onClick={() => {
              onOpenContact();
              play('click');
            }}
            className="header-btn-primary h-8! px-3! text-xs"
          >
            {t(language, 'inspector.connect')}
          </button>
        </div>
      </aside>
    </div>
  );
};
