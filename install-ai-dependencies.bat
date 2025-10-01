@echo off
echo 🤖 Instalando dependencias para PresentationMind AI...
echo.

echo 1. Instalando @anthropic-ai/sdk...
npm install @anthropic-ai/sdk

echo.
echo 2. Instalando @supabase/supabase-js...
npm install @supabase/supabase-js

echo.
echo 3. Verificando dependencias existentes...
npm list next react react-bootstrap typescript

echo.
echo 4. Generando cliente Prisma actualizado...
npx prisma generate

echo.
echo ✅ ¡Dependencias de PresentationMind AI instaladas exitosamente!
echo.
echo 📋 Próximos pasos:
echo    1. Verificar que ANTHROPIC_API_KEY esté configurada en .env
echo    2. Ejecutar migración de base de datos: npx prisma db push
echo    3. Probar el sistema en /dashboard/presentations
echo.
pause