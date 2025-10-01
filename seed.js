// lib/seed/fakeContent.js

import Content from './models/Content.js';
import User from './models/User.js';

const ALLOWED_PAGES = ['home', 'services', 'portfolio', 'portage-salarial', 'seminaires-evenements', 'contact'];

const DEFAULT_SECTIONS = {
  'home': ['hero', 'mission', 'services', 'cta'],
  'services': ['introduction', 'gestion-locative', 'portage-salarial', 'conciergerie'],
  'portfolio': ['presentation', 'mise-en-avant', 'accompagnement'],
  'portage-salarial': ['fonctionnement', 'avantages', 'temoignages'],
  'seminaires-evenements': ['seminaires', 'yoga', 'accompagnement'],
  'contact': ['presentation', 'processus', 'faq']
};

const SAMPLE_PARAGRAPHS = [
  "Notre équipe accompagne chaque professionnel avec une méthodologie éprouvée qui allie rigueur administrative et accompagnement humain.",
  "Nous construisons des parcours sur-mesure pour valoriser vos services et sécuriser chaque étape de votre développement.",
  "Grâce à une expertise terrain, nous transformons vos besoins en actions concrètes et mesurables pour vos clients et partenaires.",
  "La transparence de nos processus garantit un suivi clair des performances et une amélioration continue de vos offres.",
  "Nous mobilisons un réseau de spécialistes afin de fournir des solutions complètes et fiables, même pour les projets les plus ambitieux."
];

const SAMPLE_BULLETS = [
  "Accompagnement personnalisé du diagnostic à l'action",
  "Outils digitaux pour suivre vos indicateurs clés",
  "Suivi juridique et fiscal sur toute la durée du contrat",
  "Équipe dédiée pour coordonner vos interlocuteurs",
  "Rapports détaillés pour piloter votre stratégie"
];

const READY_STATE_MAP = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

function normalizePage(page) {
  if (!page || typeof page !== 'string') return '';
  return page.trim().toLowerCase();
}

function capitalizeWords(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildCanonicalUrl(page, section) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  if (page === 'home') {
    return baseUrl;
  }
  return `${baseUrl}/${page}#${section}`;
}

function buildMarkdown(sectionName, index) {
  const paragraph = SAMPLE_PARAGRAPHS[index % SAMPLE_PARAGRAPHS.length];
  const bulletOne = SAMPLE_BULLETS[index % SAMPLE_BULLETS.length];
  const bulletTwo = SAMPLE_BULLETS[(index + 2) % SAMPLE_BULLETS.length];

  return `${paragraph}\n\n- ${bulletOne}\n- ${bulletTwo}`;
}

const SEED_USERS = [
  {
    username: 'admin',
    email: 'admin@admin.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'superadmin',
    email: 'superadmin@admin.com',
    password: 'superadmin123',
    role: 'super-admin'
  }
];

async function upsertSeedUser({ username, email, password, role }) {
  let user = await User.findOne({ email }).select('+password');

  if (!user) {
    return User.create({
      username,
      email,
      password,
      role
    });
  }

  let shouldPersist = false;

  if (user.username !== username) {
    user.username = username;
    shouldPersist = true;
  }

  if (user.role !== role) {
    user.role = role;
    shouldPersist = true;
  }

  const hasValidPassword = await user.comparePassword(password);

  if (!hasValidPassword) {
    user.password = password;
    shouldPersist = true;
  }

  if (!user.isActive) {
    user.isActive = true;
    shouldPersist = true;
  }

  if (shouldPersist) {
    await user.save();
  }

  return user;
}

async function ensureSeedUsers() {
  const seededUsers = {};

  for (const userDefinition of SEED_USERS) {
    const user = await upsertSeedUser(userDefinition);

    if (userDefinition.role === 'admin') {
      seededUsers.admin = user;
    }

    if (userDefinition.role === 'super-admin') {
      seededUsers.superAdmin = user;
    }
  }

  return seededUsers;
}

async function getUniqueSection(page, baseSection) {
  let attempt = 0;
  let candidate = baseSection;

  // Prevent infinite loops by bounding the number of attempts
  while (attempt < 25) {
    const exists = await Content.exists({ page, section: candidate });
    if (!exists) {
      return candidate;
    }

    attempt += 1;
    candidate = `${baseSection}-${attempt + 1}`;
  }

  throw new Error(`Unable to determine unique section name for ${baseSection}`);
}

export async function createFakeContent({ page, count = 3, sections }) {
  const normalizedPage = normalizePage(page);

  if (!ALLOWED_PAGES.includes(normalizedPage)) {
    throw new Error(`Page \"${page}\" is not supported. Allowed pages: ${ALLOWED_PAGES.join(', ')}`);
  }

  const safeCount = Number.isInteger(count) ? Math.min(Math.max(count, 1), 12) : 3;
  const sectionPool = Array.isArray(sections) && sections.length
    ? sections.map(section => normalizePage(section)).filter(Boolean)
    : DEFAULT_SECTIONS[normalizedPage] || [`section-${normalizedPage}`];

  if (!sectionPool.length) {
    throw new Error('At least one section name is required to generate fake content.');
  }

  const { admin: adminUser, superAdmin } = await ensureSeedUsers();
  const author = adminUser || superAdmin;

  if (!author) {
    throw new Error('Unable to determine an author user for seeded content.');
  }
  const createdItems = [];
  const baseDisplayOrder = await Content.countDocuments({ page: normalizedPage });

  for (let index = 0; index < safeCount; index += 1) {
    const baseSection = sectionPool[index % sectionPool.length];
    const section = await getUniqueSection(normalizedPage, baseSection);
    const now = new Date();
    const displayOrder = baseDisplayOrder + index + 1;
    const contentBody = buildMarkdown(baseSection, index);
    const humanReadableSection = capitalizeWords(baseSection);

    const doc = await Content.create({
      page: normalizedPage,
      section,
      title: `Bloc ${humanReadableSection}`,
      content: contentBody,
      contentType: 'markdown',
      metadata: {
        subtitle: `Section de démonstration ${humanReadableSection}`,
        description: `Contenu fictif généré pour illustrer la section ${humanReadableSection} de la page ${capitalizeWords(normalizedPage)}.`,
        keywords: [normalizedPage, baseSection, 'démonstration', 'contenu'],
        author: author.username,
        publishDate: now,
        lastModified: now
      },
      settings: {
        isPublished: true,
        showTitle: true,
        allowComments: false,
        featured: displayOrder === 1,
        displayOrder
      },
      seo: {
        metaTitle: `${capitalizeWords(normalizedPage)} - ${humanReadableSection}`,
        metaDescription: `Découvrez ${humanReadableSection} sur notre page ${capitalizeWords(normalizedPage)}.`,
        canonicalUrl: buildCanonicalUrl(normalizedPage, section)
      },
      createdBy: author._id,
      lastModifiedBy: author._id
    });

    createdItems.push({
      id: doc._id.toString(),
      page: doc.page,
      section: doc.section,
      title: doc.title,
      metadata: doc.metadata,
      settings: doc.settings,
      seo: doc.seo,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  return createdItems;
}

export function describeConnection(connection) {
  return {
    host: connection?.host || null,
    name: connection?.name || null,
    readyState: connection?.readyState ?? null,
    status: READY_STATE_MAP[connection?.readyState] || 'unknown'
  };
}
