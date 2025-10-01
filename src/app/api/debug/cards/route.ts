import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { PlanLimitService } from '@/lib/planLimits';
import { CardService } from '@/lib/cardService';

export async function GET() {
  try {
    console.log('DEBUG /api/cards - Testing cards creation flow...');
    
    const session = await getServerSession(authOptionsSafe);
    
    console.log('Cards debug session data:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({
        step: 'session_check',
        success: false,
        error: 'No session or user ID found'
      });
    }

    // Test 1: Check plan limits
    console.log('Testing PlanLimitService.canCreateCard...');
    let planLimitResult;
    try {
      planLimitResult = await PlanLimitService.canCreateCard(session.user.id);
      console.log('Plan limit result:', planLimitResult);
    } catch (planError) {
      console.error('Plan limit error:', planError);
      return NextResponse.json({
        step: 'plan_limits',
        success: false,
        error: planError instanceof Error ? planError.message : 'Unknown plan limit error',
        stack: planError instanceof Error ? planError.stack : null
      });
    }

    if (!planLimitResult.allowed) {
      return NextResponse.json({
        step: 'plan_limits',
        success: false,
        error: 'Plan limit exceeded',
        reason: planLimitResult.reason
      });
    }

    // Test 2: Get user plan limits
    console.log('Testing PlanLimitService.getUserPlanLimits...');
    let userPlanLimits;
    try {
      userPlanLimits = await PlanLimitService.getUserPlanLimits(session.user.id);
      console.log('User plan limits:', userPlanLimits);
    } catch (planLimitsError) {
      console.error('User plan limits error:', planLimitsError);
      return NextResponse.json({
        step: 'user_plan_limits',
        success: false,
        error: planLimitsError instanceof Error ? planLimitsError.message : 'Unknown user plan limits error',
        stack: planLimitsError instanceof Error ? planLimitsError.stack : null
      });
    }

    // Test 3: Try creating a test card (dry run)
    const testCardData = {
      title: 'Test Card',
      name: 'Test User',
      profession: 'Test Profession',
      about: 'Test description',
      email: 'test@example.com',
      customUrl: 'test-card-debug',
      cardBackgroundColor: '#2c2c2c',
      cardTextColor: '#ffffff',
      enableHoverEffect: false,
      enableGlassmorphism: false,
      enableSubtleAnimations: false,
      enableBackgroundPatterns: false,
      isActive: true
      // Removed isPublic - this field doesn't exist in the Card schema
    };

    console.log('Testing CardService.createCard... (This will create a real test card)');
    let cardResult;
    try {
      // We'll actually create a test card to see if it works
      cardResult = await CardService.createCard(session.user.id, testCardData);
      console.log('Card created successfully:', cardResult.id);
      
      // Clean up - delete the test card
      await CardService.deleteCard(cardResult.id, session.user.id);
      console.log('Test card cleaned up');
      
    } catch (cardError) {
      console.error('Card creation error:', cardError);
      return NextResponse.json({
        step: 'card_creation',
        success: false,
        error: cardError instanceof Error ? cardError.message : 'Unknown card creation error',
        stack: cardError instanceof Error ? cardError.stack : null
      });
    }

    return NextResponse.json({
      success: true,
      message: 'All card creation steps work correctly',
      tests: {
        session_check: true,
        plan_limits: true,
        user_plan_limits: true,
        card_creation: true
      },
      details: {
        userId: session.user.id,
        planLimitResult,
        userPlanLimits,
        testCardCreated: true
      }
    });

  } catch (error) {
    console.error('DEBUG cards error:', error);
    return NextResponse.json({
      step: 'general_error',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    });
  }
}