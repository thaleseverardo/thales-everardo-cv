import { useState, useEffect, useCallback } from 'react';
import {
  AuthUser,
  ContactData,
  subscribeToAuth,
  signInWithGoogle,
  signOutUser,
  fetchProtectedContact,
} from '../services/firebaseAuth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const data = await fetchProtectedContact(authUser);
        setContact(data);
      } else {
        setContact(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = useCallback(async () => {
    // 1. Zera o estado React imediatamente (UI responde no mesmo milissegundo)
    setUser(null);
    setContact(null);
    // 2. Executa a limpeza da sessão no Firebase em segundo plano
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Aviso durante encerramento de sessão:', e);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    contact,
    signInWithGoogle,
    signOut: handleSignOut,
  };
}
