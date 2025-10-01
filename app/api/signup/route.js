import { NextResponse } from 'next/server';
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
  if (!isNonEmptyString(owner.firstName) || !isNonEmptyString(owner.lastName) || !isNonEmptyString(owner.email) || !isNonEmptyString(owner.birthDate)) {
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

const validateSeekerPayload = (data) => {
  if (!data) return 'Les informations du locataire sont manquantes.';

  if (!isNonEmptyString(data.firstName) || !isNonEmptyString(data.lastName) || !isNonEmptyString(data.email)) {
    return 'Veuillez renseigner vos informations de contact.';
  }

  if (!isNonEmptyString(data.preferredRegion)) {
    return 'Veuillez préciser la destination recherchée.';
  }

  return null;
};

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    if (!['owner', 'seeker'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Le type de candidature est invalide."
        },
        { status: 400 }
      );
    }

    const validationError = type === 'owner' ? validateOwnerPayload(data) : validateSeekerPayload(data);
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

    const application = await SignupApplication.create({
      type,
      ownerData: type === 'owner' ? data : undefined,
      seekerData: type === 'seeker' ? data : undefined
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
