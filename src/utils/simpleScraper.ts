export interface FlightPrice {
  price: string;
  airline?: string;
  url: string;
  source: 'skyscanner' | 'google' | 'kayak';
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

// Función para generar URL de Skyscanner
function generateSkyscannerURL(origin: string, destination: string, startDate: string, endDate: string): string {
  // URL más simple y directa para Skyscanner
  const url = `https://www.skyscanner.es/transport/flights/${origin}/${destination}/${startDate}/${endDate}/`;
  return url;
}

// Función para generar URL de Google Flights
function generateGoogleFlightsURL(origin: string, destination: string, startDate: string, endDate: string): string {
  // URL más simple para Google Flights usando parámetros básicos
  const url = `https://www.google.com/travel/flights?hl=es&f=0&t=0&q=Flights%20from%20${origin}%20to%20${destination}`;
  return url;
}

// Función para generar URL de Kayak
function generateKayakURL(origin: string, destination: string, startDate: string, endDate: string): string {
  const url = `https://www.kayak.es/flights/${origin}-${destination}/${startDate}/${endDate}`;
  return url;
}

// Función para generar precios simulados pero realistas
function generateRealisticPrice(destination: string, origin: string, startDate: string, endDate: string): FlightPrice {
  // Precios base por región
  const basePrices: { [key: string]: number } = {
    // Europa
    'LHR': 120, 'CDG': 95, 'FCO': 110, 'AMS': 105, 'BER': 115,
    'VIE': 130, 'PRG': 125, 'BUD': 140, 'CPH': 135, 'ARN': 145,
    'ZRH': 150, 'BCN': 85, 'IST': 160, 'DUB': 125, 'GVA': 155,
    'SVO': 180, 'RIX': 165, 'EDI': 130,
    
    // Asia
    'DXB': 350, 'BKK': 450, 'SIN': 480, 'KUL': 420, 'HKT': 470,
    'MLE': 520, 'CMB': 380, 'DOH': 360, 'MCT': 340, 'CAI': 280,
    'AUH': 370, 'JED': 320, 'CMN': 180,
    
    // América
    'MIA': 280, 'CUN': 220, 'PUJ': 240, 'HAV': 260, 'GCM': 290,
    'NAS': 310, 'BGI': 330, 'SJU': 270, 'PTY': 320, 'MRU': 580,
    'SEZ': 620, 'HNL': 380,
    
    // China
    'PEK': 420, 'PKX': 420, 'PVG': 440, 'SHA': 440, 'CAN': 400,
    'SZX': 410, 'CTU': 430, 'CKG': 450, 'XIY': 460, 'HGH': 420,
    'KMG': 470, 'HAK': 480, 'CSX': 450, 'DLC': 460, 'TSN': 430,
    
    // Otros
    'JFK': 320, 'LAX': 380, 'ORD': 340, 'NRT': 520, 'HND': 520,
    'ICN': 480, 'SYD': 580, 'MEL': 590, 'AKL': 620, 'CPT': 420,
    'GRU': 440, 'EZE': 460, 'JNB': 380, 'DEL': 360, 'MEX': 240,
    'SFO': 400, 'YYZ': 350
  };

  // Obtener precio base o usar uno por defecto
  const basePrice = basePrices[destination] || 200;
  
  // Añadir variabilidad (±20%)
  const variation = (Math.random() - 0.5) * 0.4; // ±20%
  const finalPrice = Math.round(basePrice * (1 + variation));
  
  // Aerolíneas comunes
  const airlines = ['Iberia', 'Ryanair', 'Vueling', 'Air Europa', 'British Airways', 'Lufthansa', 'Air France'];
  const randomAirline = airlines[Math.floor(Math.random() * airlines.length)];

  const result = {
    price: `€${finalPrice}`,
    airline: randomAirline,
    url: generateSkyscannerURL(origin, destination, startDate, endDate),
    source: 'skyscanner' as const
  };

  return result;
}

// Función principal para obtener precios de vuelos
export async function getFlightPricesSimple(
  origin: string, 
  destination: string, 
  startDate: string, 
  endDate: string
): Promise<ScrapedFlightData> {
  try {
    // Simular delay realista
    const delay = 1000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const skyscannerPrice = generateRealisticPrice(destination, origin, startDate, endDate);
    
    const googleFlightsPrice = {
      price: 'Ver precios',
      airline: 'Google Flights',
      url: generateGoogleFlightsURL(origin, destination, startDate, endDate),
      source: 'google' as const
    };

    const kayakPrice = {
      price: 'Ver precios',
      airline: 'Kayak',
      url: generateKayakURL(origin, destination, startDate, endDate),
      source: 'kayak' as const
    };

    const result = {
      destination: {
        code: destination,
        name: destination,
        country: 'Unknown'
      },
      skyscanner: skyscannerPrice,
      googleFlights: googleFlightsPrice,
      kayak: kayakPrice
    };
    
    return result;
  } catch (error) {
    return {
      destination: {
        code: destination,
        name: destination,
        country: 'Unknown'
      },
      skyscanner: null,
      googleFlights: null,
      kayak: null
    };
  }
}

// Función para obtener precios de múltiples destinos
export async function getMultipleFlightPricesSimple(
  origin: string,
  destinations: Array<{ code: string; name: string; country: string }>,
  startDate: string,
  endDate: string
): Promise<ScrapedFlightData[]> {
  const results: ScrapedFlightData[] = [];
  
  for (let i = 0; i < destinations.length; i++) {
    const destination = destinations[i];
    
    const flightData = await getFlightPricesSimple(origin, destination.code, startDate, endDate);
    flightData.destination = destination;
    results.push(flightData);
  }
  
  return results;
} 