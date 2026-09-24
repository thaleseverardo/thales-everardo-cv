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
  Terminal,
  Shield,
  Layers,
} from 'lucide-react';
import { SystemState } from '../types';
import { CURRICULUM_NODES, PROFILE_LENSES_CONFIG } from '../data/curriculumData';
import { useSoundEffects } from '../hooks/useSoundEffects';

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
  const isPT = language === 'PT';
  const trans = isPT ? node.pt : null;

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

  const shortTitle = trans ? trans.shortTitle : node.shortTitle;
  const role = trans ? trans.role : node.role;
  const businessValue = trans ? trans.businessValue : node.businessValue;
  const engineeringFeat = trans ? trans.engineeringFeat : node.engineeringFeat;
  const contextProblem = trans ? trans.contextProblem : node.contextProblem;
  const architecturalSolution = trans ? trans.architecturalSolution : node.architecturalSolution;
  const engineeringLesson = trans ? trans.engineeringLesson : node.engineeringLesson;
  const metricDetails = trans ? trans.metricDetails : node.metricDetails;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="flex-1" onClick={onClose} />

      <aside
        className={`w-full max-w-xl h-full flex flex-col shadow-2xl border-l relative overflow-hidden transition-colors ${
          theme === 'dark' ? 'bg-[#09090b] border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header Toolbar */}
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
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectNode(nextNode.id)}
              className="p-1.5 rounded hover:bg-zinc-800/40 text-zinc-400"
              title="Próximo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded ml-2 hover:bg-zinc-800/40 text-zinc-400 hover:text-white"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Node Identity */}
        <div className="p-5 pb-3">
          <h2 className="text-xl font-sans font-bold tracking-tight">{shortTitle}</h2>
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
          <div className="text-xs font-sans opacity-70 mt-1">{role}</div>
        </div>

        {/* Business ROI Callout */}
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
              <span>{isPT ? 'Retorno Comercial (ROI):' : 'Executive Business ROI:'}</span>
            </div>
            <p>{businessValue}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
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
            {isPT ? 'ARQUITETURA & DESAFIO' : 'ARCHITECTURE & FEAT'}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            {isPT ? 'LOGS EM TEMPO REAL' : 'SYSTEM TRACE'}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Interactive Simulation Switch inside Drawer */}
          {node.interactiveAction && (
            <div
              className={`p-3.5 rounded-lg border ${
                theme === 'dark' ? 'bg-zinc-900/80 border-zinc-700' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {isPT ? 'Simulação de Produção' : 'Interactive Production Toggle'}
                </span>
              </div>
              <p className="text-xs font-sans opacity-80 mt-1">
                {isPT && trans?.interactiveActionDescription
                  ? trans.interactiveActionDescription
                  : node.interactiveAction.description}
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
                <span>
                  {isPT && trans?.interactiveActionLabel
                    ? trans.interactiveActionLabel
                    : node.interactiveAction.label}
                </span>
              </button>
            </div>
          )}

          {activeTab === 'architecture' ? (
            <>
              {/* Hard Metrics Grid */}
              <div className="grid grid-cols-3 gap-2">
                {metricDetails.map((m, idx) => (
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

              {/* The Bottleneck vs Solution */}
              <div className="space-y-3 text-xs sm:text-sm font-sans leading-relaxed">
                <div>
                  <h4 className="font-mono font-bold text-xs uppercase opacity-70 mb-1">
                    {isPT ? 'O Gargalo / Desafio:' : 'The Bottleneck:'}
                  </h4>
                  <p className="opacity-90">{contextProblem}</p>
                </div>

                <div>
                  <h4 className="font-mono font-bold text-xs uppercase opacity-70 mb-1">
                    {isPT ? 'Solução Arquitetural Aplicada:' : 'Architectural Intervention:'}
                  </h4>
                  <p className="opacity-90">{architecturalSolution}</p>
                </div>

                <div
                  className={`p-3 rounded-lg border italic ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="font-mono font-bold not-italic block text-[11px] mb-1 text-blue-600 dark:text-cyan-400">
                    {isPT ? 'PRINCÍPIO DE ENGENHARIA:' : 'ENGINEERING PRINCIPLE:'}
                  </span>
                  &ldquo;{engineeringLesson}&rdquo;
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="font-mono font-bold text-xs uppercase opacity-70 mb-2">
                  {isPT ? 'Stack Técnica:' : 'Tech Stack:'}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {node.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs font-mono border dark:bg-zinc-900 dark:border-zinc-800 bg-slate-100 border-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* System Log Trace */
            <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-2">
              <div className="text-[10px] text-zinc-500 mb-2">// TELEMETRY_STREAM: {node.id}</div>
              <div>[00:00:01] CLUSTER_STATE: Active Invariants Verified (ACID OK)</div>
              <div>[00:00:02] THROUGHPUT: {node.metricHighlight}</div>
              <div>[00:00:03] FAILOVER: Circuit Breaker nominal with sub-second health checks</div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className={`p-4 border-t flex items-center justify-between gap-3 ${
            theme === 'dark' ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded font-mono text-xs font-semibold opacity-70 hover:opacity-100"
          >
            {isPT ? 'FECHAR' : 'CLOSE'}
          </button>
          <button
            onClick={() => {
              onOpenContact();
              play('click');
            }}
            className="px-4 py-1.5 rounded text-white text-xs font-mono font-bold bg-blue-600 hover:bg-blue-500 transition-colors shadow-xs"
          >
            {isPT ? 'FALAR COM O THALES' : 'CONNECT WITH THALES'}
          </button>
        </div>
      </aside>
    </div>
  );
};