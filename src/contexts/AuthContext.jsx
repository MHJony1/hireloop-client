'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { authClient } from '@/lib/auth-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const { data } = await authClient.getSession();
      setUser(data?.user || null);
    } catch (error) {
      console.error('Error fetching session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial session fetch
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Listen for route changes (popstate)
  useEffect(() => {
    const handleRouteChange = () => {
      fetchSession();
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [fetchSession]);

  // Poll session every 10 seconds (keeps session fresh)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSession();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchSession]);

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  const signIn = useCallback(
    async (email, password) => {
      try {
        const result = await authClient.signIn.email({
          email,
          password,
        });
        await fetchSession();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [fetchSession],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refetch: fetchSession,
        signOut,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
