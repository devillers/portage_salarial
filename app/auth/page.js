'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ClientIcon from '../../components/ClientIcon';

const LOGIN_MODE = 'login';
const REGISTER_MODE = 'register';

const INITIAL_FORM = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export default function AuthPage() {
  const [mode, setMode] = useState(LOGIN_MODE);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.role === 'admin') {
          router.replace('/admin/dashboard');
        }
      }
    } catch (err) {
      console.warn('Unable to restore auth session', err);
    }
  }, [router]);

  const isLoginMode = useMemo(() => mode === LOGIN_MODE, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === LOGIN_MODE ? REGISTER_MODE : LOGIN_MODE));
    setForm(INITIAL_FORM);
    setError('');
    setSuccess('');
  };

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
    setSuccess('');

    try {
      if (!isLoginMode && form.password !== form.confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }

      const payload = isLoginMode
        ? { username: form.username.trim(), password: form.password }
        : {
            username: form.username.trim(),
            email: form.email.trim(),
            password: form.password
          };

      const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data?.success) {
        throw new Error(data?.message || "Une erreur est survenue lors de l'authentification.");
      }

      const targetUser = data.user ?? null;
      const token = data.token ?? null;

      if (token && typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(targetUser));

        if (targetUser?.role === 'admin') {
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminUser', JSON.stringify(targetUser));
        }
      }

      if (isLoginMode) {
        setSuccess('Connexion réussie. Redirection en cours...');
      } else {
        setSuccess('Compte créé avec succès. Redirection en cours...');
      }

      setTimeout(() => {
        if (targetUser?.role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/');
        }
      }, 800);
    } catch (err) {
      setError(err.message || "Impossible d'effectuer la requête.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row">
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
              mixBlendMode: 'multiply'
            }}
          />
        </div>

        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <ClientIcon name="ShieldCheck" className="w-6 h-6" />
            </div>
            <span className="uppercase tracking-[0.4em] text-sm font-semibold text-white/80">ESPACE MEMBRE</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Gérez vos chalets avec une plateforme sécurisée et intuitive.
          </h1>

          <p className="text-white/80 text-lg">
            Accédez à vos outils de suivi, mettez à jour vos contenus et collaborez avec notre équipe dédiée depuis une seule interface.
          </p>

          <ul className="space-y-4">
            {["Connexion sécurisée par jeton", 'Gestion du contenu portfolio', 'Support dédié 7j/7'].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="mt-1">
                  <ClientIcon name="CheckCircle" className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-white/85 text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 py-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              {isLoginMode ? 'Connexion à votre espace' : 'Créer un compte gestionnaire'}
            </h2>
            <p className="text-neutral-600 text-sm">
              {isLoginMode
                ? 'Entrez vos identifiants pour accéder à la plateforme de gestion.'
                : 'Renseignez vos informations pour activer votre accès sécurisé.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="flex items-center justify-between bg-neutral-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setMode(LOGIN_MODE)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isLoginMode ? 'bg-white shadow text-neutral-900' : 'text-neutral-500'
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setMode(REGISTER_MODE)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  !isLoginMode ? 'bg-white shadow text-neutral-900' : 'text-neutral-500'
                }`}
              >
                Inscription
              </button>
            </div>

            {error ? (
              <div className="p-4 border border-red-200 bg-red-50 rounded-xl flex items-start gap-3">
                <ClientIcon name="AlertCircle" className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : null}

            {success ? (
              <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-xl flex items-start gap-3">
                <ClientIcon name="CircleCheck" className="w-5 h-5 text-emerald-600" />
                <p className="text-sm text-emerald-700">{success}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-neutral-700">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <ClientIcon name="User" className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="username"
                    name="username"
                    required
                    value={form.username}
                    onChange={handleChange}
                    placeholder="ex: gestionnaire-alpes"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {!isLoginMode ? (
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
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="vous@exemple.com"
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : null}

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
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {!isLoginMode ? (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-700">
                    Confirmation du mot de passe
                  </label>
                  <div className="relative">
                    <ClientIcon name="Shield" className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="********"
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <ClientIcon name={isLoginMode ? 'LogIn' : 'UserPlus'} className="w-5 h-5" />
                    {isLoginMode ? 'Se connecter' : "Créer mon compte"}
                  </>
                )}
              </button>
            </form>

            {isLoginMode ? (
              <div className="text-right">
                <Link href="/contact" className="text-sm text-primary-700 hover:text-primary-800 font-medium">
                  Besoin d'aide ? Contactez-nous
                </Link>
              </div>
            ) : null}
          </div>

          <p className="text-xs text-neutral-500 text-center">
            En vous connectant, vous acceptez nos conditions générales d'utilisation et notre politique de confidentialité.
          </p>

          <p className="text-sm text-neutral-600 text-center">
            {isLoginMode ? (
              <>
                Pas encore de compte ?{' '}
                <button type="button" onClick={toggleMode} className="text-primary-700 font-semibold hover:text-primary-800">
                  Créer un accès
                </button>
              </>
            ) : (
              <>
                Vous avez déjà un accès ?{' '}
                <button type="button" onClick={toggleMode} className="text-primary-700 font-semibold hover:text-primary-800">
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
