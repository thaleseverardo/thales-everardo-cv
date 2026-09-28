import React from 'react';
import { Search, X } from 'lucide-react';
import { SystemState, ProfileLens } from '../../types';
import { PROFILE_LENSES_CONFIG } from '../../data/curriculumData';
import { t } from '../../i18n/translations';

interface ViewFilterToolbarProps {
  systemState: SystemState;
  updateState: (updates: Partial<SystemState>) => void;
}

const ALL_LENSES: ProfileLens[] = ['ALL', 'ARCHITECTURE', 'DATA', 'SOFTWARE_ENG', 'DATABASE'];

export const ViewFilterToolbar: React.FC<ViewFilterToolbarProps> = ({
  systemState,
  updateState,
}) => {
  const { language, profileLens, searchTerm } = systemState;

  return (
    <div className="hidden md:flex w-full px-5 sm:px-8 pt-4 pb-2 z-20 shrink-0">
      <div className="w-full flex items-center justify-between gap-3">
        {/* BARRA DE CATEGORIAS / LENTES */}
        <div role="tablist" className="segmented-control">
          {ALL_LENSES.map((lensKey) => {
            const isActive = profileLens === lensKey;

            return (
              <button
                key={lensKey}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => updateState({ profileLens: lensKey })}
                className={`segmented-btn ${isActive ? 'segmented-btn-active' : ''}`}
              >
                <span>
                  {lensKey === 'ALL'
                    ? t(language, 'lens.all')
                    : lensKey === 'ARCHITECTURE'
                    ? t(language, 'lens.architecture')
                    : lensKey === 'DATA'
                    ? t(language, 'lens.data')
                    : lensKey === 'SOFTWARE_ENG'
                    ? t(language, 'lens.software')
                    : t(language, 'lens.database')}
                </span>
              </button>
            );
          })}
        </div>

        {/* CAMPO DE BUSCA AMPLO */}
        <div className="relative flex-1 min-w-56 shadow-2xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => updateState({ searchTerm: e.target.value })}
            placeholder={t(language, 'nav.filterPlaceholder')}
            className="toolbar-search-field"
            aria-label={t(language, 'nav.filterPlaceholder')}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => updateState({ searchTerm: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 cursor-pointer"
              aria-label={t(language, 'nav.clearSearch')}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
