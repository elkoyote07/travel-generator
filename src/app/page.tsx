"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plane, MapPin, Settings, Search, Globe, Calendar } from "lucide-react";
import { generateMultipleDestinations, FlightSearchParams } from "@/utils/flightSearch";

import SearchResults from "@/components/SearchResults";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function Home() {
  const t = useTranslations();
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

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<string>("");
  const [currentDescription, setCurrentDescription] = useState<string>("");

  const handleGenerateTrip = async () => {
    console.log(`\n🎯 [FRONTEND] Iniciando generación de viaje`);
    console.log(`📅 [FRONTEND] Timestamp: ${new Date().toISOString()}`);

    if (!originAirport || !departureDate) {
      console.log(`❌ [FRONTEND] Error: Campos requeridos incompletos`);
      console.log(`   Aeropuerto origen: ${originAirport || "NO DEFINIDO"}`);
      console.log(`   Fecha salida: ${departureDate || "NO DEFINIDA"}`);
      alert(t("error_required"));
      return;
    }

    console.log(`✅ [FRONTEND] Validación de campos exitosa`);
    console.log(`🛫 [FRONTEND] Aeropuerto origen: ${originAirport}`);
    console.log(`📅 [FRONTEND] Fecha salida: ${departureDate}`);
    console.log(`⚙️ [FRONTEND] Configuración:`);
    console.log(`   - Máximo vuelos: ${maxFlights}`);
    console.log(`   - Presupuesto: ${preferences.budget}`);
    console.log(`   - Clima: ${preferences.climate}`);
    console.log(`   - Duración: ${preferences.duration}`);

    setIsLoading(true);

    try {
      // Calcular fecha de regreso basada en la duración seleccionada
      const startDate = new Date(departureDate);
      let endDate = new Date(startDate);

      if (preferences.duration === "7") {
        endDate.setDate(startDate.getDate() + 7);
      } else if (preferences.duration === "14") {
        endDate.setDate(startDate.getDate() + 14);
      } else if (preferences.duration === "21") {
        endDate.setDate(startDate.getDate() + 21);
      } else {
        // Para 'any', usar 7 días por defecto
        endDate.setDate(startDate.getDate() + 7);
      }

      console.log(`📅 [FRONTEND] Fechas calculadas:`);
      console.log(`   - Salida: ${startDate.toISOString().split("T")[0]}`);
      console.log(`   - Regreso: ${endDate.toISOString().split("T")[0]}`);
      console.log(
        `   - Duración: ${Math.round(
          (endDate.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )} días`
      );

      const searchParams: FlightSearchParams = {
        originAirport,
        maxFlights,
        preferences,
        dateRange: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
      };

      console.log(`🎲 [FRONTEND] Generando destinos aleatorios...`);
      // Generar 3 destinos aleatorios
      const destinations = generateMultipleDestinations(searchParams, 3);

      console.log(`🎯 [FRONTEND] Destinos generados:`);
      destinations.forEach((dest, index) => {
        console.log(
          `   ${index + 1}. ${dest.destination.code} (${dest.destination.name}, ${dest.destination.country})`
        );
      });

      console.log(`🌐 [FRONTEND] Enviando petición a API...`);
      // Obtener precios para cada destino usando la API
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
        console.error(
          `❌ [FRONTEND] Error en respuesta de API: ${response.status} ${response.statusText}`
        );
        throw new Error("Error al obtener precios de vuelos");
      }

      console.log(`✅ [FRONTEND] Respuesta de API recibida exitosamente`);
      const data = await response.json();
      const results = data.results;
      const mode = data.mode;
      const description = data.description;

      console.log(`📊 [FRONTEND] Resultados procesados:`);
      console.log(`   - Total destinos: ${results.length}`);
      results.forEach((result: any, index: number) => {
        const price = result.skyscanner?.price || "N/A";
        const airline = result.skyscanner?.airline || "N/A";
        console.log(
          `   ${index + 1}. ${result.destination.code}: ${price} (${airline})`
        );
      });

      setSearchResults(results);
      setCurrentMode(mode || "");
      setCurrentDescription(description || "");
      setShowResults(true);

      // Guardar información del modo para mostrarla en los resultados
      if (mode && description) {
        console.log(
          `🎯 [FRONTEND] Modo utilizado: ${mode.toUpperCase()} - ${description}`
        );
      }
      console.log(`✅ [FRONTEND] Viaje generado exitosamente`);
    } catch (error) {
      console.error(`❌ [FRONTEND] Error generando viaje:`, error);
      alert(t("error_generate"));
    } finally {
      setIsLoading(false);
      console.log(`🏁 [FRONTEND] Proceso completado`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-5 w-5" />
                <span>{t("config")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("discover")}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Settings */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("origin_airport")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={originAirport}
                    onChange={(e) => setOriginAirport(e.target.value.toUpperCase())}
                    placeholder="Ej: MAD, BCN, AGP..."
                    maxLength={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase tracking-wider"
                  />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-2">{t("popular_airports")}</p>
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
                  {t("max_flights")}
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
                  <span>1 vuelo</span>
                  <span>5 vuelos</span>
                </div>
              </div>
            </div>

            {/* Right Column - Preferences */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("budget")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["low", "medium", "high"].map((budget) => (
                    <button
                      key={budget}
                      onClick={() => setPreferences({ ...preferences, budget })}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        preferences.budget === budget
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {budget === "low" && t("budget_low")}
                      {budget === "medium" && t("budget_medium")}
                      {budget === "high" && t("budget_high")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("preferred_climate")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "any", label: t("climate_any") },
                    { value: "warm", label: t("climate_warm") },
                    { value: "cold", label: t("climate_cold") },
                    { value: "tropical", label: t("climate_tropical") },
                  ].map((climate) => (
                    <button
                      key={climate.value}
                      onClick={() => setPreferences({ ...preferences, climate: climate.value })}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        preferences.climate === climate.value
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {climate.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("trip_duration")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["7", "14", "21"].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setPreferences({ ...preferences, duration })}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        preferences.duration === duration
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {duration === "7" && t("duration_7")}
                      {duration === "14" && t("duration_14")}
                      {duration === "21" && t("duration_21")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("departure_date")}
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleGenerateTrip}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-xl text-lg shadow-lg transition-colors duration-200"
            >
              {isLoading ? t("loading") : t("generate_trip")}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <SearchResults
            results={searchResults}
            mode={currentMode}
            description={currentDescription}
          />
        )}
      </main>
    </div>
  );
}
