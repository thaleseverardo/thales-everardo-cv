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

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);
const app = getApps().length > 0 ? getApp() : (isConfigured ? initializeApp(firebaseConfig) : null);

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
    provider: user.providerData[0]?.providerId || 'google.com',
  };
}

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

export async function signInWithGoogle(): Promise<AuthUser> {
  if (!isConfigured || !auth) {
    alert('Configuração do Firebase ausente no .env.local.');
    throw new Error('Firebase Auth not configured');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);
  const user = mapFirebaseUser(result.user);
  if (!user) throw new Error('Falha ao autenticar usuário.');
  currentUser = user;
  return user;
}

export async function signOutUser(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
  currentUser = null;
  listeners.forEach((cb) => cb(null));
}

/**
 * Consulta autenticada ao Cloud Firestore
 */
export async function fetchProtectedContact(user: AuthUser | null): Promise<ContactData | null> {
  if (!user || !db) return null;

  try {
    const snap = await getDoc(doc(db, 'portfolio', 'contacts'));
    if (snap.exists()) {
      const data = snap.data();
      return {
        email: data.email || '',
        phone: data.phone || '',
      };
    }
  } catch (error) {
    console.error('Erro ao buscar contatos protegidos no Firestore:', error);
  }

  return null;
}
