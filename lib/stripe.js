import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

/**
 * Create a Stripe checkout session for chalet booking
 */
export async function createCheckoutSession({
  chaletId,
  chaletTitle,
  amount,
  currency = 'eur',
  customerEmail,
  successUrl,
  cancelUrl,
  metadata = {}
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Booking: ${chaletTitle}`,
              description: `Chalet reservation`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        chaletId,
        ...metadata
      },
      payment_intent_data: {
        metadata: {
          chaletId,
          ...metadata
        }
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    return session;
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw new Error('Failed to create payment session');
  }
}

/**
 * Retrieve a Stripe checkout session
 */
export async function getCheckoutSession(sessionId) {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw new Error('Failed to retrieve payment session');
  }
}

/**
 * Create a payment intent for custom checkout
 */
export async function createPaymentIntent({
  amount,
  currency = 'eur',
  customerEmail,
  metadata = {}
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      receipt_email: customerEmail,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
}

/**
 * Construct webhook event from raw body and signature
 */
export function constructWebhookEvent(rawBody, signature) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret not configured');
  }

  try {
    return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Process successful payment
 */
export async function handleSuccessfulPayment(paymentIntent) {
  // This function would typically update the booking status
  // and send confirmation emails
  console.log('Payment succeeded:', paymentIntent.id);
  
  return {
    success: true,
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency
  };
}

/**
 * Process failed payment
 */
export async function handleFailedPayment(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  
  return {
    success: false,
    paymentIntentId: paymentIntent.id,
    error: paymentIntent.last_payment_error?.message
  };
}

export default stripe;