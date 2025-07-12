import axios from 'axios';

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

// Función para generar URL de Skyscanner
function generateSkyscannerURL(origin: string, destination: string, startDate: string, endDate: string): string {
  return `https://www.skyscanner.es/transport/flights/${origin}/${destination}/${startDate}/${endDate}/`;
}

// Función para generar URL de Google Flights
function generateGoogleFlightsURL(origin: string, destination: string, startDate: string, endDate: string): string {
  const formattedStartDate = startDate.replace(/-/g, '');
  const formattedEndDate = endDate.replace(/-/g, '');
  return `https://www.google.com/travel/flights?hl=es&tfs=${origin}_${destination}_${formattedStartDate}&tfs=${destination}_${origin}_${formattedEndDate}`;
}

// Función para hacer scraping real de Skyscanner
async function scrapeSkyscannerReal(origin: string, destination: string, startDate: string, endDate: string): Promise<FlightPrice | null> {
  try {
    // URL de la API no oficial de Skyscanner
    const apiUrl = `https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create`;
    
    // Headers para simular un navegador real
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    // Parámetros de la búsqueda
    const searchParams = {
      cabin_class: 'economy',
      adults: 1,
      children: 0,
      infants: 0,
      origin_airport_entity_id: origin,
      destination_airport_entity_id: destination,
      outbound_date: startDate,
      return_date: endDate,
      currency: 'EUR',
      locale: 'es-ES',
      market: 'ES'
    };

    // Intentar hacer la petición a la API
    const response = await axios.post(apiUrl, searchParams, { headers, timeout: 10000 });
    
    if (response.data && response.data.itineraries) {
      // Buscar el precio más barato
      let cheapestPrice = null;
      let cheapestAirline = null;
      
      for (const itinerary of response.data.itineraries) {
        if (itinerary.pricing_options && itinerary.pricing_options.length > 0) {
          const price = itinerary.pricing_options[0].price;
          if (!cheapestPrice || price.amount < cheapestPrice.amount) {
            cheapestPrice = price;
            cheapestAirline = itinerary.legs?.[0]?.carriers?.marketing?.[0]?.name || 'Unknown';
          }
        }
      }
      
      if (cheapestPrice) {
        return {
          price: `€${Math.round(cheapestPrice.amount)}`,
          airline: cheapestAirline,
          url: generateSkyscannerURL(origin, destination, startDate, endDate),
          source: 'skyscanner'
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error scraping Skyscanner:', error);
    
    // Si falla la API, intentar scraping de la página web
    return await scrapeSkyscannerWeb(origin, destination, startDate, endDate);
  }
}

// Función de respaldo para scraping de la página web de Skyscanner
async function scrapeSkyscannerWeb(origin: string, destination: string, startDate: string, endDate: string): Promise<FlightPrice | null> {
  try {
    const url = generateSkyscannerURL(origin, destination, startDate, endDate);
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    const response = await axios.get(url, { headers, timeout: 15000 });
    
    // Buscar precios en el HTML usando regex
    const priceRegex = /€(\d+)/g;
    const prices = [];
    let match;
    
    while ((match = priceRegex.exec(response.data)) !== null) {
      prices.push(parseInt(match[1]));
    }
    
    if (prices.length > 0) {
      const cheapestPrice = Math.min(...prices);
      return {
        price: `€${cheapestPrice}`,
        airline: 'Varias aerolíneas',
        url: url,
        source: 'skyscanner'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error scraping Skyscanner web:', error);
    return null;
  }
}

// Función para scraping de Google Flights (más limitado)
async function scrapeGoogleFlightsReal(origin: string, destination: string, startDate: string, endDate: string): Promise<FlightPrice | null> {
  try {
    const url = generateGoogleFlightsURL(origin, destination, startDate, endDate);
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    const response = await axios.get(url, { headers, timeout: 15000 });
    
    // Google Flights es más difícil de scrapear, así que solo devolvemos el enlace
    return {
      price: 'Ver precios',
      airline: 'Google Flights',
      url: url,
      source: 'google'
    };
  } catch (error) {
    console.error('Error scraping Google Flights:', error);
    return null;
  }
}

// Función principal para obtener precios de vuelos
export async function getFlightPricesReal(
  origin: string, 
  destination: string, 
  startDate: string, 
  endDate: string
): Promise<ScrapedFlightData> {
  try {
    // Ejecutar ambos scrapers en paralelo
    const [skyscannerResult, googleResult] = await Promise.allSettled([
      scrapeSkyscannerReal(origin, destination, startDate, endDate),
      scrapeGoogleFlightsReal(origin, destination, startDate, endDate)
    ]);

    return {
      destination: {
        code: destination,
        name: destination,
        country: 'Unknown'
      },
      skyscanner: skyscannerResult.status === 'fulfilled' ? skyscannerResult.value : null,
      googleFlights: googleResult.status === 'fulfilled' ? googleResult.value : null
    };
  } catch (error) {
    console.error('Error getting flight prices:', error);
    return {
      destination: {
        code: destination,
        name: destination,
        country: 'Unknown'
      },
      skyscanner: null,
      googleFlights: null
    };
  }
}

// Función para obtener precios de múltiples destinos
export async function getMultipleFlightPricesReal(
  origin: string,
  destinations: Array<{ code: string; name: string; country: string }>,
  startDate: string,
  endDate: string
): Promise<ScrapedFlightData[]> {
  const results: ScrapedFlightData[] = [];
  
  for (const destination of destinations) {
    const flightData = await getFlightPricesReal(origin, destination.code, startDate, endDate);
    flightData.destination = destination;
    results.push(flightData);
  }
  
  return results;
} 