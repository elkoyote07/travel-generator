"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, MapPin, Settings, AlertCircle } from "lucide-react";
import { generateMultipleDestinations, FlightSearchParams } from "@/utils/flightSearch";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function Home() {
  const router = useRouter();
  const [originAirport, setOriginAirport] = useState("");
  const [maxFlights, setMaxFlights] = useState(2);
  const [preferences, setPreferences] = useState({
    budget: "medium",
    climate: "any",
    duration: "any",
  });
  const [departureDate, setDepartureDate] = useState("");

  const airports = [
    { code: "MAD", name: "Madrid Barajas", city: "Madrid" },
    { code: "BCN", name: "Barcelona El Prat", city: "Barcelona" },
    { code: "AGP", name: "Málaga Costa del Sol", city: "Málaga" },
    { code: "PMI", name: "Palma de Mallorca", city: "Palma" },
    { code: "ALC", name: "Alicante Elche", city: "Alicante" },
    { code: "IBZ", name: "Ibiza", city: "Ibiza" },
    { code: "VLC", name: "Valencia", city: "Valencia" },
    { code: "SVQ", name: "Sevilla", city: "Sevilla" },
    { code: "TFN", name: "Tenerife Norte", city: "Tenerife" },
    { code: "LPA", name: "Gran Canaria", city: "Las Palmas" },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleGenerateTrip = async () => {
    if (!originAirport || !departureDate) {
      setErrorMessage("Please fill in the origin airport and departure date");
      return;
    }

    setIsLoading(true);

    try {
      const startDate = new Date(departureDate);
      let endDate = new Date(startDate);

      if (preferences.duration === "7") {
        endDate.setDate(startDate.getDate() + 7);
      } else if (preferences.duration === "14") {
        endDate.setDate(startDate.getDate() + 14);
      } else if (preferences.duration === "21") {
        endDate.setDate(startDate.getDate() + 21);
      } else {
        endDate.setDate(startDate.getDate() + 7);
      }

      const searchParams: FlightSearchParams = {
        originAirport,
        maxFlights,
        preferences,
        dateRange: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
      };

      const destinations = generateMultipleDestinations(searchParams, 3);
      const response = await fetch("/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: originAirport,
          destinations: destinations.map((d) => d.destination),
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        throw new Error("Error fetching flight prices");
      }

      const data = await response.json();
      const results = data.results;
      const mode = data.mode;
      const description = data.description;

      // Navigate to results page with data
      const resultsParam = encodeURIComponent(JSON.stringify(results));
      const modeParam = mode || "";
      const descriptionParam = description || "";
      
      router.push(`/results?results=${resultsParam}&mode=${modeParam}&description=${descriptionParam}`);
    } catch (error) {
      setErrorMessage("Error generating trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Travel Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-5 w-5" />
                <span>Config</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your next adventure
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin airport
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={originAirport}
                    onChange={(e) => setOriginAirport(e.target.value.toUpperCase())}
                    placeholder="E.g.: MAD, BCN, AGP..."
                    maxLength={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase tracking-wider"
                  />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-2">Popular airports:</p>
                  <div className="flex flex-wrap gap-2">
                    {airports.map((airport) => (
                      <button
                        key={airport.code}
                        onClick={() => setOriginAirport(airport.code)}
                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                          originAirport === airport.code
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {airport.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max flights
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={maxFlights}
                    onChange={(e) => setMaxFlights(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                    {maxFlights}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 flight</span>
                  <span>5 flights</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["low", "medium", "high"].map((budget) => (
                    <button
                      key={budget}
                      onClick={() => setPreferences((p) => ({ ...p, budget }))}
                      className={`py-3 px-4 rounded-lg border transition-colors ${
                        preferences.budget === budget
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {budget.charAt(0).toUpperCase() + budget.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Climate
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["any", "warm", "cold"].map((climate) => (
                    <button
                      key={climate}
                      onClick={() => setPreferences((p) => ({ ...p, climate }))}
                      className={`py-3 px-4 rounded-lg border transition-colors ${
                        preferences.climate === climate
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {climate.charAt(0).toUpperCase() + climate.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["any", "7", "14", "21"].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setPreferences((p) => ({ ...p, duration }))}
                      className={`py-3 px-4 rounded-lg border transition-colors ${
                        preferences.duration === duration
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {duration === "any" ? "Any" : `${duration} days`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure date
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-end space-y-4">
            {errorMessage && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}
            <button
              onClick={handleGenerateTrip}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Search
            </button>
          </div>
        </div>

        {isLoading && <LoadingAnimation isVisible={isLoading} />}
      </main>
    </div>
  );
}
