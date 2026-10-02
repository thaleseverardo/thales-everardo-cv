export const CANONICAL_REDIRECT_BASE = 'https://thaleseverardo.github.io/thales-everardo-cv';

export type RedirectChannel = 'linkedin' | 'github' | 'portfolio' | 'portifolio';

export function getTrackingUrl(channel: RedirectChannel, source: string): string {
  return `${CANONICAL_REDIRECT_BASE}/${channel}?src=${encodeURIComponent(source)}`;
}
