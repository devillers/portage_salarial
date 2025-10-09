'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from '../../components/providers/SessionProvider';
import ClientIcon from '../../components/ClientIcon';

const INITIAL_FORM_STATE = {
  email: '',
  password: ''
};

export default function TenantLoginPage() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    const role = session?.user?.role;

    if (role === 'tenant') {
      router.replace('/tenant/dashboard');
      return;
    }

    if (role) {
      setError("Cet espace est réservé aux locataires. Vous avez été déconnecté.");
      void signOut({ callbackUrl: '/tenant' });
    }
  }, [status, session?.user?.role, router]);

  const isSubmitDisabled = useMemo(() => {
    return loading || !form.email.trim() || !form.password;
  }, [form.email, form.password, loading]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        callbackUrl: '/tenant/dashboard'
      });

      if (result?.error) {
        setError(
          result.error === 'CredentialsSignin'
            ? 'Identifiants invalides.'
            : result.error
        );
      } else {
        setInfoMessage('Connexion réussie. Redirection vers votre espace locataire...');
        setTimeout(() => {
          router.replace(result?.url ?? '/tenant/dashboard');
        }, 400);
      }
    } catch (err) {
      console.error('Tenant login failed', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid gap-10 lg:grid-cols-2">
        <div className="bg-white rounded-3xl shadow-xl p-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center">
              <ClientIcon name="Home" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-primary-600/80 font-semibold">
                Espace locataire
              </p>
              <h1 className="text-2xl font-semibold text-neutral-900">Connexion sécurisée</h1>
            </div>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed">
            Accédez à votre espace personnel pour consulter et mettre à jour votre annonce. Vos
            informations sont protégées et accessibles à tout moment.
          </p>

          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 space-y-2 text-sm text-primary-900">
            <p className="font-semibold">Besoin d&apos;aide ?</p>
            <p>Contactez notre équipe support à l&apos;adresse support@chaletmanager.com.</p>
          </div>

          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <ClientIcon name="ShieldCheck" className="w-5 h-5 text-primary-500" />
            <span>Authentification renforcée et gestion autonome de votre annonce.</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700">
                Adresse e-mail
              </label>
              <div className="relative">
                <ClientIcon name="Mail" className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 pl-10 text-sm text-neutral-900 shadow-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                Mot de passe
              </label>
              <div className="relative">
                <ClientIcon name="Lock" className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 pl-10 text-sm text-neutral-900 shadow-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="Votre mot de passe"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                <ClientIcon name="AlertTriangle" className="w-4 h-4 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : null}

            {infoMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-start gap-2">
                <ClientIcon name="CircleCheck" className="w-4 h-4 mt-0.5" />
                <span>{infoMessage}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Connexion...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ClientIcon name="LogIn" className="w-4 h-4" />
                  Se connecter
                </span>
              )}
            </button>
          </form>

          <div className="text-center text-sm text-neutral-500">
            <p>
              Vous n&apos;êtes pas locataire ?
              <Link href="/admin" className="ml-1 font-medium text-primary-600 hover:text-primary-700">
                Accédez à l&apos;espace administrateur
              </Link>
            </p>
          </div>

          <div className="text-center text-xs text-neutral-400">
            <Link href="/" className="inline-flex items-center gap-2 hover:text-neutral-600">
              <ClientIcon name="ArrowLeft" className="w-4 h-4" />
              Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
