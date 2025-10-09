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
const ALLOWED_ROLES = ['admin', 'super-admin', 'owner', 'tenant'];

const normaliseRoleValue = (role, isOwner = false) => {
  const candidate = (role || '').toString().trim().toLowerCase();

  if (isOwner && candidate !== 'owner') {
    return 'owner';
  }

  if (candidate) {
    return candidate;
  }

  if (isOwner) {
    return 'owner';
  }

  return '';
};

const isRoleAllowed = (role, isOwner = false) => {
  const normalizedRole = normaliseRoleValue(role, isOwner);
  if (!normalizedRole) return false;
  return ALLOWED_ROLES.includes(normalizedRole);
};

const SessionContext = createContext({
  data: null,
  status: 'loading'
});

let externalSignIn = async () => ({
  error: "Le gestionnaire de session est en cours d'initialisation."
});

let externalSignOut = async () => ({ ok: true });

const normaliseUser = (user, token) => {
  const role = normaliseRoleValue(user?.role, user?.isOwner);

  return {
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
    role: role || 'user',
    isOwner: role === 'owner',
    apiToken: token || user?.apiToken || ''
  };
};

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

    if (stored?.user && !isRoleAllowed(stored.user.role, stored.user.isOwner)) {
      persistSession(null);
      setSession(null);
      setStatus('unauthenticated');
      return;
    }

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

      if (!isRoleAllowed(user.role, user.isOwner)) {
        return { error: "Vous n'avez pas les droits nécessaires pour accéder à l'admin." };
      }

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

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    const role = session?.user?.role;
    const isOwner = session?.user?.isOwner;

    if (!role) {
      return;
    }

    if (!isRoleAllowed(role, isOwner)) {
      void performSignOut({ callbackUrl: '/admin' });
    }
  }, [status, session?.user?.role, session?.user?.isOwner, performSignOut]);

  const value = useMemo(
    () => ({
      data: session,
      status
    }),
    [session, status]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
