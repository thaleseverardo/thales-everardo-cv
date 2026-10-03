import { LocalizedProject } from '../types';
import { getLocalizedProjects, getLocalizedProject } from './locales';
import { PROJECTS_EN } from './locales/en/projects';
import { PROJECTS_PT } from './locales/pt/projects';

export interface ProjectItem extends LocalizedProject {
  titleEN: string;
  titlePT: string;
  descEN: string;
  descPT: string;
  contentEN: string;
  contentPT: string;
}

// Fachada para compatibilidade integral com código legado
export const PROJECTS_DATA: ProjectItem[] = PROJECTS_EN.map((enProj) => {
  const ptProj = PROJECTS_PT.find((p) => p.slug === enProj.slug) || enProj;
  return {
    ...enProj,
    titleEN: enProj.title,
    titlePT: ptProj.title,
    descEN: enProj.desc,
    descPT: ptProj.desc,
    contentEN: enProj.content,
    contentPT: ptProj.content,
  };
});

export { getLocalizedProjects, getLocalizedProject };
