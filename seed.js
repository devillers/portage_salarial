/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envFiles = ['.env.local', '.env'];

  for (const fileName of envFiles) {
    const fullPath = path.join(process.cwd(), fileName);
    if (!fs.existsSync(fullPath)) {
      continue;
    }

    const raw = fs.readFileSync(fullPath, 'utf8');
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const delimiterIndex = trimmed.indexOf('=');
      if (delimiterIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, delimiterIndex).trim();
      let value = trimmed.slice(delimiterIndex + 1).trim();

      if (!key || Object.prototype.hasOwnProperty.call(process.env, key)) {
        continue;
      }

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    }
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    .trim();
}

async function ensureAdminUser(UserModel) {
  const username = (process.env.SEED_ADMIN_USERNAME || 'gestionnaire-alpes').toLowerCase();
  const email = (process.env.SEED_ADMIN_EMAIL || 'gestionnaire@portage.local').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || 'GestionPortage123!';

  let user = await UserModel.findOne({ email });

  if (!user) {
    user = await UserModel.create({
      username,
      email,
      password,
      role: 'admin'
    });
    console.log(`✔️  Utilisateur administrateur créé : ${email}`);
  } else {
    console.log(`ℹ️  Utilisateur administrateur déjà présent : ${email}`);
  }

  return user;
}

