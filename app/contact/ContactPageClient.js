'use client';

/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ClientIcon from '../../components/ClientIcon';
import PageWrapper from '../../components/layout/PageWrapper';

export default function ContactPageClient() {
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
  const [honeypot, setHoneypot] = useState('');

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
    if (honeypot.trim() !== '') {
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);

    const subjectLabel = projectTypes.find(t => t.value === formData.projectType)?.label || 'Général';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: `Demande de contact - ${subjectLabel}`
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Une erreur est survenue lors de l\'envoi du formulaire.');
      }

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
      setHoneypot('');
    } catch (err) {
      setError(err.message || 'Erreur de connexion. Veuillez réessayer.');
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

  const highlights = [
    {
      icon: 'UserCheck',
      title: 'Dedicated Advisor',
      description: 'A single point of contact follows your project from the first call to post-stay follow-up.',
    },
    {
      icon: 'CalendarClock',
      title: 'Flexible Scheduling',
      description: 'We adapt to your agenda for virtual or on-site meetings anywhere in the Alps.',
    },
    {
      icon: 'MessageCircle',
      title: 'Multilingual Team',
      description: 'French, English, and German-speaking experts ready to welcome your guests with finesse.',
    },
  ];

  const stats = [
    {
      value: '15 min',
      label: 'Average first response time',
    },
    {
      value: '24/7',
      label: 'Availability during guest stays',
    },
    {
      value: '300+',
      label: 'Successful projects delivered',
    },
    {
      value: '100%',
      label: 'Tailor-made proposals',
    },
  ];

  return (
    <PageWrapper mainClassName="space-y-24 bg-neutral-50 pt-0 md:pt-0 pb-24 md:pb-32">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden rounded-none text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
            alt="Contactez-nous pour vos projets de gestion de chalets"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-primary-200">
            Discutons de votre projet
          </p>
          <h1 className="mb-6 text-4xl font-light leading-tight md:text-6xl lg:text-7xl">
            Contactez notre équipe de concierges experts
            <span className="block text-primary-200">Pour une gestion de chalet sans compromis</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
            Partagez vos ambitions : nous orchestrons des expériences personnalisées qui enchantent vos hôtes et simplifient votre quotidien de propriétaire.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="tel:+33123456789"
              className="flex items-center justify-center rounded-full bg-primary-700 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-primary-800 hover:shadow-2xl"
            >
              <ClientIcon name="Phone" className="mr-2 h-5 w-5" />
              Appeler un conseiller
            </a>

            <a
              href="mailto:contact@chaletmanager.com"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20"
            >
              Écrire un email
            </a>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-white py-16 shadow-sm sm:rounded-3xl sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Votre projet entre des mains expertes
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Des conseillers disponibles et une organisation pointue pour répondre rapidement à toutes vos demandes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl border border-neutral-200 bg-neutral-50/60 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 mx-auto">
                  <ClientIcon name={item.icon} className="h-8 w-8 text-primary-700" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-20 shadow-sm sm:rounded-3xl sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
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
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company" className="text-sm text-neutral-700">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                  />
                </div>

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
                    <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-100">
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
              <div className="rounded-3xl bg-neutral-100 p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Notre Localisation
                </h3>
                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
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
              <div className="mt-8 rounded-3xl bg-primary-50 p-6">
                <h3 className="text-xl font-bold text-primary-900 mb-4">
                  Besoin d'une Réponse Rapide ?
                </h3>
                <p className="text-primary-800 mb-4">
                  Pour les demandes urgentes, n'hésitez pas à nous appeler directement.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+33123456789"
                    className="flex flex-1 items-center justify-center rounded-full bg-primary-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-primary-800"
                  >
                    <ClientIcon name="Phone" className="mr-2 h-5 w-5" />
                    Appeler Maintenant
                  </a>
                  <a
                    href="mailto:contact@chaletmanager.com"
                    className="flex flex-1 items-center justify-center rounded-full border border-primary-700 px-4 py-3 font-semibold text-primary-700 transition-colors hover:bg-primary-50"
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

      <section className="bg-primary-800 py-20 text-white shadow-xl sm:mx-6 sm:rounded-3xl sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Un accompagnement réactif et sur mesure
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Nous coordonnons tous les détails pour garantir un séjour inoubliable à vos hôtes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-primary-200">
                  {stat.value}
                </div>
                <p className="text-primary-100">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-900 py-20 text-white sm:mx-6 sm:rounded-3xl sm:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à discuter de votre projet ?
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            Nos spécialistes vous rappellent sous 24h pour construire une proposition personnalisée.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/services"
              className="rounded-full bg-white px-8 py-4 font-semibold text-primary-900 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-primary-100"
            >
              Explorer nos services
            </a>
            <Link
              href="/portfolio"
              className="rounded-full border border-white/40 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/20"
            >
              Voir nos réalisations
            </Link>
          </div>
        </div>
      </section>

    </PageWrapper>
  );
}
