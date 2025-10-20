'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from '../../../components/providers/SessionProvider';
import ClientIcon from '../../../components/ClientIcon';

const ALLOWED_ROLES = ['admin', 'super-admin', 'owner'];

const SOURCE_LABELS = {
  'signup-application': 'Candidature'
};

const getAmenityLabel = (amenity) => {
  if (!amenity) {
    return '';
  }

  if (typeof amenity === 'string') {
    return amenity;
  }

  if (typeof amenity?.name === 'string') {
    return amenity.name;
  }

  if (typeof amenity?.label === 'string') {
    return amenity.label;
  }

  if (typeof amenity?.description === 'string') {
    return amenity.description;
  }

  return '';
};

export default function AdminChaletsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [chalets, setChalets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingChaletId, setUpdatingChaletId] = useState(null);
  const [selectedChalet, setSelectedChalet] = useState(null);
  const [validatingSignupId, setValidatingSignupId] = useState(null);

  const apiToken = session?.user?.apiToken;
  const userRole = session?.user?.role;
  const isSuperAdmin = userRole === 'super-admin';

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin');
    }
  }, [status, router]);

  // Enforce allowed roles
  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    if (!userRole) {
      return;
    }

    if (!ALLOWED_ROLES.includes(userRole)) {
      signOut({ callbackUrl: '/admin' });
    }
  }, [status, userRole]);

  const fetchChalets = useCallback(async () => {
    if (status !== 'authenticated' || !userRole || !ALLOWED_ROLES.includes(userRole)) return;

    setLoading(true);
    setError('');

    try {
      const headers = apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined;
      const endpoint = isSuperAdmin
        ? '/api/chalets?includeInactive=true&includeSignups=true'
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

      const combinedEntries = Array.isArray(data.data) ? data.data : [];
      setChalets(combinedEntries);
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
    if (!isSuperAdmin || !chalet?.slug || !apiToken) return;

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
          availability: { isActive: nextStatus }
        })
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Mise à jour impossible');
      }

      const updatedChalet = data.data;
      setChalets((prev) => prev.map((item) => (item._id === updatedChalet._id ? updatedChalet : item)));
    } catch (err) {
      console.error('Failed to toggle chalet status', err);
      setError(err?.message || 'Impossible de mettre à jour le statut du chalet.');
    } finally {
      setUpdatingChaletId(null);
    }
  };

  const handleViewChaletDetails = (chalet) => setSelectedChalet(chalet);
  const closeChaletDetails = () => setSelectedChalet(null);

  const handleValidateSignupChalet = async (chalet) => {
    if (!isSuperAdmin || !apiToken || !chalet?.ownerApplicationId) return;

    setValidatingSignupId(chalet._id);
    setError('');

    try {
      const response = await fetch('/api/chalets/publish-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`
        },
        body: JSON.stringify({ applicationId: chalet.ownerApplicationId })
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Impossible de valider la candidature.');
      }

      const publishedChalet = data.data;
      setChalets((prev) => {
        const withoutSignup = prev.filter((item) => item._id !== chalet._id);
        return publishedChalet ? [...withoutSignup, publishedChalet] : withoutSignup;
      });

      setSelectedChalet((current) => (current?._id === chalet._id ? null : current));
    } catch (err) {
      console.error('Failed to publish signup chalet', err);
      setError(err?.message || 'Impossible de valider le chalet.');
    } finally {
      setValidatingSignupId(null);
    }
  };

  // Close details on ESC
  useEffect(() => {
    if (!selectedChalet) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeChaletDetails();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedChalet]);

  const signupEntries = useMemo(
    () => chalets.filter((chalet) => chalet?.source === 'signup-application'),
    [chalets]
  );

  const persistedChalets = useMemo(
    () => chalets.filter((chalet) => chalet?.source !== 'signup-application'),
    [chalets]
  );

  const activeChalets = useMemo(
    () => persistedChalets.filter((chalet) => chalet?.availability?.isActive),
    [persistedChalets]
  );

  const inactiveChalets = useMemo(
    () => persistedChalets.filter((chalet) => !chalet?.availability?.isActive),
    [persistedChalets]
  );

  const displayChaletCount = isSuperAdmin ? persistedChalets.length : chalets.length;

  const userName = useMemo(() => {
    if (!session?.user) return '';
    return session.user.name || session.user.email || '';
  }, [session?.user]);

  // ---- TABLE RENDERERS ----------------------------------------------------
  const renderChaletRow = (chalet) => {
    const isSignup = chalet?.source === 'signup-application';
    const isActive = chalet?.availability?.isActive ?? false;
    const coverImage = getAdminThumbnailImage(chalet);

    const guestCount = chalet?.specifications?.maxGuests;
    const hasGuestCount = Number.isFinite(guestCount) && guestCount > 0;

    const areaValue = chalet?.specifications?.area;
    const hasArea = Number.isFinite(areaValue) && areaValue > 0;

    const basePrice = chalet?.pricing?.basePrice;
    const hasBasePrice = Number.isFinite(basePrice) && basePrice >= 0;

    const infoParts = [
      hasGuestCount ? `${guestCount} pers` : null,
      hasArea ? `${areaValue} m²` : null,
      hasBasePrice ? `${Number(basePrice).toLocaleString('fr-FR')} € / nuit` : null
    ].filter(Boolean);
    const infoText = infoParts.length ? infoParts.join(' · ') : '—';

    const city = chalet?.location?.city || 'Ville à préciser';
    const country = chalet?.location?.country ? `, ${chalet.location.country}` : '';

    const sourceBadgeLabel = chalet?.source ? (SOURCE_LABELS[chalet.source] || chalet.source) : null;

    const canToggle = isSuperAdmin && !isSignup && chalet?.slug;
    const canValidateSignup = isSuperAdmin && isSignup && chalet?.ownerApplicationId;

    const isUpdating = updatingChaletId === chalet?._id;
    const isValidatingSignup = validatingSignupId === chalet?._id;

    return (
      <tr key={chalet._id} className="hover:bg-neutral-50">
        {/* Col 1 — Chalet */}
        <td className="px-4 py-3 align-top">
          <div className="flex items-start gap-3">
            <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
              {coverImage?.url ? (
                <Image
                  src={coverImage.url}
                  alt={coverImage.alt || chalet.title || 'Chalet'}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                  <ClientIcon name="ImageOff" className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {chalet.title || 'Chalet sans titre'}
                </p>

                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  <span
                    className="mr-1.5 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: isActive ? '#16a34a' : '#a3a3a3' }}
                  />
                  {isActive ? 'Actif' : 'Inactif'}
                </span>

                {sourceBadgeLabel && (
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    isSignup ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {sourceBadgeLabel}
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-xs text-neutral-500">{city}{country}</p>

              {/* Sur mobile, afficher l'info clé sous le titre */}
              <p className="mt-1 text-xs text-neutral-600 md:hidden">{infoText}</p>
            </div>
          </div>
        </td>

        {/* Col 2 — Infos clés (masquée sur mobile) */}
        <td className="hidden md:table-cell px-4 py-3 align-top text-sm text-neutral-700">{infoText}</td>

        {/* Col 3 — Actions */}
        <td className="px-4 py-3 align-top">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleViewChaletDetails(chalet)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
            >
              <ClientIcon name="Eye" className="h-4 w-4" />
              <span className="sr-only">Voir le chalet</span>
            </button>

            {/* Lien gérer / statut candidature */}
            {!isSignup ? (
              <Link
                href={`/admin/chalets/${chalet.slug || ''}`}
                className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm ring-1 ring-neutral-200 transition-colors hover:text-neutral-900 hover:ring-neutral-300"
              >
                Gérer
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
                En cours
              </span>
            )}

            {/* Switch publication / validation */}
            {isSignup ? (
              canValidateSignup ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={false}
                    onClick={() => handleValidateSignupChalet(chalet)}
                    disabled={isValidatingSignup}
                    className={`relative inline-flex h-9 w-16 items-center rounded-full px-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                      isValidatingSignup ? 'bg-primary-500' : 'bg-neutral-300'
                    } ${isValidatingSignup ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-7 w-7 transform rounded-full bg-white shadow transition ${
                        isValidatingSignup ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                    <span className="sr-only">Valider cette candidature et publier le chalet</span>
                  </button>
                  <span className="text-xs font-semibold text-primary-700">
                    {isValidatingSignup ? 'Validation…' : 'Valider'}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-neutral-400">En attente</span>
              )
            ) : canToggle ? (
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => handleToggleChaletStatus(chalet)}
                disabled={isUpdating}
                className={`relative inline-flex h-9 w-16 items-center rounded-full px-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                  isActive ? 'bg-green-500' : 'bg-neutral-300'
                } ${isUpdating ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-7 w-7 transform rounded-full bg-white shadow transition ${
                    isActive ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
                <span className="sr-only">Basculer le statut du chalet</span>
              </button>
            ) : (
              <span className="text-xs text-neutral-400">Modification restreinte</span>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const renderChaletsTable = (items) => {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Chalet
              </th>
              <th scope="col" className="hidden md:table-cell px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Infos clés
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white text-sm text-neutral-700">
            {items.map((chalet) => renderChaletRow(chalet))}
          </tbody>
        </table>
      </div>
    );
  };

  // ---- SELECTED CHALET DETAILS -------------------------------------------
  const selectedChaletImage = useMemo(() => {
    if (!selectedChalet) return null;
    return getAdminThumbnailImage(selectedChalet);
  }, [selectedChalet]);

  const selectedChaletDetails = useMemo(() => {
    if (!selectedChalet) return null;

    const guestCount = selectedChalet?.specifications?.maxGuests;
    const hasGuestCount = Number.isFinite(guestCount) && guestCount > 0;
    const guestLabel = hasGuestCount ? `${guestCount} voyageur${guestCount > 1 ? 's' : ''}` : 'À renseigner';

    const areaValue = selectedChalet?.specifications?.area;
    const hasArea = Number.isFinite(areaValue) && areaValue > 0;
    const areaLabel = hasArea ? `${areaValue} m²` : 'À renseigner';

    const basePrice = selectedChalet?.pricing?.basePrice;
    const hasBasePrice = Number.isFinite(basePrice) && basePrice >= 0;
    const priceLabel = hasBasePrice ? `${Number(basePrice).toLocaleString('fr-FR')} €` : 'À renseigner';

    const isActive = selectedChalet?.availability?.isActive ?? false;
    const lastUpdatedAt = selectedChalet?.updatedAt
      ? new Date(selectedChalet.updatedAt).toLocaleString('fr-FR')
      : 'Date inconnue';

    const amenities = Array.isArray(selectedChalet?.amenities)
      ? selectedChalet.amenities
          .map(getAmenityLabel)
          .map((value) => value?.trim?.())
          .filter(Boolean)
      : [];

    return { guestLabel, areaLabel, priceLabel, isActive, lastUpdatedAt, amenities };
  }, [selectedChalet]);

  // ---- RENDER -------------------------------------------------------------
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
            <h2 className="text-2xl font-bold text-neutral-900">{displayChaletCount} chalet(s)</h2>
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
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {persistedChalets.length || signupEntries.length ? (
          <div className="space-y-10">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">Chalets actifs</h3>
                <span className="text-sm text-neutral-500">{activeChalets.length} visible(s) dans le portfolio</span>
              </div>
              {activeChalets.length ? (
                renderChaletsTable(activeChalets)
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
                  <span className="text-sm text-neutral-500">{inactiveChalets.length} en brouillon</span>
                </div>
                {inactiveChalets.length ? (
                  renderChaletsTable(inactiveChalets)
                ) : (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
                    Aucun chalet masqué. Tous vos chalets sont publiés.
                  </div>
                )}
              </section>
            )}

            {isSuperAdmin && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Candidatures</h3>
                  <span className="text-sm text-neutral-500">{signupEntries.length} en cours d&apos;examen</span>
                </div>
                {signupEntries.length ? (
                  renderChaletsTable(signupEntries)
                ) : (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
                    Aucune nouvelle candidature pour le moment.
                  </div>
                )}
              </section>
            )}

            {!isSuperAdmin && inactiveChalets.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Chalets en attente de publication</h3>
                  <span className="text-sm text-neutral-500">{inactiveChalets.length} à compléter</span>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
                  Complétez les informations et contactez l&apos;équipe Chalet Manager pour publier ces chalets.
                </div>
                <div className="mt-6">{renderChaletsTable(inactiveChalets)}</div>
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

      {selectedChalet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 px-4 py-8"
          role="dialog"
          aria-modal="true"
          onClick={closeChaletDetails}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="document"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{selectedChalet?.title || 'Chalet sans titre'}</h3>
                <p className="text-sm text-neutral-500">
                  {selectedChalet?.location?.city || 'Ville à préciser'}
                  {selectedChalet?.location?.country ? `, ${selectedChalet.location.country}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={closeChaletDetails}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
              >
                <ClientIcon name="X" className="h-4 w-4" />
                <span className="sr-only">Fermer les détails du chalet</span>
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              <div className="relative h-64 w-full bg-neutral-100">
                {selectedChaletImage?.url ? (
                  <Image
                    src={selectedChaletImage.url}
                    alt={selectedChaletImage.alt || selectedChalet?.title || 'Chalet'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-400">
                    <ClientIcon name="ImageOff" className="h-8 w-8" />
                    <span className="text-sm">Aucune image disponible</span>
                  </div>
                )}
              </div>

              <div className="space-y-6 px-6 py-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Informations clés</h4>
                    <dl className="mt-3 space-y-2 text-sm text-neutral-700">
                      <div className="flex items-center justify-between">
                        <dt>Capacité</dt>
                        <dd>{selectedChaletDetails?.guestLabel || '—'}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>Surface</dt>
                        <dd>{selectedChaletDetails?.areaLabel || '—'}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>Prix par nuit</dt>
                        <dd>{selectedChaletDetails?.priceLabel || '—'}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>Statut</dt>
                        <dd className={selectedChaletDetails?.isActive ? 'text-green-600' : 'text-neutral-500'}>
                          {selectedChaletDetails?.isActive ? 'Actif' : 'Inactif'}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>Mise à jour</dt>
                        <dd>{selectedChaletDetails?.lastUpdatedAt || '—'}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="rounded-xl border border-neutral-200 p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Localisation</h4>
                    <div className="mt-3 space-y-1 text-sm text-neutral-700">
                      <p>{selectedChalet?.location?.address || 'Adresse à préciser'}</p>
                      <p>
                        {(selectedChalet?.location?.postalCode || '')} {selectedChalet?.location?.city || ''}
                      </p>
                      <p>{selectedChalet?.location?.country || ''}</p>
                    </div>
                    {selectedChalet?.location?.coordinates && (
                      <p className="mt-3 text-xs text-neutral-500">
                        Coordonnées : {selectedChalet.location.coordinates.latitude?.toFixed?.(4) || '—'}, {' '}
                        {selectedChalet.location.coordinates.longitude?.toFixed?.(4) || '—'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Description</h4>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-700">
                    {selectedChalet?.description || 'Aucune description fournie.'}
                  </p>
                </div>

                {selectedChaletDetails?.amenities?.length ? (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Équipements</h4>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {selectedChaletDetails.amenities.map((amenity, index) => (
                        <li
                          key={`${amenity}-${index}`}
                          className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                        >
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selectedChalet?.contact && (
                  <div className="grid gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Contact</h4>
                    {selectedChalet.contact?.email && <p>Email : {selectedChalet.contact.email}</p>}
                    {selectedChalet.contact?.phone && <p>Téléphone : {selectedChalet.contact.phone}</p>}
                    {selectedChalet.contact?.website && <p>Site web : {selectedChalet.contact.website}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-6 py-4">
              <div className="text-xs text-neutral-500">
                Source : {selectedChalet?.source ? SOURCE_LABELS[selectedChalet.source] || selectedChalet.source : 'Interne'}
              </div>
              {!selectedChalet?.source || selectedChalet.source !== 'signup-application' ? (
                <Link
                  href={`/admin/chalets/${selectedChalet?.slug || ''}`}
                  className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  onClick={closeChaletDetails}
                >
                  <ClientIcon name="ExternalLink" className="mr-2 h-4 w-4" />
                  Gérer ce chalet
                </Link>
              ) : (
                <span className="text-xs font-semibold text-primary-700">Candidature en cours d&apos;examen</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- IMAGE HELPERS --------------------------------------------------------
function normalizeImageValue(image, fallbackAlt) {
  if (!image) return null;

  if (typeof image === 'string') {
    const value = image?.trim?.() || image;
    return value ? { url: value, alt: fallbackAlt } : null;
  }

  if (typeof image === 'object') {
    const url = image.url || image.secureUrl || image.src || image.path;
    if (url) {
      return { url, alt: image.alt || image.caption || fallbackAlt };
    }
  }

  return null;
}

function pickImageFromArray(arrayValue, fallbackAlt) {
  if (!Array.isArray(arrayValue)) return null;

  const prioritized = arrayValue.find((item) => item?.isHero || item?.isPrimary);
  if (prioritized) {
    const normalized = normalizeImageValue(prioritized, fallbackAlt);
    if (normalized) return normalized;
  }

  for (const item of arrayValue) {
    const normalized = normalizeImageValue(item, fallbackAlt);
    if (normalized) return normalized;
  }
  return null;
}

function getAdminThumbnailImage(chalet) {
  const fallbackAlt = chalet?.title || 'Chalet';
  const images = chalet?.images;

  if (Array.isArray(images)) {
    const fromArray = pickImageFromArray(images, fallbackAlt);
    if (fromArray) return fromArray;
  } else if (images && typeof images === 'object') {
    const heroCandidate = normalizeImageValue(images.hero, fallbackAlt);
    if (heroCandidate) return heroCandidate;

    const galleryCandidate = pickImageFromArray(images.gallery, fallbackAlt);
    if (galleryCandidate) return galleryCandidate;

    for (const value of Object.values(images)) {
      if (!value) continue;
      if (Array.isArray(value)) {
        const candidate = pickImageFromArray(value, fallbackAlt);
        if (candidate) return candidate;
      } else {
        const candidate = normalizeImageValue(value, fallbackAlt);
        if (candidate) return candidate;
      }
    }
  }

  const heroImage = normalizeImageValue(chalet?.heroImage, fallbackAlt);
  if (heroImage) return heroImage;

  const galleryImage = pickImageFromArray(chalet?.gallery, fallbackAlt);
  if (galleryImage) return galleryImage;

  return null;
}