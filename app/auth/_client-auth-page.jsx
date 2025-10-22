'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from '../../components/providers/SessionProvider';
import ClientIcon from '../../components/ClientIcon';
import PageWrapper from '../../components/layout/PageWrapper';

const INITIAL_FORM = {
  email: '',
  password: '',
};

export default function AuthPageClient() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const isSubmittingDisabled = useMemo(() => {
    return loading || !form.email.trim() || !form.password;
  }, [form.email, form.password, loading]);

  // Redirige si déjà authentifié
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin/dashboard');
    }
  }, [status, router]);

  // Récupère un éventuel message d’erreur passé en query (?error=...)
  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        callbackUrl: '/admin/dashboard',
      });

      if (result?.error) {
        setError(
          result.error === 'CredentialsSignin'
            ? 'Identifiants invalides.'
            : result.error
        );
      } else {
        setSuccess('Connexion réussie. Redirection en cours...');
        const redirectUrl = result?.url ?? '/admin/dashboard';
        setTimeout(() => {
          router.replace(redirectUrl);
        }, 500);
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper mainClassName="flex min-h-screen flex-col bg-neutral-50 px-0 py-0 lg:flex-row">
      {/* Panneau gauche : héro */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center px-6 py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 opacity-90" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url(https://images.pexels.com/photos/1129187/pexels-photo-1129187.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <ClientIcon name="ShieldCheck" className="w-6 h-6" />
            </div>
            <span className="uppercase tracking-[0.4em] text-sm font-semibold text-white/80">
              ESPACE MEMBRE
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Gérez vos chalets avec une plateforme sécurisée et intuitive.
          </h1>

          <p className="text-white/80 text-lg">
            Accédez à vos outils de suivi, mettez à jour vos contenus et collaborez avec notre équipe dédiée depuis une seule interface.
          </p>

          <ul className="space-y-4">
            {[
              'Connexion sécurisée avec notre système interne',
              'Gestion centralisée du portfolio',
              'Support dédié 7j/7',
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="mt-1">
                  <ClientIcon name="CheckCircle" className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-white/85 text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="bg-white/10 rounded-2xl p-6 space-y-2">
            <p className="text-sm font-semibold text-white/90">Identifiants de démonstration</p>
            <p className="text-sm text-white/80">
              Email : <span className="font-medium">admin@admin.com</span>
            </p>
            <p className="text-sm text-white/80">
              Mot de passe : <span className="font-medium">admin123</span>
            </p>
          </div>
        </div>
      </div>

      {/* Panneau droit : formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 py-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Connexion sécurisée</h2>
            <p className="text-neutral-600 text-sm">
              Connectez-vous avec vos identifiants administrateur pour accéder à la console de gestion.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {error ? (
              <div
                className="p-4 border border-red-200 bg-red-50 rounded-xl flex items-start gap-3"
                role="alert"
                aria-live="polite"
              >
                <ClientIcon name="AlertCircle" className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : null}

            {success ? (
              <div
                className="p-4 border border-emerald-200 bg-emerald-50 rounded-xl flex items-start gap-3"
                role="status"
                aria-live="polite"
              >
                <ClientIcon name="CircleCheck" className="w-5 h-5 text-emerald-600" />
                <p className="text-sm text-emerald-700">{success}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-neutral-700">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <ClientIcon
                    name="Mail"
                    className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="vous@exemple.com"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <ClientIcon
                    name="Lock"
                    className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2"
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingDisabled}
                aria-busy={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <ClientIcon name="LogIn" className="w-5 h-5" />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
              <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
                Besoin d&apos;aide ?
              </p>
              <p className="text-sm text-neutral-600">
                Utilisez les identifiants fournis ou contactez notre équipe support pour obtenir un accès personnalisé.
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-500 text-center">
            Authentification sécurisée propulsée par NextAuth.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
