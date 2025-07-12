import { getMultipleFlightPricesReal } from './realFlightScraper';
import { getMultipleFlightPricesWithPuppeteer } from './puppeteerScraper';
import { SCRAPER_CONFIG } from './scraperConfig';

export interface FlightPrice {
  price: string;
  airline?: string;
  url: string;
  source: 'skyscanner' | 'google';
}

export interface ScrapedFlightData {
  destination: {
    code: string;
    name: string;
    country: string;
  };
  skyscanner: FlightPrice | null;
  googleFlights: FlightPrice | null;
}

// Función principal inteligente que maneja fallos
export async function getFlightPricesSmart(
  origin: string,
  destinations: Array<{ code: string; name: string; country: string }>,
  startDate: string,
  endDate: string
): Promise<ScrapedFlightData[]> {
  let results: ScrapedFlightData[] = [];
  
  try {
    // Intentar primero con el scraper real (más rápido)
    if (SCRAPER_CONFIG.useRealScraper) {
      results = await getMultipleFlightPricesReal(origin, destinations, startDate, endDate);
      
      // Verificar si obtuvimos resultados válidos
      const validResults = results.filter(r => r.skyscanner && r.skyscanner.price !== 'Ver precios');
      
      if (validResults.length > 0) {
        return results;
      }
    }
    
    // Si el scraper real falló y tenemos Puppeteer habilitado, intentar con él
    if (SCRAPER_CONFIG.usePuppeteerAsBackup) {
      // Esperar un poco antes de intentar con Puppeteer
      await new Promise(resolve => setTimeout(resolve, SCRAPER_CONFIG.delayBetweenRequests));
      
      results = await getMultipleFlightPricesWithPuppeteer(origin, destinations, startDate, endDate);
      
      const validResults = results.filter(r => r.skyscanner && r.skyscanner.price !== 'Ver precios');
      
      if (validResults.length > 0) {
        return results;
      }
    }
    
    // Si ambos fallaron, devolver resultados con enlaces pero sin precios
    return results.map(result => ({
      ...result,
      skyscanner: result.skyscanner || {
        price: 'Precio no disponible',
        airline: 'Skyscanner',
        url: `https://www.skyscanner.es/transport/flights/${origin}/${result.destination.code}/${startDate}/${endDate}/`,
        source: 'skyscanner'
      },
      googleFlights: result.googleFlights || {
        price: 'Ver precios',
        airline: 'Google Flights',
        url: `https://www.google.com/travel/flights?hl=es&tfs=${origin}_${result.destination.code}_${startDate.replace(/-/g, '')}&tfs=${result.destination.code}_${origin}_${endDate.replace(/-/g, '')}`,
        source: 'google'
      }
    }));
    
  } catch (error) {
    
    // En caso de error total, devolver estructura básica
    return destinations.map(destination => ({
      destination,
      skyscanner: {
        price: 'Error al obtener precio',
        airline: 'Skyscanner',
        url: `https://www.skyscanner.es/transport/flights/${origin}/${destination.code}/${startDate}/${endDate}/`,
        source: 'skyscanner'
      },
      googleFlights: {
        price: 'Ver precios',
        airline: 'Google Flights',
        url: `https://www.google.com/travel/flights?hl=es&tfs=${origin}_${destination.code}_${startDate.replace(/-/g, '')}&tfs=${destination.code}_${origin}_${endDate.replace(/-/g, '')}`,
        source: 'google'
      }
    }));
  }
}

// Función para obtener precios con retry automático
export async function getFlightPricesWithRetry(
  origin: string,
  destinations: Array<{ code: string; name: string; country: string }>,
  startDate: string,
  endDate: string,
  maxRetries: number = SCRAPER_CONFIG.maxRetries
): Promise<ScrapedFlightData[]> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const results = await getFlightPricesSmart(origin, destinations, startDate, endDate);
      
      // Verificar si obtuvimos resultados válidos
      const validResults = results.filter(r => r.skyscanner && r.skyscanner.price !== 'Error al obtener precio' && r.skyscanner.price !== 'Precio no disponible');
      
      if (validResults.length > 0) {
        return results;
      }
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, SCRAPER_CONFIG.delayBetweenRequests * 2));
      }
      
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, SCRAPER_CONFIG.delayBetweenRequests * 2));
      }
    }
  }
  
  // Si todos los intentos fallaron, devolver resultados básicos
  return destinations.map(destination => ({
    destination,
    skyscanner: {
      price: 'No disponible',
      airline: 'Skyscanner',
      url: `https://www.skyscanner.es/transport/flights/${origin}/${destination.code}/${startDate}/${endDate}/`,
      source: 'skyscanner'
    },
    googleFlights: {
      price: 'Ver precios',
      airline: 'Google Flights',
      url: `https://www.google.com/travel/flights?hl=es&tfs=${origin}_${destination.code}_${startDate.replace(/-/g, '')}&tfs=${destination.code}_${origin}_${endDate.replace(/-/g, '')}`,
      source: 'google'
    }
  }));
} 