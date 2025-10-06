import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Chalet from '../../../../models/Chalet';
import SignupApplication from '../../../../models/SignupApplication';
import { verifyToken } from '../../../../lib/auth';

const DEFAULT_COORDINATES = {
  latitude: 45.923,
  longitude: 6.869
};

function sanitizeSlug(value) {
  return (value || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function generateUniqueSlug(baseTitle) {
  const base = sanitizeSlug(baseTitle) || 'chalet';
  let slug = base;
  let suffix = 1;

  while (await Chalet.exists({ slug })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function mapMediaEntry(entry, fallbackAlt, fallbackCaption) {
  if (!entry) {
    return null;
  }

  const url = entry.secureUrl || entry.url;
  if (!url) {
    return null;
  }

  const alt = entry.alt || entry.originalFilename || fallbackAlt;

  return {
    url,
    alt: alt || fallbackAlt,
    caption: entry.caption || fallbackCaption || ''
  };
}

function parseNumericValue(value, fallback = 0) {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/\s/g, '').replace(',', '.');
    const match = normalized.match(/\d+(\.\d+)?/);
    if (match) {
      return Number(match[0]);
    }
  }

  return fallback;
}

function buildAmenities(ownerAmenities = {}) {
  const amenities = [];

  if (ownerAmenities.jacuzzi) {
    amenities.push({ name: 'Jacuzzi' });
  }
  if (ownerAmenities.sauna) {
    amenities.push({ name: 'Sauna' });
  }
  if (ownerAmenities.piscine) {
    amenities.push({ name: 'Piscine' });
  }

  const otherAmenities = Array.isArray(ownerAmenities.other)
    ? ownerAmenities.other
    : [];

  otherAmenities.forEach((label) => {
    if (label) {
      amenities.push({ name: label });
    }
  });

  return amenities;
}

function dedupeByUrl(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.url) {
      return false;
    }
    if (seen.has(item.url)) {
      return false;
    }
    seen.add(item.url);
    return true;
  });
}

