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

  try {
    let results: ScrapedFlightData[] = [];

    switch (mode) {
      case 'mock':
        results = await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
        break;
      case 'scraper':
        results = await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
        break;
      case 'apis':
        results = await getMultipleFlightPricesWithAPIs(origin, destinations, startDate, endDate);
        break;
      case 'hybrid':
        results = await getHybridFlightPrices(origin, destinations, startDate, endDate);
        break;
      default:
        results = await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
        break;
    }

    return results;
  } catch (error) {
    return await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
  }
}

async function getHybridFlightPrices(
  origin: string,
  destinations: Array<{ code: string; name: string; country: string }>,
  startDate: string,
  endDate: string
): Promise<ScrapedFlightData[]> {
  try {
    const apiResults = await getMultipleFlightPricesWithAPIs(origin, destinations, startDate, endDate);
    
    const hasRealPrices = apiResults.some(result => 
      result.skyscanner?.price !== 'N/A' && 
      result.skyscanner?.price !== 'Consultar'
    );

    if (hasRealPrices) {
      return apiResults;
    }

    const scraperResults = await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
    
    const hasScraperPrices = scraperResults.some(result => 
      result.skyscanner?.price !== 'N/A' && 
      result.skyscanner?.price !== 'Consultar'
    );

    if (hasScraperPrices) {
      return scraperResults;
    }

    return await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
  } catch (error) {
    return await getMultipleFlightPricesSimple(origin, destinations, startDate, endDate);
  }
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