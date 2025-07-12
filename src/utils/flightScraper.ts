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

// Función para simular scraping de Skyscanner (mock por ahora)
async function scrapeSkyscanner(origin: string, destination: string, startDate: string, endDate: string): Promise<FlightPrice | null> {
  try {
    // Simulamos un delay para que parezca que estamos haciendo scraping
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // Mock de precios - en una implementación real aquí harías el scraping
    const mockPrices = [
      { price: '€89', airline: 'Ryanair' },
      { price: '€125', airline: 'Iberia' },
      { price: '€156', airline: 'Air Europa' },
      { price: '€203', airline: 'Vueling' },
      { price: '€89', airline: 'EasyJet' },
    ];
    
    const randomPrice = mockPrices[Math.floor(Math.random() * mockPrices.length)];
    
    return {
      price: randomPrice.price,
      airline: randomPrice.airline,
      url: generateSkyscannerURL(origin, destination, startDate, endDate),
      source: 'skyscanner'
    };
  } catch (error) {
    console.error('Error scraping Skyscanner:', error);
    return null;
  }
}

// Función para simular scraping de Google Flights (mock por ahora)
async function scrapeGoogleFlights(origin: string, destination: string, startDate: string, endDate: string): Promise<FlightPrice | null> {
  try {
    // Simulamos un delay diferente para Google Flights
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
    
    // Mock de precios para Google Flights
    const mockPrices = [
      { price: '€95', airline: 'Vueling' },
      { price: '€112', airline: 'Iberia' },
      { price: '€134', airline: 'Air Europa' },
      { price: '€87', airline: 'Ryanair' },
      { price: '€178', airline: 'British Airways' },
    ];
    
    const randomPrice = mockPrices[Math.floor(Math.random() * mockPrices.length)];
    
    return {
      price: randomPrice.price,
      airline: randomPrice.airline,
      url: generateGoogleFlightsURL(origin, destination, startDate, endDate),
      source: 'google'
    };
  } catch (error) {
    console.error('Error scraping Google Flights:', error);
    return null;
  }
}

// Función principal para obtener precios de vuelos
export async function getFlightPrices(
  origin: string, 
  destination: string, 
  startDate: string, 
  endDate: string
): Promise<ScrapedFlightData> {
  try {
    // Ejecutar ambos scrapers en paralelo
    const [skyscannerResult, googleResult] = await Promise.allSettled([
      scrapeSkyscanner(origin, destination, startDate, endDate),
      scrapeGoogleFlights(origin, destination, startDate, endDate)
    ]);

    return {
      destination: {
        code: destination,
        name: destination, // En una implementación real, obtendrías el nombre del destino
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
export async function getMultipleFlightPrices(
  origin: string,
  destinations: Array<{ code: string; name: string; country: string }>,
  startDate: string,
  endDate: string
): Promise<ScrapedFlightData[]> {
  const results: ScrapedFlightData[] = [];
  
  for (const destination of destinations) {
    const flightData = await getFlightPrices(origin, destination.code, startDate, endDate);
    flightData.destination = destination;
    results.push(flightData);
  }
  
  return results;
} 