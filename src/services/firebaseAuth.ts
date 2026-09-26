import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

export async function signInWithEmail(email: string, pass: string): Promise<AuthUser> {
  if (!auth) throw new Error("Firebase Auth não configurado");
  const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const user = mapFirebaseUser(res.user);
  if (!user) throw new Error("Falha ao autenticar");
  currentUser = user;
  listeners.forEach((cb) => cb(currentUser));
  return user;
}

export async function signUpWithEmail(email: string, pass: string): Promise<AuthUser> {
  if (!auth) throw new Error("Firebase Auth não configurado");
  const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const user = mapFirebaseUser(res.user);
  if (!user) throw new Error("Falha ao registrar");
  currentUser = user;
  listeners.forEach((cb) => cb(currentUser));
  return user;
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
  if (!user || !db) return null;

  try {
    const snap = await getDoc(doc(db, "portfolio", "contacts"));
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.email && data.phone) {
        return {
          email: String(data.email).trim(),
          phone: String(data.phone).trim(),
        };
      }
    }
  } catch (error) {
    console.error("Erro ao buscar contatos no Firestore:", error);
  }

  return null;
}
