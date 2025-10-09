'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { signOut, useSession } from '../../../../components/providers/SessionProvider';
import ClientIcon from '../../../../components/ClientIcon';

const ALLOWED_ROLES = ['admin', 'super-admin', 'owner'];

export default function AdminChaletDetailPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const router = useRouter();
  const { data: session, status } = useSession();

  const [chalet, setChalet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const apiToken = session?.user?.apiToken;
  const userRole = session?.user?.role;
  const isSuperAdmin = userRole === 'super-admin';

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin');
    }
  }, [status, router]);

  // Enforce access control for the allowed roles
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

  const fetchChalet = useCallback(
    async ({ signal } = {}) => {
      if (!slug || status !== 'authenticated') {
        return;
      }

      if (!userRole || !ALLOWED_ROLES.includes(userRole)) {
        setLoading(false);
        setChalet(null);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const headers = apiToken
          ? { Authorization: `Bearer ${apiToken}` }
          : undefined;

        const response = await fetch(`/api/chalets/${slug}`, {
          headers,
          signal
        });

        if (response.status === 401) {
          signOut({ callbackUrl: '/admin' });
          return;
        }

        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || 'Impossible de charger le chalet.');
        }

        setChalet(data.data);
      } catch (err) {
        if (err?.name === 'AbortError') {
          return;
        }

        console.error('Failed to load chalet', err);
        setError(err?.message || "Une erreur est survenue lors du chargement du chalet.");
      } finally {
        setLoading(false);
      }
    },
    [apiToken, slug, status, userRole]
  );

  useEffect(() => {
    const controller = new AbortController();

    if (status === 'authenticated' && slug) {
      fetchChalet({ signal: controller.signal });
    }

    return () => controller.abort();
  }, [fetchChalet, slug, status]);

  const toggleChaletStatus = useCallback(async () => {
    if (!chalet?.slug || !apiToken || !isSuperAdmin) {
      return;
    }

    const nextStatus = !(chalet?.availability?.isActive ?? false);
    setIsUpdatingStatus(true);

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
        throw new Error(data?.message || 'Impossible de mettre à jour le statut du chalet.');
      }

      setChalet(data.data);
    } catch (err) {
      console.error('Failed to toggle chalet status', err);
      setError(err?.message || 'Impossible de modifier le statut du chalet.');
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [apiToken, chalet, isSuperAdmin]);

  const normalizedAmenities = useMemo(() => {
    if (!Array.isArray(chalet?.amenities)) {
      return [];
    }

    return chalet.amenities
      .map((amenity) => {
        if (typeof amenity === 'string') {
          return amenity;
        }
        if (amenity && typeof amenity === 'object') {
          return amenity.name || amenity.label || '';
        }
        return '';
      })
      .map((value) => value?.trim?.())
      .filter(Boolean);
  }, [chalet?.amenities]);

  const galleryImages = useMemo(() => {
    if (!Array.isArray(chalet?.images?.gallery)) {
      return [];
    }

    return chalet.images.gallery
      .map((image) => {
        if (!image) return null;

        if (typeof image === 'string') {
          const value = image?.trim?.() || image;
          return value ? { url: value, alt: chalet?.title || 'Photo du chalet' } : null;
        }

        if (typeof image === 'object') {
          const url = image.url || image.secureUrl || image.src || image.path;
          if (!url) return null;
          return {
            url,
            alt: image.alt || image.caption || chalet?.title || 'Photo du chalet'
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [chalet?.images?.gallery, chalet?.title]);

  const heroImage = useMemo(() => {
    const hero = chalet?.images?.hero;
    if (!hero) return null;

    if (typeof hero === 'string') {
      const value = hero?.trim?.() || hero;
      return value ? { url: value, alt: chalet?.title || 'Image du chalet' } : null;
    }

    if (typeof hero === 'object') {
      const url = hero.url || hero.secureUrl || hero.src || hero.path;
      if (!url) return null;
      return {
        url,
        alt: hero.alt || hero.caption || chalet?.title || 'Image du chalet'
      };
    }

    return null;
  }, [chalet?.images?.hero, chalet?.title]);

  const locationSummary = useMemo(() => {
    const parts = [
      chalet?.location?.address,
      chalet?.location?.postalCode,
      chalet?.location?.city,
      chalet?.location?.country
    ].filter(Boolean);

    return parts.join(' · ');
  }, [
    chalet?.location?.address,
    chalet?.location?.postalCode,
    chalet?.location?.city,
    chalet?.location?.country
  ]);

  const specifications = useMemo(() => {
    const spec = chalet?.specifications || {};
    return [
      spec?.bedrooms ? `${spec.bedrooms} chambre${spec.bedrooms > 1 ? 's' : ''}` : null,
      spec?.bathrooms ? `${spec.bathrooms} salle${spec.bathrooms > 1 ? 's' : ''} de bain` : null,
      spec?.maxGuests ? `${spec.maxGuests} voyageur${spec.maxGuests > 1 ? 's' : ''}` : null,
      spec?.area ? `${spec.area} m²` : null,
      spec?.floors ? `${spec.floors} niveau${spec.floors > 1 ? 'x' : ''}` : null
    ].filter(Boolean);
  }, [chalet?.specifications]);

  const availabilitySummary = useMemo(() => {
    if (!chalet?.availability) return [];
    const { minimumStay, maximumStay, checkInTime, checkOutTime, blockedDates } = chalet.availability;

    return [
      minimumStay ? `Séjour min. ${minimumStay} nuit${minimumStay > 1 ? 's' : ''}` : null,
      maximumStay ? `Séjour max. ${maximumStay} nuit${maximumStay > 1 ? 's' : ''}` : null,
      checkInTime ? `Arrivée : ${checkInTime}` : null,
      checkOutTime ? `Départ : ${checkOutTime}` : null,
      Array.isArray(blockedDates) && blockedDates.length > 0
        ? `${blockedDates.length} période${blockedDates.length > 1 ? 's' : ''} bloquée${blockedDates.length > 1 ? 's' : ''}`
        : null
    ].filter(Boolean);
  }, [chalet?.availability]);

  const lastUpdatedAt = useMemo(() => {
    if (!chalet?.updatedAt) return null;

    try {
      return new Date(chalet.updatedAt).toLocaleString('fr-FR', {
        dateStyle: 'long',
        timeStyle: 'short'
      });
    } catch (err) {
      return null;
    }
  }, [chalet?.updatedAt]);

  const handleRetry = () => {
    fetchChalet();
  };

  const isActive = chalet?.availability?.isActive ?? false;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-4 w-40 animate-pulse rounded bg-neutral-200" />
        <div className="mt-6 h-7 w-80 animate-pulse rounded bg-neutral-200" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="h-56 animate-pulse rounded-xl bg-neutral-200" />
          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/admin/chalets"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          <ClientIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
          Retour à la liste
        </Link>

        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <h1 className="text-lg font-semibold">Impossible d&rsquo;afficher ce chalet</h1>
          <p className="mt-2 text-sm">
            {error}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <ClientIcon name="RefreshCw" className="mr-2 h-4 w-4" />
              Réessayer
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/chalets')}
              className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-300 hover:text-neutral-900"
            >
              <ClientIcon name="List" className="mr-2 h-4 w-4" />
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!chalet) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/admin/chalets"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          <ClientIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
          Retour à la liste
        </Link>

        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 text-neutral-700">
          <h1 className="text-lg font-semibold">Chalet introuvable</h1>
          <p className="mt-2 text-sm">
            Le chalet demandé n&rsquo;existe pas ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/admin/chalets"
        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        <ClientIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
        Retour à la liste des chalets
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
            <span>{chalet.slug}</span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'
            }`}>
              <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: isActive ? '#047857' : '#9ca3af' }} />
              {isActive ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-900">{chalet.title}</h1>
          {locationSummary && <p className="mt-1 text-sm text-neutral-500">{locationSummary}</p>}
          {lastUpdatedAt && (
            <p className="mt-2 text-xs text-neutral-400">Dernière mise à jour : {lastUpdatedAt}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isSuperAdmin && (
            <button
              type="button"
              onClick={toggleChaletStatus}
              disabled={isUpdatingStatus}
              className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                isActive
                  ? 'bg-white text-neutral-700 ring-1 ring-neutral-200 hover:text-neutral-900 hover:ring-neutral-300'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              } ${isUpdatingStatus ? 'cursor-wait opacity-70' : ''}`}
            >
              <ClientIcon name="ToggleRight" className="mr-2 h-4 w-4" />
              {isUpdatingStatus
                ? 'Mise à jour…'
                : isActive
                  ? 'Mettre hors ligne'
                  : 'Mettre en ligne'}
            </button>
          )}

          <Link
            href={`/chalets/${chalet.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-300 hover:text-neutral-900"
          >
            <ClientIcon name="ExternalLink" className="mr-2 h-4 w-4" />
            Voir la fiche publique
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {heroImage && (
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
              <div className="relative h-64 w-full sm:h-80">
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                  priority
                />
              </div>
            </div>
          )}

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Description</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-700">
              {chalet.description || 'Aucune description renseignée.'}
            </p>
          </section>

          {normalizedAmenities.length > 0 && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">Équipements</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {normalizedAmenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {galleryImages.length > 0 && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">Galerie</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {galleryImages.slice(0, 4).map((image) => (
                  <div key={image.url} className="relative h-40 overflow-hidden rounded-xl border border-neutral-200">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Infos clés</h2>
            <div className="mt-4 space-y-3 text-sm text-neutral-700">
              {specifications.length > 0 && (
                <p className="flex items-start gap-2">
                  <ClientIcon name="Info" className="mt-1 h-4 w-4 text-neutral-400" />
                  <span>{specifications.join(' · ')}</span>
                </p>
              )}
              <p className="flex items-start gap-2">
                <ClientIcon name="MapPin" className="mt-1 h-4 w-4 text-neutral-400" />
                <span>{locationSummary || 'Adresse non renseignée'}</span>
              </p>
              {chalet.pricing?.basePrice && (
                <p className="flex items-start gap-2">
                  <ClientIcon name="Euro" className="mt-1 h-4 w-4 text-neutral-400" />
                  <span>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: chalet.pricing.currency || 'EUR'
                    }).format(chalet.pricing.basePrice)}
                    <span className="text-neutral-500"> / nuit</span>
                  </span>
                </p>
              )}
              {chalet.pricing?.cleaningFee ? (
                <p className="flex items-start gap-2 text-sm text-neutral-600">
                  <ClientIcon name="Sparkles" className="mt-1 h-4 w-4 text-neutral-400" />
                  <span>
                    Frais de ménage :
                    {' '}
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: chalet.pricing.currency || 'EUR'
                    }).format(chalet.pricing.cleaningFee)}
                  </span>
                </p>
              ) : null}
              {chalet.pricing?.securityDeposit ? (
                <p className="flex items-start gap-2 text-sm text-neutral-600">
                  <ClientIcon name="Shield" className="mt-1 h-4 w-4 text-neutral-400" />
                  <span>
                    Caution :
                    {' '}
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: chalet.pricing.currency || 'EUR'
                    }).format(chalet.pricing.securityDeposit)}
                  </span>
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Disponibilités</h2>
            {availabilitySummary.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                {availabilitySummary.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ClientIcon name="Calendar" className="mt-1 h-4 w-4 text-neutral-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-neutral-500">Aucune information sur les disponibilités.</p>
            )}
          </section>

          {(chalet.contact?.email || chalet.contact?.phone || chalet.contact?.website) && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">Contact</h2>
              <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                {chalet.contact?.email && (
                  <li className="flex items-start gap-2">
                    <ClientIcon name="Mail" className="mt-1 h-4 w-4 text-neutral-400" />
                    <span>{chalet.contact.email}</span>
                  </li>
                )}
                {chalet.contact?.phone && (
                  <li className="flex items-start gap-2">
                    <ClientIcon name="Phone" className="mt-1 h-4 w-4 text-neutral-400" />
                    <span>{chalet.contact.phone}</span>
                  </li>
                )}
                {chalet.contact?.website && (
                  <li className="flex items-start gap-2">
                    <ClientIcon name="Globe" className="mt-1 h-4 w-4 text-neutral-400" />
                    <Link
                      href={chalet.contact.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {chalet.contact.website}
                    </Link>
                  </li>
                )}
              </ul>
            </section>
          )}

          {Array.isArray(chalet.availability?.blockedDates) && chalet.availability.blockedDates.length > 0 && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">Périodes bloquées</h2>
              <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                {chalet.availability.blockedDates.map((period, index) => {
                  const startDate = period?.start ? new Date(period.start) : null;
                  const endDate = period?.end ? new Date(period.end) : null;
                  const formattedRange = [startDate, endDate]
                    .map((date) =>
                      date
                        ? date.toLocaleDateString('fr-FR', { dateStyle: 'medium' })
                        : 'Date inconnue'
                    )
                    .join(' → ');

                  return (
                    <li key={`${period?.start || index}-${period?.end || index}`} className="flex items-start gap-2">
                      <ClientIcon name="Slash" className="mt-1 h-4 w-4 text-neutral-400" />
                      <div>
                        <p>{formattedRange}</p>
                        {period?.reason && (
                          <p className="text-xs text-neutral-500">Motif : {period.reason}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
