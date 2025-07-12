// Función para probar URLs de Skyscanner y Google Flights
export function testURLs() {
  const origin = 'MAD';
  const destination = 'BCN';
  const startDate = '2024-03-15';
  const endDate = '2024-03-20';

  const skyscannerURL = `https://www.skyscanner.es/transport/flights/${origin}/${destination}/${startDate}/${endDate}/?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&ref=home`;
  const googleFlightsURL = `https://www.google.com/travel/flights?hl=es&tfs=${origin}_${destination}_${startDate}&tfs=${destination}_${origin}_${endDate}&curr=EUR`;

  return {
    skyscanner: skyscannerURL,
    googleFlights: googleFlightsURL
  };
}

// Función para generar URLs alternativas más robustas
export function generateAlternativeURLs(origin: string, destination: string, startDate: string, endDate: string) {
  // URL alternativa para Skyscanner (más simple)
  const skyscannerSimple = `https://www.skyscanner.es/transport/flights/${origin}/${destination}/`;
  
  // URL alternativa para Google Flights (más directa)
  const googleFlightsSimple = `https://www.google.com/travel/flights?hl=es&q=${origin}%20to%20${destination}`;
  
  // URL de Kayak como alternativa
  const kayakURL = `https://www.kayak.es/flights/${origin}-${destination}/${startDate}/${endDate}`;
  
  return {
    skyscanner: skyscannerSimple,
    googleFlights: googleFlightsSimple,
    kayak: kayakURL
  };
} 