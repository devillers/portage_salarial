import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import SignupApplication from '../../../models/SignupApplication';

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

    const ownerPayload =
      normalizedType === 'owner'
        ? {
            ...data,
            owner: {
              ...data.owner,
              password: await bcrypt.hash(data.owner.password, 12)
            }
          }
        : undefined;

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
