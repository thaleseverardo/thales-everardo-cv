/**
 * PII Shield - Anti-Scraping / Anti-Harvesting Utility
 * Impede que scrapers automáticos e regex estáticos extraiam email e telefone
 * do bundle de código JS compilado.
 */

// Chunks fragmentados e invertidos em base64 customizada
const _E_PARTS = ['bW9jLmV2aWw=', 'c2llci5zZWxhaHQ=']; // live.com, thales.reis invertidos
const _P_PARTS = ['NDc3Ny00NDk0OQ==', 'LSsgNTUgKDExKQ==']; // 94944-7774, +55 (11)

function decodeChunk(reversedB64: string): string {
  try {
    const raw = atob(reversedB64);
    return raw.split('').reverse().join('');
  } catch {
    return '';
  }
}

/**
 * Monta o e-mail apenas em tempo de execução
 */
export function getDecodedEmail(): string {
  if (typeof window === 'undefined') return '';
  const user = decodeChunk(_E_PARTS[1]);
  const host = decodeChunk(_E_PARTS[0]);
  return `${user}@${host}`;
}

/**
 * Monta o telefone apenas em tempo de execução
 */
export function getDecodedPhone(): string {
  if (typeof window === 'undefined') return '';
  const prefix = decodeChunk(_P_PARTS[1]);
  const number = decodeChunk(_P_PARTS[0]);
  return `${prefix} ${number}`;
}
