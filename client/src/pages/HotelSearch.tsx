import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Hotel } from "@shared/schema";
import HotelSearchForm from "@/components/HotelSearchForm";
import HotelCard from "@/components/HotelCard";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function HotelSearch() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState({
    city: "",
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedHotels, setSelectedHotels] = useLocalStorage<Hotel[]>("selectedHotels", []);
  
  // Fetch hotel search results
  const { data: hotels, isLoading, error } = useQuery<Hotel[]>({
    queryKey: ['/api/hotels/search', searchParams.city, searchParams.checkIn, searchParams.checkOut],
    enabled: hasSearched && !!searchParams.city && !!searchParams.checkIn && !!searchParams.checkOut,
  });

  const handleSearch = (formData: { city: string; checkIn: string; checkOut: string }) => {
    setSearchParams(formData);
    setHasSearched(true);
  };

  const handleSelectHotel = (hotel: Hotel) => {
    // Check if hotel is already selected
    const isAlreadySelected = selectedHotels.some(h => h.id === hotel.id);
    
    if (isAlreadySelected) {
      // Remove from selection
      setSelectedHotels(selectedHotels.filter(h => h.id !== hotel.id));
      toast({
        title: "Hotel Removed",
        description: "Hotel has been removed from your itinerary.",
      });
    } else {
      // Add to selection
      setSelectedHotels([...selectedHotels, hotel]);
      toast({
        title: "Hotel Added",
        description: "Hotel has been added to your itinerary.",
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
        <h1 className="text-3xl font-bold">Hotel Search</h1>
        <p className="text-gray-600 mt-1">Find and book hotels for your trip</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <HotelSearchForm onSearch={handleSearch} />
              
              {selectedHotels.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-3">Selected Hotels ({selectedHotels.length})</h3>
                  <div className="space-y-3">
                    {selectedHotels.map((hotel) => (
                      <div key={hotel.id} className="flex items-center justify-between p-3 bg-primary/5 rounded-md">
                        <div>
                          <p className="font-medium">{hotel.name}</p>
                          <p className="text-sm text-gray-500">{hotel.city} • ${hotel.price}/night</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleSelectHotel(hotel)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4" asChild>
                    <Link href="/itinerary">
                      Continue with Selected Hotels
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hotel Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Hotel Results</h2>
              
              {!hasSearched ? (
                <div className="text-center py-12 border border-dashed rounded-md">
                  <p className="text-gray-500">Search for hotels to see results</p>
                </div>
              ) : isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  <p>Failed to load hotel results. Please try again.</p>
                </div>
              ) : hotels && hotels.length > 0 ? (
                <div className="space-y-6">
                  <div className="text-sm text-gray-500 mb-2">
                    Found {hotels.length} hotels in {searchParams.city}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {hotels.map((hotel) => (
                      <HotelCard 
                        key={hotel.id} 
                        hotel={hotel}
                        checkIn={searchParams.checkIn}
                        checkOut={searchParams.checkOut}
                        isSelected={selectedHotels.some(h => h.id === hotel.id)}
                        onSelect={() => handleSelectHotel(hotel)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-md">
                  <p className="text-gray-500">No hotels found for this location and dates</p>
                  <p className="text-sm text-gray-400 mt-2">Try a different city or dates</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
