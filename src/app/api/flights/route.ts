import { NextRequest, NextResponse } from 'next/server';
import { getFlightPrices, getModeInfo } from '@/utils/unifiedFlightService';

export async function POST(request: NextRequest) {
  console.log(`\n🌐 [API] Nueva petición recibida en /api/flights`);
  console.log(`📅 [API] Timestamp: ${new Date().toISOString()}`);
  
  // Mostrar información del modo actual
  const modeInfo = getModeInfo();
  console.log(`🎯 [API] Modo actual: ${modeInfo.mode.toUpperCase()}`);
  console.log(`📝 [API] Descripción: ${modeInfo.description}`);
  
  try {
    const body = await request.json();
    const { origin, destinations, startDate, endDate } = body;

    console.log(`📋 [API] Parámetros recibidos:`);
    console.log(`   🛫 Origen: ${origin}`);
    console.log(`   🎯 Destinos: ${destinations?.length || 0} destinos`);
    console.log(`   📅 Fecha salida: ${startDate}`);
    console.log(`   📅 Fecha regreso: ${endDate}`);

    if (!origin || !destinations || !startDate || !endDate) {
      console.log(`❌ [API] Error: Faltan parámetros requeridos`);
      console.log(`   Origin: ${!!origin}`);
      console.log(`   Destinations: ${!!destinations}`);
      console.log(`   StartDate: ${!!startDate}`);
      console.log(`   EndDate: ${!!endDate}`);
      
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    console.log(`✅ [API] Parámetros válidos, iniciando búsqueda...`);

    // Obtener precios usando el servicio unificado
    const results = await getFlightPrices(
      origin,
      destinations,
      startDate,
      endDate
    );

    console.log(`\n📊 [API] Resultados obtenidos:`);
    console.log(`   ✅ Total de destinos procesados: ${results.length}`);
    
    // Estadísticas de precios
    const pricesWithData = results.filter(r => r.skyscanner?.price);
    const avgPrice = pricesWithData.length > 0 
      ? pricesWithData.reduce((sum, r) => {
          const price = parseInt(r.skyscanner!.price.replace('€', ''));
          return sum + price;
        }, 0) / pricesWithData.length
      : 0;
    
    console.log(`   💰 Precios obtenidos: ${pricesWithData.length}/${results.length}`);
    console.log(`   📈 Precio promedio: €${Math.round(avgPrice)}`);
    
    // Aerolíneas más comunes
    const airlines = results
      .map(r => r.skyscanner?.airline)
      .filter(Boolean);
    const airlineCounts = airlines.reduce((acc, airline) => {
      acc[airline!] = (acc[airline!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log(`   ✈️ Aerolíneas encontradas:`);
    Object.entries(airlineCounts).forEach(([airline, count]) => {
      console.log(`      - ${airline}: ${count} vuelos`);
    });

    // Fuentes de datos utilizadas
    const sources = results
      .map(r => r.skyscanner?.source)
      .filter(Boolean);
    const sourceCounts = sources.reduce((acc, source) => {
      acc[source!] = (acc[source!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log(`   🔍 Fuentes de datos utilizadas:`);
    Object.entries(sourceCounts).forEach(([source, count]) => {
      console.log(`      - ${source}: ${count} resultados`);
    });

    console.log(`✅ [API] Respuesta enviada exitosamente`);
    return NextResponse.json({ 
      results,
      mode: modeInfo.mode,
      description: modeInfo.description
    });
  } catch (error) {
    console.error(`❌ [API] Error interno del servidor:`, error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 