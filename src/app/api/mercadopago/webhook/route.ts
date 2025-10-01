import { NextRequest, NextResponse } from 'next/server';
import { mercadopago, CARD_PRICES } from '@/lib/mercadopago';
import { prisma } from '@/lib/db';
// import { UserStatus } from '@prisma/client';
import { AccessService } from '@/lib/planLimits';

export async function POST(request: NextRequest) {
  try {
    if (!mercadopago) {
      return NextResponse.json({ error: 'MercadoPago not configured' }, { status: 500 });
    }

    const body = await request.json();
    console.log('MercadoPago webhook received:', body);

    // MercadoPago sends payment notifications
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Get payment details from MercadoPago
      const payment = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        }
      });

      if (!payment.ok) {
        console.error('Failed to fetch payment from MercadoPago');
        return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 400 });
      }

      const paymentData = await payment.json();
      
      // Only process approved payments
      if (paymentData.status === 'approved') {
        const externalReference = paymentData.external_reference;
        
        // Parse external reference: "user-{userId}-subscription-{type}-{timestamp}"
        const match = externalReference?.match(/^user-(.+)-subscription-(.+)-(\d+)$/);
        if (!match) {
          console.error('Invalid external reference format:', externalReference);
          return NextResponse.json({ error: 'Invalid external reference' }, { status: 400 });
        }

        const [, userId, subscriptionType, timestamp] = match;
        
        // Validate subscription type
        if (!['first-year', 'renewal'].includes(subscriptionType)) {
          console.error('Invalid subscription type:', subscriptionType);
          return NextResponse.json({ error: 'Invalid subscription type' }, { status: 400 });
        }

        // Update user's subscription in database
        try {
          const isFirstYear = subscriptionType === 'first-year';
          const price = isFirstYear ? CARD_PRICES.FIRST_YEAR : CARD_PRICES.RENEWAL;
          const subscriptionEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 año
          
          // Activar suscripción del usuario
          await AccessService.activateSubscription(userId, subscriptionEndDate, isFirstYear);

          // Create/update subscription record
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              stripeSubscriptionId: paymentId,
              stripePriceId: `mp-${subscriptionType}`,
              status: 'active',
              currentPeriodStart: new Date(),
              currentPeriodEnd: subscriptionEndDate,
              isFirstYear,
              price,
              originalPrice: CARD_PRICES.FIRST_YEAR,
            },
            create: {
              userId,
              stripeSubscriptionId: paymentId,
              stripePriceId: `mp-${subscriptionType}`,
              status: 'active',
              currentPeriodStart: new Date(),
              currentPeriodEnd: subscriptionEndDate,
              isFirstYear,
              price,
              originalPrice: CARD_PRICES.FIRST_YEAR,
            }
          });

          console.log(`Activated subscription for user ${userId}, type: ${subscriptionType}, price: ${price}`);
        } catch (dbError) {
          console.error('Database error:', dbError);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('MercadoPago webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}