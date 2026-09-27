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
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);

const app = getApps().length > 0 ? getApp() : (isFirebaseConfigured ? initializeApp(firebaseConfig) : null);
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && app) {
  isSupported().then((supported) => {
    if (supported && app) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn('Analytics não inicializado:', e);
      }
    }
  });
}

export function logAnalyticsEvent(eventName: string, eventParams?: Record<string, any>) {
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
    if (!user) throw new Error('Falha ao processar login do Google.');
    currentUser = user;
    listeners.forEach((cb) => cb(currentUser));
    return user;
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user') {
      console.warn('Login cancelado pelo usuário.');
    } else {
      console.error('Erro na autenticação do Google:', error);
    }
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
    if (!user) throw new Error('Falha ao processar login do GitHub.');
    currentUser = user;
    listeners.forEach((cb) => cb(currentUser));
    return user;
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user') {
      console.warn('Login cancelado pelo usuário.');
    } else if (error?.code === 'auth/account-exists-with-different-credential') {
      // Erro tratado no modal de UI
    } else {
      console.error('Erro na autenticação do GitHub:', error);
    }
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    if (auth) {
      await signOut(auth);
    }
  } catch (err) {
    console.warn("Aviso ao encerrar sessão Firebase:", err);
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

  // 1. Tenta carregar do Firestore Database
  if (db) {
    try {
      const snap = await getDoc(doc(db, "portfolio", "contacts"));
      if (snap.exists()) {
        const data = snap.data();
        const email = data.email || data.Email || '';
        const phone = data.phone || data.Phone || data.whatsapp || data.telefone || '';

        if (email || phone) {
          return {
            email: String(email).trim() || 'thales.everardo@gmail.com',
            phone: String(phone).trim() || '+55 11 98322-0744',
          };
        }
      } else {
        console.warn(
          "[Firestore Warning] Documento 'portfolio/contacts' não encontrado. Verifique se a coleção é 'portfolio' e o documento é 'contacts'."
        );
      }
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        console.error(
          "[Firestore Permission Denied] As regras de segurança do Firestore bloquearam a leitura. Permita a leitura com: allow read: if request.auth != null; no Firebase Console."
        );
      } else {
        console.error("[Firestore Error] Falha ao carregar contatos protegidos:", error);
      }
    }
  }

  // 2. FALLBACK RESILIENTE DE MISSÃO CRÍTICA:
  // Se o usuário passou pelo OAuth com sucesso, não o deixamos preso em 'Carregando...'.
  return {
    email: 'thales.everardo@gmail.com',
    phone: '+55 11 98322-0744',
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

  // 1. Limpeza de registros no Firestore se houver
  if (db && firebaseUser.uid) {
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, "audit_sessions", firebaseUser.uid));
    } catch {}
  }

  // 2. Tentativa direta de exclusão
  try {
    await deleteUser(firebaseUser);
    currentUser = null;
    listeners.forEach((cb) => cb(null));
    return true;
  } catch (err: any) {
    // 3. Tratamento de segurança obrigatório: auth/requires-recent-login
    if (err?.code === 'auth/requires-recent-login') {
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
        console.warn("Usuário cancelou a confirmação de segurança ou falha na reautenticação:", reauthErr);
        await signOut(auth);
        currentUser = null;
        listeners.forEach((cb) => cb(null));
        return false;
      }
    } else {
      console.error("Erro inesperado na exclusão do usuário:", err);
      await signOut(auth);
      currentUser = null;
      listeners.forEach((cb) => cb(null));
      return false;
    }
  }
}

