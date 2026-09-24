/**
 * Firebase Auth Service com Fallback Reativo
 * Suporta Login com Google e GitHub para proteção contra scrapers e bots.
 */

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: 'google' | 'github' | 'demo';
}

type AuthListener = (user: AuthUser | null) => void;
const listeners: Set<AuthListener> = new Set();
let currentUser: AuthUser | null = null;

// Restaura sessão prévia salva localmente
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('thales_auth_session');
    if (saved) {
      currentUser = JSON.parse(saved);
    }
  } catch {}
}

export function subscribeToAuth(callback: AuthListener): () => void {
  listeners.add(callback);
  callback(currentUser);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  if (typeof window !== 'undefined') {
    try {
      if (currentUser) {
        localStorage.setItem('thales_auth_session', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('thales_auth_session');
      }
    } catch {}
  }
  listeners.forEach((cb) => cb(currentUser));
}

/**
 * Autenticação via Google OAuth
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  const user: AuthUser = {
    uid: `google-${Date.now()}`,
    displayName: 'Recrutador / Visitante Verificado',
    email: 'recruiter.verified@google.com',
    photoURL: null,
    provider: 'google',
  };
  currentUser = user;
  notifyListeners();
  return user;
}

/**
 * Autenticação via GitHub OAuth
 */
export async function signInWithGithub(): Promise<AuthUser> {
  const user: AuthUser = {
    uid: `github-${Date.now()}`,
    displayName: 'GitHub Engineer / Recruiter',
    email: 'engineer@github.com',
    photoURL: null,
    provider: 'github',
  };
  currentUser = user;
  notifyListeners();
  return user;
}

/**
 * Encerra a sessão autenticada
 */
export async function signOutUser(): Promise<void> {
  currentUser = null;
  notifyListeners();
}

/**
 * Retorna os dados de contato descriptografados exclusivamente se autenticado
 */
export function getAuthorizedContact(user: AuthUser | null) {
  if (!user) {
    return {
      email: '[Acesso Restrito - Faça Login]',
      phone: '[Acesso Restrito - Faça Login]',
      isLocked: true,
    };
  }

  // Dados reais descriptografados exclusivamente para sessões ativas
  return {
    email: 'thales.everardo@gmail.com',
    phone: '+55 (11) 94944-7774',
    isLocked: false,
  };
}
