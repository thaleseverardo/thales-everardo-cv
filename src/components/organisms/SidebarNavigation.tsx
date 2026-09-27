import React, { useState, useEffect, useRef } from 'react';
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
  const sidebarRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    if (isCollapsed) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        typeof window !== 'undefined' &&
        window.innerWidth >= 768 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCollapsed]);

  const handleNavItemClick = (id: ViewLayout) => {
    onSelectView(id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {!isCollapsed && (
        <div
          className="md:hidden fixed inset-0 z-35 bg-black/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-150"
          onClick={() => setIsCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR NATIVA DE ALTA PRECISÃO - SEM OVERFLOW, SEM BORDAS AZUIS E SEM VAZAMENTO DE SCROLLBAR */}
      <aside
        ref={sidebarRef}
        aria-label="Navegação de Vistas"
        className={`relative shrink-0 h-full select-none transition-all duration-200 ease-in-out flex flex-col print:hidden border-r z-30 overflow-hidden ${
          isCollapsed
            ? 'w-14 sm:w-16 shadow-none'
            : 'w-60 sm:w-64 shadow-xl'
        } ${
          theme === 'dark'
            ? 'bg-[#09090b] border-zinc-800/80 text-zinc-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* TOPO: TOGGLE MINIMALISTA INTEGRADO (SEM BORDAS AZUIS OU ANÉIS VAZADOS) */}
        <div className="h-12 px-2.5 border-b border-slate-100 dark:border-zinc-800/60 flex items-center justify-between shrink-0">
          {!isCollapsed && (
            <span className="px-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 truncate">
              {t(language, 'nav.tools')}
            </span>
          )}
          <button
            type="button"
            onClick={toggleCollapse}
            className={`flex items-center justify-center rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/60 focus:outline-none ${
              isCollapsed ? 'w-9 h-9 mx-auto' : 'w-7 h-7 ml-auto'
            }`}
            title={isCollapsed ? t(language, 'sidebar.expand') : t(language, 'sidebar.collapse')}
            aria-label={isCollapsed ? t(language, 'sidebar.expand') : t(language, 'sidebar.collapse')}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronLeft className="w-4 h-4 shrink-0" />
            )}
          </button>
        </div>

        {/* NAVEGAÇÃO DE ÍCONES (COM OVERFLOW-X BLOQUEADO - EXTINÇÃO DO SCROLLBAR ◄ ▬ ►) */}
        <div className="p-2 sm:p-2.5 space-y-1.5 pt-3 flex-1 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = viewLayout === item.id;
            const label = t(language, item.labelKey);
            const desc = t(language, item.descKey);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavItemClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                title={isCollapsed ? `${label} — ${desc}` : undefined}
                className={`relative group flex items-center transition-all duration-150 cursor-pointer font-sans outline-none focus:outline-none ${
                  isCollapsed
                    ? 'w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-xl justify-center'
                    : 'w-full h-11 px-3 rounded-xl gap-3 text-left'
                } ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-zinc-800/90 text-zinc-100 border border-white/10 shadow-inner'
                      : 'bg-slate-100 text-slate-900 border border-slate-200 shadow-2xs'
                    : theme === 'dark'
                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850/60 border border-transparent'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                }`}
              >
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
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
