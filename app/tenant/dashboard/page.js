'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from '../../../components/providers/SessionProvider';
import ClientIcon from '../../../components/ClientIcon';

const EMPTY_POST = {
  title: '',
  subtitle: '',
  summary: '',
  content: '',
  contentType: 'markdown',
  isPublished: true
};

export default function TenantDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState(EMPTY_POST);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [lastUpdated, setLastUpdated] = useState(null);

  const apiToken = session?.user?.apiToken || '';
  const userName = session?.user?.name || session?.user?.email || 'Locataire';

  const isTenant = useMemo(() => {
    return (session?.user?.role || '').toString().toLowerCase() === 'tenant';
  }, [session?.user?.role]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/tenant');
    }
  }, [status, router]);

  const loadPost = useCallback(async () => {
    if (!apiToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/tenant/posts', {
        headers: {
          Authorization: `Bearer ${apiToken}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        setFeedback({ type: 'error', message: 'Votre session a expiré. Veuillez vous reconnecter.' });
        await signOut({ callbackUrl: '/tenant' });
        return;
      }

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Impossible de charger votre publication.');
      }

      if (result.data) {
        setPost((prev) => ({
          ...prev,
          ...result.data
        }));
        setLastUpdated(result.data.updatedAt ? new Date(result.data.updatedAt) : null);
      } else {
        setPost(EMPTY_POST);
        setLastUpdated(null);
      }
    } catch (error) {
      console.error('Failed to load tenant post', error);
      setFeedback({ type: 'error', message: "Une erreur est survenue lors du chargement de votre publication." });
    } finally {
      setLoading(false);
    }
  }, [apiToken]);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    if (!isTenant) {
      router.replace('/');
      return;
    }

    loadPost();
  }, [status, isTenant, loadPost, router]);

  const handleFieldChange = (field) => (event) => {
    const value = field === 'isPublished' ? event.target.checked : event.target.value;
    setPost((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!apiToken) return;

    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await fetch('/api/tenant/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          title: post.title,
          subtitle: post.subtitle,
          summary: post.summary,
          content: post.content,
          contentType: post.contentType,
          isPublished: post.isPublished
        })
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Impossible de sauvegarder votre publication.');
      }

      setFeedback({ type: 'success', message: result.message || 'Publication enregistrée avec succès.' });
      setLastUpdated(result.data?.updatedAt ? new Date(result.data.updatedAt) : new Date());
      setPost((prev) => ({
        ...prev,
        ...result.data
      }));
    } catch (error) {
      console.error('Failed to save tenant post', error);
      setFeedback({ type: 'error', message: error.message || 'Une erreur est survenue lors de la sauvegarde.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/tenant' });
  };

  const renderFeedback = () => {
    if (!feedback.message) return null;

    if (feedback.type === 'success') {
      return (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-start gap-2">
          <ClientIcon name="CircleCheck" className="w-4 h-4 mt-0.5" />
          <span>{feedback.message}</span>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
        <ClientIcon name="AlertTriangle" className="w-4 h-4 mt-0.5" />
        <span>{feedback.message}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-md shadow-primary-900/5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-primary-500">Espace locataire</p>
            <h1 className="text-3xl font-semibold text-neutral-900">Bonjour {userName}</h1>
            <p className="text-sm text-neutral-500">
              Gérez ici la présentation de votre annonce. Les modifications sont instantanément sauvegardées et visibles par notre équipe.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-100"
          >
            <ClientIcon name="LogOut" className="h-4 w-4" />
            Déconnexion
          </button>
        </header>

        {renderFeedback()}

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-8 shadow-md shadow-primary-900/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900">Aperçu de votre annonce</h2>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${post.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'}`}>
                <span className={`h-2 w-2 rounded-full ${post.isPublished ? 'bg-emerald-500' : 'bg-neutral-500'}`} />
                {post.isPublished ? 'En ligne' : 'Brouillon'}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Titre</p>
                <p className="text-lg font-semibold text-neutral-900">{post.title || 'Aucun titre défini'}</p>
              </div>
              {post.subtitle ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Sous-titre</p>
                  <p className="text-sm text-neutral-600">{post.subtitle}</p>
                </div>
              ) : null}
              {post.summary ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Résumé</p>
                  <p className="text-sm text-neutral-600 whitespace-pre-wrap">{post.summary}</p>
                </div>
              ) : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Contenu détaillé</p>
                <div className="mt-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700 whitespace-pre-wrap">
                  {post.content || 'Aucun contenu saisi pour le moment.'}
                </div>
              </div>
              {lastUpdated ? (
                <p className="text-xs text-neutral-400">
                  Dernière mise à jour le {lastUpdated.toLocaleDateString()} à {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-md shadow-primary-900/5">
            <h2 className="text-xl font-semibold text-neutral-900">Modifier votre publication</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Ajustez le contenu de votre annonce puis cliquez sur « Enregistrer » pour publier vos modifications.
            </p>

            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-neutral-700">
                  Titre principal
                </label>
                <input
                  id="title"
                  type="text"
                  value={post.title}
                  onChange={handleFieldChange('title')}
                  required
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 shadow-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="Ex. : Séjour montagnard tout confort"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subtitle" className="text-sm font-medium text-neutral-700">
                  Sous-titre (optionnel)
                </label>
                <input
                  id="subtitle"
                  type="text"
                  value={post.subtitle}
                  onChange={handleFieldChange('subtitle')}
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 shadow-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="Mettez en avant un point fort"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="summary" className="text-sm font-medium text-neutral-700">
                  Résumé (optionnel)
                </label>
                <textarea
                  id="summary"
                  value={post.summary}
                  onChange={handleFieldChange('summary')}
                  rows={3}
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 shadow-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="Décrivez en quelques lignes l&apos;essentiel de votre annonce"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium text-neutral-700">
                  Contenu détaillé
                </label>
                <textarea
                  id="content"
                  value={post.content}
                  onChange={handleFieldChange('content')}
                  rows={8}
                  required
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 shadow-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="Décrivez précisément votre offre, vos services, vos conditions, etc."
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={post.isPublished}
                  onChange={handleFieldChange('isPublished')}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Rendre ma publication visible par l&apos;équipe Chalet Manager</span>
              </label>

              <button
                type="submit"
                disabled={saving || loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sauvegarde en cours...
                  </>
                ) : (
                  <>
                    <ClientIcon name="Save" className="h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </form>
          </section>
        </div>

        {loading ? (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-lg">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              <span className="text-sm font-medium text-neutral-600">Chargement de votre espace...</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
