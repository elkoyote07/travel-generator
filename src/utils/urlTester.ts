// Función para probar URLs de Skyscanner y Google Flights
export function testURLs(origin: string, destination: string, startDate: string, endDate: string) {
  const skyscannerURL = `https://www.skyscanner.es/transport/flights/${origin}/${destination}/${startDate}/${endDate}/`;
  const googleFlightsURL = `https://www.google.com/travel/flights?hl=es&f=0&t=0&q=Flights%20from%20${origin}%20to%20${destination}`;
  
  console.log('URLs generadas:');
  console.log('Skyscanner:', skyscannerURL);
  console.log('Google Flights:', googleFlightsURL);
  
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