'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from '../../../components/providers/SessionProvider';
import ClientIcon from '../../../components/ClientIcon';

const ALLOWED_ROLES = ['admin', 'super-admin', 'owner'];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    chalets: 0,
    bookings: 0,
    revenue: 0,
    occupancy: 0,
    chaletsDetails: [],
    recentBookings: [],
    ownerApplications: []
  });
  const [loading, setLoading] = useState(true);
  const [updatingChaletId, setUpdatingChaletId] = useState(null);
  const router = useRouter();
  const apiToken = session?.user?.apiToken;
  const userRole = session?.user?.role;
  const isSuperAdmin = userRole === 'super-admin';

  // Redirige si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    const role = session?.user?.role;

    if (!role) {
      return;
    }

    if (!ALLOWED_ROLES.includes(role)) {
      signOut({ callbackUrl: '/admin' });
    }
  }, [status, session?.user?.role]);

  // Charge les stats quand la session est prête
  useEffect(() => {
    if (status !== 'authenticated') return;

    if (!session?.user?.role || !ALLOWED_ROLES.includes(session?.user?.role)) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadStats = async () => {
      if (!apiToken) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        await fetchStats(apiToken, controller.signal, session?.user?.role);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    return () => controller.abort();
  }, [status, apiToken, session?.user?.role]);

  const fetchStats = async (token, signal, role) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const isSuperAdminRole = role === 'super-admin';
      const chaletsEndpoint = isSuperAdminRole
        ? '/api/chalets?includeInactive=true'
        : '/api/chalets?owner=me';
      const bookingsEndpoint = isSuperAdminRole ? '/api/bookings' : '/api/bookings?owner=me';

      const requests = [
        fetch(chaletsEndpoint, { headers, signal }),
        fetch(bookingsEndpoint, { headers, signal })
      ];

      if (isSuperAdminRole) {
        requests.push(
          fetch('/api/signup?type=owner', { headers, signal })
        );
      }

      const responses = await Promise.all(requests);
      const chaletsResponse = responses[0];
      const bookingsResponse = responses[1];
      const signupResponse = isSuperAdminRole ? responses[2] : null;

      // Gestion 401 -> déconnexion propre
      if (
        chaletsResponse.status === 401 ||
        bookingsResponse.status === 401 ||
        (isSuperAdminRole && signupResponse?.status === 401)
      ) {
        signOut({ callbackUrl: '/admin' });
        return;
      }

      const chaletsData = await chaletsResponse.json();
      const bookingsData = await bookingsResponse.json();
      const signupData = isSuperAdminRole && signupResponse
        ? await signupResponse.json()
        : null;

      const chalets = chaletsData?.success ? chaletsData.data : [];
      const bookings = bookingsData?.success ? bookingsData.data : [];
      const ownerApplications = isSuperAdminRole && signupData?.success && Array.isArray(signupData.data)
        ? signupData.data
        : [];

      const computedRevenue = isSuperAdminRole
        ? 125000
        : bookings.reduce((total, booking) => {
            const bookingTotal = Number(booking?.pricing?.total ?? 0);
            return total + (Number.isFinite(bookingTotal) ? bookingTotal : 0);
          }, 0);

      const computedOccupancy = isSuperAdminRole
        ? 78
        : chalets.length === 0
          ? 0
          : Math.min(100, Math.round((bookings.length / chalets.length) * 20));

      setStats({
        chalets: chalets.length,
        bookings: bookings.length,
        revenue: computedRevenue,
        occupancy: computedOccupancy,
        chaletsDetails: chalets,
        recentBookings: bookings.slice(0, 5),
        ownerApplications: isSuperAdminRole ? ownerApplications : []
      });
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Failed to fetch stats:', error);
      }
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin' });
  };

  const handleToggleChaletStatus = async (chalet) => {
    if (!chalet?.slug || !apiToken) {
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
        throw new Error(data?.message || 'Failed to update chalet');
      }

      const updatedChalet = data.data;

      setStats((prev) => {
        const updatedDetails = (prev?.chaletsDetails || []).map((item) =>
          item._id === updatedChalet._id ? updatedChalet : item
        );

        return {
          ...prev,
          chaletsDetails: updatedDetails,
          chalets: updatedDetails.length
        };
      });
    } catch (error) {
      console.error('Failed to toggle chalet status:', error);
    } finally {
      setUpdatingChaletId(null);
    }
  };

  const userName = useMemo(() => {
    if (!session?.user) return '';
    return session.user.name || session.user.email || '';
  }, [session?.user]);

  const menuItems = useMemo(() => {
    if (isSuperAdmin) {
      return [
        {
          title: 'Chalets',
          description: 'Gérer le portfolio de chalets',
          icon: 'Home',
          href: '/admin/chalets',
          color: 'bg-blue-500'
        },
        {
          title: 'Réservations',
          description: 'Suivre les bookings et paiements',
          icon: 'Calendar',
          href: '/admin/bookings',
          color: 'bg-green-500'
        },
        {
          title: 'Contenu',
          description: 'Modifier les pages du site',
          icon: 'FileText',
          href: '/admin/content',
          color: 'bg-purple-500'
        },
        {
          title: 'Utilisateurs',
          description: 'Gérer les comptes admin',
          icon: 'Users',
          href: '/admin/users',
          color: 'bg-orange-500'
        }
      ];
    }

    return [
      {
        title: 'Mes chalets',
        description: 'Gérer vos propriétés et leurs disponibilités',
        icon: 'Home',
        href: '/admin/chalets',
        color: 'bg-blue-500'
      },
      {
        title: 'Réservations',
        description: 'Consulter les demandes pour vos chalets',
        icon: 'Calendar',
        href: '/admin/bookings',
        color: 'bg-green-500'
      },
      {
        title: 'Profil',
        description: 'Mettre à jour vos informations personnelles',
        icon: 'User',
        href: '/admin/profile',
        color: 'bg-purple-500'
      }
    ];
  }, [isSuperAdmin]);

  const statCards = [
    {
      title: 'Chalets Gérés',
      value: stats.chalets,
      icon: 'Home',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Réservations',
      value: stats.bookings,
      icon: 'Calendar',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: "Chiffre d'Affaires",
      value: `€${Number(stats.revenue || 0).toLocaleString('fr-FR')}`,
      icon: 'TrendingUp',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: "Taux d'Occupation",
      value: `${Number(stats.occupancy || 0)}%`,
      icon: 'BarChart3',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-300 border-t-primary-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center mr-3">
                <ClientIcon name="Mountain" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-neutral-900">
                Administration Chalet Manager
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-neutral-600">
                Bonjour, <span className="font-semibold">{userName}</span>
                <span className="ml-2 inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                  {isSuperAdmin ? 'Super administrateur' : 'Propriétaire'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors flex items-center"
              >
                <ClientIcon name="LogOut" className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Tableau de bord</h2>
            <p className="text-neutral-600">
              {isSuperAdmin
                ? 'Vue d\'ensemble complète de votre activité de gestion.'
                : 'Suivez la performance de vos chalets et réservations en un clin d’œil.'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/chalets"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ClientIcon name="Plus" className="h-4 w-4 mr-2" />
              {isSuperAdmin ? 'Ajouter un chalet' : 'Proposer un chalet'}
            </Link>
            <Link
              href="/admin/support"
              className="inline-flex items-center px-4 py-2 border border-neutral-200 text-sm font-medium rounded-lg text-neutral-700 hover:text-neutral-900 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ClientIcon name="LifeBuoy" className="h-4 w-4 mr-2" />
              Support
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <ClientIcon name={stat.icon} className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Actions rapides</h3>
              <p className="text-sm text-neutral-600">
                {isSuperAdmin
                  ? 'Accédez rapidement aux principales sections de l\'administration.'
                  : 'Retrouvez les pages clés pour gérer vos chalets.'}
              </p>
            </div>
            <Link
              href="/admin/support"
              className="text-sm font-medium text-primary-700 hover:text-primary-800 flex items-center"
            >
              <ClientIcon name="MessageCircle" className="h-4 w-4 mr-2" />
              Besoin d&apos;aide ?
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-200 transition-all duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mr-3`}>
                    <ClientIcon name={item.icon} className="h-5 w-5 text-white" />
                  </div>
                  <ClientIcon name="ArrowRight" className="h-5 w-5 text-neutral-400 group-hover:text-primary-600 transition-colors ml-auto" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Owner specific overview */}
        {!isSuperAdmin && (
          <section className="grid gap-6 lg:grid-cols-2 mb-10">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">Mes chalets</h3>
                <Link href="/admin/chalets" className="text-sm text-primary-700 hover:text-primary-800 font-medium">
                  Gérer
                </Link>
              </div>
              {stats.chaletsDetails?.length ? (
                <ul className="space-y-4">
                  {stats.chaletsDetails.map((chalet) => (
                    <li key={chalet._id} className="flex items-start">
                      <div className="mt-1 mr-3 rounded-full bg-primary-100 p-2">
                        <ClientIcon name="Home" className="h-4 w-4 text-primary-700" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{chalet.title}</p>
                        <p className="text-sm text-neutral-600">
                          {chalet.location?.city
                            ? `${chalet.location.city}, ${chalet.location?.country ?? ''}`
                            : 'Localisation à compléter'}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          Statut : {chalet.availability?.isActive ? 'En ligne' : 'Hors ligne'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-600">
                  Ajoutez votre premier chalet pour commencer à recevoir des réservations.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">Réservations récentes</h3>
                <Link href="/admin/bookings" className="text-sm text-primary-700 hover:text-primary-800 font-medium">
                  Voir tout
                </Link>
              </div>
              {stats.recentBookings?.length ? (
                <ul className="space-y-4">
                  {stats.recentBookings.map((booking) => {
                    const checkIn = booking?.dates?.checkIn ? new Date(booking.dates.checkIn) : null;
                    const checkOut = booking?.dates?.checkOut ? new Date(booking.dates.checkOut) : null;
                    const formattedDates = checkIn && checkOut
                      ? `${checkIn.toLocaleDateString('fr-FR')} → ${checkOut.toLocaleDateString('fr-FR')}`
                      : 'Dates à confirmer';

                    return (
                      <li key={booking._id} className="flex items-start">
                        <div className="mt-1 mr-3 rounded-full bg-green-100 p-2">
                          <ClientIcon name="Calendar" className="h-4 w-4 text-green-700" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {booking.guest?.name || booking.guest?.email || 'Client'}
                          </p>
                          <p className="text-sm text-neutral-600">{formattedDates}</p>
                          {booking.chalet?.title && (
                            <p className="mt-1 text-xs text-neutral-500">Chalet : {booking.chalet.title}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-neutral-600">
                  Vous n&apos;avez pas encore de réservations. Partagez votre annonce pour en recevoir.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Super admin specific insights */}
        {isSuperAdmin && (
          <section className="grid gap-6 lg:grid-cols-2 mb-10">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Collection de propriétés</h3>
                  <p className="text-sm text-neutral-600">
                    Activez ou masquez les chalets visibles sur le portfolio public.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                  {stats.chaletsDetails?.filter((chalet) => chalet?.availability?.isActive)?.length || 0} actifs
                </span>
              </div>

              {stats.chaletsDetails?.length ? (
                <ul className="space-y-4">
                  {stats.chaletsDetails.map((chalet) => {
                    const isActive = chalet?.availability?.isActive ?? false;
                    return (
                      <li key={chalet._id} className="flex items-start justify-between gap-4 border border-neutral-200 rounded-xl p-4">
                        <div>
                          <p className="font-medium text-neutral-900">{chalet.title}</p>
                          <p className="text-sm text-neutral-600">
                            {chalet.location?.city
                              ? `${chalet.location.city}, ${chalet.location?.country ?? ''}`
                              : 'Localisation à compléter'}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            Statut actuel : {isActive ? 'Visible dans le portfolio' : 'Masqué du portfolio'}
                          </p>
                        </div>
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
                          {updatingChaletId === chalet._id ? 'Mise à jour...' : isActive ? 'Désactiver' : 'Activer'}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-neutral-600">
                  Ajoutez des chalets pour gérer leur visibilité depuis cette interface.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Candidatures propriétaires</h3>
                  <p className="text-sm text-neutral-600">
                    Retrouvez les dernières demandes reçues via le formulaire d&apos;inscription.</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                  {stats.ownerApplications?.filter((application) => application?.status !== 'reviewed')?.length || 0} en attente
                </span>
              </div>

              {stats.ownerApplications?.length ? (
                <ul className="space-y-4">
                  {stats.ownerApplications.slice(0, 6).map((application) => {
                    const owner = application?.ownerData?.owner || {};
                    const submittedAt = application?.createdAt
                      ? new Date(application.createdAt).toLocaleDateString('fr-FR')
                      : 'Date inconnue';
                    const statusLabel = application?.status === 'reviewed' ? 'Revue' : 'En attente';
                    const statusClasses = application?.status === 'reviewed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700';

                    return (
                      <li key={application._id} className="border border-neutral-200 rounded-xl p-4">
                        <p className="font-medium text-neutral-900">
                          {owner.firstName} {owner.lastName}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {application.ownerData?.title || 'Chalet sans titre'}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          Soumis le {submittedAt}
                        </p>
                        <span className={`mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClasses}`}>
                          {statusLabel}
                        </span>
                        <div className="mt-2 space-y-1 text-xs text-neutral-500">
                          {owner.email && <p>Email : {owner.email}</p>}
                          {owner.phone && <p>Téléphone : {owner.phone}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-neutral-600">
                  Aucune candidature propriétaire enregistrée pour le moment.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
