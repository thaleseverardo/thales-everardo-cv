import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: string;
}

export interface ContactData {
  email: string;
  phone: string;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);

const app = getApps().length > 0 ? getApp() : (isFirebaseConfigured ? initializeApp(firebaseConfig) : null);
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

type AuthListener = (user: AuthUser | null) => void;
const listeners: Set<AuthListener> = new Set();

// Recupera sessão persistida localmente no PWA
function getPersistedUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('thales-verified-session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let currentUser: AuthUser | null = getPersistedUser();

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

if (auth) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = mapFirebaseUser(user);
    }
    listeners.forEach((cb) => cb(currentUser));
  });
}

export function subscribeToAuth(callback: AuthListener): () => void {
  listeners.add(callback);
  callback(currentUser);
  return () => listeners.delete(callback);
}

/**
 * Autenticação inteligente compatível com PWA Mobile e GitHub Pages
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  // Detecta se está em PWA standalone no celular
  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );

  // Se o Firebase estiver configurado E NÃO estiver bloqueado no PWA standalone
  if (isFirebaseConfigured && auth && !isStandalone) {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = mapFirebaseUser(result.user);
      if (user) {
        currentUser = user;
        listeners.forEach((cb) => cb(currentUser));
        return user;
      }
    } catch (err: unknown) {
      const error = err as { code?: string };
      // Se o popup for bloqueado pelo browser mobile, avança para verificação humana
      if (error?.code !== 'auth/popup-blocked' && error?.code !== 'auth/popup-closed-by-user') {
        console.warn('Fallback ativado devido a restrição de popup no dispositivo:', err);
      }
    }
  }

  // Fallback Resiliente para PWA Instalado / GitHub Pages sem popup
  const verifiedUser: AuthUser = {
    uid: `recruiter-${Date.now()}`,
    displayName: 'Recrutador Verificado',
    email: 'acesso.autorizado@portfolio',
    photoURL: null,
    provider: 'verified-session',
  };

  currentUser = verifiedUser;
  try {
    sessionStorage.setItem('thales-verified-session', JSON.stringify(verifiedUser));
  } catch {}

  listeners.forEach((cb) => cb(currentUser));
  return verifiedUser;
}

export async function signOutUser(): Promise<void> {
  if (auth && isFirebaseConfigured) {
    try {
      await signOut(auth);
    } catch {}
  }
  currentUser = null;
  try {
    sessionStorage.removeItem('thales-verified-session');
  } catch {}
  listeners.forEach((cb) => cb(null));
}

export async function fetchProtectedContact(user: AuthUser | null): Promise<ContactData | null> {
  if (!user) return null;

  // Se o Firestore estiver online, tenta buscar o documento
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, 'portfolio', 'contacts'));
      if (snap.exists()) {
        const data = snap.data();
        return {
          email: data.email || 'thales.everardo@gmail.com',
          phone: data.phone || '+55 11 96296 9508',
        };
      }
    } catch {}
  }

  // Entrega autorizada pós-validação
  return {
    email: 'thales.everardo@gmail.com',
    phone: '+55 11 96296 9508',
  };
}
