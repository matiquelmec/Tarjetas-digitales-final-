import { NextRequest, NextResponse } from 'next/server';
import { mercadopago, SUBSCRIPTION_DETAILS, CARD_PRICES } from '@/lib/mercadopago';
import { Preference } from 'mercadopago';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { AccessService } from '@/lib/planLimits';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsSafe);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mercadopago) {
      return NextResponse.json({ error: 'MercadoPago not configured' }, { status: 500 });
    }

    const { subscriptionType, successUrl, cancelUrl } = await request.json();
    
    // Determinar si es primer año o renovación
    let isFirstYear = true;
    let price = CARD_PRICES.FIRST_YEAR;
    let subscriptionDetails = SUBSCRIPTION_DETAILS.FIRST_YEAR;
    
    // Verificar si el usuario ya tiene historial de suscripciones
    const userAccess = await AccessService.getUserAccess(session.user.id);
    if (userAccess && userAccess.status === 'EXPIRED') {
      // Usuario con suscripción expirada = renovación
      isFirstYear = false;
      price = CARD_PRICES.RENEWAL;
      subscriptionDetails = SUBSCRIPTION_DETAILS.RENEWAL;
    }
    
    // Si se especifica explícitamente el tipo
    if (subscriptionType === 'RENEWAL') {
      isFirstYear = false;
      price = CARD_PRICES.RENEWAL;
      subscriptionDetails = SUBSCRIPTION_DETAILS.RENEWAL;
    }

    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: `subscription-${isFirstYear ? 'first-year' : 'renewal'}`,
            title: subscriptionDetails.name,
            description: subscriptionDetails.description,
            quantity: 1,
            unit_price: price,
            currency_id: 'CLP',
          }
        ],
        back_urls: {
          success: successUrl || `${request.nextUrl.origin}/dashboard?success=true&type=${isFirstYear ? 'first-year' : 'renewal'}`,
          failure: cancelUrl || `${request.nextUrl.origin}/pricing?canceled=true`,
          pending: `${request.nextUrl.origin}/dashboard?pending=true&type=${isFirstYear ? 'first-year' : 'renewal'}`,
        },
        auto_return: 'approved',
        external_reference: `user-${session.user.id}-subscription-${isFirstYear ? 'first-year' : 'renewal'}-${Date.now()}`,
        notification_url: `${request.nextUrl.origin}/api/mercadopago/webhook`,
        payer: {
          email: session.user.email || '',
          name: session.user.name || '',
        },
      },
    });

    return NextResponse.json({ url: preference.init_point });
  } catch (error) {
    console.error('Error creating MercadoPago checkout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}