'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const STORAGE_KEY = 'chalet-management.session';

const SessionContext = createContext({
  data: null,
  status: 'loading'
});

let externalSignIn = async () => ({
  error: "Le gestionnaire de session est en cours d'initialisation."
});

let externalSignOut = async () => ({ ok: true });

const normaliseUser = (user, token) => ({
  id: user?.id
    ? typeof user.id === 'string'
      ? user.id
      : user.id.toString?.() ?? ''
    : user?._id
    ? typeof user._id === 'string'
      ? user._id
      : user._id.toString?.() ?? ''
    : '',
  name: user?.username || user?.name || '',
  email: user?.email || '',
  role: user?.role || 'user',
  apiToken: token || user?.apiToken || ''
});

const loadStoredSession = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.user) return null;

    return parsed;
  } catch (error) {
    console.warn('Failed to parse stored session', error);
    return null;
  }
};

const persistSession = (session) => {
  if (typeof window === 'undefined') return;

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export function useSession() {
  return useContext(SessionContext);
}

export async function signIn(provider, options = {}) {
  return externalSignIn(provider, options);
}

export async function signOut(options = {}) {
  return externalSignOut(options);
}

export default function AuthSessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const stored = loadStoredSession();
    if (stored) {
      setSession(stored);
      setStatus('authenticated');
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  const performSignIn = useCallback(async (provider, options = {}) => {
    if (provider !== 'credentials') {
      return { error: 'Ce fournisseur d\'authentification n\'est pas pris en charge.' };
    }

    const email = options.email?.trim().toLowerCase();
    const password = options.password;

    if (!email || !password) {
      return { error: 'Veuillez renseigner un email et un mot de passe.' };
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: email, password })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        const message = result?.message || 'Identifiants invalides.';
        return { error: message };
      }

      const user = normaliseUser(result.user, result.token);
      const sessionData = { user };

      setSession(sessionData);
      setStatus('authenticated');
      persistSession(sessionData);

      return {
        ok: true,
        url: options.callbackUrl ?? '/'
      };
    } catch (error) {
      console.error('Sign-in failed', error);
      return { error: 'Une erreur est survenue. Veuillez réessayer.' };
    }
  }, []);

  const performSignOut = useCallback(async (options = {}) => {
    persistSession(null);
    setSession(null);
    setStatus('unauthenticated');

    return {
      ok: true,
      url: options.callbackUrl ?? '/'
    };
  }, []);

  useEffect(() => {
    externalSignIn = performSignIn;
    externalSignOut = performSignOut;

    return () => {
      externalSignIn = async () => ({
        error: "Le gestionnaire de session est en cours d'initialisation."
      });
      externalSignOut = async () => ({ ok: true });
    };
  }, [performSignIn, performSignOut]);

  const value = useMemo(
    () => ({
      data: session,
      status
    }),
    [session, status]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
