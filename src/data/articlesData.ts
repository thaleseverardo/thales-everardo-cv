import { LocalizedArticle } from '../types';
import { getLocalizedArticles, getLocalizedArticle } from './locales';
import { ARTICLES_EN } from './locales/en/articles';
import { ARTICLES_PT } from './locales/pt/articles';

export interface ArticleItem extends LocalizedArticle {
  titleEN: string;
  titlePT: string;
  descEN: string;
  descPT: string;
  contentEN: string;
  contentPT: string;
}

// Fachada para compatibilidade integral com código legado
export const ARTICLES_DATA: ArticleItem[] = ARTICLES_EN.map((enArt) => {
  const ptArt = ARTICLES_PT.find((p) => p.slug === enArt.slug) || enArt;
  return {
    ...enArt,
    titleEN: enArt.title,
    titlePT: ptArt.title,
    descEN: enArt.desc,
    descPT: ptArt.desc,
    contentEN: enArt.content,
    contentPT: ptArt.content,
  };
});

export { getLocalizedArticles, getLocalizedArticle };
