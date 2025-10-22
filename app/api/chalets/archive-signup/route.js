import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import SignupApplication from '../../../../models/SignupApplication';
import { verifyToken } from '../../../../lib/auth';

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

    const body = await request.json();
    const applicationId = body?.applicationId;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: "L'identifiant de la candidature est requis." },
        { status: 400 }
      );
    }

    await dbConnect();

    const application = await SignupApplication.findById(applicationId);

    if (!application || application.type !== 'owner') {
      return NextResponse.json(
        { success: false, message: 'Candidature introuvable ou de type invalide.' },
        { status: 404 }
      );
    }

    if (application.status === 'reviewed') {
      return NextResponse.json({
        success: true,
        message: 'Cette candidature a déjà été archivée.'
      });
    }

    application.status = 'reviewed';
    await application.save();

    return NextResponse.json({
      success: true,
      message: 'La candidature a été archivée avec succès.'
    });
  } catch (error) {
    console.error('Failed to archive signup chalet:', error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la suppression de la candidature."
      },
      { status: 500 }
    );
  }
}
