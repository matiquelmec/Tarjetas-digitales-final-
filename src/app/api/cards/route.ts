import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { CardService } from '@/lib/cardService';
import { AccessService, PlanLimitService } from '@/lib/planLimits';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('GET /api/cards - Starting request');
    const session = await getServerSession(authOptionsSafe);
    
    console.log('GET Session data:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    if (!session?.user?.email) {
      console.log('GET Authorization failed - no session or user email');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      console.log('GET User not found for email:', session.user.email);
      return NextResponse.json([]);
    }

    const cards = await CardService.getUserCards(user.id);
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/cards - Starting request');
    
    // Use the updated authOptionsSafe with JWT strategy
    const session = await getServerSession(authOptionsSafe);
    
    console.log('Session data:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    if (!session?.user?.email) {
      console.log('Authorization failed - no session or user email');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cardData = await request.json();

    // Asegurar que el usuario existe en la base de datos
    let user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      console.log('User not found, creating with trial for email:', session.user.email);
      // Crear usuario con trial automático
      const now = new Date();
      const trialEndDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      user = await prisma.user.create({
        data: {
          email: session.user.email!,
          name: session.user.name || '',
          image: session.user.image || '',
          status: 'TRIAL',
          trialStartDate: now,
          trialEndDate: trialEndDate,
          isFirstYear: true,
        },
      });
      console.log('User created successfully with trial:', user.id);
    }

    // Verificar acceso del usuario
    const now = new Date();
    const hasValidTrial = user.status === 'TRIAL' && user.trialEndDate && now <= user.trialEndDate;
    const hasValidSubscription = user.status === 'ACTIVE' && user.subscriptionEndDate && now <= user.subscriptionEndDate;
    
    // Si el trial ha expirado, dar un nuevo trial de 7 días (temporal para desarrollo)
    if (!hasValidTrial && !hasValidSubscription && user.status === 'TRIAL') {
      console.log('Extending trial for user:', user.email);
      const newTrialEndDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          trialEndDate: newTrialEndDate,
          trialStartDate: now
        }
      });
      console.log('Trial extended until:', newTrialEndDate);
    } else if (!hasValidTrial && !hasValidSubscription) {
      return NextResponse.json({ 
        error: 'Access required',
        message: 'Tu suscripción ha expirado. Renueva para continuar creando tarjetas.'
      }, { status: 403 });
    }
    
    // Con el nuevo sistema, todos los usuarios con acceso tienen todas las funciones
    // No necesitamos validar funciones individuales ya que el trial incluye todo

    // Crear la tarjeta con acceso completo a todas las funciones
    const card = await CardService.createCard(user.id, cardData);
    
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}