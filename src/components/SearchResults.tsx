'use client';

import { Plane, ExternalLink, Euro, Calendar, MapPin } from 'lucide-react';

interface FlightPrice {
  price: string;
  airline?: string;
  url: string;
  source: string;
}

interface ScrapedFlightData {
  destination: {
    code: string;
    name: string;
    country: string;
  };
  skyscanner: FlightPrice | null;
  googleFlights: FlightPrice | null;
  kayak: FlightPrice | null;
}

interface SearchResultsProps {
  results: ScrapedFlightData[];
  mode?: string;
  description?: string;
}

export default function SearchResults({ results, mode, description }: SearchResultsProps) {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'aviationstack':
        return '✈️';
      case 'amadeus':
        return '🏢';
      case 'kiwi':
        return '🥝';
      case 'simulated':
        return '🎲';
      default:
        return '🔗';
    }
  };

  const getSourceName = (source: string) => {
    switch (source) {
      case 'aviationstack':
        return 'Aviation Stack';
      case 'amadeus':
        return 'Amadeus';
      case 'kiwi':
        return 'Kiwi.com';
      case 'simulated':
        return 'Simulated';
      default:
        return source;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Search Results
        </h2>
        <p className="text-gray-600">
          Found {results.length} destinations for your search
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{result.destination.code}</h3>
                  <p className="text-blue-100 text-sm">{result.destination.name}</p>
                </div>
                <div className="text-right">
                  <MapPin className="h-5 w-5 inline mr-1" />
                  <span className="text-blue-100 text-sm">{result.destination.country}</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              {result.skyscanner && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSourceIcon(result.skyscanner.source)}</span>
                      <span className="font-semibold text-gray-900">
                        {getSourceName(result.skyscanner.source)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {result.skyscanner.price}
                      </div>
                      {result.skyscanner.airline && (
                        <div className="text-sm text-gray-500">
                          {result.skyscanner.airline}
                        </div>
                      )}
                    </div>
                  </div>
                  <a
                    href={result.skyscanner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Flights</span>
                  </a>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">More options</h4>
                
                {result.googleFlights && (
                  <a
                    href={result.googleFlights.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg flex items-center justify-between transition-colors duration-200"
                  >
                    <span className="flex items-center space-x-2">
                      <span>🔍</span>
                      <span>Google Flights</span>
                    </span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {result.kayak && (
                  <a
                    href={result.kayak.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg flex items-center justify-between transition-colors duration-200"
                  >
                    <span className="flex items-center space-x-2">
                      <span>🛫</span>
                      <span>Kayak</span>
                    </span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                <a
                  href={`https://www.momondo.es/flights/${result.destination.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg flex items-center justify-between transition-colors duration-200"
                >
                  <span className="flex items-center space-x-2">
                    <span>🌍</span>
                    <span>Momondo</span>
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>

                <a
                  href={`https://www.booking.com/flights/index.html?ss=${result.destination.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg flex items-center justify-between transition-colors duration-200"
                >
                  <span className="flex items-center space-x-2">
                    <span>🏨</span>
                    <span>Booking.com</span>
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>

                <a
                  href={`https://www.expedia.es/Flights-Search?destination=${result.destination.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg flex items-center justify-between transition-colors duration-200"
                >
                  <span className="flex items-center space-x-2">
                    <span>✈️</span>
                    <span>Expedia</span>
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mt-6">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Plane className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Information about prices</h3>
            <p className="text-blue-800 text-sm">
              Prices are based on the current mode and description.
            </p>
            {mode && (
              <div className="mt-2 p-2 bg-blue-100 rounded">
                <p className="text-blue-800 text-xs">
                  <strong>Current Mode:</strong> {mode.toUpperCase()} - {description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 