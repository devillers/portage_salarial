'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from '../../../components/providers/SessionProvider';
import ClientIcon from '../../../components/ClientIcon';

const ALLOWED_ROLES = ['admin', 'super-admin', 'owner'];

export default function AdminChaletsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [chalets, setChalets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingChaletId, setUpdatingChaletId] = useState(null);

  const apiToken = session?.user?.apiToken;
  const userRole = session?.user?.role;
  const isSuperAdmin = userRole === 'super-admin';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && !ALLOWED_ROLES.includes(userRole)) {
      signOut({ callbackUrl: '/admin' });
    }
  }, [status, userRole]);

  const fetchChalets = useCallback(async () => {
    if (status !== 'authenticated' || !ALLOWED_ROLES.includes(userRole)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const headers = apiToken
        ? {
            Authorization: `Bearer ${apiToken}`
          }
        : undefined;

      const endpoint = isSuperAdmin
        ? '/api/chalets?includeInactive=true'
        : '/api/chalets?owner=me';

      const response = await fetch(endpoint, { headers });

      if (response.status === 401) {
        signOut({ callbackUrl: '/admin' });
        return;
      }

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Une erreur est survenue lors du chargement des chalets');
      }

      setChalets(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Failed to load chalets', err);
      setError(err?.message || 'Impossible de récupérer les chalets.');
    } finally {
      setLoading(false);
    }
  }, [apiToken, isSuperAdmin, status, userRole]);

  useEffect(() => {
    fetchChalets();
  }, [fetchChalets]);

  const handleToggleChaletStatus = async (chalet) => {
    if (!isSuperAdmin || !chalet?.slug || !apiToken) {
      return;
    }

    const nextStatus = !(chalet?.availability?.isActive ?? false);
    setUpdatingChaletId(chalet._id);

    try {
      const response = await fetch(`/api/chalets/${chalet.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          availability: {
            isActive: nextStatus
          }
        })
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Mise à jour impossible');
      }

      const updatedChalet = data.data;
      setChalets((prev) =>
        prev.map((item) => (item._id === updatedChalet._id ? updatedChalet : item))
      );
    } catch (err) {
      console.error('Failed to toggle chalet status', err);
      setError(err?.message || 'Impossible de mettre à jour le statut du chalet.');
    } finally {
      setUpdatingChaletId(null);
    }
  };

  const activeChalets = useMemo(
    () => chalets.filter((chalet) => chalet?.availability?.isActive),
    [chalets]
  );

  const inactiveChalets = useMemo(
    () => chalets.filter((chalet) => !chalet?.availability?.isActive),
    [chalets]
  );

  const userName = useMemo(() => {
    if (!session?.user) return '';
    return session.user.name || session.user.email || '';
  }, [session?.user]);

  const renderChaletCard = (chalet) => {
    const isActive = chalet?.availability?.isActive ?? false;
    const coverImage = chalet?.images?.[0];

    return (
      <li
        key={chalet._id}
        className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="relative h-48 bg-neutral-100">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={chalet.title || 'Chalet'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-neutral-400">
              <ClientIcon name="ImageOff" className="h-8 w-8 mb-2" />
              <span className="text-sm">Aucune image</span>
            </div>
          )}
          <div className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 shadow">
            <ClientIcon name="MapPin" className="h-4 w-4 mr-1" />
            {chalet.location?.city || 'Ville à préciser'}
          </div>
          <div
            className={`absolute top-4 right-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium shadow ${
              isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: isActive ? '#16a34a' : '#a3a3a3' }}
            />
            {isActive ? 'Actif' : 'Inactif'}
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {chalet.title || 'Chalet sans titre'}
            </h3>
            <p className="text-sm text-neutral-600 line-clamp-3">
              {chalet.description || 'Ajoutez une description pour mettre en valeur ce chalet.'}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Capacité</dt>
              <dd className="font-medium text-neutral-900">
                {chalet.capacity?.guests ? `${chalet.capacity.guests} voyageurs` : 'À renseigner'}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Surface</dt>
              <dd className="font-medium text-neutral-900">
                {chalet.details?.area ? `${chalet.details.area} m²` : 'À renseigner'}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Prix par nuit</dt>
              <dd className="font-medium text-neutral-900">
                {chalet.pricing?.pricePerNight
                  ? `${Number(chalet.pricing.pricePerNight).toLocaleString('fr-FR')} €`
                  : 'À renseigner'}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Visibilité</dt>
              <dd className="font-medium text-neutral-900">
                {isActive ? 'Visible sur le portfolio' : 'Masqué du portfolio'}
              </dd>
            </div>
          </dl>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <div className="flex items-center space-x-2 text-sm text-neutral-500">
              <ClientIcon name="Clock" className="h-4 w-4" />
              <span>
                Dernière mise à jour :{' '}
                {chalet.updatedAt
                  ? new Date(chalet.updatedAt).toLocaleDateString('fr-FR')
                  : 'Date inconnue'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => handleToggleChaletStatus(chalet)}
                  disabled={updatingChaletId === chalet._id}
                  className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {updatingChaletId === chalet._id
                    ? 'Mise à jour...'
                    : isActive
                      ? 'Masquer du portfolio'
                      : 'Publier'}
                </button>
              )}
              <Link
                href={`/admin/chalets/${chalet.slug || ''}`}
                className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:border-neutral-300"
              >
                Gérer
              </Link>
            </div>
          </div>
        </div>
      </li>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3 text-neutral-500">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-300 border-t-primary-700" />
          <span>Chargement des chalets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center mr-3">
                <ClientIcon name="Mountain" className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Gestion des chalets</h1>
                <p className="text-sm text-neutral-500">
                  Consultez et administrez les propriétés du portfolio Chalet Manager.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-neutral-600">
                Bonjour, <span className="font-semibold">{userName}</span>
                {isSuperAdmin ? (
                  <span className="ml-2 inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                    Super administrateur
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                    Propriétaire
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/admin' })}
                className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors flex items-center"
              >
                <ClientIcon name="LogOut" className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">{chalets.length} chalet(s)</h2>
            <p className="text-sm text-neutral-600">
              {isSuperAdmin
                ? 'Activez ou masquez les propriétés pour contrôler leur visibilité publique.'
                : 'Complétez vos informations pour publier votre chalet sur le portfolio.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:border-neutral-300"
            >
              <ClientIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Retour au dashboard
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <ClientIcon name="Plus" className="h-4 w-4 mr-2" />
              Ajouter un chalet
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {chalets.length ? (
          <div className="space-y-10">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">Chalets actifs</h3>
                <span className="text-sm text-neutral-500">
                  {activeChalets.length} visible(s) dans le portfolio
                </span>
              </div>
              {activeChalets.length ? (
                <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {activeChalets.map((chalet) => renderChaletCard(chalet))}
                </ul>
              ) : (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
                  Aucun chalet actif pour le moment.
                </div>
              )}
            </section>

            {isSuperAdmin && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Chalets masqués</h3>
                  <span className="text-sm text-neutral-500">
                    {inactiveChalets.length} en brouillon
                  </span>
                </div>
                {inactiveChalets.length ? (
                  <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {inactiveChalets.map((chalet) => renderChaletCard(chalet))}
                  </ul>
                ) : (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
                    Aucun chalet masqué. Tous vos chalets sont publiés.
                  </div>
                )}
              </section>
            )}

            {!isSuperAdmin && inactiveChalets.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Chalets en attente de publication</h3>
                  <span className="text-sm text-neutral-500">
                    {inactiveChalets.length} à compléter
                  </span>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
                  Complétez les informations et contactez l&apos;équipe Chalet Manager pour publier ces chalets.
                </div>
                <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {inactiveChalets.map((chalet) => renderChaletCard(chalet))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700">
              <ClientIcon name="Home" className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Aucun chalet enregistré</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Ajoutez votre premier chalet pour le voir apparaître ici et suivre sa visibilité dans le portfolio.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <ClientIcon name="Plus" className="h-4 w-4 mr-2" />
                Soumettre un chalet
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:border-neutral-300"
              >
                Voir le portfolio public
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
