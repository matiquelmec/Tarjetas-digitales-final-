# 🗄️ Configuración de Base de Datos: Local + Supabase

## 📋 Resumen
Este proyecto usa **PostgreSQL local** para desarrollo y **Supabase** para producción.

---

## 🚀 Setup Rápido

### 1️⃣ **Desarrollo Local**
```bash
# Crear base de datos local
psql -U postgres
CREATE DATABASE tarjetas_digitales;
\q

# Configurar .env.local
cp .env.local.example .env.local
# Editar .env.local con tu contraseña de PostgreSQL

# Migrar esquema
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate

# Iniciar desarrollo
npm run dev
```

### 2️⃣ **Producción (Supabase)**
- Base de datos ya configurada en: `wvlygvzqaxfalsdgmgpc.supabase.co`
- Connection string en `.env` para producción
- Deploy automático en Netlify usa variables de entorno de producción

---

## 🔧 Comandos Útiles

### **Sincronizar Esquema**
```bash
# Con base local
npx prisma db push

# Con Supabase
DATABASE_URL="postgresql://..." npx prisma db push
```

### **Ver Base de Datos**
```bash
# Abrir Prisma Studio
npx prisma studio
```

### **Generar Migraciones**
```bash
# Crear nueva migración
npx prisma migrate dev --name descripcion_cambio
```

---

## 📊 Estructura de Tablas Principales

### **User**
- Información de usuarios autenticados
- Status de suscripción (TRIAL, ACTIVE, PREMIUM)
- Fechas de trial y suscripción

### **Card** 
- Tarjetas digitales de cada usuario
- Diseño, colores, efectos
- URLs personalizadas y QR codes

### **SmartCV**
- CVs inteligentes (próximamente)
- Optimización con IA

### **Presentation**
- Presentaciones inmersivas (próximamente)
- Slides y efectos visuales

---

## 🌐 URLs de Acceso

### **Local**
- App: http://localhost:3000
- Prisma Studio: http://localhost:5555

### **Producción**
- App: https://tarjetasdigitales.netlify.app
- Supabase Dashboard: https://app.supabase.com/project/wvlygvzqaxfalsdgmgpc

---

## 🔐 Seguridad

### **Variables de Entorno**
- **NUNCA** commitear `.env` o `.env.local`
- Usar `.env.example` para documentación
- Configurar variables en Netlify para producción

### **Conexiones**
- Local: Sin SSL para desarrollo
- Supabase: SSL habilitado por defecto
- Connection pooling activado en Supabase

---

## 📈 Monitoreo

### **Supabase Dashboard**
- Queries en tiempo real
- Métricas de performance
- Logs de errores

### **Prisma Studio**
```bash
npx prisma studio
```
Visualización y edición de datos local

---

## 🆘 Troubleshooting

### **Error: Cannot connect to database**
```bash
# Verificar PostgreSQL local
pg_isready -h localhost -p 5432

# Verificar connection string
echo $DATABASE_URL
```

### **Error: Schema out of sync**
```bash
# Resetear y sincronizar
npx prisma db push --force-reset
```

### **Error: Prisma Client outdated**
```bash
npx prisma generate
npm run build
```

---

## 📝 Notas Importantes

1. **Desarrollo**: Usa `.env.local` con PostgreSQL local
2. **Producción**: Usa `.env` con Supabase
3. **Migraciones**: Siempre probar en local primero
4. **Backups**: Supabase hace backups automáticos diarios
5. **Límites Gratis**: 
   - Supabase: 500MB storage, 2GB bandwidth
   - Suficiente para ~10,000 usuarios activos

---

## 🎯 Próximos Pasos

1. ✅ Configurar PostgreSQL local
2. ✅ Conectar con Supabase
3. ⏳ Implementar sistema de backups
4. ⏳ Configurar monitoring avanzado
5. ⏳ Optimizar queries con índices