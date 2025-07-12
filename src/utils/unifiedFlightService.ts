import { getCurrentMode, isModeEnabled, printCurrentConfig, getLogConfig } from './config';
import { getMultipleFlightPricesSimple } from './simpleScraper';
import { getMultipleFlightPricesWithAPIs } from './flightAPIs';

export interface FlightPrice {
  price: string;
  airline?: string;
  url: string;
  source: string;
}

export interface ScrapedFlightData {
  destination: {
    code: string;
    name: string;
    country: string;
  };
  skyscanner: FlightPrice | null;
  googleFlights: FlightPrice | null;
  kayak: FlightPrice | null;
}

export async function getFlightPrices(
  origin: string,
  destinations: Array<{ code: string; name: string; country: string }>,
  startDate: string,
  endDate: string
): Promise<ScrapedFlightData[]> {
  printCurrentConfig();
  const mode = getCurrentMode();
  const logConfig = getLogConfig();
  console.log(`\n🚀 [UNIFIED] Iniciando búsqueda en modo: ${mode.toUpperCase()}`);
  console.log(`📍 [UNIFIED] Origen: ${origin}`);
  console.log(`🎯 [UNIFIED] Destinos: ${destinations.length}`);
  console.log(`📅 [UNIFIED] Fechas: ${startDate} → ${endDate}`);
  try {
    let results: ScrapedFlightData[] = [];
    switch (mode) {
      case 'mock':
        console.log(`🎲 [UNIFIED] Usando modo MOCK`);
        results = await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
        break;
      case 'scraper':
        console.log(`🕷️ [UNIFIED] Usando modo SCRAPER`);
        results = await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
        break;
      case 'apis':
        console.log(`🔌 [UNIFIED] Usando modo APIS`);
        results = await getMultipleFlightPricesWithAPIs(origin, destinations, startDate, endDate);
        break;
      case 'hybrid':
        console.log(`🔄 [UNIFIED] Usando modo HIBRIDO`);
        results = await getHybridFlightPrices(origin, destinations, startDate, endDate);
        break;
      default:
        console.log(`⚠️ [UNIFIED] Modo no reconocido, usando MOCK por defecto`);
        results = await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
    }
    if (logConfig.enabled) {
      console.log(`\n📊 [UNIFIED] Resultados obtenidos:`);
      console.log(`   ✅ Total destinos: ${results.length}`);
      if (logConfig.showPrices) {
        results.forEach((result, index) => {
          const price = result.skyscanner?.price || 'N/A';
          const airline = result.skyscanner?.airline || 'N/A';
          const source = result.skyscanner?.source || 'N/A';
          console.log(`   ${index + 1}. ${result.destination.code}: ${price} (${airline}) [${source}]`);
        });
      }
    }
    return results;
  } catch (error) {
    console.error(`❌ [UNIFIED] Error en búsqueda:`, error);
    console.log(`🔄 [UNIFIED] Usando fallback a MOCK`);
    return await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
  }
}

async function getHybridFlightPrices(
  origin: string,
  destinations: Array<{ code: string; name: string; country: string }>,
  startDate: string,
  endDate: string
): Promise<ScrapedFlightData[]> {
  console.log(`🔄 [HYBRID] Iniciando búsqueda híbrida`);
  if (isModeEnabled('apis')) {
    try {
      console.log(`🔌 [HYBRID] Intentando APIs...`);
      const apiResults = await getMultipleFlightPricesWithAPIs(origin, destinations, startDate, endDate);
      const realPrices = apiResults.filter(r => r.skyscanner && r.skyscanner.source !== 'simulated');
      if (realPrices.length > 0) {
        console.log(`✅ [HYBRID] APIs exitosas, usando resultados de APIs`);
        return apiResults;
      } else {
        console.log(`⚠️ [HYBRID] APIs no obtuvieron precios reales`);
      }
    } catch (error) {
      console.log(`❌ [HYBRID] Error en APIs:`, error);
    }
  }
  if (isModeEnabled('scraper')) {
    try {
      console.log(`🕷️ [HYBRID] Intentando scraper...`);
      const scraperResults = await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
      console.log(`✅ [HYBRID] Scraper exitoso`);
      return scraperResults;
    } catch (error) {
      console.log(`❌ [HYBRID] Error en scraper:`, error);
    }
  }
  console.log(`🎲 [HYBRID] Usando fallback a MOCK`);
  return await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
}

export function getModeInfo() {
  const mode = getCurrentMode();
  const logConfig = getLogConfig();
  return {
    mode,
    logging: logConfig.enabled,
    showUrls: logConfig.showUrls,
    showPrices: logConfig.showPrices,
    description: getModeDescription(mode)
  };
}

function getModeDescription(mode: string): string {
  switch (mode) {
    case 'mock':
      return 'Genera precios simulados realistas';
    case 'scraper':
      return 'Usa el scraper original de Skyscanner';
    case 'apis':
      return 'Usa APIs gratuitas (Aviation Stack, Amadeus, Kiwi)';
    case 'hybrid':
      return 'Intenta APIs primero, luego scraper, finalmente mock';
    default:
      return 'Modo no reconocido';
  }
} 