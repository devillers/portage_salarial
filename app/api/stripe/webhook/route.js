import { NextResponse } from 'next/server';
import { constructWebhookEvent, handleSuccessfulPayment, handleFailedPayment } from '../../../../lib/stripe';
import dbConnect from '../../../../lib/mongodb';
import Booking from '../../../../models/Booking';
import Chalet from '../../../../models/Chalet';

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { success: false, message: 'No signature' },
        { status: 400 }
      );
    }

    const event = constructWebhookEvent(rawBody, signature);

    await dbConnect();

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handleSuccessfulPayment(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handleFailedPayment(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

async function handleCheckoutSessionCompleted(session) {
  try {
    const { metadata } = session;
    const { chaletId, checkIn, checkOut, guests, guestInfo } = metadata;

    // Parse JSON metadata
    const guestData = JSON.parse(guests);
    const guestInfoData = JSON.parse(guestInfo);

    // Get chalet details
    const chalet = await Chalet.findById(chaletId);
    if (!chalet) {
      throw new Error('Chalet not found');
    }

    // Calculate pricing details
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    const baseAmount = nights * chalet.pricing.basePrice;
    const cleaningFee = chalet.pricing.cleaningFee || 0;
    const taxes = (baseAmount + cleaningFee) * (chalet.pricing.taxRate / 100);
    const totalAmount = baseAmount + cleaningFee + taxes;

    // Create booking record
    const booking = new Booking({
      chalet: chaletId,
      guest: guestInfoData,
      dates: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights
      },
      guests: guestData,
      pricing: {
        baseAmount,
        cleaningFee,
        taxes,
        totalAmount,
        currency: chalet.pricing.currency
      },
      payment: {
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        status: 'completed',
        paidAt: new Date()
      },
      status: 'confirmed'
    });

    await booking.save();

    console.log('Booking created successfully:', booking._id);

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    throw error;
  }
}