function buildChaletSeeds() {
  return [
    {
      title: 'Chalet Aster des Cimes',
      description:
        "Situé au cœur de Chamonix, le Chalet Aster des Cimes offre une vue panoramique sur le Mont-Blanc. Ses espaces de vie lumineux et son spa nordique en extérieur en font un lieu idéal pour les séjours en famille ou entre amis. Chaque détail a été conçu pour offrir un confort absolu, des matériaux nobles aux équipements haut de gamme.",
      shortDescription:
        'Un chalet lumineux à Chamonix avec spa nordique extérieur et cinq suites.',
      images: [
        {
          url: 'https://images.pexels.com/photos/1127119/pexels-photo-1127119.jpeg',
          alt: 'Façade enneigée du Chalet Aster des Cimes',
          caption: 'Une architecture alpine contemporaine',
          isHero: true
        },
        {
          url: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
          alt: 'Salon du Chalet Aster des Cimes',
          caption: 'Salon cathédrale avec cheminée centrale'
        },
        {
          url: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg',
          alt: 'Spa nordique du Chalet Aster des Cimes',
          caption: 'Spa nordique chauffé face aux montagnes'
        }
      ],
      amenities: [
        { name: 'Spa nordique', icon: 'Spa', description: 'Bain norvégien extérieur chauffé toute l’année.' },
        { name: 'Cheminée centrale', icon: 'Fireplace', description: 'Cheminée double face pour des soirées conviviales.' },
        { name: 'Salle de cinéma', icon: 'Clapperboard', description: 'Espace multimédia avec système Dolby Atmos.' },
        { name: 'Ski room chauffé', icon: 'Snowflake', description: 'Rangements dédiés avec chauffe-chaussures.' }
      ],
      specifications: {
        bedrooms: 5,
        bathrooms: 5,
        maxGuests: 12,
        area: 320,
        floors: 3
      },
      location: {
        address: '89 Route des Pèlerins',
        city: 'Chamonix',
        country: 'France',
        postalCode: '74400',
        coordinates: {
          latitude: 45.923697,
          longitude: 6.869433
        }
      },
      pricing: {
        basePrice: 780,
        currency: 'EUR',
        cleaningFee: 120,
        securityDeposit: 1500,
        taxRate: 10
      },
      availability: {
        isActive: true,
        minimumStay: 3,
        maximumStay: 21,
        checkInTime: '16:00',
        checkOutTime: '10:00',
        blockedDates: []
      },
      contact: {
        phone: '+33 4 50 53 00 00',
        email: 'aster@portage-salarial.fr',
        website: 'https://www.portage-salarial.fr/chalets/aster-des-cimes'
      },
      seo: {
        metaTitle: 'Chalet Aster des Cimes - Chamonix',
        metaDescription: 'Chalet d’exception à Chamonix avec spa nordique, salle de cinéma et vue Mont-Blanc.'
      },
      featured: true
    },
    {
      title: 'Chalet Lueur des Alpes',
      description:
        "Perché sur les hauteurs de Megève, le Chalet Lueur des Alpes propose une atmosphère chaleureuse mêlant tradition et modernité. Sa terrasse panoramique et sa piscine intérieure à débordement invitent à la détente après une journée sur les pistes.",
      shortDescription: 'Prestige à Megève avec piscine intérieure et service de conciergerie 24/7.',
      images: [
        {
          url: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg',
          alt: 'Vue extérieure du Chalet Lueur des Alpes',
          caption: 'Architecture traditionnelle et bardage bois',
          isHero: true
        },
        {
          url: 'https://images.pexels.com/photos/276551/pexels-photo-276551.jpeg',
          alt: 'Piscine intérieure du Chalet Lueur des Alpes',
          caption: 'Piscine intérieure à débordement avec vue'
        },
        {
          url: 'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg',
          alt: 'Suite parentale du Chalet Lueur des Alpes',
          caption: 'Suite parentale avec dressing et salle de bain marbre'
        }
      ],
      amenities: [
        { name: 'Piscine intérieure', icon: 'Waves', description: 'Piscine chauffée avec nage à contre-courant.' },
        { name: 'Conciergerie 24/7', icon: 'Headset', description: 'Service personnalisé pour chaque séjour.' },
        { name: 'Salle de sport', icon: 'Dumbbell', description: 'Espace fitness équipé Technogym.' },
        { name: 'Héliport privé', icon: 'Helicopter', description: 'Plateforme privée pour transferts rapides.' }
      ],
      specifications: {
        bedrooms: 6,
        bathrooms: 6,
        maxGuests: 14,
        area: 410,
        floors: 4
      },
      location: {
        address: '210 Chemin des Bois',
        city: 'Megève',
        country: 'France',
        postalCode: '74120',
        coordinates: {
          latitude: 45.8575,
          longitude: 6.6136
        }
      },
      pricing: {
        basePrice: 980,
        currency: 'EUR',
        cleaningFee: 150,
        securityDeposit: 2500,
        taxRate: 12
      },
      availability: {
        isActive: true,
        minimumStay: 4,
        maximumStay: 28,
        checkInTime: '15:00',
        checkOutTime: '11:00',
        blockedDates: []
      },
      contact: {
        phone: '+33 4 50 93 01 01',
        email: 'lueur@portage-salarial.fr',
        website: 'https://www.portage-salarial.fr/chalets/lueur-des-alpes'
      },
      seo: {
        metaTitle: 'Chalet Lueur des Alpes - Megève',
        metaDescription: 'Chalet de prestige à Megève avec piscine intérieure, héliport privé et conciergerie.'
      },
      featured: false
    },
    {
      title: 'Chalet Horizon Belle Plagne',
      description:
        "Dominant la vallée de la Tarentaise, le Chalet Horizon Belle Plagne combine un design contemporain et l’authenticité savoyarde. Sa grande pièce de vie avec baies vitrées ouvre sur un panorama exceptionnel et une terrasse chauffée.",
      shortDescription: 'Belle Plagne panoramique avec terrasse chauffée et espace bien-être.',
      images: [
        {
          url: 'https://images.pexels.com/photos/210415/pexels-photo-210415.jpeg',
          alt: 'Terrasse panoramique du Chalet Horizon',
          caption: 'Terrasse chauffée avec vue sur la Tarentaise',
          isHero: true
        },
        {
          url: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg',
          alt: 'Cuisine moderne du Chalet Horizon',
          caption: 'Cuisine ouverte équipée Gaggenau'
        },
        {
          url: 'https://images.pexels.com/photos/259803/pexels-photo-259803.jpeg',
          alt: 'Chambre du Chalet Horizon Belle Plagne',
          caption: 'Chambres avec balcon et vue montagne'
        }
      ],
      amenities: [
        { name: 'Sauna et hammam', icon: 'HotTub', description: 'Espace bien-être complet.' },
        { name: 'Terrasse chauffée', icon: 'Sun', description: 'Terrasse avec braseros et salons extérieurs.' },
        { name: 'Garage 4 véhicules', icon: 'Car', description: 'Garage couvert avec borne de recharge.' }
      ],
      specifications: {
        bedrooms: 4,
        bathrooms: 4,
        maxGuests: 10,
        area: 260,
        floors: 3
      },
      location: {
        address: '52 Route de Belle Plagne',
        city: 'La Plagne',
        country: 'France',
        postalCode: '73210',
        coordinates: {
          latitude: 45.5102,
          longitude: 6.6778
        }
      },
      pricing: {
        basePrice: 640,
        currency: 'EUR',
        cleaningFee: 110,
        securityDeposit: 1800,
        taxRate: 10
      },
      availability: {
        isActive: true,
        minimumStay: 3,
        maximumStay: 14,
        checkInTime: '17:00',
        checkOutTime: '10:00',
        blockedDates: []
      },
      contact: {
        phone: '+33 4 79 09 77 77',
        email: 'horizon@portage-salarial.fr',
        website: 'https://www.portage-salarial.fr/chalets/horizon-belle-plagne'
      },
      seo: {
        metaTitle: 'Chalet Horizon Belle Plagne',
        metaDescription: 'Chalet contemporain à Belle Plagne avec terrasse chauffée et espace bien-être.'
      },
      featured: false
    }
  ];
}

