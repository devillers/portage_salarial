'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../hooks/useAuth';
import ClientIcon from '../../components/ClientIcon';

const INITIAL_CREDENTIALS = {
  email: '',
  password: ''
};

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState(INITIAL_CREDENTIALS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { status, login } = useAuth();
  const router = useRouter();

  const isSubmitDisabled = useMemo(() => {
    return loading || !credentials.email.trim() || !credentials.password;
  }, [credentials.email, credentials.password, loading]);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin/dashboard');
    }
  }, [status, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await login({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password
    });

    if (!result.success) {
      setError(result.message || 'Identifiants invalides.');
    } else {
      router.replace('/admin/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary-700 rounded-full flex items-center justify-center">
              <ClientIcon name="Mountain" className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Administration
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Connectez-vous à votre espace d'administration
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <ClientIcon name="AlertCircle" className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="admin@admin.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Votre mot de passe"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full px-4 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connexion...
                </>
              ) : (
                <>
                  <ClientIcon name="LogIn" className="mr-2 h-5 w-5" />
                  Se Connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500">
              Accès réservé aux administrateurs autorisés. Identifiants par défaut : admin@admin.com / admin123.
            </p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-primary-700 hover:text-primary-800 text-sm font-medium transition-colors flex items-center justify-center"
          >
            <ClientIcon name="ArrowLeft" className="mr-1 h-4 w-4" />
            Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}