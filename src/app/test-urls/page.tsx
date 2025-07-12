'use client';

import { testURLs, generateAlternativeURLs } from '@/utils/urlTester';

export default function TestURLs() {
  const origin = 'MAD';
  const destination = 'BCN';
  const startDate = '2024-03-15';
  const endDate = '2024-03-22';

  const urls = testURLs(origin, destination, startDate, endDate);
  const alternativeUrls = generateAlternativeURLs(origin, destination, startDate, endDate);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Prueba de URLs</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* URLs Originales */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">URLs Originales</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Skyscanner</h3>
                <a 
                  href={urls.skyscanner} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {urls.skyscanner}
                </a>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Google Flights</h3>
                <a 
                  href={urls.googleFlights} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {urls.googleFlights}
                </a>
              </div>
            </div>
          </div>

          {/* URLs Alternativas */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">URLs Alternativas</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Skyscanner (Simple)</h3>
                <a 
                  href={alternativeUrls.skyscanner} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {alternativeUrls.skyscanner}
                </a>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Google Flights (Simple)</h3>
                <a 
                  href={alternativeUrls.googleFlights} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {alternativeUrls.googleFlights}
                </a>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Kayak</h3>
                <a 
                  href={alternativeUrls.kayak} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {alternativeUrls.kayak}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Instrucciones de Prueba</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Haz clic en cada enlace para verificar que funcionan</li>
            <li>Verifica que las páginas se abren correctamente</li>
            <li>Comprueba que los parámetros de búsqueda se aplican</li>
            <li>Si alguna URL no funciona, usaremos las alternativas</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 