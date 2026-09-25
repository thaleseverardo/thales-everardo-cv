import React from 'react';
import { Calendar, MapPin, ArrowRight, TrendingUp, FileSearch } from 'lucide-react';
import { ArchitectureNode, AppLanguage, AppTheme, ProfileLens, MetricHighlight } from '../../types';
import { isNodeActiveInFilter } from '../../utils/filterUtils';
import { t, getNodeContent } from '../../i18n/translations';

interface ExecutiveTimelineViewProps {
  nodes: ArchitectureNode[];
  onSelectNode: (nodeId: string) => void;
  language: AppLanguage;
  theme: AppTheme;
  profileLens?: ProfileLens;
  searchTerm?: string;
  selectedTag?: string | null;
  onClearFilter?: () => void;
}

export const ExecutiveTimelineView: React.FC<ExecutiveTimelineViewProps> = ({
  nodes,
  onSelectNode,
  language,
  theme,
  profileLens = 'ALL',
  searchTerm = '',
  selectedTag = null,
  onClearFilter,
}) => {
  const matchingNodes = nodes
    .filter((node) => isNodeActiveInFilter(node, profileLens, searchTerm, selectedTag, language))
    .slice()
    .reverse();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
      <div className="mb-8 border-b pb-4 dark:border-zinc-800 border-slate-200">
        <h2 className="text-xl sm:text-2xl font-sans font-bold tracking-tight">
          {t(language, 'timeline.header')}
        </h2>
        <p
          className={`text-xs sm:text-sm mt-1 max-w-2xl font-sans ${
            theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'
          }`}
        >
          {t(language, 'timeline.subheader')}
        </p>
      </div>

      {matchingNodes.length === 0 ? (
        <div className="p-8 text-center rounded-xl border dark:bg-zinc-900/40 dark:border-zinc-800 bg-white border-slate-200">
          <FileSearch className="w-8 h-8 mx-auto opacity-40 mb-2" />
          <h3 className="font-sans font-bold text-sm">
            {t(language, 'timeline.emptyTitle')}
          </h3>
          <p className="text-xs opacity-70 mt-1 max-w-sm mx-auto">
            {t(language, 'timeline.emptyDesc')}
          </p>
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              className="mt-4 px-3 py-1.5 rounded-md font-mono text-xs font-bold bg-blue-600 text-white"
            >
              {t(language, 'timeline.resetFilters')}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6 relative border-l-2 ml-3 sm:ml-5 pl-5 sm:pl-7 dark:border-zinc-800 border-slate-200 pb-10">
          {matchingNodes.map((node) => {
            const content = getNodeContent(node, language);

            return (
              <article
                key={node.id}
                role="article"
                className={`relative rounded-xl border p-5 sm:p-6 transition-all hover:shadow-lg ${
                  theme === 'dark'
                    ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div
                  className={`absolute -left-7.75 sm:-left-9.75 top-6 w-5 h-5 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-bold ${
                    theme === 'dark'
                      ? 'bg-zinc-950 border-cyan-400 text-cyan-400'
                      : 'bg-white border-blue-600 text-blue-700 shadow-2xs'
                  }`}
                >
                  {node.number}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b dark:border-zinc-800/80 border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400">
                        {node.company}
                      </span>
                      <span className="text-zinc-400 text-xs">/</span>
                      <span className="text-xs font-mono opacity-60 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {node.location}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-sans font-bold mt-1 tracking-tight text-zinc-900 dark:text-zinc-100">
                      {content.shortTitle}
                    </h3>
                    <div className="text-xs font-sans opacity-75 mt-0.5">{content.role}</div>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs opacity-60 shrink-0 mt-1 sm:mt-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{node.period}</span>
                  </div>
                </div>

                <div
                  className={`my-3.5 p-3 rounded-lg border text-xs sm:text-sm font-sans leading-relaxed ${
                    theme === 'dark'
                      ? 'bg-zinc-950/60 border-zinc-800 text-zinc-200'
                      : 'bg-blue-50/70 border-blue-200 text-blue-900'
                  }`}
                >
                  <div className="font-mono font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5 text-blue-700 dark:text-cyan-400">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span>{t(language, 'timeline.businessImpact')}</span>
                  </div>
                  <p>{content.businessValue}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3">
                  {content.metricDetails.map((metric: MetricHighlight, i: number) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded border font-mono text-xs ${
                        theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] opacity-60 uppercase">{metric.label}</div>
                      <div className="text-sm font-bold mt-0.5 text-blue-600 dark:text-cyan-400">
                        {metric.value}
                      </div>
                      <div className="text-[10px] opacity-60 truncate">{metric.subtext}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t dark:border-zinc-800/80 border-slate-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {node.technologies.slice(0, 5).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                          theme === 'dark'
                            ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {node.technologies.length > 5 && (
                      <span className="text-[11px] font-mono text-slate-600 dark:text-zinc-300 font-semibold">
                        +{node.technologies.length - 5}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectNode(node.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>{t(language, 'timeline.inspectButton')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
