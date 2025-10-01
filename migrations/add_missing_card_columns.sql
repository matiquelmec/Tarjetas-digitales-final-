-- Migration: Add missing Card table columns
-- Date: August 31, 2025
-- Purpose: Add Sistema Profesional v4.0 and animated gradient columns to Card table

-- Add Sistema Profesional v4.0 columns (lines 106-108 in schema.prisma)
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "enableProfessionalEffects" BOOLEAN DEFAULT false;
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "professionalPersonality" TEXT DEFAULT 'trustworthy';
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "effectIntensity" TEXT DEFAULT 'balanced';

-- Add animated gradient columns (lines 110-115 in schema.prisma)  
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "enableAnimatedGradient" BOOLEAN DEFAULT false;
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "animatedGradientType" TEXT DEFAULT 'aurora';
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "animatedGradientSpeed" INTEGER DEFAULT 3;
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "animatedGradientIntensity" INTEGER DEFAULT 3;
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "animatedGradientOpacity" DOUBLE PRECISION DEFAULT 0.5;

-- Add floating shapes columns (lines 115-119 in schema.prisma)
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "enableFloatingShapes" BOOLEAN DEFAULT false;
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "floatingShapesType" TEXT DEFAULT 'geometric';
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "floatingShapesCount" INTEGER DEFAULT 3;
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "floatingShapesSpeed" INTEGER DEFAULT 3;

-- Add ambient effect columns (lines 119-120 in schema.prisma)
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "ambientIntensity" INTEGER DEFAULT 3;
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "ambientOpacity" DOUBLE PRECISION DEFAULT 0.5;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'Card' 
  AND column_name IN (
    'enableProfessionalEffects',
    'professionalPersonality', 
    'effectIntensity',
    'enableAnimatedGradient',
    'animatedGradientType',
    'animatedGradientSpeed',
    'animatedGradientIntensity',
    'animatedGradientOpacity',
    'enableFloatingShapes',
    'floatingShapesType',
    'floatingShapesCount',
    'floatingShapesSpeed',
    'ambientIntensity',
    'ambientOpacity'
  )
ORDER BY column_name;