'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cm-admin-token';

const AuthContext = createContext(null);

function getStoredToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Unable to access localStorage:', error);
    return null;
  }
}

function persistToken(token) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (token) {
      window.localStorage.setItem(STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Unable to persist auth token:', error);
  }
}

export default function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const resetSession = useCallback(() => {
    persistToken(null);
    setUser(null);
    setToken(null);
  }, []);

  const hydrateFromToken = useCallback(async (candidateToken) => {
    if (!candidateToken) {
      resetSession();
      setStatus('unauthenticated');
      return false;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${candidateToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const payload = await response.json();
      if (!payload?.success || !payload?.user) {
        throw new Error('Invalid payload');
      }

      setToken(candidateToken);
      setUser(payload.user);
      setStatus('authenticated');
      return true;
    } catch (error) {
      console.warn('Token verification failed:', error);
      resetSession();
      setStatus('unauthenticated');
      return false;
    }
  }, [resetSession]);

  useEffect(() => {
    const stored = getStoredToken();

    if (!stored) {
      setStatus('unauthenticated');
      return;
    }

    hydrateFromToken(stored);
  }, [hydrateFromToken]);

  const login = useCallback(async ({ email, password }) => {
    setStatus('loading');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email,
          password
        })
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success || !payload?.token) {
        const message = payload?.message || 'Identifiants invalides.';
        resetSession();
        setStatus('unauthenticated');
        return {
          success: false,
          message
        };
      }

      persistToken(payload.token);
      setToken(payload.token);
      setUser(payload.user ?? null);
      setStatus('authenticated');

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      resetSession();
      setStatus('unauthenticated');
      return {
        success: false,
        message: 'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
      };
    }
  }, [resetSession]);

  const logout = useCallback(() => {
    resetSession();
    setStatus('unauthenticated');
  }, [resetSession]);

  const value = useMemo(() => ({
    status,
    user,
    token,
    login,
    logout,
    hydrate: hydrateFromToken
  }), [status, user, token, login, logout, hydrateFromToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}
