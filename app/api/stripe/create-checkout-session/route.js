import { NextResponse } from 'next/server';
import { createCheckoutSession } from '../../../../lib/stripe';
import dbConnect from '../../../../lib/mongodb';
import Chalet from '../../../../models/Chalet';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { chaletId, amount, currency, customerEmail, bookingData } = body;

    // Validate chalet exists
    const chalet = await Chalet.findById(chaletId);
    if (!chalet) {
      return NextResponse.json(
        {
          success: false,
          message: 'Chalet not found'
        },
        { status: 404 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Create Stripe checkout session
    const session = await createCheckoutSession({
      chaletId,
      chaletTitle: chalet.title,
      amount,
      currency,
      customerEmail,
      successUrl: `${siteUrl}/chalet/${chalet.slug}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/chalet/${chalet.slug}/booking`,
      metadata: {
        chaletId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: JSON.stringify(bookingData.guests),
        guestInfo: JSON.stringify(bookingData.guest)
      }
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create checkout session'
      },
      { status: 500 }
    );
  }
}