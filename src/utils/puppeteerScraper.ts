import puppeteer from 'puppeteer';

export interface FlightPrice {
  price: string;
  airline?: string;
  url: string;
  source: 'skyscanner' | 'google';
}

// Función para generar URL de Skyscanner
function generateSkyscannerURL(origin: string, destination: string, startDate: string, endDate: string): string {
  return `https://www.skyscanner.es/transport/flights/${origin}/${destination}/${startDate}/${endDate}/`;
}

// Función para scraping con Puppeteer (más robusto pero más lento)
export async function scrapeSkyscannerWithPuppeteer(
  origin: string, 
  destination: string, 
  startDate: string, 
  endDate: string
): Promise<FlightPrice | null> {
  let browser;
  
  try {
    // Lanzar el navegador
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Configurar el viewport y user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const url = generateSkyscannerURL(origin, destination, startDate, endDate);
    
    // Navegar a la página
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Esperar a que carguen los precios
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Intentar extraer precios usando diferentes selectores
    const priceSelectors = [
      '[data-testid="price"]',
      '.price',
      '.Price',
      '[class*="price"]',
      '[class*="Price"]',
      'span[class*="price"]',
      'div[class*="price"]'
    ];
    
    let prices: string[] = [];
    
    for (const selector of priceSelectors) {
      try {
        const elements = await page.$$(selector);
        for (const element of elements) {
          const text = await element.evaluate(el => el.textContent);
          if (text && text.includes('€')) {
            prices.push(text.trim());
          }
        }
      } catch (error) {
        // Continuar con el siguiente selector
        continue;
      }
    }
    
    // Si no encontramos precios con selectores específicos, buscar en todo el texto
    if (prices.length === 0) {
      const pageContent = await page.content();
      const priceRegex = /€(\d+)/g;
      const matches = pageContent.match(priceRegex);
      if (matches) {
        prices = matches;
      }
    }
    
    if (prices.length > 0) {
      // Extraer el precio más bajo
      const numericPrices = prices
        .map(p => parseInt(p.replace(/[^\d]/g, '')))
        .filter(p => !isNaN(p) && p > 0);
      
      if (numericPrices.length > 0) {
        const cheapestPrice = Math.min(...numericPrices);
        return {
          price: `€${cheapestPrice}`,
          airline: 'Varias aerolíneas',
          url: url,
          source: 'skyscanner'
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error scraping with Puppeteer:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Función para obtener precios de múltiples destinos con Puppeteer
export async function getMultipleFlightPricesWithPuppeteer(
  origin: string,
  destinations: Array<{ code: string; name: string; country: string }>,
  startDate: string,
  endDate: string
): Promise<any[]> {
  const results = [];
  
  for (const destination of destinations) {
    const flightData = await scrapeSkyscannerWithPuppeteer(origin, destination.code, startDate, endDate);
    
    results.push({
      destination,
      skyscanner: flightData,
      googleFlights: {
        price: 'Ver precios',
        airline: 'Google Flights',
        url: `https://www.google.com/travel/flights?hl=es&tfs=${origin}_${destination.code}_${startDate.replace(/-/g, '')}&tfs=${destination.code}_${origin}_${endDate.replace(/-/g, '')}`,
        source: 'google'
      }
    });
  }
  
  return results;
} 