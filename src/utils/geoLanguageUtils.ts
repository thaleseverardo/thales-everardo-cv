import { AppLanguage } from '../types';
import { getStoredPreferences } from './storageUtils';

// Matriz de Países ISO 3166-1 alpha-2
export const LUSOPHONE_COUNTRIES = ['BR', 'PT', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL'];
export const HISPANOPHONE_COUNTRIES = [
  'ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR', 'GQ'
];
export const FRANCOPHONE_COUNTRIES = [
  'FR', 'BE', 'SN', 'CI', 'CM', 'CD', 'MG', 'ML', 'BF', 'NE', 'TD', 'GN', 'RW', 'BI', 'BJ', 'TG', 'GA', 'CG', 'DJ', 'KM', 'VU', 'SC', 'MC', 'LU'
];

export const BCP47_TAGS: Record<AppLanguage, string> = {
  PT: 'pt-BR',
  EN: 'en-US',
  ES: 'es-ES',
  FR: 'fr-FR',
};

/**
 * Converte código de país (ISO Alpha-2) em AppLanguage
 */
export function resolveCountryToLanguage(countryCode: string): AppLanguage {
  const code = countryCode.toUpperCase();
  if (LUSOPHONE_COUNTRIES.includes(code)) return 'PT';
  if (HISPANOPHONE_COUNTRIES.includes(code)) return 'ES';
  if (FRANCOPHONE_COUNTRIES.includes(code)) return 'FR';
  return 'EN'; // Default global
}

/**
 * Detecção em Tempo Zero (0ms) baseada em Fuso Horário e Navegador
 */
export function detectLocalLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'EN';

  try {
    // 1. Parâmetro de teste de QA na URL: ?geo=FR ou ?lang=es
    const params = new URLSearchParams(window.location.search);
    const geoParam = params.get('geo') || params.get('country');
    if (geoParam) {
      return resolveCountryToLanguage(geoParam);
    }
    const langParam = params.get('lang');
    if (langParam) {
      const p = langParam.toUpperCase();
      if (p === 'PT' || p === 'EN' || p === 'ES' || p === 'FR') return p as AppLanguage;
    }

    // 2. Preferência gravada no JSON 'thales-everardo-cv'
    const prefs = getStoredPreferences();
    if (prefs.language && ['PT', 'EN', 'ES', 'FR'].includes(prefs.language)) {
      return prefs.language;
    }

    // 3. Fuso Horário Físico do Dispositivo (Instantâneo)
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
    
    // Lusófonos
    if (/sao_paulo|fortaleza|recife|belem|bahia|cuiaba|manaus|porto_velho|rio_branco|campo_grande|noronha|santarem|boa_vista|araguaina|maceio|lisbon|madeira|azores|luanda|maputo|cape_verde|bissau|sao_tome|dili/.test(tz)) {
      return 'PT';
    }

    // Hispanófonos
    if (/madrid|ceuta|canary|buenos_aires|cordoba|mendoza|mexico_city|cancun|monterrey|tijuana|bogota|santiago|lima|caracas|guayaquil|guatemala|havana|la_paz|santo_domingo|tegucigalpa|asuncion|el_salvador|managua|costa_rica|panama|montevideo|puerto_rico/.test(tz)) {
      return 'ES';
    }

    // Francófonos
    if (/paris|brussels|dakar|abidjan|douala|kinshasa|antananarivo|bamako|ouagadougou|niamey|ndjamena|conakry|kigali|lome|libreville|brazzaville|monaco/.test(tz)) {
      return 'FR';
    }

    // 4. Idioma do Sistema Operacional / Navegador (navigator.languages)
    const navLangs = navigator.languages || [navigator.language || ''];
    for (const l of navLangs) {
      const lower = l.toLowerCase();
      if (lower.startsWith('pt')) return 'PT';
      if (lower.startsWith('es')) return 'ES';
      if (lower.startsWith('fr')) return 'FR';
      if (lower.startsWith('en')) return 'EN';
    }
  } catch (e) {}

  // Fallback padrão se não for identificado: INGLÊS
  return 'EN';
}
