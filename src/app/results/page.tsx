"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Plane, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SearchResults from "@/components/SearchResults";

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

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<ScrapedFlightData[]>([]);
  const [mode, setMode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resultsData = searchParams.get("results");
    const modeData = searchParams.get("mode");
    const descriptionData = searchParams.get("description");

    if (resultsData) {
      try {
        const parsedResults = JSON.parse(decodeURIComponent(resultsData));
        setResults(parsedResults);
        setMode(modeData || "");
        setDescription(descriptionData || "");
      } catch (error) {
        console.error("Error parsing results:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Search</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {results.length > 0 ? (
          <SearchResults
            results={results}
            mode={mode}
            description={description}
          />
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any destinations matching your search criteria.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Another Search
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 