import { useState, useEffect } from 'react';
import {
  AuthUser,
  subscribeToAuth,
  signInWithGoogle,
  signInWithGithub,
  signOutUser,
  getAuthorizedContact,
} from '../services/firebaseAuth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const contact = getAuthorizedContact(user);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    contact,
    signInWithGoogle,
    signInWithGithub,
    signOut: signOutUser,
  };
}
