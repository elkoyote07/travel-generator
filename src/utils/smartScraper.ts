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
      console.log('Intentando con scraper real...');
      results = await getMultipleFlightPricesReal(origin, destinations, startDate, endDate);
      
      // Verificar si obtuvimos resultados válidos
      const validResults = results.filter(r => r.skyscanner && r.skyscanner.price !== 'Ver precios');
      
      if (validResults.length > 0) {
        console.log(`Scraper real exitoso: ${validResults.length} destinos con precios`);
        return results;
      }
    }
    
    // Si el scraper real falló y tenemos Puppeteer habilitado, intentar con él
    if (SCRAPER_CONFIG.usePuppeteerAsBackup) {
      console.log('Scraper real falló, intentando con Puppeteer...');
      
      // Esperar un poco antes de intentar con Puppeteer
      await new Promise(resolve => setTimeout(resolve, SCRAPER_CONFIG.delayBetweenRequests));
      
      results = await getMultipleFlightPricesWithPuppeteer(origin, destinations, startDate, endDate);
      
      const validResults = results.filter(r => r.skyscanner && r.skyscanner.price !== 'Ver precios');
      
      if (validResults.length > 0) {
        console.log(`Puppeteer exitoso: ${validResults.length} destinos con precios`);
        return results;
      }
    }
    
    // Si ambos fallaron, devolver resultados con enlaces pero sin precios
    console.log('Ambos scrapers fallaron, devolviendo enlaces sin precios');
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
    console.error('Error en scraper inteligente:', error);
    
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
      console.log(`Intento ${attempt} de ${maxRetries}`);
      const results = await getFlightPricesSmart(origin, destinations, startDate, endDate);
      
      // Verificar si obtuvimos resultados válidos
      const validResults = results.filter(r => r.skyscanner && r.skyscanner.price !== 'Error al obtener precio' && r.skyscanner.price !== 'Precio no disponible');
      
      if (validResults.length > 0) {
        console.log(`Éxito en intento ${attempt}: ${validResults.length} destinos con precios`);
        return results;
      }
      
      if (attempt < maxRetries) {
        console.log(`Intento ${attempt} falló, esperando antes del siguiente...`);
        await new Promise(resolve => setTimeout(resolve, SCRAPER_CONFIG.delayBetweenRequests * 2));
      }
      
    } catch (error) {
      lastError = error as Error;
      console.error(`Error en intento ${attempt}:`, error);
      
      if (attempt < maxRetries) {
        console.log(`Esperando antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, SCRAPER_CONFIG.delayBetweenRequests * 2));
      }
    }
  }
  
  // Si todos los intentos fallaron, devolver resultados básicos
  console.log('Todos los intentos fallaron, devolviendo resultados básicos');
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