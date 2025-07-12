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
      console.log(`⚠️ [CONFIG] Modo '${mode}' no reconocido, usando 'mock' por defecto`);
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
  const mode = getCurrentMode();
  const logConfig = getLogConfig();
  console.log(`\n⚙️ [CONFIG] Configuración actual:`);
  console.log(`   🎯 Modo principal: ${mode.toUpperCase()}`);
  console.log(`   📝 Logging: ${logConfig.enabled ? 'HABILITADO' : 'DESHABILITADO'}`);
  console.log(`   🔗 URLs en logs: ${logConfig.showUrls ? 'SÍ' : 'NO'}`);
  console.log(`   💰 Precios en logs: ${logConfig.showPrices ? 'SÍ' : 'NO'}`);
  if (mode === 'apis' || mode === 'hybrid') {
    console.log(`   🔌 APIs configuradas:`);
    console.log(`      - Aviation Stack: ${FLIGHT_CONFIG.APIS.AVIATION_STACK.enabled ? '✅' : '❌'}`);
    console.log(`      - Amadeus: ${FLIGHT_CONFIG.APIS.AMADEUS.enabled ? '✅' : '❌'}`);
    console.log(`      - Kiwi: ${FLIGHT_CONFIG.APIS.KIWI.enabled ? '✅' : '❌'}`);
  }
  if (mode === 'scraper' || mode === 'hybrid') {
    console.log(`   🕷️ Scraping: ${FLIGHT_CONFIG.SCRAPING.enabled ? '✅' : '❌'}`);
  }
  if (mode === 'mock' || mode === 'hybrid') {
    console.log(`   🎲 Mock: ${FLIGHT_CONFIG.MOCK.enabled ? '✅' : '❌'}`);
  }
  console.log('');
} 