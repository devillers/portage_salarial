'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientIcon from '../../../components/ClientIcon';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    chalets: 0,
    bookings: 0,
    revenue: 0,
    occupancy: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin');
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch chalets count
      const chaletsResponse = await fetch('/api/chalets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const chaletsData = await chaletsResponse.json();
      
      // Fetch bookings count
      const bookingsResponse = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const bookingsData = await bookingsResponse.json();

      setStats({
        chalets: chaletsData.success ? chaletsData.data.length : 0,
        bookings: bookingsData.success ? bookingsData.data.length : 0,
        revenue: 125000, // Mock data
        occupancy: 78 // Mock data
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin');
  };

  const menuItems = [
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
      title: 'Chiffre d\'Affaires',
      value: `€${stats.revenue.toLocaleString()}`,
      icon: 'TrendingUp',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Taux d\'Occupation',
      value: `${stats.occupancy}%`,
      icon: 'BarChart3',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-700"></div>
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
                Bonjour, <span className="font-semibold">{user?.username}</span>
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Tableau de Bord
          </h2>
          <p className="text-neutral-600">
            Vue d'ensemble de votre activité de gestion de chalets
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <ClientIcon name={stat.icon} className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <a
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
              <p className="text-sm text-neutral-600">
                {item.description}
              </p>
            </a>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Activité Récente
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <ClientIcon name="Calendar" className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">
                  Nouvelle réservation - Chalet Mont-Blanc
                </p>
                <p className="text-xs text-neutral-600">
                  Il y a 2 heures
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <ClientIcon name="Home" className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">
                  Chalet ajouté au portfolio - Les Arcs
                </p>
                <p className="text-xs text-neutral-600">
                  Hier à 14:30
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <ClientIcon name="Mail" className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">
                  Nouveau message de contact reçu
                </p>
                <p className="text-xs text-neutral-600">
                  Hier à 09:15
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/admin/activity"
              className="text-primary-700 hover:text-primary-800 text-sm font-medium transition-colors"
            >
              Voir toute l'activité
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}