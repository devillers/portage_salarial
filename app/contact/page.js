'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ClientIcon from '../../components/ClientIcon';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function ContactPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    dates: '',
    guests: '',
    budget: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pre-fill project type based on URL parameter
    const type = searchParams.get('type');
    if (type) {
      setFormData(prev => ({
        ...prev,
        projectType: type
      }));
    }
  }, [searchParams]);

  const projectTypes = [
    { value: '', label: 'Sélectionnez un type de projet' },
    { value: 'gestion-chalet', label: 'Gestion de chalet' },
    { value: 'seminaire-corporate', label: 'Séminaire corporate' },
    { value: 'sejour-yoga', label: 'Séjour yoga' },
    { value: 'portage-salarial', label: 'Portage salarial' },
    { value: 'autre', label: 'Autre demande' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: `Demande de contact - ${projectTypes.find(t => t.value === formData.projectType)?.label || 'Général'}`
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          dates: '',
          guests: '',
          budget: '',
          message: ''
        });
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: 'Mail',
      title: 'Email',
      value: 'contact@chaletmanager.com',
      link: 'mailto:contact@chaletmanager.com'
    },
    {
      icon: 'Phone',
      title: 'Téléphone',
      value: '+33 1 23 45 67 89',
      link: 'tel:+33123456789'
    },
    {
      icon: 'MapPin',
      title: 'Adresse',
      value: 'Chamonix-Mont-Blanc\nHaute-Savoie, France',
      link: null
    },
    {
      icon: 'Clock',
      title: 'Horaires',
      value: 'Lun-Ven: 9h-18h\nSam: 9h-12h',
      link: null
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center text-white overflow-hidden mt-16 md:mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
            alt="Contactez-nous pour vos projets de gestion de chalets"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contactez-Nous
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Parlons de votre projet de gestion de chalet ou d'organisation d'événements
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                Envoyez-nous un Message
              </h2>
              
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <ClientIcon name="CheckCircle" className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-800">
                      Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <ClientIcon name="AlertCircle" className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="Votre nom et prénom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-neutral-700 mb-2">
                      Type de projet *
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    >
                      {projectTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="dates" className="block text-sm font-medium text-neutral-700 mb-2">
                      Dates souhaitées
                    </label>
                    <input
                      type="text"
                      id="dates"
                      name="dates"
                      value={formData.dates}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="Ex: Décembre 2024 - Mars 2025"
                    />
                  </div>

                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-neutral-700 mb-2">
                      Nombre de personnes
                    </label>
                    <input
                      type="text"
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="Ex: 8 personnes"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-neutral-700 mb-2">
                    Budget approximatif
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Sélectionnez une fourchette</option>
                    <option value="moins-5000">Moins de 5 000€</option>
                    <option value="5000-15000">5 000€ - 15 000€</option>
                    <option value="15000-30000">15 000€ - 30 000€</option>
                    <option value="30000-50000">30 000€ - 50 000€</option>
                    <option value="plus-50000">Plus de 50 000€</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder="Décrivez votre projet, vos besoins spécifiques, vos attentes..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <ClientIcon name="Send" className="mr-2 h-5 w-5" />
                      Envoyer le Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                Nos Coordonnées
              </h2>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <ClientIcon name={info.icon} className="h-6 w-6 text-primary-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-primary-700 hover:text-primary-800 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-neutral-600 whitespace-pre-line">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="bg-neutral-100 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Notre Localisation
                </h3>
                <div className="bg-white rounded-lg p-4 border border-neutral-200">
                  <div className="flex items-center justify-center h-48 text-neutral-500">
                    <div className="text-center">
                      <ClientIcon name="MapPin" className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">
                        Carte interactive disponible<br />
                        Chamonix-Mont-Blanc, France
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="mt-8 bg-primary-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-primary-900 mb-4">
                  Besoin d'une Réponse Rapide ?
                </h3>
                <p className="text-primary-800 mb-4">
                  Pour les demandes urgentes, n'hésitez pas à nous appeler directement.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+33123456789"
                    className="flex-1 px-4 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors text-center flex items-center justify-center"
                  >
                    <ClientIcon name="Phone" className="mr-2 h-5 w-5" />
                    Appeler Maintenant
                  </a>
                  <a
                    href="mailto:contact@chaletmanager.com"
                    className="flex-1 px-4 py-3 border border-primary-700 text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-center flex items-center justify-center"
                  >
                    <ClientIcon name="Mail" className="mr-2 h-5 w-5" />
                    Email Direct
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}