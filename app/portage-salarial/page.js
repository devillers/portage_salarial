/* eslint-disable react/no-unescaped-entities */

import Image from 'next/image';
import Link from 'next/link';
import ClientIcon from '../../components/ClientIcon';
import PageWrapper from '../../components/layout/PageWrapper';

export const metadata = {
  title: 'Portage Salarial | Chalet Manager',
  description: 'Découvrez le portage salarial pour la gestion de chalets. Structure tripartite offrant sécurité sociale, simplicité administrative et flexibilité pour les experts indépendants.',
};

export default function PortageSalarialPage() {
  const benefits = [
    {
      icon: 'Shield',
      title: 'Protection Sociale Complète',
      description: 'Couverture sociale comparable à un salarié : retraite, santé, chômage, prévoyance.'
    },
    {
      icon: 'FileText',
      title: 'Simplicité Administrative',
      description: 'La société de portage gère tous les aspects administratifs, comptables et fiscaux.'
    },
    {
      icon: 'Users',
      title: 'Liberté Commerciale',
      description: 'Autonomie totale pour prospecter, négocier et fixer vos tarifs avec les clients.'
    },
    {
      icon: 'TrendingUp',
      title: 'Optimisation Fiscale',
      description: 'Déduction des frais professionnels et optimisation de la rémunération nette.'
    }
  ];

  const conditions = [
    {
      icon: 'Briefcase',
      title: 'Expertise Reconnue',
      description: 'Niveau d\'expertise suffisant pour trouver des clients et négocier les conditions de mission.'
    },
    {
      icon: 'Clock',
      title: 'Missions Occasionnelles',
      description: 'Prestations ponctuelles ne dépassant pas 36 mois et ne remplaçant pas l\'activité principale du client.'
    },
    {
      icon: 'Target',
      title: 'Services Intellectuels',
      description: 'Prestations de conseil, formation, expertise technique ou gestion spécialisée.'
    },
    {
      icon: 'Euro',
      title: 'Commission de Gestion',
      description: 'Frais de gestion prélevés sur le chiffre d\'affaires (généralement 5 à 10%).'
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Signature du Contrat',
      description: 'CDI ou CDD avec la société de portage salarial selon la durée de la mission.'
    },
    {
      number: '02',
      title: 'Négociation Client',
      description: 'Vous prospectez et négociez directement avec vos clients les conditions de prestation.'
    },
    {
      number: '03',
      title: 'Gestion Administrative',
      description: 'La société de portage établit les contrats commerciaux et gère la facturation.'
    },
    {
      number: '04',
      title: 'Versement du Salaire',
      description: 'Réception de votre rémunération sous forme de salaire après déduction des charges et frais.'
    }
  ];

  const limitations = [
    'Services à la personne (garde d\'enfants, aide à domicile)',
    'Activités commerciales de vente de biens',
    'Prestations nécessitant un agrément spécifique',
    'Missions dépassant 36 mois consécutifs'
  ];

  return (
    <PageWrapper mainClassName="space-y-24 bg-neutral-50 pt-0 md:pt-6 pb-24 md:pb-32">
      {/* Hero Section */}
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-neutral-900 text-white shadow-lg sm:mx-6 sm:rounded-3xl">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
            alt="Portage salarial pour la gestion de chalets"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/35"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Portage Salarial</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            La solution idéale pour exercer en toute sécurité votre activité de gestion de chalets.
          </p>
        </div>
      </section>

      {/* Definition Section */}
      <section className="bg-white py-20 shadow-sm sm:mx-6 sm:rounded-3xl sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Qu'est-ce que le Portage Salarial ?
              </h2>
              
              <div className="space-y-6">
                <p className="text-lg text-neutral-600 leading-relaxed">
                  Le <strong>portage salarial</strong> est un arrangement d'emploi tripartite innovant qui implique 
                  un <strong>travailleur indépendant</strong> (salarié porté), une <strong>société de portage</strong> 
                  et un ou plusieurs <strong>clients</strong>.
                </p>
                
                <p className="text-lg text-neutral-600 leading-relaxed">
                  Le travailleur signe un <strong>CDI ou CDD</strong> avec la société de portage, qui se charge 
                  de gérer les contrats et la facturation avec le client. Le chiffre d'affaires est ensuite 
                  versé au travailleur sous forme de <strong>salaire</strong> après déduction des frais de gestion 
                  et des charges sociales.
                </p>

                <div className="bg-primary-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-primary-900 mb-3">
                    Structure Tripartite
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary-600 rounded-full mr-3"></div>
                      <span className="text-primary-800"><strong>Salarié Porté :</strong> Expert indépendant</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary-600 rounded-full mr-3"></div>
                      <span className="text-primary-800"><strong>Société de Portage :</strong> Gestion administrative</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary-600 rounded-full mr-3"></div>
                      <span className="text-primary-800"><strong>Client :</strong> Bénéficiaire des prestations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                  alt="Arrangement tripartite du portage salarial"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Les Avantages du Portage Salarial
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Combinez la sécurité du salariat avec la liberté de l'entrepreneuriat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              return (
                <div 
                  key={index}
                  className="text-center p-6 bg-white rounded-2xl border border-neutral-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientIcon name={benefit.icon} className="h-8 w-8 text-primary-700" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 bg-white p-8 rounded-2xl border border-neutral-200">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
              Pourquoi Choisir le Portage Salarial ?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">
                  <ClientIcon name="CheckCircle" className="inline h-5 w-5 text-primary-600 mr-2" />
                  Sécurité Sociale
                </h4>
                <p className="text-neutral-600 mb-4">
                  Bénéficiez d'une couverture sociale complète comparable à celle d'un salarié : 
                  assurance maladie, retraite, assurance chômage, et prévoyance.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">
                  <ClientIcon name="CheckCircle" className="inline h-5 w-5 text-primary-600 mr-2" />
                  Liberté Entrepreneuriale
                </h4>
                <p className="text-neutral-600 mb-4">
                  Gardez votre autonomie pour trouver vos clients, négocier vos tarifs et 
                  organiser vos missions selon vos préférences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Comment Ça Fonctionne ?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Un processus simple et transparent en 4 étapes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-700 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                    {step.number}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-16 w-full h-0.5 bg-primary-200"></div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Conditions et Prérequis
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Le portage salarial s'adresse aux experts avec un niveau d'autonomie suffisant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {conditions.map((condition, index) => {
              return (
                <div 
                  key={index}
                  className="text-center p-6 bg-white rounded-2xl border border-neutral-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientIcon name={condition.icon} className="h-8 w-8 text-primary-700" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-3">
                    {condition.title}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {condition.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Limitations */}
          <div className="bg-white p-8 rounded-2xl border border-neutral-200">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
              Activités Non Éligibles
            </h3>
            <p className="text-neutral-600 mb-6 text-center">
              Le portage salarial ne s'applique pas aux activités suivantes :
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {limitations.map((limitation, index) => (
                <div key={index} className="flex items-start">
                  <ClientIcon name="X" className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">{limitation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Intéressé par le Portage Salarial ?
          </h2>
          
          <p className="text-xl text-primary-100 mb-8">
            Découvrez comment travailler avec nous en toute sécurité pour la gestion de vos chalets
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/contact?type=portage-salarial"
              className="px-8 py-4 bg-white text-primary-800 rounded-full font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <ClientIcon name="Mail" className="mr-2 h-5 w-5" />
              Demander des Informations
            </Link>
            
            <a
              href="tel:+33123456789"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-primary-800 transition-all duration-300 flex items-center justify-center"
            >
              <ClientIcon name="Phone" className="mr-2 h-5 w-5" />
              Nous Appeler
            </a>
          </div>

          <div className="flex items-center justify-center space-x-6 text-primary-200">
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="h-5 w-5 mr-2" />
              Consultation Gratuite
            </div>
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="h-5 w-5 mr-2" />
              Accompagnement Personnalisé
            </div>
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="h-5 w-5 mr-2" />
              Démarrage Rapide
            </div>
          </div>
        </div>
      </section>

    </PageWrapper>
  );
}
