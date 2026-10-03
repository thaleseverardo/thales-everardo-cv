import { AppLanguage } from '../../types';
import { ARTICLES_PT } from './pt/articles';
import { ARTICLES_EN } from './en/articles';
import { ARTICLES_ES } from './es/articles';
import { ARTICLES_FR } from './fr/articles';

import { PROJECTS_PT } from './pt/projects';
import { PROJECTS_EN } from './en/projects';
import { PROJECTS_ES } from './es/projects';
import { PROJECTS_FR } from './fr/projects';

import { DEGREES_PT, CREDENTIALS_PT, HARD_SKILLS_PT, SOFT_SKILLS_PT, LANGUAGES_PT } from './pt/profile';
import { DEGREES_EN, CREDENTIALS_EN, HARD_SKILLS_EN, SOFT_SKILLS_EN, LANGUAGES_EN } from './en/profile';
import { DEGREES_ES, CREDENTIALS_ES, HARD_SKILLS_ES, SOFT_SKILLS_ES, LANGUAGES_ES } from './es/profile';
import { DEGREES_FR, CREDENTIALS_FR, HARD_SKILLS_FR, SOFT_SKILLS_FR, LANGUAGES_FR } from './fr/profile';

export function getLocalizedArticles(lang: AppLanguage) {
  switch (lang) {
    case 'PT': return ARTICLES_PT;
    case 'ES': return ARTICLES_ES;
    case 'FR': return ARTICLES_FR;
    case 'EN':
    default: return ARTICLES_EN;
  }
}

export function getLocalizedArticle(slug: string | null, lang: AppLanguage) {
  if (!slug) return null;
  const list = getLocalizedArticles(lang);
  return list.find((a) => a.slug === slug) || null;
}

export function getLocalizedProjects(lang: AppLanguage) {
  switch (lang) {
    case 'PT': return PROJECTS_PT;
    case 'ES': return PROJECTS_ES;
    case 'FR': return PROJECTS_FR;
    case 'EN':
    default: return PROJECTS_EN;
  }
}

export function getLocalizedProject(slug: string | null, lang: AppLanguage) {
  if (!slug) return null;
  const list = getLocalizedProjects(lang);
  return list.find((p) => p.slug === slug) || null;
}

export function getLocalizedDegrees(lang: AppLanguage) {
  switch (lang) {
    case 'PT': return DEGREES_PT;
    case 'ES': return DEGREES_ES;
    case 'FR': return DEGREES_FR;
    case 'EN':
    default: return DEGREES_EN;
  }
}

export function getLocalizedCredentials(lang: AppLanguage) {
  switch (lang) {
    case 'PT': return CREDENTIALS_PT;
    case 'ES': return CREDENTIALS_ES;
    case 'FR': return CREDENTIALS_FR;
    case 'EN':
    default: return CREDENTIALS_EN;
  }
}

export function getLocalizedHardSkills(lang: AppLanguage) {
  switch (lang) {
    case 'PT': return HARD_SKILLS_PT;
    case 'ES': return HARD_SKILLS_ES;
    case 'FR': return HARD_SKILLS_FR;
    case 'EN':
    default: return HARD_SKILLS_EN;
  }
}

export function getLocalizedSoftSkills(lang: AppLanguage) {
  switch (lang) {
    case 'PT': return SOFT_SKILLS_PT;
    case 'ES': return SOFT_SKILLS_ES;
    case 'FR': return SOFT_SKILLS_FR;
    case 'EN':
    default: return SOFT_SKILLS_EN;
  }
}

export function getLocalizedLanguages(lang: AppLanguage) {
  switch (lang) {
    case 'PT': return LANGUAGES_PT;
    case 'ES': return LANGUAGES_ES;
    case 'FR': return LANGUAGES_FR;
    case 'EN':
    default: return LANGUAGES_EN;
  }
}
