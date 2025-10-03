/* eslint-disable react/no-unescaped-entities */

import Image from 'next/image';
import Link from 'next/link';
import ClientIcon from '../../components/ClientIcon';
import PageWrapper from '../../components/layout/PageWrapper';

export const metadata = {
  title: 'Séminaires & Événements | Chalet Manager',
  description: 'Organisation complète de séminaires incentive, événements corporate et séjours yoga avec Les Joly Dames. MICE event planning professionnel dans les Alpes.',
};

export default function SeminairesEvenementsPage() {
  const miceSteps = [
    {
      icon: 'Target',
      title: 'Définition des Objectifs',
      description: 'Analyse des besoins, définition des objectifs business et identification des résultats attendus'
    },
    {
      icon: 'Euro',
      title: 'Budget & Planification',
      description: 'Établissement du budget global, répartition des coûts et optimisation des ressources'
    },
    {
      icon: 'MapPin',
      title: 'Choix du Lieu',
      description: 'Sélection de sites adaptés aux objectifs, capacité et ambiance recherchée'
    },
    {
      icon: 'Settings',
      title: 'Mise en Place Technique',
      description: 'Installation audiovisuelle, équipements IT et infrastructure technique'
    },
    {
      icon: 'Smartphone',
      title: 'Intégration Numérique',
      description: 'Outils digitaux, applications événementielles et solutions hybrides'
    },
    {
      icon: 'Palette',
      title: 'Design d\'Expérience',
      description: 'Création d\'ambiances, scénographie et parcours participant personnalisé'
    },
    {
      icon: 'Truck',
      title: 'Logistique',
      description: 'Coordination transport, hébergement, restauration et services annexes'
    },
    {
      icon: 'BarChart3',
      title: 'Suivi Post-Événement',
      description: 'Analyse des résultats, feedback participants et reporting complet'
    }
  ];

  const trends2025 = [
    {
      icon: 'Wifi',
      title: 'Digital & Hybride',
      description: 'Événements connectés combinant présentiel et virtuel pour une portée maximale'
    },
    {
      icon: 'Mountain',
      title: 'Incentives Expérientielles',
      description: 'Voyages aventure, expériences culturelles immersives et retraites bien-être'
    },
    {
      icon: 'Users',
      title: 'Personnalisation à Grande Échelle',
      description: 'Expériences sur-mesure adaptées aux profils et préférences individuelles'
    },
    {
      icon: 'Leaf',
      title: 'Durabilité',
      description: 'Lieux éco-responsables, événements sans papier, restauration zéro déchet'
    },
    {
      icon: 'Globe',
      title: 'Lieux Atypiques',
      description: 'Sites exceptionnels et insolites pour des expériences mémorables'
    }
  ];

  const services = [
    'Choix et réservation de sites adaptés',
    'Salles de réunion équipées et logements confortables',
    'Planification d\'activités de cohésion d\'équipe',
    'Gestion complète des fournisseurs',
    'Intégration d\'outils technologiques avancés',
    'Inscriptions en ligne et badges digitaux',
    'Suivi budgétaire en temps réel',
    'Reporting détaillé post-événement'
  ];

  const yogaFeatures = [
    {
      icon: 'MapPin',
      title: 'Destinations Exceptionnelles',
      description: 'Alpes françaises, Haut Atlas marocain, Alpes juliennes slovènes'
    },
    {
      icon: 'Calendar',
      title: 'Format Optimal',
      description: 'Séjours de 4 nuits et 3 jours pour une immersion complète'
    },
    {
      icon: 'Users',
      title: 'Groupes Intimistes',
      description: '8 participantes (France/Slovénie), 10 au Maroc pour une ambiance conviviale'
    },
    {
      icon: 'Heart',
      title: 'Expérience Holistique',
      description: 'Yoga, randonnées guidées, cuisine locale végétarienne'
    }
  ];

  return (
    <PageWrapper mainClassName="space-y-24 bg-neutral-50 pt-0 md:pt-6 pb-24 md:pb-32">
      {/* Hero Section */}
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-neutral-900 text-white shadow-lg sm:mx-6 sm:rounded-3xl">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg"
            alt="Organisation de séminaires et événements corporate"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/35"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Séminaires & Événements</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Organisation complète de séminaires incentive, événements corporate et séjours yoga dans des cadres exceptionnels.
          </p>
        </div>
      </section>

      {/* MICE Introduction */}
      <section className="bg-white py-20 shadow-sm sm:mx-6 sm:rounded-3xl sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              MICE Event Planning Professionnel
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                <strong>MICE (Meetings, Incentives, Conferences, Exhibitions)</strong> vise à créer des expériences qui favorisent les connexions, soutiennent les objectifs business et se déroulent avec une logistique irréprochable.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Notre expertise couvre l'ensemble du processus, de la conception à l'exécution, pour des événements qui marquent les esprits et génèrent des résultats concrets.
              </p>
            </div>
          </div>

          {/* MICE Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {miceSteps.map((step, index) => {
              return (
                <div 
                  key={index}
                  className="text-center p-6 bg-neutral-50 rounded-2xl border border-neutral-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientIcon name={step.icon} className="h-8 w-8 text-primary-700" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2025 Trends */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Tendances 2025
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Les nouvelles attentes du marché MICE et les innovations qui transforment l'événementiel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trends2025.map((trend, index) => {
              return (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-2xl border border-neutral-200 hover:border-primary-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                    <ClientIcon name={trend.icon} className="h-6 w-6 text-primary-700" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">
                    {trend.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {trend.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Sustainability Focus */}
          <div className="mt-16 bg-primary-50 p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <ClientIcon name="Leaf" className="h-8 w-8 text-primary-700 mr-4" />
              <h3 className="text-2xl font-bold text-primary-900">
                Engagement Durabilité
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ClientIcon name="MapPin" className="h-6 w-6 text-primary-800" />
                </div>
                <h4 className="font-semibold text-primary-900 mb-2">Lieux Éco-responsables</h4>
                <p className="text-primary-700 text-sm">Sites certifiés environnementaux</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ClientIcon name="Smartphone" className="h-6 w-6 text-primary-800" />
                </div>
                <h4 className="font-semibold text-primary-900 mb-2">Événements Sans Papier</h4>
                <p className="text-primary-700 text-sm">Solutions 100% digitales</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ClientIcon name="Heart" className="h-6 w-6 text-primary-800" />
                </div>
                <h4 className="font-semibold text-primary-900 mb-2">Restauration Zéro Déchet</h4>
                <p className="text-primary-700 text-sm">Circuits courts et locaux</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ClientIcon name="Globe" className="h-6 w-6 text-primary-800" />
                </div>
                <h4 className="font-semibold text-primary-900 mb-2">Compensation Carbone</h4>
                <p className="text-primary-700 text-sm">Neutralité carbone garantie</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Coordination Complète
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Nous prenons en charge l'intégralité de votre événement, de la conception à l'exécution, 
                pour vous permettre de vous concentrer sur vos objectifs business.
              </p>
              
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start">
                    <ClientIcon name="CheckCircle" className="h-6 w-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg"
                  alt="Coordination d'événements corporate"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Les Joly Dames Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Séminaires Yoga avec Les Joly Dames
            </h2>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto">
              Week-ends de marche et yoga pour femmes dans des destinations exceptionnelles
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg"
                  alt="Séjour yoga dans les montagnes"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-primary-900 mb-6">
                Une Expérience Unique de Ressourcement
              </h3>
              <p className="text-lg text-primary-800 mb-6 leading-relaxed">
                Les Joly Dames organisent des week-ends de marche et yoga pour femmes, en petits groupes, 
                dans les <strong>Alpes françaises</strong>, le <strong>Haut Atlas marocain</strong> et les <strong>Alpes juliennes slovènes</strong>.
              </p>
              
              <div className="bg-white/50 p-6 rounded-xl mb-6">
                <h4 className="font-semibold text-primary-900 mb-4">L'Expérience Complète :</h4>
                <ul className="space-y-2 text-primary-800">
                  <li className="flex items-start">
                    <ClientIcon name="Star" className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Séjours de <strong>4 nuits et 3 jours</strong> avec hébergement confortable</span>
                  </li>
                  <li className="flex items-start">
                    <ClientIcon name="Star" className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Repas principalement <strong>végétariens</strong> à base d'ingrédients locaux</span>
                  </li>
                  <li className="flex items-start">
                    <ClientIcon name="Star" className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Randonnées guidées</strong> par des guides locaux expérimentés</span>
                  </li>
                  <li className="flex items-start">
                    <ClientIcon name="Star" className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Séances de yoga</strong> avec des professeures qualifiées</span>
                  </li>
                </ul>
              </div>

              <p className="text-primary-700 leading-relaxed">
                L'accent est mis sur la <strong>détente</strong>, la <strong>reconnexion</strong> et l'<strong>exploration de cultures locales</strong> 
                dans une ambiance conviviale et ressourçante.
              </p>
            </div>
          </div>

          {/* Yoga Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {yogaFeatures.map((feature, index) => {
              return (
                <div 
                  key={index}
                  className="text-center p-6 bg-white/70 rounded-2xl border border-primary-200 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientIcon name={feature.icon} className="h-8 w-8 text-primary-800" />
                  </div>
                  <h3 className="text-lg font-bold text-primary-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-primary-700 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Partnership Info */}
          <div className="bg-white p-8 rounded-2xl border border-primary-200 shadow-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary-900 mb-4">
                Partenariat Privilégié
              </h3>
              <p className="text-lg text-primary-800 mb-6 max-w-3xl mx-auto leading-relaxed">
                Nous collaborons avec Les Joly Dames pour proposer des <strong>séminaires yoga "clé en main"</strong> 
                incluant logistique complète, activités sur-mesure et hébergements de charme dans des cadres naturels exceptionnels.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-700">
                <div className="flex items-center">
                  <ClientIcon name="CheckCircle" className="h-4 w-4 mr-2" />
                  <span>8 participantes (France/Slovénie)</span>
                </div>
                <div className="flex items-center">
                  <ClientIcon name="CheckCircle" className="h-4 w-4 mr-2" />
                  <span>10 participantes (Maroc)</span>
                </div>
                <div className="flex items-center">
                  <ClientIcon name="CheckCircle" className="h-4 w-4 mr-2" />
                  <span>Ambiance conviviale garantie</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Organiser Votre Prochain Événement ?
          </h2>
          
          <p className="text-xl text-primary-100 mb-8">
            Demandez un devis personnalisé pour votre séminaire corporate ou séjour yoga sur mesure
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?type=seminaire-corporate"
              className="px-8 py-4 bg-white text-primary-800 rounded-full font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <ClientIcon name="Calendar" className="mr-2 h-5 w-5" />
              Devis Séminaire Corporate
            </Link>
            
            <Link
              href="/contact?type=sejour-yoga"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-primary-800 transition-all duration-300 flex items-center justify-center"
            >
              <ClientIcon name="Heart" className="mr-2 h-5 w-5" />
              Devis Séjour Yoga
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-6 text-primary-200 mt-8">
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="h-5 w-5 mr-2" />
              Devis Gratuit
            </div>
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="h-5 w-5 mr-2" />
              Réponse Rapide
            </div>
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="h-5 w-5 mr-2" />
              Sur Mesure
            </div>
          </div>
        </div>
      </section>

    </PageWrapper>
  );
}
