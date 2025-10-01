/**
 * 🧪 Test Script - Verificar Sistema PresentationMind AI
 * 
 * Script para probar que todos los componentes del sistema
 * estén funcionando correctamente antes del deployment.
 */

import { PresentationMindSystem } from './PresentationMindSystem';

async function testPresentationMindSystem() {
  console.log('🤖 Testing PresentationMind AI System...\n');

  // Verificar variables de entorno
  console.log('1. Verificando configuración...');
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!anthropicKey) {
    console.error('❌ ANTHROPIC_API_KEY no encontrada en variables de entorno');
    return;
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de Supabase no encontradas');
    return;
  }

  console.log('✅ Variables de entorno configuradas correctamente');

  // Inicializar sistema
  console.log('\n2. Inicializando sistema...');
  const presentationMind = new PresentationMindSystem(
    anthropicKey,
    supabaseUrl,
    supabaseKey
  );
  console.log('✅ Sistema inicializado');

  // Documento de prueba
  const testDocument = `
    Inteligencia Artificial en el Futuro del Trabajo

    La inteligencia artificial está transformando radicalmente el panorama laboral mundial. 
    Según estudios recientes, se espera que el 40% de los trabajos actuales sean 
    automatizados en los próximos 15 años.

    Impacto en Diferentes Sectores:

    Manufactura: Los robots ya realizan el 25% de las tareas de manufactura. 
    Esta cifra podría llegar al 60% para 2030.

    Servicios Financieros: Los algoritmos de trading representan el 70% de 
    las transacciones en Wall Street. Los bancos están implementando 
    chatbots que reducen los costos de servicio al cliente en un 30%.

    Salud: Los sistemas de diagnóstico por IA pueden detectar cáncer con 
    95% de precisión, superando a los radiólogos humanos en algunos casos.

    Educación: Las plataformas de aprendizaje personalizado están mejorando 
    los resultados académicos en un 25% en promedio.

    Oportunidades y Desafíos:

    La IA creará nuevos tipos de empleos: especialistas en IA, entrenadores 
    de algoritmos, auditores de sistemas automatizados. Sin embargo, también 
    eliminará muchos puestos tradicionales.

    La clave está en la adaptación y el aprendizaje continuo. Las empresas 
    que inviertan en reentrenar a su fuerza laboral tendrán ventaja competitiva.

    Conclusión:

    El futuro del trabajo no es humano versus máquina, sino humano con máquina. 
    La colaboración inteligente entre humanos y AI será el factor determinante 
    del éxito organizacional.
  `;

  // Configuración de prueba
  const testInput = {
    document: testDocument,
    audienceType: 'corporate' as const,
    duration: 10,
    objective: 'inform' as const,
    interactivityLevel: 'medium' as const,
    requiresResearch: false, // Deshabilitado para test rápido
    customInstructions: 'Enfócate en datos concretos y estadísticas'
  };

  // Ejecutar prueba
  console.log('\n3. Generando presentación de prueba...');
  console.log('Documento:', testDocument.substring(0, 100) + '...');
  console.log('Configuración:', testInput);

  try {
    const startTime = Date.now();
    const result = await presentationMind.createPresentation(testInput);
    const processingTime = Date.now() - startTime;

    console.log('\n✅ ¡Presentación generada exitosamente!');
    console.log(`⏱️  Tiempo de procesamiento: ${processingTime}ms`);
    console.log(`📊 Calidad: ${result.qualityScore}/10`);
    console.log(`📋 Slides generados: ${result.presentation.metadata.totalSlides}`);
    console.log(`🎯 Duración estimada: ${result.presentation.metadata.estimatedDuration} minutos`);

    // Mostrar algunos slides de ejemplo
    console.log('\n📑 Primeros 2 slides generados:');
    result.presentation.slides.slice(0, 2).forEach((slide, index) => {
      console.log(`\nSlide ${index + 1}: ${slide.title}`);
      console.log(`Bullets: ${slide.content.bulletPoints?.join(', ') || 'N/A'}`);
      console.log(`Tiempo estimado: ${slide.estimatedTime}s`);
    });

    // Mostrar métricas de agentes
    console.log('\n📈 Métricas de Agentes:');
    console.log(`- Orchestrator: ${result.agentReports.orchestrator.planQuality}/10 calidad`);
    console.log(`- Content Analysis: ${result.agentReports.contentAnalysis.ruleCompliance}% cumplimiento regla 6x6`);
    console.log(`- Research: ${result.agentReports.research.dataPointsFound} datos encontrados`);

    console.log('\n🎉 ¡Sistema PresentationMind AI funcionando perfectamente!');
    return true;

  } catch (error) {
    console.error('\n❌ Error durante la generación:');
    console.error(error);
    return false;
  }
}

// Ejecutar test si es llamado directamente
if (require.main === module) {
  testPresentationMindSystem()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test fallido:', error);
      process.exit(1);
    });
}

export { testPresentationMindSystem };