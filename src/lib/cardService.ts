import { prisma } from './db';
import { Card } from '@prisma/client';

export interface CardData {
  title: string;
  name: string;
  profession: string;
  about?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  photoUrl?: string;
  location?: string;
  appointmentLink?: string;
  professionalDetails?: string;
  customUrl?: string;
  // Visual customization fields (exactly matching Prisma schema)
  cardBackgroundColor?: string;
  cardTextColor?: string;
  buttonSecondaryColor?: string;
  buttonNormalBackgroundColor?: string;
  buttonSecondaryHoverColor?: string;
  pageBackgroundColor?: string;
  enableHoverEffect?: boolean;
  enableGlassmorphism?: boolean;
  enableSubtleAnimations?: boolean;
  enableBackgroundPatterns?: boolean;
  enableAIPalette?: boolean;
  // Nuevos campos para efectos visuales (Agosto 2025)
  fontFamily?: string;
  enableParticles?: boolean;
  particleType?: string;
  particleDensity?: number;
  particleCount?: number;
  template?: string;
  // Campos para efectos de ambiente (Agosto 2025)
  enableAnimatedGradient?: boolean;
  animatedGradientType?: string;
  animatedGradientSpeed?: number;
  animatedGradientIntensity?: number;
  animatedGradientOpacity?: number;
  enableFloatingShapes?: boolean;
  floatingShapesType?: string;
  floatingShapesCount?: number;
  floatingShapesSpeed?: number;
  ambientIntensity?: number;
  ambientOpacity?: number;
  isActive?: boolean;
}

export class CardService {
  static async generateUniqueUrl(baseUrl: string): Promise<string> {
    // Verificar si la URL base está disponible
    const existingCard = await prisma.card.findFirst({
      where: { customUrl: baseUrl }
    });

    if (!existingCard) {
      return baseUrl; // URL base disponible
    }

    // Si hay conflicto, agregar número secuencial
    let counter = 2;
    let uniqueUrl = `${baseUrl}-${counter}`;
    
    while (await prisma.card.findFirst({ where: { customUrl: uniqueUrl } })) {
      counter++;
      uniqueUrl = `${baseUrl}-${counter}`;
    }

    return uniqueUrl;
  }

  static async createCard(userId: string, cardData: CardData): Promise<Card> {
    console.log('CardService.createCard - Starting with userId:', userId);
    
    // First, ensure the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    console.log('CardService.createCard - User lookup result:', {
      found: !!user,
      userId: userId,
      userEmail: user?.email
    });

    if (!user) {
      console.error('CardService.createCard - User not found in database:', userId);
      // Intentar buscar por email si userId podría ser un email
      if (userId.includes('@')) {
        console.log('Attempting to find user by email:', userId);
        const userByEmail = await prisma.user.findUnique({
          where: { email: userId }
        });
        if (userByEmail) {
          console.log('Found user by email, using correct ID:', userByEmail.id);
          userId = userByEmail.id;
        } else {
          throw new Error(`User not found by ID or email: ${userId}`);
        }
      } else {
        throw new Error(`User not found with ID: ${userId}`);
      }
    }

    // Generar URL única si se proporciona customUrl
    if (cardData.customUrl) {
      console.log('Generating unique URL for:', cardData.customUrl);
      cardData.customUrl = await this.generateUniqueUrl(cardData.customUrl);
      console.log('Final URL generated:', cardData.customUrl);
    }

    console.log('CardService.createCard - Creating card with data:', {
      userId,
      title: cardData.title,
      name: cardData.name,
      customUrl: cardData.customUrl
    });

    return await prisma.card.create({
      data: {
        ...cardData,
        userId,
      },
    });
  }

  static async getUserCards(userId: string): Promise<Card[]> {
    return await prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCard(cardId: string): Promise<Card | null> {
    return await prisma.card.findUnique({
      where: { id: cardId },
      include: { user: true },
    });
  }

  static async updateCard(cardId: string, userId: string, cardData: Partial<CardData>): Promise<Card> {
    return await prisma.card.update({
      where: { 
        id: cardId,
        userId // Ensure user owns this card
      },
      data: cardData,
    });
  }

  static async deleteCard(cardId: string, userId: string): Promise<Card> {
    return await prisma.card.delete({
      where: { 
        id: cardId,
        userId // Ensure user owns this card
      },
    });
  }

  static async incrementViews(cardId: string): Promise<void> {
    await prisma.card.update({
      where: { id: cardId },
      data: {
        views: { increment: 1 },
      },
    });
  }

  static async incrementClicks(cardId: string): Promise<void> {
    await prisma.card.update({
      where: { id: cardId },
      data: {
        clicks: { increment: 1 },
      },
    });
  }

  static async getPublicCard(cardId: string): Promise<Card | null> {
    const card = await prisma.card.findFirst({
      where: { 
        id: cardId,
        isActive: true 
      },
      include: { user: true },
    });

    if (card) {
      await this.incrementViews(cardId);
    }

    return card;
  }
}