async function buildChaletPayload(application) {
  const ownerData = application.ownerData || {};
  const title = ownerData.title?.trim() || 'Chalet sans titre';
  const shortDescription = ownerData.shortDescription?.trim()
    || ownerData.longDescription?.slice(0, 180)?.trim()
    || 'Découvrez ce nouveau chalet bientôt disponible.';
  const description = ownerData.longDescription?.trim() || shortDescription;

  const heroPhotoSource = Array.isArray(ownerData.heroPhoto)
    ? ownerData.heroPhoto.find((file) => file?.secureUrl || file?.url)
    : null;

  if (!heroPhotoSource) {
    throw new Error(
      "Impossible de publier le chalet : aucune photo principale n'est disponible."
    );
  }

  const heroImage = mapMediaEntry(
    heroPhotoSource,
    `${title} - image principale`,
    heroPhotoSource.caption
  );

  const gallerySources = Array.isArray(ownerData.gallery)
    ? ownerData.gallery
    : [];

  const roomGallerySources = Array.isArray(ownerData.rooms)
    ? ownerData.rooms.flatMap((room, roomIndex) =>
        (Array.isArray(room?.photos) ? room.photos : []).map((photo, photoIndex) =>
          mapMediaEntry(
            photo,
            `${room?.name || `Pièce ${roomIndex + 1}`} - photo ${photoIndex + 1}`,
            photo.caption
          )
        )
      )
    : [];

  const portfolioGallerySources = Array.isArray(ownerData.portfolioGallery)
    ? ownerData.portfolioGallery
    : [];

  const galleryImages = [
    ...gallerySources.map((photo, index) =>
      mapMediaEntry(photo, `${title} - galerie ${index + 1}`, photo.caption)
    ),
    ...roomGallerySources,
    ...portfolioGallerySources.map((photo, index) =>
      mapMediaEntry(photo, `${title} - portfolio ${index + 1}`, photo.caption)
    )
  ].filter(Boolean);

  const capacity = Math.max(1, parseInt(parseNumericValue(ownerData.capacity, 1), 10));
  const basePrice = parseNumericValue(
    ownerData.seasonPrice ?? ownerData.monthlyPrice,
    0
  );

  const bedrooms = Math.max(
    1,
    Array.isArray(ownerData.rooms) ? ownerData.rooms.length : 1
  );
  const bathrooms = Math.max(1, parseNumericValue(ownerData.bathrooms, 1));
  const area = Math.max(10, parseNumericValue(ownerData.area, 80));

  const propertyAddress = ownerData.propertyAddress || {};
  const addressParts = [
    propertyAddress.streetNumber,
    propertyAddress.streetName,
    propertyAddress.line2
  ]
    .map((part) => part?.trim())
    .filter(Boolean);

  const address = addressParts.join(' ') || 'Adresse à confirmer';
  const city = propertyAddress.city?.trim() || 'Ville à confirmer';
  const country = propertyAddress.country?.trim() || 'Pays à confirmer';
  const postalCode = propertyAddress.postalCode?.trim() || '';

  const coordinates = {
    latitude: parseNumericValue(propertyAddress.latitude, DEFAULT_COORDINATES.latitude),
    longitude: parseNumericValue(propertyAddress.longitude, DEFAULT_COORDINATES.longitude)
  };

  const contact = ownerData.owner || {};

  return {
    title,
    slug: await generateUniqueSlug(ownerData.slug || title),
    shortDescription,
    description,
    images: {
      hero: heroImage,
      gallery: dedupeByUrl(galleryImages)
    },
    amenities: buildAmenities(ownerData.amenities),
    specifications: {
      bedrooms,
      bathrooms,
      maxGuests: capacity,
      area,
      floors: Math.max(1, parseNumericValue(ownerData.floors, 1))
    },
    location: {
      address,
      city,
      country,
      postalCode,
      coordinates
    },
    pricing: {
      basePrice,
      currency: 'EUR',
      cleaningFee: parseNumericValue(ownerData.cleaningFee, 0),
      securityDeposit: parseNumericValue(ownerData.securityDeposit, 0),
      taxRate: parseNumericValue(ownerData.taxRate, 0)
    },
    availability: {
      isActive: true,
      minimumStay: Math.max(1, parseNumericValue(ownerData.minimumStay, 1)),
      maximumStay: Math.max(1, parseNumericValue(ownerData.maximumStay, 365)),
      checkInTime: ownerData.checkInTime || '15:00',
      checkOutTime: ownerData.checkOutTime || '11:00',
      blockedDates: []
    },
    contact: {
      phone: contact.phone || '',
      email: contact.email || '',
      website: contact.website || ''
    },
    seo: {
      metaTitle: `${title} | Chalet Manager`,
      metaDescription: shortDescription,
      keywords: [title, city, 'chalet', 'location']
        .filter(Boolean)
        .map((value) => value.toString().trim())
    }
  };
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Access token is required' },
        { status: 401 }
      );
    }

    let user;
    try {
      user = await verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (user?.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const applicationId = body?.applicationId;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: "L'identifiant de la candidature est requis." },
        { status: 400 }
      );
    }

    const application = await SignupApplication.findById(applicationId);

    if (!application || application.type !== 'owner') {
      return NextResponse.json(
        { success: false, message: 'Candidature introuvable ou de type invalide.' },
        { status: 404 }
      );
    }

    if (application.status === 'reviewed') {
      return NextResponse.json(
        { success: false, message: 'Cette candidature a déjà été validée.' },
        { status: 409 }
      );
    }

    const payload = await buildChaletPayload(application);
    const chalet = await Chalet.create(payload);

    application.status = 'reviewed';
    await application.save();

    return NextResponse.json({
      success: true,
      message: 'Le chalet a été validé et publié avec succès.',
      data: chalet.toObject({ virtuals: true })
    });
  } catch (error) {
    console.error('Failed to publish signup chalet:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Une erreur est survenue lors de la publication du chalet."
      },
      { status: 500 }
    );
  }
}
