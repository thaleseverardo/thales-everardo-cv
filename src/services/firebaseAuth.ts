/**
 * Firebase Auth Service Real (Google OAuth)
 * Executa signInWithPopup real abrindo o diálogo de autenticação de contas do Google.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: string;
}

// Configuração lida do arquivo .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);

// Inicialização segura do Firebase (Singleton)
const app = getApps().length > 0 ? getApp() : (isConfigured ? initializeApp(firebaseConfig) : null);
const auth = app ? getAuth(app) : null;

type AuthListener = (user: AuthUser | null) => void;
const listeners: Set<AuthListener> = new Set();
let currentUser: AuthUser | null = null;

function mapFirebaseUser(user: User | null): AuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    provider: user.providerData[0]?.providerId || 'google.com',
  };
}

// Observador real de estado da sessão do Firebase
if (auth) {
  onAuthStateChanged(auth, (user) => {
    currentUser = mapFirebaseUser(user);
    listeners.forEach((cb) => cb(currentUser));
  });
}

export function subscribeToAuth(callback: AuthListener): () => void {
  listeners.add(callback);
  callback(currentUser);
  return () => listeners.delete(callback);
}

/**
 * Dispara a janela real de login do Google (OAuth Popup)
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  if (!isConfigured || !auth) {
    const errorMsg =
      '⚠️ Firebase não configurado!\n\nPara o login real do Google funcionar:\n1. Acesse https://console.firebase.google.com\n2. Crie um projeto e ative "Authentication > Google"\n3. Preencha as chaves no arquivo .env.local';
    alert(errorMsg);
    throw new Error('Firebase Auth keys missing in .env.local');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = mapFirebaseUser(result.user);
    if (!user) throw new Error('Falha ao processar usuário.');
    currentUser = user;
    return user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.warn('Login cancelado pelo usuário.');
    } else {
      console.error('Erro no Google Sign-In:', error);
      alert(`Erro na autenticação: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Dispara a janela real de login do GitHub (OAuth Popup)
 */
export async function signInWithGithub(): Promise<AuthUser> {
  if (!isConfigured || !auth) {
    alert('Configure o GitHub Provider no console do Firebase e adicione as chaves no .env.local.');
    throw new Error('Firebase Auth keys missing');
  }

  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = mapFirebaseUser(result.user);
    if (!user) throw new Error('Falha ao processar usuário.');
    currentUser = user;
    return user;
  } catch (error: any) {
    if (error.code !== 'auth/popup-closed-by-user') {
      console.error('Erro no GitHub Sign-In:', error);
      alert(`Erro na autenticação: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Encerra a sessão real do Firebase
 */
export async function signOutUser(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
  currentUser = null;
  listeners.forEach((cb) => cb(null));
}

/**
 * Libera os dados protegidos apenas para usuários autenticados via Firebase
 */
export function getAuthorizedContact(user: AuthUser | null) {
  if (!user) {
    return {
      email: '[Acesso Restrito - Faça Login com Google]',
      phone: '[Acesso Restrito - Faça Login com Google]',
      isLocked: true,
    };
  }

  return {
    email: 'thales.everardo@gmail.com',
    phone: '+55 (11) 94944-7774',
    isLocked: false,
  };
}
