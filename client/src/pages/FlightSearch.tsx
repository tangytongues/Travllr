import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Flight } from "@shared/schema";
import FlightSearchForm from "@/components/FlightSearchForm";
import FlightCard from "@/components/FlightCard";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function FlightSearch() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState({
    departure: "",
    arrival: "",
    date: new Date().toISOString().split('T')[0],
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFlights, setSelectedFlights] = useLocalStorage<Flight[]>("selectedFlights", []);
  
  // Fetch flight search results
  const { data: flights, isLoading, error } = useQuery<Flight[]>({
    queryKey: ['/api/flights/search', searchParams.departure, searchParams.arrival, searchParams.date],
    enabled: hasSearched && !!searchParams.departure && !!searchParams.arrival && !!searchParams.date,
  });

  const handleSearch = (formData: { departure: string; arrival: string; date: string }) => {
    setSearchParams(formData);
    setHasSearched(true);
  };

  const handleSelectFlight = (flight: Flight) => {
    // Check if flight is already selected
    const isAlreadySelected = selectedFlights.some(f => f.id === flight.id);
    
    if (isAlreadySelected) {
      // Remove from selection
      setSelectedFlights(selectedFlights.filter(f => f.id !== flight.id));
      toast({
        title: "Flight Removed",
        description: "Flight has been removed from your itinerary.",
      });
    } else {
      // Add to selection
      setSelectedFlights([...selectedFlights, flight]);
      toast({
        title: "Flight Added",
        description: "Flight has been added to your itinerary.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/itinerary" className="inline-flex items-center text-primary hover:underline mb-2">
          <ArrowLeftCircle className="mr-2 h-4 w-4" />
          Back to Itinerary
        </Link>
        <h1 className="text-3xl font-bold">Flight Search</h1>
        <p className="text-gray-600 mt-1">Search and select flights for your itinerary</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <FlightSearchForm onSearch={handleSearch} />
              
              {selectedFlights.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-3">Selected Flights ({selectedFlights.length})</h3>
                  <div className="space-y-3">
                    {selectedFlights.map((flight) => (
                      <div key={flight.id} className="flex items-center justify-between p-3 bg-primary/5 rounded-md">
                        <div>
                          <p className="font-medium">{flight.departureCity} to {flight.arrivalCity}</p>
                          <p className="text-sm text-gray-500">${flight.price}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleSelectFlight(flight)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4" asChild>
                    <Link href="/itinerary">
                      Continue with Selected Flights
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Flight Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Flight Results</h2>
              
              {!hasSearched ? (
                <div className="text-center py-12 border border-dashed rounded-md">
                  <p className="text-gray-500">Search for flights to see results</p>
                </div>
              ) : isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  <p>Failed to load flight results. Please try again.</p>
                </div>
              ) : flights && flights.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 mb-2">
                    Found {flights.length} flights from {searchParams.departure} to {searchParams.arrival} on {searchParams.date}
                  </div>
                  
                  {flights.map((flight) => (
                    <FlightCard 
                      key={flight.id} 
                      flight={flight}
                      isSelected={selectedFlights.some(f => f.id === flight.id)}
                      onSelect={() => handleSelectFlight(flight)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-md">
                  <p className="text-gray-500">No flights found for this route and date</p>
                  <p className="text-sm text-gray-400 mt-2">Try different destinations or dates</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
