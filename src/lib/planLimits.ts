// import { UserStatus } from '@prisma/client'; // Using string literals
import { prisma } from './db';

export interface UserAccess {
  hasAccess: boolean;
  isTrialUser: boolean;
  daysRemaining?: number;
  subscriptionEndDate?: Date;
  status: string; // Using string instead of UserStatus enum
}

export class AccessService {
  static getUserAccess(user: any): UserAccess {
    const now = new Date();
    
    // Si está en trial
    if (user.status === 'TRIAL' && user.trialEndDate && now <= user.trialEndDate) {
      const daysRemaining = Math.ceil((user.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        hasAccess: true,
        isTrialUser: true,
        daysRemaining,
        status: user.status
      };
    }
    
    // Si tiene suscripción activa
    if (user.status === 'ACTIVE' && user.subscriptionEndDate && now <= user.subscriptionEndDate) {
      return {
        hasAccess: true,
        isTrialUser: false,
        subscriptionEndDate: user.subscriptionEndDate,
        status: user.status
      };
    }
    
    // Sin acceso
    return {
      hasAccess: false,
      isTrialUser: false,
      status: user.status || 'EXPIRED'
    };
  }

  static async canCreateCard(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    console.log('AccessService.canCreateCard - Starting with userId:', userId);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { _count: { select: { cards: true } } }
    });

    console.log('AccessService.canCreateCard - User lookup result:', {
      found: !!user,
      userId: userId,
      userStatus: user?.status,
      cardCount: user?._count?.cards
    });

    if (!user) {
      console.error('AccessService.canCreateCard - User not found:', userId);
      
      // Intentar buscar por email si userId podría ser un email
      if (userId.includes('@')) {
        console.log('AccessService - Attempting to find user by email:', userId);
        const userByEmail = await prisma.user.findUnique({
          where: { email: userId },
          include: { _count: { select: { cards: true } } }
        });
        
        if (userByEmail) {
          console.log('AccessService - Found user by email:', userByEmail.id);
          const access = this.getUserAccess(userByEmail);
          
          if (!access.hasAccess) {
            return { 
              allowed: false, 
              reason: access.isTrialUser 
                ? 'Tu período de prueba ha expirado. Suscríbete para continuar creando tarjetas.'
                : 'Tu suscripción ha expirado. Renueva para continuar creando tarjetas.'
            };
          }

          return { allowed: true };
        } else {
          // Si no encontramos por email, crear usuario con trial automático
          console.log('AccessService - User not found by email, creating with trial:', userId);
          try {
            const newUser = await this.createUserWithTrial(userId);
            console.log('AccessService - User created successfully with trial:', newUser.id);
            return { allowed: true };
          } catch (createError) {
            console.error('AccessService - Failed to create user:', createError);
            return { allowed: false, reason: 'Unable to create user account. Please try logging out and logging back in.' };
          }
        }
      }
      
      return { allowed: false, reason: 'User not found in database. Please try logging out and logging back in.' };
    }

    const access = this.getUserAccess(user);
    
    if (!access.hasAccess) {
      return { 
        allowed: false, 
        reason: access.isTrialUser 
          ? 'Tu período de prueba ha expirado. Suscríbete para continuar creando tarjetas.'
          : 'Tu suscripción ha expirada. Renueva para continuar creando tarjetas.'
      };
    }

    return { allowed: true };
  }

  static async getUserAccess(userId: string): Promise<UserAccess | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        status: true,
        trialStartDate: true,
        trialEndDate: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true
      }
    });

    if (!user) return null;

    return this.getUserAccess(user);
  }

  static async createUserWithTrial(email: string) {
    const now = new Date();
    const trialEndDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 días

    return await prisma.user.create({
      data: {
        email: email,
        name: '',
        image: '',
        status: 'TRIAL',
        trialStartDate: now,
        trialEndDate: trialEndDate,
        isFirstYear: true,
      },
      include: { _count: { select: { cards: true } } }
    });
  }

  static async startTrial(userId: string) {
    const now = new Date();
    const trialEndDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 días

    return await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'TRIAL',
        trialStartDate: now,
        trialEndDate: trialEndDate,
      }
    });
  }

  static async activateSubscription(userId: string, endDate: Date, isFirstYear: boolean = true) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'ACTIVE',
        subscriptionStartDate: new Date(),
        subscriptionEndDate: endDate,
        isFirstYear: isFirstYear,
      }
    });
  }
}

// Mantener compatibilidad temporal para componentes que usen las interfaces antiguas
export interface PlanLimits {
  maxCards: number;
  hasWatermark: boolean;
  hasAnalytics: boolean;
  hasCustomDomain: boolean;
  hasExport: boolean;
  hasPrioritySupport: boolean;
  canUseHoverEffect: boolean;
  canUseGlassmorphism: boolean;
  canUseSubtleAnimations: boolean;
  canUseBackgroundPatterns: boolean;
  canUseAIPalette: boolean;
  canUseCustomTemplates: boolean;
}

// Clase de compatibilidad temporal
export class PlanLimitService {
  static async canCreateCard(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    return AccessService.canCreateCard(userId);
  }

  static async getUserPlanLimits(userId: string): Promise<PlanLimits | null> {
    const access = await AccessService.getUserAccess(userId);
    
    if (!access) return null;

    // Todos los usuarios con acceso tienen las mismas funcionalidades
    if (access.hasAccess) {
      return {
        maxCards: -1, // Ilimitado
        hasWatermark: false,
        hasAnalytics: true,
        hasCustomDomain: true,
        hasExport: true,
        hasPrioritySupport: true,
        canUseHoverEffect: true,
        canUseGlassmorphism: true,
        canUseSubtleAnimations: true,
        canUseBackgroundPatterns: true,
        canUseAIPalette: true,
        canUseCustomTemplates: true,
      };
    }

    // Sin acceso - funcionalidades limitadas
    return {
      maxCards: 0,
      hasWatermark: true,
      hasAnalytics: false,
      hasCustomDomain: false,
      hasExport: false,
      hasPrioritySupport: false,
      canUseHoverEffect: false,
      canUseGlassmorphism: false,
      canUseSubtleAnimations: false,
      canUseBackgroundPatterns: false,
      canUseAIPalette: false,
      canUseCustomTemplates: false,
    };
  }
}