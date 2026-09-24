import { ArchitectureNode, ProfileLens, AppLanguage } from '../types';

/**
 * Normalizes text for case-insensitive, diacritic-agnostic searching.
 */
export function normalizeSearchString(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Checks if a node satisfies the active profile lens filter.
 */
export function isNodeMatchingLens(node: ArchitectureNode, lens: ProfileLens): boolean {
  if (lens === 'ALL') return true;
  return node.lenses.includes(lens);
}

/**
 * Checks if a node satisfies a specific skill tag filter (if present).
 */
export function isNodeMatchingTag(node: ArchitectureNode, selectedTag: string | null): boolean {
  if (!selectedTag) return true;
  return node.technologies.some(
    (tech) => normalizeSearchString(tech) === normalizeSearchString(selectedTag)
  );
}

/**
 * Checks if a node matches the user's search query across all relevant metadata
 * (role, company, short title, engineering feat, business value, and technologies).
 */
export function isNodeMatchingSearch(
  node: ArchitectureNode,
  searchQuery: string,
  language: AppLanguage
): boolean {
  if (!searchQuery || !searchQuery.trim()) return true;
  const q = normalizeSearchString(searchQuery);
  const isPT = language === 'PT';

  const trans = isPT ? node.pt : null;
  const title = normalizeSearchString(trans?.shortTitle || node.shortTitle);
  const role = normalizeSearchString(trans?.role || node.role);
  const company = normalizeSearchString(node.company);
  const feat = normalizeSearchString(trans?.engineeringFeat || node.engineeringFeat);
  const bValue = normalizeSearchString(trans?.businessValue || node.businessValue);
  const layer = normalizeSearchString(node.layer);
  const techs = node.technologies.map((t) => normalizeSearchString(t)).join(' ');

  return (
    title.includes(q) ||
    role.includes(q) ||
    company.includes(q) ||
    feat.includes(q) ||
    bValue.includes(q) ||
    layer.includes(q) ||
    techs.includes(q)
  );
}

/**
 * Unified node evaluation combining Profile Lens, Tag filter, and Search Query.
 */
export function isNodeActiveInFilter(
  node: ArchitectureNode,
  lens: ProfileLens,
  searchQuery: string,
  selectedTag: string | null,
  language: AppLanguage
): boolean {
  const matchesLens = isNodeMatchingLens(node, lens);
  const matchesTag = isNodeMatchingTag(node, selectedTag);
  const matchesSearch = isNodeMatchingSearch(node, searchQuery, language);
  return matchesLens && matchesTag && matchesSearch;
}

/**
 * Extracts a deduplicated list of top technologies across all nodes.
 */
export function extractTopTechnologies(nodes: ArchitectureNode[], limit: number = 8): string[] {
  const counts = new Map<string, number>();
  nodes.forEach((node) => {
    node.technologies.forEach((tech) => {
      counts.set(tech, (counts.get(tech) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tech]) => tech);
}
