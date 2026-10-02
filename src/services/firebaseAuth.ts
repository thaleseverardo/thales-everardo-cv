import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  deleteUser,
  reauthenticateWithPopup,
  AuthError,
} from 'firebase/auth';
// Firestore carregado dinamicamente sob demanda para otimizar o FCP móvel

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
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);

const app = getApps().length > 0 ? getApp() : (isFirebaseConfigured ? initializeApp(firebaseConfig) : null);
export const auth = app ? getAuth(app) : null;
export const db = null;

export let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && app) {
  isSupported().then((supported) => {
    if (supported && app) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn('Analytics not initialized:', e);
      }
    }
  });
}

export function logAnalyticsEvent(eventName: string, eventParams?: Record<string, string | number | boolean>) {
  try {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch {}
}


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
    provider: user.providerData[0]?.providerId || 'password',
  };
}

let authListenerInitialized = false;

function initAuthListener() {
  if (auth && !authListenerInitialized) {
    authListenerInitialized = true;
    onAuthStateChanged(auth, (user) => {
      currentUser = mapFirebaseUser(user);
      listeners.forEach((cb) => cb(currentUser));
    });
  }
}

export function subscribeToAuth(callback: AuthListener): () => void {
  initAuthListener();
  listeners.add(callback);
  callback(currentUser);
  return () => listeners.delete(callback);
}

export async function signInWithGoogle(): Promise<AuthUser> {
  if (!isFirebaseConfigured || !auth) {
    // Credenciais ausentes
    throw new Error('Firebase Auth not configured');
  }

  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = mapFirebaseUser(result.user);
    if (!user) throw new Error('Failed to process Google sign-in.');
    currentUser = user;
    listeners.forEach((cb) => cb(currentUser));
    logAnalyticsEvent('auth_success', { provider: 'google.com' });
    return user;
  } catch (err) {
    const error = err as AuthError;
    if (error?.code === 'auth/popup-closed-by-user') {
      console.warn('Sign-in cancelled by user.');
    } else {
      console.error('Google authentication error:', error);
    }
    logAnalyticsEvent('auth_failure', { provider: 'google.com', errorCode: error?.code || 'unknown' });
    throw error;
  }
}

export async function signInWithGithub(): Promise<AuthUser> {
  if (!isFirebaseConfigured || !auth) {
    // Credenciais ausentes
    throw new Error('Firebase Auth not configured');
  }

  const provider = new GithubAuthProvider();
  provider.addScope('read:user');
  provider.addScope('user:email');

  try {
    const result = await signInWithPopup(auth, provider);
    const user = mapFirebaseUser(result.user);
    if (!user) throw new Error('Failed to process GitHub sign-in.');
    currentUser = user;
    listeners.forEach((cb) => cb(currentUser));
    logAnalyticsEvent('auth_success', { provider: 'github.com' });
    return user;
  } catch (err) {
    const error = err as AuthError;
    if (error?.code === 'auth/popup-closed-by-user') {
      console.warn('Sign-in cancelled by user.');
    } else if (error?.code === 'auth/account-exists-with-different-credential') {
      // Erro tratado no modal de UI
    } else {
      console.error('GitHub authentication error:', error);
    }
    logAnalyticsEvent('auth_failure', { provider: 'github.com', errorCode: error?.code || 'unknown' });
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    if (auth) {
      await signOut(auth);
    }
  } catch (err) {
    console.warn("Warning during Firebase sign-out:", err);
  }
  currentUser = null;
  listeners.forEach((cb) => {
    try {
      cb(null);
    } catch {}
  });
}

export async function fetchProtectedContact(user: AuthUser | null): Promise<ContactData | null> {
  if (!user) return null;

  // 1. Tenta carregar do Firestore Database via import dinâmico sob demanda
  if (app) {
    try {
      const { getFirestore, doc, getDoc } = await import('firebase/firestore');
      const firestoreDb = getFirestore(app);
      const snap = await getDoc(doc(firestoreDb, "portfolio", "contacts"));
      if (snap.exists()) {
        const data = snap.data();
        const email = data.email || data.Email || '';
        const phone = data.phone || data.Phone || data.whatsapp || data.telefone || '';

        if (email || phone) {
          return {
            email: String(email).trim() || 'email@gmail.com',
            phone: String(phone).trim() || '+55 11 99999-9999',
          };
        }
      }
    } catch (err) {
      console.warn("[Firestore Notice] Usando fallback resiliente de contatos.");
    }
  }

  // 2. FALLBACK RESILIENTE DE MISSÃO CRÍTICA:
  // Se o usuário passou pelo OAuth com sucesso, não o deixamos preso em 'Carregando...'.
  return {
    email: 'email@gmail.com',
    phone: '+55 11 99999-9999',
  };
}

export async function revokeAccessAndPurgeUserData(user?: AuthUser | null): Promise<boolean> {
  if (!auth) return false;

  let firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    currentUser = null;
    listeners.forEach((cb) => cb(null));
    return true;
  }

  // 1. Limpeza de registros no Firestore via import dinâmico se houver
  if (app && firebaseUser.uid) {
    try {
      const { getFirestore, doc, deleteDoc } = await import('firebase/firestore');
      const firestoreDb = getFirestore(app);
      await deleteDoc(doc(firestoreDb, "audit_sessions", firebaseUser.uid));
    } catch {}
  }

  // 2. Tentativa direta de exclusão
  try {
    await deleteUser(firebaseUser);
    currentUser = null;
    listeners.forEach((cb) => cb(null));
    return true;
  } catch (err) {
    const error = err as AuthError;
    // 3. Tratamento de segurança obrigatório: auth/requires-recent-login
    if (error?.code === 'auth/requires-recent-login') {
      try {
        const providerId = firebaseUser.providerData[0]?.providerId || '';
        const provider = providerId.includes('github')
          ? new GithubAuthProvider()
          : new GoogleAuthProvider();

        if (provider instanceof GoogleAuthProvider) {
          provider.addScope('email');
          provider.addScope('profile');
        }

        // Renova as credenciais através de popup de confirmação do provedor
        await reauthenticateWithPopup(firebaseUser, provider);

        // Executa a exclusão definitiva agora com o token de segurança renovado
        firebaseUser = auth.currentUser || firebaseUser;
        await deleteUser(firebaseUser);

        currentUser = null;
        listeners.forEach((cb) => cb(null));
        return true;
      } catch (reauthErr) {
        console.warn("User cancelled security confirmation or re-authentication failed:", reauthErr);
        await signOut(auth);
        currentUser = null;
        listeners.forEach((cb) => cb(null));
        return false;
      }
    } else {
      console.error("Unexpected error during user deletion:", err);
      await signOut(auth);
      currentUser = null;
      listeners.forEach((cb) => cb(null));
      return false;
    }
  }
}

