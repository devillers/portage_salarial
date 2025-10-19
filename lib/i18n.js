export const defaultLocale = 'fr';

export const translations = {
  en: {
    navigation: {
      brandName: 'Chalet Manager',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Seminars', href: '/seminaires-evenements' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Contact', href: '/contact' }
      ],
      auth: {
        signIn: 'Sign in',
        signUp: 'Sign up'
      },
      accessibility: {
        openMenu: 'Open main menu',
        closeMenu: 'Close main menu'
      }
    },
    language: {
      label: 'Language',
      english: 'English',
      french: 'Français',
      short: {
        en: 'EN',
        fr: 'FR'
      }
    },
    footer: {
      brand: {
        description:
          'Professional chalet management services for luxury mountain properties. We handle everything from guest relations to maintenance, maximizing your investment.'
      },
      contact: {
        emailLabel: 'Email',
        email: 'contact@chaletmanager.com',
        phoneLabel: 'Phone',
        phone: '+33 1 23 45 67 89',
        locationLines: ['Chamonix-Mont-Blanc', 'Haute-Savoie, France']
      },
      sections: {
        services: {
          title: 'Our Services',
          links: [
            { name: 'Rental Management', href: '/services#rental' },
            { name: 'Concierge Services', href: '/services#concierge' },
            { name: 'Maintenance', href: '/services#maintenance' },
            { name: 'Tax Administration', href: '/services#tax' },
            { name: 'Seminars & Events', href: '/seminaires-evenements' }
          ]
        },
        company: {
          title: 'Company',
          links: [
            { name: 'About Us', href: '/about' },
            { name: 'Portfolio', href: '/portfolio' },
            { name: 'Portage Salarial', href: '/portage-salarial' },
            { name: 'Seminars', href: '/seminaires-evenements' },
            { name: 'Contact', href: '/contact' },
            { name: 'Admin Login', href: '/admin' }
          ]
        },
        legal: {
          title: 'Legal',
          links: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookies' },
            { name: 'Legal Notice', href: '/legal' },
            { name: 'CGV Owners', href: '/cgv-proprietaires' },
            { name: 'CGV Tenants', href: '/cgv-locataires' }
          ]
        }
      },
      newsletter: {
        title: 'Stay Connected',
        description: 'Subscribe to our newsletter for updates and special offers.',
        placeholder: 'Enter your email',
        button: 'Subscribe',
        followUs: 'Follow us'
      },
      bottomBar: {
        copyright: 'All rights reserved.'
      }
    },
    home: {
      hero: {
        title: 'Premium Chalet',
        highlight: 'Management',
        description:
          'Transform your mountain property into a profitable venture with our comprehensive management services.',
        primaryCta: 'View Portfolio',
        secondaryCta: 'Get Started',
        backgroundAlt: 'Luxury mountain chalet in snowy landscape'
      },
      features: {
        title: 'Why Choose Our Management Services?',
        description:
          'We provide comprehensive chalet management that maximizes your investment while ensuring exceptional guest experiences',
        items: [
          {
            icon: 'Users',
            title: 'Guest Relations',
            description:
              'Professional concierge services ensuring exceptional guest experiences from arrival to departure.'
          },
          {
            icon: 'Award',
            title: 'Premium Service',
            description:
              'White-glove service standards with attention to every detail for discerning property owners.'
          },
          {
            icon: 'TrendingUp',
            title: 'Revenue Optimization',
            description:
              'Strategic pricing and marketing to maximize your rental income throughout all seasons.'
          }
        ]
      },
      services: {
        title: 'Our Core Services',
        description:
          'From rental management to concierge services, we handle every aspect of your chalet operation',
        items: [
          {
            title: 'Rental Management',
            description:
              'Complete rental management including booking coordination, guest communication, and revenue optimization.',
            image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
            imageAlt: 'Elegant chalet living room with fireplace'
          },
          {
            title: 'Concierge Services',
            description:
              'Premium concierge services providing guests with local recommendations, activity bookings, and personalized assistance.',
            image: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg',
            imageAlt: 'Concierge preparing welcome amenities'
          },
          {
            title: 'Maintenance & Care',
            description:
              'Proactive maintenance and care ensuring your property remains in pristine condition year-round.',
            image: 'https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg',
            imageAlt: 'Technician performing chalet maintenance'
          }
        ],
        cta: 'View All Services',
        learnMore: 'Learn More'
      },
      stats: {
        title: 'Proven Results',
        description: 'Our track record speaks for itself - we deliver exceptional results for property owners across the Alps',
        items: [
          { number: '150+', label: 'Chalets Managed' },
          { number: '5000+', label: 'Happy Guests' },
          { number: '98%', label: 'Satisfaction Rate' },
          { number: '45%', label: 'Avg. Revenue Increase' }
        ]
      },
      testimonials: {
        title: 'What Our Clients Say',
        description: 'Discover why property owners trust us with their most valuable investments',
        items: [
          {
            name: 'Marie Dubois',
            location: 'Courchevel',
            rating: 5,
            text:
              'Exceptional service! They transformed our chalet management completely. Revenue increased by 40% in the first year while maintaining the highest quality standards.'
          },
          {
            name: 'James Wilson',
            location: 'Chamonix',
            rating: 5,
            text:
              'Professional, reliable, and truly care about maximizing our investment. The concierge services are outstanding - guests consistently praise the experience.'
          },
          {
            name: 'Sophie Laurent',
            location: "Val d'Isère",
            rating: 5,
            text:
              'Working through portage salarial gives us complete peace of mind. All administrative tasks are handled professionally while we maintain full autonomy.'
          }
        ]
      },
      cta: {
        title: 'Ready to Maximize Your Chalet Investment?',
        description:
          'Join over 150 property owners who trust us with their chalet management. Get started today and see the difference professional management makes.',
        primaryCta: 'Get Free Consultation',
        secondaryCta: 'Call Now',
        badges: ['No Setup Fees', 'Free Consultation', 'Quick Setup']
      }
    }
  },
  fr: {
    navigation: {
      brandName: 'Chalet Manager',
      links: [
        { name: 'Accueil', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Séminaires', href: '/seminaires-evenements' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Contact', href: '/contact' }
      ],
      auth: {
        signIn: 'Se connecter',
        signUp: "S'inscrire"
      },
      accessibility: {
        openMenu: 'Ouvrir le menu principal',
        closeMenu: 'Fermer le menu principal'
      }
    },
    language: {
      label: 'Langue',
      english: 'English',
      french: 'Français',
      short: {
        en: 'EN',
        fr: 'FR'
      }
    },
    footer: {
      brand: {
        description:
          'Services professionnels de gestion de chalets pour les propriétés de montagne haut de gamme. Nous gérons tout, des relations clients à la maintenance, pour maximiser votre investissement.'
      },
      contact: {
        emailLabel: 'E-mail',
        email: 'contact@chaletmanager.com',
        phoneLabel: 'Téléphone',
        phone: '+33 1 23 45 67 89',
        locationLines: ['Chamonix-Mont-Blanc', 'Haute-Savoie, France']
      },
      sections: {
        services: {
          title: 'Nos services',
          links: [
            { name: 'Gestion locative', href: '/services#rental' },
            { name: 'Conciergerie', href: '/services#concierge' },
            { name: 'Maintenance', href: '/services#maintenance' },
            { name: 'Gestion fiscale', href: '/services#tax' },
            { name: 'Séminaires & Événements', href: '/seminaires-evenements' }
          ]
        },
        company: {
          title: 'Entreprise',
          links: [
            { name: 'À propos', href: '/about' },
            { name: 'Portfolio', href: '/portfolio' },
            { name: 'Portage salarial', href: '/portage-salarial' },
            { name: 'Séminaires', href: '/seminaires-evenements' },
            { name: 'Contact', href: '/contact' },
            { name: 'Espace admin', href: '/admin' }
          ]
        },
        legal: {
          title: 'Légal',
          links: [
            { name: 'Politique de confidentialité', href: '/privacy' },
            { name: 'Conditions d’utilisation', href: '/terms' },
            { name: 'Politique cookies', href: '/cookies' },
            { name: 'Mentions légales', href: '/legal' },
            { name: 'CGV Propriétaires', href: '/cgv-proprietaires' },
            { name: 'CGV Locataires', href: '/cgv-locataires' }
          ]
        }
      },
      newsletter: {
        title: 'Restez connectés',
        description: 'Inscrivez-vous à notre newsletter pour recevoir nos actualités et offres exclusives.',
        placeholder: 'Entrez votre e-mail',
        button: 'Je m’abonne',
        followUs: 'Suivez-nous'
      },
      bottomBar: {
        copyright: 'Tous droits réservés.'
      }
    },
    home: {
      hero: {
        title: 'Gestion premium de',
        highlight: 'chalets',
        description:
          'Transformez votre propriété de montagne en un investissement rentable grâce à notre gestion complète.',
        primaryCta: 'Voir le portfolio',
        secondaryCta: 'Commencer',
        backgroundAlt: 'Chalet de luxe en montagne enneigée'
      },
      features: {
        title: 'Pourquoi choisir notre gestion ?',
        description:
          'Nous offrons une gestion de chalet complète qui maximise votre investissement tout en garantissant une expérience client irréprochable.',
        items: [
          {
            icon: 'Users',
            title: 'Relation client',
            description:
              'Service de conciergerie professionnel pour une expérience client exceptionnelle, de l’arrivée au départ.'
          },
          {
            icon: 'Award',
            title: 'Service premium',
            description:
              'Des standards haut de gamme avec une attention à chaque détail pour les propriétaires les plus exigeants.'
          },
          {
            icon: 'TrendingUp',
            title: 'Optimisation des revenus',
            description:
              'Stratégies tarifaires et marketing pour maximiser vos revenus locatifs toute l’année.'
          }
        ]
      },
      services: {
        title: 'Nos services clés',
        description:
          'De la gestion locative à la conciergerie, nous prenons en charge chaque aspect de votre chalet.',
        items: [
          {
            title: 'Gestion locative',
            description:
              'Gestion complète des locations : coordination des réservations, communication avec les clients et optimisation des revenus.',
            image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
            imageAlt: 'Salon de chalet élégant avec cheminée'
          },
          {
            title: 'Conciergerie',
            description:
              'Service de conciergerie haut de gamme offrant recommandations locales, réservations d’activités et assistance personnalisée.',
            image: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg',
            imageAlt: 'Concierge préparant des attentions de bienvenue'
          },
          {
            title: 'Maintenance & entretien',
            description:
              'Maintenance proactive pour garantir un chalet impeccable tout au long de l’année.',
            image: 'https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg',
            imageAlt: 'Technicien effectuant la maintenance d’un chalet'
          }
        ],
        cta: 'Découvrir tous nos services',
        learnMore: 'En savoir plus'
      },
      stats: {
        title: 'Des résultats prouvés',
        description:
          'Notre bilan parle de lui-même : nous offrons des résultats exceptionnels aux propriétaires dans tout l’arc alpin.',
        items: [
          { number: '150+', label: 'Chalets gérés' },
          { number: '5000+', label: 'Invités satisfaits' },
          { number: '98%', label: 'Taux de satisfaction' },
          { number: '45%', label: 'Hausse moyenne des revenus' }
        ]
      },
      testimonials: {
        title: 'Ce que disent nos clients',
        description: 'Découvrez pourquoi les propriétaires nous confient leurs biens les plus précieux',
        items: [
          {
            name: 'Marie Dubois',
            location: 'Courchevel',
            rating: 5,
            text:
              'Un service exceptionnel ! Ils ont complètement transformé la gestion de notre chalet. Les revenus ont augmenté de 40 % la première année tout en conservant un niveau de qualité irréprochable.'
          },
          {
            name: 'James Wilson',
            location: 'Chamonix',
            rating: 5,
            text:
              'Professionnels, fiables et engagés pour maximiser notre investissement. Les services de conciergerie sont remarquables — les clients en parlent avec enthousiasme.'
          },
          {
            name: 'Sophie Laurent',
            location: "Val d'Isère",
            rating: 5,
            text:
              'Le portage salarial nous apporte une vraie tranquillité d’esprit. Toute l’administratif est géré professionnellement et nous gardons notre autonomie.'
          }
        ]
      },
      cta: {
        title: 'Prêts à valoriser votre chalet ?',
        description:
          'Rejoignez plus de 150 propriétaires qui nous confient la gestion de leur chalet. Lancez-vous dès aujourd’hui et découvrez l’impact d’une gestion professionnelle.',
        primaryCta: 'Obtenir un audit gratuit',
        secondaryCta: 'Appeler maintenant',
        badges: ['Sans frais de mise en place', 'Consultation offerte', 'Mise en route rapide']
      }
    }
  }
};

export const supportedLocales = Object.keys(translations);
