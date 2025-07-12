// Configuración para elegir qué scraper usar
export const SCRAPER_CONFIG = {
  // Usar scraper real (axios) por defecto
  useRealScraper: true,
  
  // Usar Puppeteer como respaldo si el real falla
  usePuppeteerAsBackup: true,
  
  // Tiempo de espera máximo para cada scraper (en ms)
  timeout: {
    axios: 15000,
    puppeteer: 30000
  },
  
  // Número máximo de intentos por destino
  maxRetries: 2,
  
  // Delay entre peticiones para evitar rate limiting
  delayBetweenRequests: 1000
};

// Función para obtener el scraper apropiado
export function getScraperFunction() {
  if (SCRAPER_CONFIG.useRealScraper) {
    return 'real';
  } else {
    return 'puppeteer';
  }
}

// Función para verificar si debemos usar Puppeteer como respaldo
export function shouldUsePuppeteerBackup() {
  return SCRAPER_CONFIG.usePuppeteerAsBackup;
} 