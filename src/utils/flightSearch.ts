export interface FlightSearchParams {
  originAirport: string;
  maxFlights: number;
  preferences: {
    budget: string;
    climate: string;
    duration: string;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

// Lista de destinos populares por región/clima
const destinations = {
  europe: [
    { code: 'LHR', name: 'Londres Heathrow', country: 'Reino Unido' },
    { code: 'CDG', name: 'París Charles de Gaulle', country: 'Francia' },
    { code: 'FCO', name: 'Roma Fiumicino', country: 'Italia' },
    { code: 'AMS', name: 'Ámsterdam Schiphol', country: 'Países Bajos' },
    { code: 'BER', name: 'Berlín Brandenburg', country: 'Alemania' },
    { code: 'VIE', name: 'Viena Schwechat', country: 'Austria' },
    { code: 'PRG', name: 'Praga Václav Havel', country: 'República Checa' },
    { code: 'BUD', name: 'Budapest Ferenc Liszt', country: 'Hungría' },
    { code: 'CPH', name: 'Copenhague Kastrup', country: 'Dinamarca' },
    { code: 'ARN', name: 'Estocolmo Arlanda', country: 'Suecia' },
    { code: 'FRA', name: 'Frankfurt', country: 'Alemania' },
    { code: 'ZRH', name: 'Zúrich', country: 'Suiza' },
    { code: 'BCN', name: 'Barcelona El Prat', country: 'España' },
    { code: 'IST', name: 'Estambul', country: 'Turquía' },
    { code: 'DUB', name: 'Dublín', country: 'Irlanda' },
    { code: 'GVA', name: 'Ginebra', country: 'Suiza' },
    { code: 'SVO', name: 'Moscú Sheremétievo', country: 'Rusia' },
    { code: 'RIX', name: 'Riga', country: 'Letonia' },
    { code: 'EDI', name: 'Edimburgo', country: 'Reino Unido' },
  ],
  warm: [
    { code: 'DXB', name: 'Dubái Internacional', country: 'Emiratos Árabes Unidos' },
    { code: 'BKK', name: 'Bangkok Suvarnabhumi', country: 'Tailandia' },
    { code: 'SIN', name: 'Singapur Changi', country: 'Singapur' },
    { code: 'KUL', name: 'Kuala Lumpur Internacional', country: 'Malasia' },
    { code: 'HKT', name: 'Phuket Internacional', country: 'Tailandia' },
    { code: 'MLE', name: 'Malé Velana', country: 'Maldivas' },
    { code: 'CMB', name: 'Colombo Bandaranaike', country: 'Sri Lanka' },
    { code: 'DOH', name: 'Doha Hamad', country: 'Catar' },
    { code: 'MCT', name: 'Mascate', country: 'Omán' },
    { code: 'CAI', name: 'El Cairo', country: 'Egipto' },
    { code: 'AUH', name: 'Abu Dabi', country: 'Emiratos Árabes Unidos' },
    { code: 'JED', name: 'Yeda', country: 'Arabia Saudita' },
    { code: 'CMN', name: 'Casablanca', country: 'Marruecos' },
    { code: 'CAN', name: 'Cantón Baiyun', country: 'China' },
    { code: 'SZX', name: 'Shenzhen Bao\'an', country: 'China' },
    { code: 'KMG', name: 'Kunming Changshui', country: 'China' },
    { code: 'HAK', name: 'Haikou Meilan', country: 'China' },
  ],
  tropical: [
    { code: 'MIA', name: 'Miami Internacional', country: 'Estados Unidos' },
    { code: 'CUN', name: 'Cancún Internacional', country: 'México' },
    { code: 'PUJ', name: 'Punta Cana Internacional', country: 'República Dominicana' },
    { code: 'HAV', name: 'La Habana José Martí', country: 'Cuba' },
    { code: 'GCM', name: 'Gran Caimán Owen Roberts', country: 'Islas Caimán' },
    { code: 'NAS', name: 'Nassau Lynden Pindling', country: 'Bahamas' },
    { code: 'BGI', name: 'Bridgetown Grantley Adams', country: 'Barbados' },
    { code: 'SJU', name: 'San Juan Luis Muñoz Marín', country: 'Puerto Rico' },
    { code: 'PTY', name: 'Panamá Tocumen', country: 'Panamá' },
    { code: 'MRU', name: 'Mauricio Sir Seewoosagur Ramgoolam', country: 'Mauricio' },
    { code: 'SEZ', name: 'Seychelles', country: 'Seychelles' },
    { code: 'BKK', name: 'Bangkok Suvarnabhumi', country: 'Tailandia' },
    { code: 'HNL', name: 'Honolulu', country: 'Estados Unidos' },
  ],
  cold: [
    { code: 'YOW', name: 'Ottawa Macdonald-Cartier', country: 'Canadá' },
    { code: 'YVR', name: 'Vancouver Internacional', country: 'Canadá' },
    { code: 'YYZ', name: 'Toronto Pearson', country: 'Canadá' },
    { code: 'HEL', name: 'Helsinki Vantaa', country: 'Finlandia' },
    { code: 'OSL', name: 'Oslo Gardermoen', country: 'Noruega' },
    { code: 'KEF', name: 'Reikiavik Keflavík', country: 'Islandia' },
    { code: 'TLL', name: 'Tallin Lennart Meri', country: 'Estonia' },
    { code: 'SVO', name: 'Moscú Sheremétievo', country: 'Rusia' },
    { code: 'RIX', name: 'Riga', country: 'Letonia' },
    { code: 'EDI', name: 'Edimburgo', country: 'Reino Unido' },
    { code: 'GVA', name: 'Ginebra', country: 'Suiza' },
    { code: 'MUC', name: 'Múnich', country: 'Alemania' },
    { code: 'LED', name: 'San Petersburgo Púlkovo', country: 'Rusia' },
    { code: 'PEK', name: 'Beijing Capital', country: 'China' },
    { code: 'PKX', name: 'Beijing Daxing', country: 'China' },
    { code: 'TSN', name: 'Tianjin Binhai', country: 'China' },
    { code: 'DLC', name: 'Dalian Zhoushuizi', country: 'China' },
  ],
  any: [
    { code: 'JFK', name: 'Nueva York JFK', country: 'Estados Unidos' },
    { code: 'LAX', name: 'Los Ángeles Internacional', country: 'Estados Unidos' },
    { code: 'ORD', name: 'Chicago O\'Hare', country: 'Estados Unidos' },
    { code: 'NRT', name: 'Tokio Narita', country: 'Japón' },
    { code: 'HND', name: 'Tokio Haneda', country: 'Japón' },
    { code: 'ICN', name: 'Seúl Incheon', country: 'Corea del Sur' },
    { code: 'SYD', name: 'Sídney Kingsford Smith', country: 'Australia' },
    { code: 'MEL', name: 'Melbourne Tullamarine', country: 'Australia' },
    { code: 'AKL', name: 'Auckland Internacional', country: 'Nueva Zelanda' },
    { code: 'CPT', name: 'Ciudad del Cabo Internacional', country: 'Sudáfrica' },
    { code: 'GRU', name: 'São Paulo Guarulhos', country: 'Brasil' },
    { code: 'EZE', name: 'Buenos Aires Ezeiza', country: 'Argentina' },
    { code: 'JNB', name: 'Johannesburgo OR Tambo', country: 'Sudáfrica' },
    { code: 'DEL', name: 'Delhi Indira Gandhi', country: 'India' },
    { code: 'BKK', name: 'Bangkok Suvarnabhumi', country: 'Tailandia' },
    { code: 'DXB', name: 'Dubái Internacional', country: 'Emiratos Árabes Unidos' },
    { code: 'MEX', name: 'Ciudad de México', country: 'México' },
    { code: 'SFO', name: 'San Francisco', country: 'Estados Unidos' },
    { code: 'YYZ', name: 'Toronto Pearson', country: 'Canadá' },
    { code: 'PVG', name: 'Shanghái Pudong', country: 'China' },
    { code: 'SHA', name: 'Shanghái Hongqiao', country: 'China' },
    { code: 'CAN', name: 'Cantón Baiyun', country: 'China' },
    { code: 'SZX', name: 'Shenzhen Bao\'an', country: 'China' },
    { code: 'CTU', name: 'Chengdu Shuangliu', country: 'China' },
    { code: 'CKG', name: 'Chongqing Jiangbei', country: 'China' },
    { code: 'XIY', name: 'Xi\'an Xianyang', country: 'China' },
    { code: 'HGH', name: 'Hangzhou Xiaoshan', country: 'China' },
    { code: 'KMG', name: 'Kunming Changshui', country: 'China' },
    { code: 'HAK', name: 'Haikou Meilan', country: 'China' },
    { code: 'CSX', name: 'Changsha Huanghua', country: 'China' },
    { code: 'DLC', name: 'Dalian Zhoushuizi', country: 'China' },
    { code: 'TSN', name: 'Tianjin Binhai', country: 'China' },
  ],
};

// Función para generar URL de Skyscanner
export function generateSkyscannerURL(params: FlightSearchParams, destinationCode: string): string {
  const { originAirport, dateRange } = params;
  
  // Formatear fechas para Skyscanner (YYYY-MM-DD)
  const outboundDate = dateRange.startDate;
  const returnDate = dateRange.endDate;
  
  // URL base de Skyscanner
  const baseURL = 'https://www.skyscanner.es/transport/flights';
  
  // Construir la URL
  const url = `${baseURL}/${originAirport}/${destinationCode}/${outboundDate}/${returnDate}/`;
  
  return url;
}

// Función para seleccionar destino aleatorio basado en preferencias
export function getRandomDestination(params: FlightSearchParams): { code: string; name: string; country: string } {
  const { preferences } = params;
  
  let destinationPool: typeof destinations.europe;
  
  // Seleccionar pool de destinos basado en preferencias de clima
  switch (preferences.climate) {
    case 'warm':
      destinationPool = destinations.warm;
      break;
    case 'tropical':
      destinationPool = destinations.tropical;
      break;
    case 'cold':
      destinationPool = destinations.cold;
      break;
    case 'any':
    default:
      destinationPool = destinations.any;
      break;
  }
  
  // Seleccionar destino aleatorio
  const randomIndex = Math.floor(Math.random() * destinationPool.length);
  return destinationPool[randomIndex];
}

// Función para generar múltiples opciones de destinos
export function generateMultipleDestinations(params: FlightSearchParams, count: number = 3): Array<{
  destination: { code: string; name: string; country: string };
  skyscannerURL: string;
}> {
  const results = [];
  const usedDestinations = new Set();
  
  for (let i = 0; i < count; i++) {
    let destination;
    let attempts = 0;
    
    // Evitar duplicados
    do {
      destination = getRandomDestination(params);
      attempts++;
    } while (usedDestinations.has(destination.code) && attempts < 20);
    
    if (attempts < 20) {
      usedDestinations.add(destination.code);
      const skyscannerURL = generateSkyscannerURL(params, destination.code);
      
      results.push({
        destination,
        skyscannerURL
      });
    }
  }
  
  return results;
} 