function buildPortfolioDescription(chalet) {
  return `Situé à ${chalet.location.city}, ${chalet.title} dispose de ${chalet.specifications.bedrooms} chambres et peut accueillir jusqu'à ${chalet.specifications.maxGuests} personnes. Ses équipements premium tels que ${chalet.amenities.slice(0, 2).map((a) => a.name).join(' et ')} en font un refuge idéal pour des séjours d'exception.`;
}

function buildCustomImages(chalet) {
  return (chalet.images || []).slice(0, 2).map((image, index) => ({
    url: image.url,
    alt: `${chalet.title} - ${index === 0 ? 'Vue extérieure' : 'Intérieur'}`,
    caption: image.caption || `${chalet.title} - ${index === 0 ? 'Vue panoramique' : 'Espace de vie'}`,
    isHero: index === 0
  }));
}

async function seedPortfolio({ ChaletModel, PortfolioItemModel }) {
  const seeds = buildChaletSeeds();
  const results = [];

  for (const [index, seed] of seeds.entries()) {
    const expectedSlug = slugify(seed.title);
    let chalet = await ChaletModel.findOne({ slug: expectedSlug });

    if (!chalet) {
      chalet = await ChaletModel.create(seed);
      console.log(`✔️  Chalet créé : ${seed.title}`);
    } else {
      chalet.set(seed);
      await chalet.save();
      console.log(`ℹ️  Chalet mis à jour : ${seed.title}`);
    }

    let portfolio = await PortfolioItemModel.findOne({ chalet: chalet._id });

    const description = buildPortfolioDescription(chalet);
    const customImages = buildCustomImages(chalet);

    if (!portfolio) {
      portfolio = await PortfolioItemModel.create({
        chalet: chalet._id,
        featured: index === 0,
        displayOrder: index + 1,
        customDescription: description,
        customImages,
        externalBookingUrl: `${chalet.contact.website}#reservation`,
        showOnPortfolio: true,
        seoTitle: `${chalet.title} - Chalet de prestige`,
        seoDescription: description.slice(0, 155),
        tags: [chalet.location.city, 'montagne', 'luxe']
      });
      console.log(`✔️  Élément de portfolio créé pour ${chalet.title}`);
    } else {
      portfolio.set({
        featured: index === 0,
        displayOrder: index + 1,
        customDescription: description,
        customImages,
        externalBookingUrl: `${chalet.contact.website}#reservation`,
        showOnPortfolio: true,
        seoTitle: `${chalet.title} - Chalet de prestige`,
        seoDescription: description.slice(0, 155)
      });
      const tags = new Set([...(portfolio.tags || []), chalet.location.city, 'montagne', 'luxe']);
      portfolio.tags = Array.from(tags);
      await portfolio.save();
      console.log(`ℹ️  Élément de portfolio mis à jour pour ${chalet.title}`);
    }

    results.push({ chalet, portfolio });
  }

  return results;
}

async function createPortfolioContent(createFakeContentFn) {
  const created = await createFakeContentFn({ page: 'portfolio', count: 3 });
  console.log(`✔️  Contenus éditoriaux générés pour la page portfolio (${created.length} entrées).`);
  return created;
}

async function main() {
  loadEnv();

  if (!process.env.MONGODB_URI) {
    throw new Error('La variable d\'environnement MONGODB_URI est requise pour exécuter le script de seed.');
  }

  const mongoose = (await import('mongoose')).default;
  const { default: dbConnect } = await import('./lib/mongodb.js');
  const { createFakeContent } = await import('./lib/seed/fakeContent.js');
  const { default: User } = await import('./models/User.js');
  const { default: Chalet } = await import('./models/Chalet.js');
  const { default: PortfolioItem } = await import('./models/PortfolioItem.js');

  await dbConnect();

  const admin = await ensureAdminUser(User);
  const seededPortfolio = await seedPortfolio({ ChaletModel: Chalet, PortfolioItemModel: PortfolioItem });
  const contentEntries = await createPortfolioContent(createFakeContent);

  console.log('\nRésumé du seed :');
  console.table([
    {
      type: 'Utilisateur',
      details: admin.email,
      action: 'assuré'
    },
    ...seededPortfolio.map(({ chalet }) => ({
      type: 'Chalet',
      details: chalet.title,
      action: 'synchronisé'
    })),
    ...contentEntries.map((entry) => ({
      type: 'Contenu',
      details: `${entry.page} / ${entry.section}`,
      action: 'créé'
    }))
  ]);

  await mongoose.connection.close();
}

main()
  .then(() => {
    console.log('\n✅  Script de seed terminé avec succès.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌  Le script de seed a échoué :', error);
    process.exit(1);
  });
