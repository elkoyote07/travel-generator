export const FLIGHT_CONFIG = {
  MODE: process.env.FLIGHT_MODE || 'mock',
  APIS: {
    AVIATION_STACK: {
      enabled: process.env.AVIATION_STACK_ENABLED === 'true',
      apiKey: process.env.AVIATION_STACK_API_KEY
    },
    AMADEUS: {
      enabled: process.env.AMADEUS_ENABLED === 'true',
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET
    },
    KIWI: {
      enabled: process.env.KIWI_ENABLED === 'true',
      apiKey: process.env.KIWI_API_KEY
    }
  },
  SCRAPING: {
    enabled: process.env.SCRAPING_ENABLED === 'true',
    timeout: parseInt(process.env.SCRAPING_TIMEOUT || '10000'),
    retries: parseInt(process.env.SCRAPING_RETRIES || '3')
  },
  MOCK: {
    enabled: process.env.MOCK_ENABLED === 'true',
    delay: parseInt(process.env.MOCK_DELAY || '1000')
  }
};

export type FlightMode = 'mock' | 'scraper' | 'apis' | 'hybrid';

export function getCurrentMode(): FlightMode {
  const mode = FLIGHT_CONFIG.MODE.toLowerCase();
  switch (mode) {
    case 'mock':
      return 'mock';
    case 'scraper':
      return 'scraper';
    case 'apis':
      return 'apis';
    case 'hybrid':
      return 'hybrid';
    default:
      return 'mock';
  }
}

export function isModeEnabled(mode: FlightMode): boolean {
  const currentMode = getCurrentMode();
  if (currentMode === 'hybrid') {
    return true;
  }
  return currentMode === mode;
}

export function getLogConfig() {
  return {
    enabled: process.env.LOGGING_ENABLED !== 'false',
    level: process.env.LOG_LEVEL || 'info',
    showUrls: process.env.LOG_SHOW_URLS === 'true',
    showPrices: process.env.LOG_SHOW_PRICES === 'true'
  };
}

export function printCurrentConfig() {
  // Función vacía para mantener compatibilidad
} 