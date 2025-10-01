const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateUsers() {
  console.log('🚀 Iniciando migración de usuarios al nuevo sistema...');
  
  try {
    // Obtener todos los usuarios existentes
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        plan: true,
        createdAt: true,
        subscription: true,
      }
    });

    console.log(`📊 Encontrados ${users.length} usuarios para migrar`);

    for (const user of users) {
      console.log(`\n👤 Migrando usuario: ${user.email} (Plan: ${user.plan})`);
      
      const now = new Date();
      let updateData = {};

      // Lógica de migración basada en el plan actual
      if (user.plan === 'FREE') {
        // Usuarios FREE → Trial de 7 días
        const trialEndDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        updateData = {
          status: 'TRIAL',
          trialStartDate: now,
          trialEndDate: trialEndDate,
          isFirstYear: true,
        };
        console.log(`   ✅ FREE → TRIAL (7 días hasta ${trialEndDate.toLocaleDateString()})`);
        
      } else if (['PROFESSIONAL', 'BUSINESS', 'ENTERPRISE'].includes(user.plan)) {
        // Usuarios con planes pagos → Suscripción activa por 1 año
        const subscriptionEndDate = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000));
        updateData = {
          status: 'ACTIVE',
          subscriptionStartDate: now,
          subscriptionEndDate: subscriptionEndDate,
          isFirstYear: false, // Como ya pagaron, considerarlos como renovación
        };
        console.log(`   ✅ ${user.plan} → ACTIVE (1 año hasta ${subscriptionEndDate.toLocaleDateString()})`);
        
        // Si tienen subscription existente, actualizarla también
        if (user.subscription) {
          await prisma.subscription.update({
            where: { userId: user.id },
            data: {
              isFirstYear: false,
              price: 2990, // Precio de renovación
              originalPrice: 4990,
              currentPeriodEnd: subscriptionEndDate,
            }
          });
          console.log(`   🔄 Subscription actualizada`);
        }
      }

      // Actualizar el usuario
      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
      
      console.log(`   ✅ Usuario migrado exitosamente`);
    }

    console.log('\n🎉 Migración completada exitosamente!');
    console.log(`\n📈 Resumen:`);
    
    // Mostrar estadísticas finales
    const stats = await prisma.user.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });
    
    stats.forEach(stat => {
      console.log(`   ${stat.status}: ${stat._count.status} usuarios`);
    });

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
if (require.main === module) {
  migrateUsers()
    .then(() => {
      console.log('\n✅ Migración finalizada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en migración:', error);
      process.exit(1);
    });
}

module.exports = { migrateUsers };