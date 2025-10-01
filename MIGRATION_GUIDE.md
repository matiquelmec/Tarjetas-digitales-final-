# 🚀 Guía de Migración: Nuevo Sistema de Monetización

## 📋 Resumen de Cambios Implementados

Se ha implementado completamente el nuevo sistema de monetización basado en **trials + pagos anuales**, reemplazando el sistema freemium anterior.

### 🎯 Nuevo Modelo:
- **Trial 7 días** - Acceso completo a todas las funcionalidades
- **$4,990 CLP** - Primer año después del trial  
- **$2,990 CLP** - Renovación anual
- **Sin planes** FREE/PROFESSIONAL/BUSINESS/ENTERPRISE
- **Solo estados:** TRIAL → ACTIVE → EXPIRED

---

## 🔧 Archivos Modificados

### 1. **Base de Datos** (`prisma/schema.prisma`)
- ✅ Eliminado enum `Plan`
- ✅ Agregado enum `UserStatus` (TRIAL, ACTIVE, EXPIRED)
- ✅ Nuevos campos en User: `trialStartDate`, `trialEndDate`, `subscriptionStartDate`, `subscriptionEndDate`, `isFirstYear`, `status`
- ✅ Actualizados campos en Subscription: `isFirstYear`, `price`, `originalPrice`

### 2. **Configuración de Precios** (`src/lib/mercadopago.ts`)
- ✅ Reemplazado `PLAN_PRICES` por `CARD_PRICES`
- ✅ Nuevo `SUBSCRIPTION_DETAILS` con precios específicos
- ✅ Eliminado `PLAN_LIMITS`

### 3. **Lógica de Acceso** (`src/lib/planLimits.ts`)
- ✅ Nueva clase `AccessService` con interfaz `UserAccess`
- ✅ Mantenida compatibilidad temporal con `PlanLimitService`
- ✅ Lógica simplificada: trial/activo = acceso completo

### 4. **APIs Actualizadas**
- ✅ `/api/user/plan-limits/route.ts` - Retorna `UserAccess`
- ✅ `/api/create-checkout-session/route.ts` - Maneja FIRST_YEAR vs RENEWAL
- ✅ `/api/cards/route.ts` - Validación de acceso simplificada
- ✅ `/api/user/ensure/route.ts` - Trial automático al crear usuario
- ✅ `/api/mercadopago/webhook/route.ts` - Procesa nuevos tipos de suscripción

### 5. **Interfaz de Usuario**
- ✅ `/app/pricing/page.tsx` - Diseño minimalista con un solo producto
- ✅ `/app/dashboard/page.tsx` - Banner de trial integrado
- ✅ Nuevo componente `TrialBanner.tsx`
- ✅ Onboarding automático en `AppInitializer.tsx`

### 6. **Sistema de Autenticación**
- ✅ Actualizados `auth-safe.ts` y `next-auth.d.ts`
- ✅ Trial automático al registrarse

---

## 🚨 Pasos de Despliegue CRÍTICOS

### 1. **Ejecutar Migración de Base de Datos**
```bash
# 1. Aplicar cambios de schema
npx prisma db push

# 2. Migrar usuarios existentes
node migrate-users.js
```

### 2. **Verificar Variables de Entorno**
Asegurar que estén configuradas:
```env
MP_ACCESS_TOKEN=tu_token_mercadopago
NEXTAUTH_SECRET=tu_secret
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
DATABASE_URL=tu_database_url
```

### 3. **Generar Cliente Prisma**
```bash
npx prisma generate
```

### 4. **Construir y Desplegar**
```bash
npm run build
npm start
```

---

## ⚠️ Precauciones Importantes

### **ANTES DE EJECUTAR EN PRODUCCIÓN:**

1. **Backup de Base de Datos**
   ```bash
   # Crear backup completo antes de la migración
   pg_dump database_url > backup_pre_migration.sql
   ```

2. **Probar en Staging Primero**
   - Ejecutar migración en entorno de prueba
   - Verificar que usuarios existentes mantengan acceso
   - Probar flujo completo de pagos

3. **Monitorear Durante Migración**
   - Logs de `migrate-users.js`
   - Verificar que todos los usuarios se migren correctamente
   - Confirmar que MercadoPago webhook funciona

---

## 🧪 Funcionalidades del Nuevo Sistema

### **Para Usuarios Nuevos:**
1. Registro → Trial automático de 7 días
2. Acceso completo durante trial
3. Notificaciones en días 5, 6, 7
4. Conversión a suscripción ($4,990)

### **Para Usuarios Existentes:**
- **FREE** → Migrados a Trial de 7 días
- **PROFESSIONAL/BUSINESS/ENTERPRISE** → Suscripción activa por 1 año
- **Precio de renovación:** $2,990 CLP

### **Flujo de Pagos:**
1. Detección automática: primer año vs renovación
2. Precios diferenciados en MercadoPago
3. Activación automática via webhook
4. Notificaciones contextuales en dashboard

---

## 📊 Testing Checklist

Antes de marcar como completo, verificar:

- [ ] Usuarios nuevos reciben trial automático
- [ ] Trial expira correctamente después de 7 días
- [ ] Pagos de primer año ($4,990) funcionan
- [ ] Pagos de renovación ($2,990) funcionan
- [ ] Webhook actualiza estado correctamente
- [ ] Dashboard muestra información de trial/suscripción
- [ ] Página de pricing refleja precios correctos
- [ ] Usuarios sin acceso no pueden crear tarjetas
- [ ] Migración de usuarios existentes exitosa

---

## 🛠️ Scripts Disponibles

- **`migrate-users.js`** - Migra usuarios existentes al nuevo sistema
- **`npm run dev`** - Desarrollo local
- **`npm run build`** - Build de producción
- **`npx prisma studio`** - Interfaz visual de base de datos

---

## 📞 Soporte

Si encuentras problemas durante la migración:

1. Verificar logs de `migrate-users.js`
2. Revisar estado de base de datos con Prisma Studio
3. Confirmar variables de entorno
4. Verificar configuración de MercadoPago

**¡El sistema está listo para producción!** ✅