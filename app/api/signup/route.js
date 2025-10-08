import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import SignupApplication from '../../../models/SignupApplication';
import User from '../../../models/User';
import { verifyToken } from '../../../lib/auth';

export const runtime = 'nodejs';

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const validateOwnerPayload = (data) => {
  if (!data) return 'Les informations du propriétaire sont manquantes.';

  if (!isNonEmptyString(data.title) || !isNonEmptyString(data.shortDescription) || !isNonEmptyString(data.longDescription)) {
    return 'Veuillez renseigner les informations principales du chalet.';
  }

  const propertyAddress = data.propertyAddress || {};
  if (
    !isNonEmptyString(propertyAddress.streetNumber) ||
    !isNonEmptyString(propertyAddress.streetName) ||
    !isNonEmptyString(propertyAddress.city) ||
    !isNonEmptyString(propertyAddress.country)
  ) {
    return "Veuillez compléter l'adresse du chalet.";
  }

  const owner = data.owner || {};
  if (
    !isNonEmptyString(owner.firstName) ||
    !isNonEmptyString(owner.lastName) ||
    !isNonEmptyString(owner.email) ||
    !isNonEmptyString(owner.birthDate) ||
    !isNonEmptyString(owner.password)
  ) {
    return 'Veuillez compléter les informations personnelles du propriétaire.';
  }

  const mainAddress = data.mainAddress || {};
  if (
    !isNonEmptyString(mainAddress.streetNumber) ||
    !isNonEmptyString(mainAddress.streetName) ||
    !isNonEmptyString(mainAddress.city) ||
    !isNonEmptyString(mainAddress.country)
  ) {
    return "Veuillez compléter l'adresse principale du propriétaire.";
  }

  return null;
};

const validateTenantPayload = (data) => {
  if (!data) return 'Les informations du locataire sont manquantes.';

  if (!isNonEmptyString(data.firstName) || !isNonEmptyString(data.lastName) || !isNonEmptyString(data.email)) {
    return 'Veuillez renseigner vos informations de contact.';
  }

  if (!isNonEmptyString(data.preferredRegion)) {
    return 'Veuillez préciser la destination recherchée.';
  }

  return null;
};

const normalizeType = (type) => {
  const normalized = (type || '').toString().trim().toLowerCase();

  switch (normalized) {
    case 'owner':
      return 'owner';
    case 'tenant':
    case 'seeker':
      return 'tenant';
    default:
      return '';
  }
};

const sanitizeUsername = (value) => {
  const base = (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .slice(0, 30);

  return base.length >= 3 ? base : 'owner';
};

const generateUniqueUsername = async (preferredUsername) => {
  const sanitizedBase = sanitizeUsername(preferredUsername);
  let candidate = sanitizedBase;
  let suffix = 0;

  // Ensure we do not exceed the maxlength defined in the schema (30 chars)
  const maxLength = 30;

  while (await User.exists({ username: candidate })) {
    suffix += 1;
    const suffixString = suffix.toString();
    const baseLength = Math.max(0, maxLength - suffixString.length);
    const base = sanitizedBase.slice(0, baseLength) || 'owner';
    candidate = `${base}${suffixString}`;
  }

  return candidate;
};

async function ensureOwnerUser(ownerDetails, slug) {
  const email = ownerDetails?.email?.toLowerCase?.();
  const password = ownerDetails?.password;

  if (!email || !password) {
    return null;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const normalizedRole = (existingUser.role || '').toString().trim().toLowerCase();
    const shouldUpdateRole = !['admin', 'super-admin', 'owner'].includes(normalizedRole);
    const isOwnerRole = normalizedRole === 'owner';

    if (shouldUpdateRole || (isOwnerRole && !existingUser.isOwner)) {
      existingUser.role = 'owner';
      existingUser.isOwner = true;
      await existingUser.save();
    }
    return existingUser;
  }

  const preferredUsername = slug || ownerDetails.email?.split?.('@')?.[0] || ownerDetails.lastName || 'owner';
  const username = await generateUniqueUsername(preferredUsername);

  const user = new User({
    username,
    email,
    password,
    role: 'owner',
    isOwner: true
  });

  await user.save();
  return user;
}

export async function POST(request) {
  try {
    const { type, data } = await request.json();
    const normalizedType = normalizeType(type);

    if (!normalizedType) {
      return NextResponse.json(
        {
          success: false,
          message: "Le type de candidature est invalide."
        },
        { status: 400 }
      );
    }

    const validationError =
      normalizedType === 'owner' ? validateOwnerPayload(data) : validateTenantPayload(data);
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          message: validationError
        },
        { status: 400 }
      );
    }

    await dbConnect();

    let ownerPayload;
    if (normalizedType === 'owner') {
      const ownerPassword = data.owner.password;
      const hashedPassword = await bcrypt.hash(ownerPassword, 12);

      ownerPayload = {
        ...data,
        owner: {
          ...data.owner,
          password: hashedPassword
        }
      };

      await ensureOwnerUser(
        {
          ...data.owner,
          password: ownerPassword
        },
        data.slug
      );
    }

    const application = await SignupApplication.create({
      type: normalizedType,
      ownerData: ownerPayload,
      tenantData: normalizedType === 'tenant' ? data : undefined
    });

    return NextResponse.json({
      success: true,
      message: 'Candidature enregistrée avec succès.',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur interne est survenue. Veuillez réessayer plus tard."
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access token is required'
        },
        { status: 401 }
      );
    }

    let user;
    try {
      user = await verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token'
        },
        { status: 401 }
      );
    }

    if (user?.role !== 'super-admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Insufficient permissions'
        },
        { status: 403 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const query = {};
    if (type) {
      query.type = type;
    }
    if (status) {
      query.status = status;
    }

    const applications = await SignupApplication.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const sanitized = applications.map((application) => {
      if (application.type !== 'owner') {
        return application;
      }

      const ownerData = application.ownerData || {};
      const owner = ownerData.owner || {};
      const { password, ...ownerWithoutPassword } = owner;

      return {
        ...application,
        ownerData: {
          ...ownerData,
          owner: ownerWithoutPassword
        }
      };
    });

    return NextResponse.json({
      success: true,
      data: sanitized
    });
  } catch (error) {
    console.error('Error fetching signup applications:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch signup applications'
      },
      { status: 500 }
    );
  }
}
