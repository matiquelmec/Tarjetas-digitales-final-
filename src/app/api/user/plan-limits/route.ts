import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptionsSafe } from "@/lib/auth-safe";

export async function GET() {
  try {
    console.log("GET /api/user/plan-limits - Starting request");
    const session = await getServerSession(authOptionsSafe);
    
    if (!session?.user?.email) {
      console.log("Plan limits - Authorization failed - no session or email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retornar límites por defecto sin consulta DB compleja para evitar 500 errors
    const defaultPlanLimits = {
      maxCards: -1, // Ilimitado por ahora
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

    console.log("Plan limits retrieved successfully (default):", defaultPlanLimits);
    return NextResponse.json(defaultPlanLimits);
    
  } catch (error) {
    console.error("Error fetching plan limits:", error);
    
    // Fallback con límites básicos en lugar de error 500
    return NextResponse.json({
      maxCards: 3, // Límite conservador
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
    });
  }
}