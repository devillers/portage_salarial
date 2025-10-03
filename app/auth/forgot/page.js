'use client';

/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react';
import Link from 'next/link';
import PageWrapper from '../../../components/layout/PageWrapper';
import ClientIcon from '../../../components/ClientIcon';

const STEPS = [
  {
    icon: 'MailSearch',
    title: 'Demande de réinitialisation',
    description: 'Saisissez l\'adresse email associée à votre compte afin de recevoir un lien sécurisé de réinitialisation.'
  },
  {
    icon: 'ShieldCheck',
    title: 'Vérification de votre identité',
    description: 'Répondez à nos questions de contrôle ou contactez directement notre équipe support pour un accompagnement personnalisé.'
  },
  {
    icon: 'KeyRound',
    title: 'Création d\'un nouvel accès',
    description: 'Choisissez un nouveau mot de passe fort et actualisez vos informations de sécurité si nécessaire.'
  }
];

export default function LostCredentialsPage() {
  const [formData, setFormData] = useState({
    email: '',
    subject: 'Identifiants perdus',
    message: ''
  });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeedback({ type: '', message: '' });
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.email.trim()) {
      setFeedback({ type: 'error', message: 'Merci de renseigner votre adresse email pour recevoir un nouveau lien de connexion.' });
      return;
    }

    setFeedback({
      type: 'success',
      message:
        'Votre demande a bien été transmise. Vérifiez votre boîte mail, un lien de réinitialisation vient de vous être envoyé.'
    });
    setFormData({ email: '', subject: 'Identifiants perdus', message: '' });
  };

  return (
    <PageWrapper mainClassName="bg-neutral-50 pt-0 md:pt-6 pb-24">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white/90 p-10 shadow-xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 text-center">
                <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">
                  <ClientIcon name="LifeBuoy" className="h-4 w-4" />
                  Assistance
                </span>
                <h1 className="text-4xl font-bold text-neutral-900">Identifiants perdus</h1>
                <p className="text-neutral-600">
                  Vous avez égaré vos accès ? Pas d\'inquiétude, suivez les étapes ci-dessous et notre équipe vous accompagnera pour retrouver une connexion sécurisée.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {STEPS.map((step) => (
                  <div key={step.title} className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 text-left">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary-100 p-3 text-primary-600">
                        <ClientIcon name={step.icon} className="h-5 w-5" />
                      </div>
                      <h2 className="text-base font-semibold text-neutral-900">{step.title}</h2>
                    </div>
                    <p className="mt-4 text-sm text-neutral-600">{step.description}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-neutral-200 bg-white/80 p-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-800">Adresse email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vous@exemple.com"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-800">Message (optionnel)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Précisez les difficultés rencontrées pour que notre support vous aide plus rapidement."
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                {feedback.message && (
                  <div
                    className={`rounded-xl border p-4 text-sm ${
                      feedback.type === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
                >
                  <ClientIcon name="Send" className="h-4 w-4" />
                  Recevoir un nouveau lien
                </button>

                <p className="text-xs text-neutral-500">
                  Besoin d\'une assistance immédiate ? <Link href="mailto:support@chaletmanager.com" className="text-primary-600 underline-offset-2 hover:underline">Contactez notre équipe support</Link> ou appelez-nous au <a href="tel:+33123456789" className="text-primary-600 underline-offset-2 hover:underline">+33 1 23 45 67 89</a>.
                </p>
              </form>

              <div className="text-center text-sm text-neutral-500">
                <Link href="/auth" className="inline-flex items-center gap-2 text-primary-600 underline-offset-2 hover:underline">
                  <ClientIcon name="ArrowLeft" className="h-4 w-4" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </div>
      </section>
    </PageWrapper>
  );
}

