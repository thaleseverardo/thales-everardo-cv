import React from 'react';
import { ArrowLeft, Clock, Calendar, ExternalLink } from 'lucide-react';
import { AppLanguage, AppTheme } from '../../types';
import { getLocalizedArticles, getLocalizedArticle } from '../../data/locales';
import { t } from '../../i18n/translations';

interface ArticlesViewProps {
  language: AppLanguage;
  theme: AppTheme;
  activeSlug: string | null;
  onSelectArticle: (slug: string | null) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  language,
  theme,
  activeSlug,
  onSelectArticle,
}) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const activeArticle = getLocalizedArticle(activeSlug, language);
  const articlesList = getLocalizedArticles(language);

  if (activeArticle) {
    const staticUrl = `${base}/articles/${activeArticle.slug}/`;

    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-in fade-in duration-200">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSelectArticle(null)}
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t(language, 'articles.backToAll')}</span>
          </button>

          <a
            href={staticUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:underline"
          >
            <span>{t(language, 'articles.openStatic')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <article
          className={`p-6 sm:p-10 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#0c0c0f]/80 border-zinc-800 text-zinc-200 shadow-xs' : 'bg-white border-zinc-200 text-zinc-800 shadow-xs'
          }`}
        >
          <header className="border-b pb-5 mb-6 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                {activeArticle.tag}
              </span>
              <span className="text-xs font-mono opacity-50">•</span>
              <span className="text-xs font-mono opacity-60 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeArticle.readTime}
              </span>
              <span className="text-xs font-mono opacity-50">•</span>
              <span className="text-xs font-mono opacity-60 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {activeArticle.date}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug">
              {activeArticle.title}
            </h1>
            <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-2">
              Author: Thales Everardo Albuquerque Reis · Staff Systems Engineer & Systems Architect
            </div>
          </header>

          <div
            className="space-y-4 text-sm leading-relaxed opacity-90 font-sans [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-blue-600 [&>h3]:dark:text-cyan-400 [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: activeArticle.content }}
          />

          <footer className="mt-10 pt-5 border-t border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>Author: Thales Everardo Albuquerque Reis</span>
            <button
              type="button"
              onClick={() => onSelectArticle(null)}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              ← {t(language, 'articles.backToAll')}
            </button>
          </footer>
        </article>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-in fade-in duration-200">
      <div className="mb-8 border-b pb-4 dark:border-zinc-800 border-zinc-200">
        <h1 className="text-xl sm:text-2xl font-sans font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {t(language, 'articles.pageTitle')}
        </h1>
        <p className="text-xs sm:text-sm mt-1 text-zinc-500 dark:text-zinc-400 font-sans">
          {t(language, 'articles.pageSubtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {articlesList.map((art) => (
          <a
            key={art.slug}
            href={`${base}/articles/${art.slug}/`}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                e.preventDefault();
                onSelectArticle(art.slug);
              }
            }}
            className={`block p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer group text-inherit no-underline ${
              theme === 'dark'
                ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                    {art.tag}
                  </span>
                  <span className="text-xs font-mono opacity-50">•</span>
                  <span className="text-xs font-mono opacity-60 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {art.readTime}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {art.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-sans">
                  {art.desc}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2 mt-2 sm:mt-0">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
                  <span>{t(language, 'articles.readArticle')}</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
