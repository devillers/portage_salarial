/* eslint-disable react/no-unescaped-entities */

import Image from 'next/image';
import Link from 'next/link';
import ClientIcon from '../../components/ClientIcon';
import PageWrapper from '../../components/layout/PageWrapper';
import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({
  title: 'Séminaires & Événements | Chalet Manager',
  description:
    "Direction événementielle sur-mesure pour séminaires, incentives et retraites bien-être. Production haut de gamme, logistique 360° et expériences immersives dans les Alpes.",
  path: '/seminaires-evenements',
  keywords: [
    'organisation seminaire',
    'evenement entreprise alpes',
    'retreat montagne',
    'evenement corporate chalet',
  ],
});

export default function SeminairesEvenementsPage() {
  const stats = [
    {
      value: '120+',
      label: 'événements orchestrés',
    },
    {
      value: '35',
      label: 'destinations alpines partenaires',
    },
    {
      value: '97%',
      label: 'taux de satisfaction clients',
    },
    {
      value: '48h',
      label: 'pour recevoir un concept créatif',
    },
  ];

  const eventPrograms = [
    {
      title: 'Séminaires Corporate Signature',
      description:
        'Alignement stratégique, contenus inspirants et production technique irréprochable pour vos rencontres clés.',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg',
      imageAlt: "Conférence d'entreprise dans un chalet moderne avec vue sur les montagnes",
      highlights: [
        'Design de programme & storytelling sur-mesure',
        'Studios modulables, scénographie et audiovisuel premium',
        'Expériences networking et soirées signature',
      ],
    },
    {
      title: 'Incentives & Team Building',
      description:
        'Moments fédérateurs pour engager vos équipes et célébrer vos succès dans des cadres naturels d’exception.',
      image: 'https://images.pexels.com/photos/2603681/pexels-photo-2603681.jpeg',
      imageAlt: "Équipe en activité de team building dans la neige",
      highlights: [
        'Activités outdoor accompagnées par des guides locaux',
        'Ateliers de cohésion imaginés avec vos RH',
        'Logistique transport & sécurité intégrée',
      ],
    },
    {
      title: 'Retraites & Séjours Yoga',
      description:
        'Parenthèses bien-être co-créées avec Les Joly Dames : équilibre entre ressourcement et découvertes.',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
      imageAlt: 'Séance de yoga au lever du soleil face aux montagnes',
      highlights: [
        'Petits groupes de 8 à 12 participantes',
        'Gastronomie végétale et slow living',
        'Guides, professeures certifiées et accompagnement holistique',
      ],
    },
  ];

  const servicePillars = [
    {
      icon: 'CalendarCheck',
      title: 'Pilotage 360°',
      description: 'Gestion complète du rétroplanning, coordination fournisseurs et contrôle budget.',
    },
    {
      icon: 'Presentation',
      title: 'Design Expérientiel',
      description: 'Scénographie immersive, contenus inspirants et mise en scène de vos messages clés.',
    },
    {
      icon: 'Sparkles',
      title: 'Moments Signature',
      description: 'Dîners privés, activités exclusives et attentions personnalisées pour chaque participant.',
    },
    {
      icon: 'ShieldCheck',
      title: 'Sécurité & Sérénité',
      description: 'Supervision terrain, protocoles de sécurité et plans de contingence documentés.',
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Cadrage stratégique',
      description: 'Analyse de vos enjeux, des profils participants et définition des KPI événementiels.',
    },
    {
      number: '02',
      title: 'Concept & design',
      description: 'Création du fil rouge, sélection des lieux et architecture du programme sur-mesure.',
    },
    {
      number: '03',
      title: 'Production & logistique',
      description: 'Coordination opérationnelle, transports, hébergements, technique et hospitalité.',
    },
    {
      number: '04',
      title: 'Live experience',
      description: 'Direction de projet sur site, gestion des imprévus et accompagnement des équipes.',
    },
    {
      number: '05',
      title: 'Mesure & suivi',
      description: 'Reporting, collecte de feedbacks et recommandations pour vos prochaines éditions.',
    },
  ];

  const jolyHighlights = [
    {
      icon: 'Mountain',
      title: 'Destinations exceptionnelles',
      description: 'Alpes françaises, Haut Atlas marocain et Alpes juliennes slovènes.',
    },
    {
      icon: 'Users',
      title: 'Cercle intimiste',
      description: 'Groupes réduits pour favoriser la cohésion et l’écoute individuelle.',
    },
    {
      icon: 'HeartPulse',
      title: 'Bien-être holistique',
      description: 'Yoga, randonnées guidées, cuisine végétale et rituels ressourçants.',
    },
    {
      icon: 'Sun',
      title: 'Rythme équilibré',
      description: 'Alternance de workshops, temps d’intégration et instants contemplatifs.',
    },
  ];

  const commitments = [
    {
      icon: 'Leaf',
      title: 'Éco-conception',
      description: 'Sélection de partenaires engagés, circuits courts et compensation carbone systématique.',
    },
    {
      icon: 'ScanLine',
      title: 'Hybridation digitale',
      description: 'Plateformes de diffusion live, applications participants et analytics en temps réel.',
    },
    {
      icon: 'Handshake',
      title: 'Réseau premium',
      description: 'Chefs, artistes, speakers et guides triés sur le volet pour des expériences exclusives.',
    },
    {
      icon: 'Star',
      title: 'Hospitalité signature',
      description: 'Conciergerie dédiée, cadeaux sur mesure et attention portée à chaque détail.',
    },
  ];

  return (
    <PageWrapper mainClassName="space-y-24 bg-neutral-50 pt-0 md:pt-6 pb-24 md:pb-32">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden rounded-none text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg"
            alt="Organisation de séminaires premium dans un chalet alpin"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-primary-200">
            Direction événementielle sur-mesure
          </p>
          <h1 className="mb-6 text-4xl font-light leading-tight md:text-6xl lg:text-7xl">
            Séminaires & événements qui laissent une empreinte durable
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
            De la stratégie au dernier détail terrain, nous orchestrons des expériences professionnelles et bien-être
            dans des écrins alpins d’exception.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact?type=seminaire-corporate"
              className="flex items-center justify-center rounded-full bg-primary-700 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-primary-800 hover:shadow-2xl"
            >
              Concept sur-mesure
              <ClientIcon name="ArrowRight" className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact?type=sejour-yoga"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20"
            >
              Retraite bien-être
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction & Stats */}
      <section className="bg-white py-20 shadow-sm sm:mx-6 sm:rounded-3xl sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
                Une direction événementielle intégrée pour vos moments stratégiques
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Nous accompagnons les directions générales, marketing et RH dans la conception de rendez-vous marquants :
                séminaires de transformation, kick-off commerciaux, incentives, lancements de produit ou retraites de
                leadership.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Notre équipe garantit une expérience premium pour vos participants : storytelling, scénographie,
                coordination technique et hospitalité signature, tout en pilotant vos objectifs business.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-primary-700">
                <div className="flex items-center rounded-full bg-primary-50 px-4 py-2">
                  <ClientIcon name="CheckCircle" className="mr-2 h-4 w-4" />
                  Gouvernance projet claire
                </div>
                <div className="flex items-center rounded-full bg-primary-50 px-4 py-2">
                  <ClientIcon name="CheckCircle" className="mr-2 h-4 w-4" />
                  Créativité & performance
                </div>
                <div className="flex items-center rounded-full bg-primary-50 px-4 py-2">
                  <ClientIcon name="CheckCircle" className="mr-2 h-4 w-4" />
                  Expérience participant mémorable
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center shadow-sm"
                >
                  <p className="text-3xl font-bold text-primary-700">{stat.value}</p>
                  <p className="mt-2 text-sm text-neutral-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Programmes signature conçus pour vos objectifs
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Des formats experts imaginés pour fédérer vos équipes, inspirer vos communautés ou offrir un temps de
              reconnexion profond.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {eventPrograms.map((program, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-56">
                  <Image
                    src={program.image}
                    alt={program.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <h3 className="absolute bottom-6 left-6 text-2xl font-semibold text-white drop-shadow-lg">
                    {program.title}
                  </h3>
                </div>

                <div className="space-y-6 p-6">
                  <p className="text-neutral-600 leading-relaxed">{program.description}</p>
                  <ul className="space-y-3">
                    {program.highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex} className="flex items-start text-sm text-neutral-700">
                        <ClientIcon name="CheckCircle" className="mr-3 mt-1 h-5 w-5 text-primary-600" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Pillars */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500"></div>
        <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-10 text-white">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Un pilotage 360° sans compromis</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Nous combinons rigueur opérationnelle et créativité pour délivrer des expériences à très forte valeur
              ajoutée.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {servicePillars.map((pillar, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <ClientIcon name={pillar.icon} className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-white/80">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-20 shadow-sm sm:mx-6 sm:rounded-3xl sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Méthodologie éprouvée pour des événements performants
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Une gouvernance claire et un accompagnement de bout en bout pour transformer vos ambitions en expérience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-800">
                  <span className="text-lg font-semibold">{step.number}</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">{step.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Joly Dames Partnership */}
      <section className="py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative h-96 overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg"
                alt="Retraite yoga organisée par Les Joly Dames"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">
                Partenariat Les Joly Dames
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
                Retraites yoga & leadership féminin clés en main
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Nous co-produisons des séjours exclusifs mêlant marche consciente, yoga et découvertes culinaires. Des
                destinations inspirantes, une logistique fluide et un accompagnement bienveillant pour révéler vos
                talents féminins.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {jolyHighlights.map((highlight, index) => (
                  <div key={index} className="rounded-2xl bg-primary-50 p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-200 text-primary-800">
                      <ClientIcon name={highlight.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary-900 mb-2">{highlight.title}</h3>
                    <p className="text-sm text-primary-700 leading-relaxed">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="bg-neutral-100 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Nos engagements pour des événements responsables</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Des choix conscients et une technologie intelligente pour des expériences mémorables et durables.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {commitments.map((commitment, index) => (
              <div key={index} className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-800">
                  <ClientIcon name={commitment.icon} className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{commitment.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{commitment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center px-6 sm:px-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à imaginer votre prochain événement ?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Recevez un concept créatif détaillé en 48h : objectifs, expérience participant et feuille de route opérationnelle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?type=seminaire-corporate"
              className="flex items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-primary-800 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-neutral-100"
            >
              <ClientIcon name="Calendar" className="mr-2 h-5 w-5" />
              Brief séminaire corporate
            </Link>
            <Link
              href="/contact?type=sejour-yoga"
              className="flex items-center justify-center rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-primary-800"
            >
              <ClientIcon name="Heart" className="mr-2 h-5 w-5" />
              Co-créer une retraite yoga
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-primary-200">
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="mr-2 h-5 w-5" />
              Proposition personnalisée
            </div>
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="mr-2 h-5 w-5" />
              Réponse rapide
            </div>
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="mr-2 h-5 w-5" />
              Accompagnement dédié
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
