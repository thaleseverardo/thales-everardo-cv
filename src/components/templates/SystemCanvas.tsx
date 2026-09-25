import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  ArrowRight,
  Database,
  Radio,
  Cpu,
  Shield,
  Hexagon,
} from 'lucide-react';
import { SystemState, NodeVisualShape } from '../../types';
import { CURRICULUM_NODES } from '../../data/curriculumData';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { isNodeActiveInFilter } from '../../utils/filterUtils';

interface SystemCanvasProps {
  systemState: SystemState;
  updateState: (updates: Partial<SystemState>) => void;
  onSelectNode: (nodeId: string) => void;
}

export const SystemCanvas: React.FC<SystemCanvasProps> = ({
  systemState,
  updateState,
  onSelectNode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 700 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const {
    mode,
    isLatencyOptimized,
    isPurgeExecuted,
    isSyncActive,
    activeNodeId,
    failureInjected,
    soundEnabled,
    language,
    theme,
    profileLens,
    searchTerm,
    selectedTag,
  } = systemState;

  const { play } = useSoundEffects(soundEnabled);
  const isPT = language === 'PT';

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth || 1000;
        const isMobile = clientWidth < 768;
        const clientHeight = isMobile
          ? 110 + CURRICULUM_NODES.length * 185
          : Math.max(containerRef.current.clientHeight || 650, 560);

        setContainerSize({
          width: clientWidth,
          height: clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmallScreen = containerSize.width < 768;

  const nodeCoordinates = useMemo(() => {
    const coords: Record<string, { x: number; y: number }> = {};

    if (isSmallScreen) {
      const centerX = containerSize.width / 2;
      CURRICULUM_NODES.forEach((node, idx) => {
        coords[node.id] = {
          x: centerX,
          y: 95 + idx * 180,
        };
      });
      return coords;
    }

    const paddingX = 140;
    const paddingY = 100;
    const usableW = Math.max(containerSize.width - paddingX * 2, 450);
    const usableH = Math.max(containerSize.height - paddingY * 2, 380);

    CURRICULUM_NODES.forEach((node) => {
      const pos = mode === 'PHYSICAL_OPERATIONS' ? node.position.physical : node.position.digital;
      coords[node.id] = {
        x: paddingX + (pos.x / 100) * usableW,
        y: paddingY + (pos.y / 100) * usableH,
      };
    });

    return coords;
  }, [containerSize, mode, isSmallScreen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const edges = isSmallScreen
      ? [
          { from: 'INGESTION_LAYER', to: 'LATENCY_OPTIMIZER', colorDark: '#38bdf8', colorLight: '#2563eb', width: 2.5, isPrimary: true },
          { from: 'LATENCY_OPTIMIZER', to: 'DATA_PURGE_NODE', colorDark: '#38bdf8', colorLight: '#2563eb', width: 2.5, isPrimary: true },
          { from: 'DATA_PURGE_NODE', to: 'SYNC_GATEWAY', colorDark: '#2dd4bf', colorLight: '#0d9488', width: 2.5, isPrimary: true },
          { from: 'SYNC_GATEWAY', to: 'PHYSICAL_OPTIMIZER_NODE', colorDark: isSyncActive ? '#38bdf8' : '#71717a', colorLight: isSyncActive ? '#2563eb' : '#64748b', width: 2.5, isPrimary: true },
          { from: 'PHYSICAL_OPTIMIZER_NODE', to: 'PERSISTENCE_LAYER', colorDark: '#fbbf24', colorLight: '#d97706', width: 2.5, isPrimary: true },
        ]
      : [
          { from: 'INGESTION_LAYER', to: 'LATENCY_OPTIMIZER', colorDark: '#38bdf8', colorLight: '#2563eb', width: 2.5, isPrimary: true },
          { from: 'INGESTION_LAYER', to: 'DATA_PURGE_NODE', colorDark: isPurgeExecuted ? '#2dd4bf' : '#f43f5e', colorLight: isPurgeExecuted ? '#0d9488' : '#e11d48', width: 2, isPrimary: false },
          { from: 'LATENCY_OPTIMIZER', to: 'SYNC_GATEWAY', colorDark: '#38bdf8', colorLight: '#2563eb', width: 2.5, isPrimary: true },
          { from: 'DATA_PURGE_NODE', to: 'SYNC_GATEWAY', colorDark: '#2dd4bf', colorLight: '#0d9488', width: 2, isPrimary: false },
          { from: 'SYNC_GATEWAY', to: 'PERSISTENCE_LAYER', colorDark: isSyncActive ? '#38bdf8' : '#71717a', colorLight: isSyncActive ? '#2563eb' : '#64748b', width: 2.5, isPrimary: true },
          { from: 'PHYSICAL_OPTIMIZER_NODE', to: 'PERSISTENCE_LAYER', colorDark: '#fbbf24', colorLight: '#d97706', width: 2, isPrimary: false },
        ];

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, containerSize.width, containerSize.height);
      step += 0.015;

      const gridSize = 40;
      ctx.lineWidth = 1;
      ctx.strokeStyle = theme === 'dark' ? 'rgba(39, 39, 42, 0.35)' : 'rgba(226, 232, 240, 0.8)';
      ctx.beginPath();
      for (let x = 0; x < containerSize.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, containerSize.height);
      }
      for (let y = 0; y < containerSize.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(containerSize.width, y);
      }
      ctx.stroke();

      edges.forEach((edge) => {
        const fromPos = nodeCoordinates[edge.from];
        const toPos = nodeCoordinates[edge.to];
        if (!fromPos || !toPos) return;

        const isHovered = hoveredNodeId === edge.from || hoveredNodeId === edge.to;
        const color = theme === 'dark' ? edge.colorDark : edge.colorLight;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);

        if (isSmallScreen) {
          ctx.lineTo(toPos.x, toPos.y);
        } else {
          const midX = (fromPos.x + toPos.x) / 2;
          ctx.bezierCurveTo(midX, fromPos.y, midX, toPos.y, toPos.x, toPos.y);
        }

        if (failureInjected) {
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
        } else {
          ctx.strokeStyle = isHovered ? color : `${color}75`;
          ctx.lineWidth = isHovered ? edge.width + 1.5 : edge.width;
          if (!edge.isPrimary && !isHovered && !isSmallScreen) {
            ctx.setLineDash([3, 4]);
          }
        }
        ctx.stroke();

        if (edge.isPrimary && !failureInjected) {
          const t = (step % 1);
          let px = 0;
          let py = 0;

          if (isSmallScreen) {
            px = fromPos.x;
            py = fromPos.y + t * (toPos.y - fromPos.y);
          } else {
            const midX = (fromPos.x + toPos.x) / 2;
            const invT = 1 - t;
            px = invT * invT * invT * fromPos.x + 3 * invT * invT * t * midX + 3 * invT * t * t * midX + t * t * t * toPos.x;
            py = invT * invT * invT * fromPos.y + 3 * invT * invT * t * fromPos.y + 3 * invT * t * t * toPos.y + t * t * t * toPos.y;
          }

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [containerSize, nodeCoordinates, theme, failureInjected, isPurgeExecuted, isSyncActive, hoveredNodeId, isSmallScreen]);

  const renderShapeIcon = (shape: NodeVisualShape) => {
    switch (shape) {
      case 'STREAM_PULSE':
        return <Radio className="w-3.5 h-3.5" />;
      case 'PROCESSOR_CORE':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'DATABASE_CYLINDER':
        return <Database className="w-3.5 h-3.5" />;
      case 'GATEWAY_SHIELD':
        return <Shield className="w-3.5 h-3.5" />;
      case 'HEX_OPTIMIZER':
        return <Hexagon className="w-3.5 h-3.5" />;
    }
  };

  const matchingNodesCount = CURRICULUM_NODES.filter((n) =>
    isNodeActiveInFilter(n, profileLens, searchTerm, selectedTag, language)
  ).length;

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex-1 select-none transition-colors ${
        isSmallScreen ? 'overflow-y-auto overflow-x-hidden min-h-screen pb-16' : 'overflow-hidden'
      } ${theme === 'dark' ? 'bg-[#09090b]' : 'bg-slate-50'}`}
    >
      <canvas
        ref={canvasRef}
        width={containerSize.width}
        height={containerSize.height}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {matchingNodesCount === 0 && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center">
          <div
            className={`p-6 rounded-xl border max-w-md ${
              theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800 text-zinc-300' : 'bg-white border-slate-300 text-slate-800 shadow-lg'
            }`}
          >
            <p className="font-mono text-sm font-bold">
              {isPT ? 'Nenhum subsistema correspondente.' : 'No subsystems matching current filters.'}
            </p>
            <p className="text-xs opacity-75 mt-1 font-sans">
              {isPT
                ? `Nenhum nó foi encontrado para "${searchTerm}".`
                : `No architectural node matched "${searchTerm}".`}
            </p>
            <button
              onClick={() => updateState({ searchTerm: '', profileLens: 'ALL', selectedTag: null })}
              className="mt-4 px-3.5 py-1.5 rounded-md font-mono text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {isPT ? 'Limpar Filtros' : 'Reset Filters'}
            </button>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ minHeight: `${containerSize.height}px` }}
      >
        <h2 className="sr-only">
          {isPT ? "Mapa de Arquitetura de Subsistemas Distribuídos" : "Distributed Architecture Subsystems Map"}
        </h2>
        {CURRICULUM_NODES.map((node) => {
          const coords = nodeCoordinates[node.id];
          if (!coords) return null;

          const isMatching = isNodeActiveInFilter(node, profileLens, searchTerm, selectedTag, language);
          const isSelected = activeNodeId === node.id;
          const trans = isPT ? node.pt : null;

          const shortTitle = trans ? trans.shortTitle : node.shortTitle;
          const role = trans ? trans.role : node.role;
          const metricHighlight = trans ? trans.metricHighlight : node.metricHighlight;

          return (
            <div
              key={node.id}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`${shortTitle}, ${node.company}. ${metricHighlight}. ${isPT ? "Pressione Enter para inspecionar." : "Press Enter to inspect."}`}
              style={{
                left: `${coords.x}px`,
                top: `${coords.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              onClick={() => {
                onSelectNode(node.id);
                play('click');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectNode(node.id);
                  play('click');
                }
              }}
              className={`absolute pointer-events-auto cursor-pointer w-75 sm:w-[320px] rounded-lg border transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden ${
                !isMatching
                  ? 'opacity-25 grayscale scale-95 z-10'
                  : 'opacity-100 scale-100 z-20'
              } ${
                isSelected
                  ? 'ring-2 ring-blue-600 border-blue-600 shadow-xl'
                  : theme === 'dark'
                  ? 'bg-zinc-950/95 border-zinc-800 hover:border-zinc-700 shadow-md'
                  : 'bg-white border-slate-300 hover:border-blue-400 shadow-xs'
              }`}
            >
              <div
                className={`px-3.5 py-2 border-b flex items-center justify-between rounded-t-lg ${
                  theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-mono text-[11px] min-w-0 pr-2">
                  <span className="opacity-60">{node.number}</span>
                  <span className="opacity-30">//</span>
                  <span className="font-bold truncate text-zinc-900 dark:text-zinc-100">{node.company}</span>
                </div>
                <div className="opacity-70 shrink-0">{renderShapeIcon(node.visualShape)}</div>
              </div>

              <div className="p-3.5 space-y-2">
                <div>
                  <h3 className="font-sans font-bold text-xs sm:text-[13px] leading-snug line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {shortTitle}
                  </h3>
                  <p className="font-sans text-[11px] opacity-60 truncate mt-0.5">{role}</p>
                </div>

                <div
                  className={`px-2.5 py-1.5 rounded font-mono text-xs font-bold border leading-snug wrap-break-word ${
                    theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-cyan-300'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}
                >
                  {metricHighlight}
                </div>

                <div className="pt-2 border-t dark:border-zinc-800/80 border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="opacity-50 text-[10px] truncate max-w-42.5">
                    {node.technologies.slice(0, 2).join(' · ')}
                  </span>
                  <span className="font-bold flex items-center gap-1 text-blue-600 dark:text-cyan-400 shrink-0">
                    <span>{isPT ? 'DETALHES' : 'INSPECT'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
