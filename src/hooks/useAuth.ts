import { useState, useEffect } from 'react';
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

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    contact,
    signInWithGoogle,
    signOut: signOutUser,
  };
}
