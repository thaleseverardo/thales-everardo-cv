import React, { useState } from 'react';
import { Layers, List, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewLayout, AppLanguage, AppTheme } from '../../types';
import { t, TranslationKey } from '../../i18n/translations';

interface SidebarNavigationProps {
  viewLayout: ViewLayout;
  onSelectView: (layout: ViewLayout) => void;
  language: AppLanguage;
  theme: AppTheme;
}

interface NavItemConfig {
  id: ViewLayout;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: TranslationKey;
  descKey: TranslationKey;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'GRAPH',
    icon: Layers,
    labelKey: 'sidebar.graph',
    descKey: 'sidebar.graphDesc',
  },
  {
    id: 'TIMELINE',
    icon: List,
    labelKey: 'sidebar.timeline',
    descKey: 'sidebar.timelineDesc',
  },
  {
    id: 'RESUME',
    icon: FileText,
    labelKey: 'sidebar.resume',
    descKey: 'sidebar.resumeDesc',
  },
];

const SIDEBAR_STORAGE_KEY = 'thales_cv_sidebar_collapsed';

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  viewLayout,
  onSelectView,
  language,
  theme,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return stored !== 'false';
    } catch {
      return true;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  };

  return (
    <>
      {/* BACKDROP QUANDO O MENU ESTIVER ABERTO EM OVERLAY NO MOBILE */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-35 bg-black/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-150"
          onClick={() => setIsCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* BARRA LATERAL COM PADRÃO VISUAL AAA */}
      <aside
        aria-label="Navegação de Vistas"
        className={`fixed left-0 top-16 md:top-18 bottom-12 select-none transition-all duration-200 ease-in-out flex flex-col justify-between print:hidden border-r z-40 overflow-hidden ${
          isCollapsed
            ? 'w-14 sm:w-16 shadow-none'
            : 'w-60 sm:w-64 shadow-2xl shadow-black/80'
        } ${
          theme === 'dark'
            ? 'bg-[#09090b]/95 border-zinc-800/80 text-zinc-100 backdrop-blur-xl'
            : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-xl'
        }`}
      >
        {/* NAVEGAÇÃO DE ÍCONES SUPERIOR */}
        <div className="p-2 sm:p-2.5 space-y-2 pt-3.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = viewLayout === item.id;
            const label = t(language, item.labelKey);
            const desc = t(language, item.descKey);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectView(item.id);
                  if (!isCollapsed) {
                    setIsCollapsed(true);
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative group flex items-center transition-all duration-150 cursor-pointer font-sans outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-400 ${
                  /* No modo recolhido: caixa 40x40 rigorosamente centrada */
                  isCollapsed
                    ? 'w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-xl justify-center'
                    : 'w-full h-11 px-3 rounded-xl gap-3 text-left'
                } ${
                  /* Tratamento de micro-elevação e contraste AAA */
                  isActive
                    ? theme === 'dark'
                      ? 'bg-zinc-800/90 text-zinc-100 border border-white/10 shadow-inner'
                      : 'bg-slate-100 text-slate-900 border border-slate-200 shadow-2xs'
                    : theme === 'dark'
                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850/60 border border-transparent'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                }`}
              >
                {/* ÍCONE COM NÍVEL DE CONTRASTE AAA */}
                <div className="shrink-0 flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? theme === 'dark'
                          ? 'text-cyan-400'
                          : 'text-blue-600'
                        : 'opacity-75 group-hover:opacity-100'
                    }`}
                  />
                </div>

                {/* RÓTULO + SUBTÍTULO (EXPANDIDO) */}
                {!isCollapsed && (
                  <div className="min-w-0 flex-1 truncate">
                    <div
                      className={`text-xs font-semibold tracking-tight truncate leading-tight ${
                        isActive
                          ? theme === 'dark'
                            ? 'text-zinc-100 font-bold'
                            : 'text-slate-900 font-bold'
                          : ''
                      }`}
                    >
                      {label}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate leading-normal pt-0.5">
                      {desc}
                    </div>
                  </div>
                )}

                {/* TOOLTIP FLUTUANTE RECOLHIDO (DESKTOP) */}
                {isCollapsed && (
                  <span
                    style={{ left: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)', bottom: 'auto' }}
                    className="tooltip-bubble hidden sm:block z-50 font-sans"
                  >
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* CONTAINER DO BOTÃO INFERIOR (PERFEITAMENTE CENTRADO NO EIXO DA BARRA) */}
        <div className="p-2 sm:p-2.5 border-t border-slate-200/80 dark:border-zinc-800/80 shrink-0 bg-inherit">
          <button
            type="button"
            onClick={toggleCollapse}
            className={`flex items-center transition-colors cursor-pointer outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:focus-visible:ring-cyan-400/50 ${
              isCollapsed
                ? 'w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-xl justify-center'
                : 'w-full h-10 px-3 rounded-xl justify-between'
            } ${
              theme === 'dark'
                ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850/60 border border-transparent hover:border-zinc-700/50'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent hover:border-slate-300/60'
            }`}
            title={isCollapsed ? t(language, 'sidebar.expand') : t(language, 'sidebar.collapse')}
            aria-label={isCollapsed ? t(language, 'sidebar.expand') : t(language, 'sidebar.collapse')}
          >
            {!isCollapsed && (
              <span className="text-[11px] font-mono opacity-75 truncate select-none">
                {t(language, 'sidebar.collapse')}
              </span>
            )}
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100" />
            ) : (
              <ChevronLeft className="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
