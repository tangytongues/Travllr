import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeftCircle, Save, PlusCircle, Calendar, MapPin } from "lucide-react";
import { Destination, Itinerary as ItineraryType, Flight, Hotel } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import MapView from "@/components/MapView";
import ItineraryBuilder from "@/components/ItineraryBuilder";
import CostSummary from "@/components/CostSummary";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function Itinerary() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("planner");
  const [selectedDestinations, setSelectedDestinations] = useState<number[]>([]);
  const [selectedFlights, setSelectedFlights] = useState<Flight[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<Hotel[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [itineraryName, setItineraryName] = useState("My Trip");
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [savedItineraries, setSavedItineraries] = useLocalStorage<ItineraryType[]>("savedItineraries", []);

  // Fetch all destinations
  const { data: destinations, isLoading: isLoadingDestinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });

  // Filter to show only selected destinations
  const selectedDestinationObjects = destinations?.filter(d => 
    selectedDestinations.includes(d.id)
  ) || [];

  // Calculate total cost
  const totalCost = () => {
    const flightCosts = selectedFlights.reduce((sum, flight) => sum + flight.price, 0);
    const hotelCosts = selectedHotels.reduce((sum, hotel) => sum + hotel.price, 0);
    const activityCosts = activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);
    return flightCosts + hotelCosts + activityCosts;
  };

  // Save itinerary
  const saveItineraryMutation = useMutation({
    mutationFn: async () => {
      const itineraryData = {
        name: itineraryName,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        destinationIds: selectedDestinations,
        activities: activities,
        flights: selectedFlights,
        hotels: selectedHotels,
        totalCost: totalCost(),
        notes: "",
      };

      // Save to localStorage first (for backup)
      const newItinerary = { ...itineraryData, id: Date.now() };
      setSavedItineraries([...savedItineraries, newItinerary]);

      // Then try to save to server
      const response = await apiRequest("POST", "/api/itineraries", itineraryData);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Itinerary Saved",
        description: "Your travel itinerary has been saved successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: "Your itinerary was saved locally but we couldn't save it to the server.",
        variant: "destructive",
      });
    }
  });

  const handleSaveItinerary = () => {
    saveItineraryMutation.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Link href="/" className="inline-flex items-center text-primary hover:underline mb-2">
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Create Your Travel Itinerary</h1>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={handleSaveItinerary} 
            className="flex items-center"
            disabled={saveItineraryMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {saveItineraryMutation.isPending ? "Saving..." : "Save Itinerary"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="destinations">Destinations</TabsTrigger>
              <TabsTrigger value="planner">Itinerary Planner</TabsTrigger>
              <TabsTrigger value="travel">Flights & Hotels</TabsTrigger>
            </TabsList>

            {/* Destinations Tab */}
            <TabsContent value="destinations" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    Select Your Destinations
                  </h2>
                  <div className="mb-6">
                    <MapView 
                      destinations={destinations || []} 
                      height="400px" 
                      selectedDestinations={selectedDestinations}
                      onDestinationSelect={(id) => {
                        if (selectedDestinations.includes(id)) {
                          setSelectedDestinations(selectedDestinations.filter(d => d !== id));
                        } else {
                          setSelectedDestinations([...selectedDestinations, id]);
                        }
                      }}
                    />
                  </div>
                  
                  <h3 className="font-medium mb-2">Selected Destinations:</h3>
                  {selectedDestinations.length === 0 ? (
                    <p className="text-gray-500 italic">No destinations selected yet. Click on the map to select destinations.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedDestinationObjects.map(destination => (
                        <div key={destination.id} className="flex items-center p-3 border rounded-md">
                          <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                            <img src={destination.imageUrl} alt={destination.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium">{destination.name}</p>
                            <p className="text-sm text-gray-500">{destination.country}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-auto text-red-500"
                            onClick={() => setSelectedDestinations(selectedDestinations.filter(id => id !== destination.id))}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("planner")}>
                  Continue to Planner
                </Button>
              </div>
            </TabsContent>

            {/* Itinerary Planner Tab */}
            <TabsContent value="planner">
              <ItineraryBuilder 
                destinations={selectedDestinationObjects}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                activities={activities}
                setActivities={setActivities}
                setDateRange={setDateRange}
                itineraryName={itineraryName}
                setItineraryName={setItineraryName}
              />
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("destinations")}>
                  Back to Destinations
                </Button>
                <Button onClick={() => setActiveTab("travel")}>
                  Continue to Flights & Hotels
                </Button>
              </div>
            </TabsContent>

            {/* Flights & Hotels Tab */}
            <TabsContent value="travel">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Plane className="mr-2 h-5 w-5 text-primary" />
                    Flights & Travel
                  </h2>
                  
                  {selectedDestinations.length < 2 ? (
                    <div className="text-center p-6 border border-dashed rounded-md">
                      <p className="text-gray-500 mb-2">Select at least two destinations to search for flights</p>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("destinations")}>
                        Add Destinations
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Selected Flights</h3>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/flights">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Flights
                          </Link>
                        </Button>
                      </div>
                      
                      {selectedFlights.length === 0 ? (
                        <p className="text-gray-500 italic text-center py-4">No flights selected yet</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedFlights.map((flight, index) => (
                            <div key={index} className="flex items-center justify-between border rounded-md p-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 mr-3 flex items-center justify-center">
                                  {flight.airlineLogoUrl ? (
                                    <img src={flight.airlineLogoUrl} alt={flight.airline} className="max-h-full max-w-full" />
                                  ) : (
                                    <Plane className="text-primary" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{flight.departureCity} to {flight.arrivalCity}</p>
                                  <p className="text-sm text-gray-500">
                                    {flight.airline} • {flight.flightNumber} • ${flight.price}
                                  </p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500"
                                onClick={() => setSelectedFlights(selectedFlights.filter((_, i) => i !== index))}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Home className="mr-2 h-5 w-5 text-primary" />
                    Hotels & Accommodations
                  </h2>
                  
                  {selectedDestinations.length === 0 ? (
                    <div className="text-center p-6 border border-dashed rounded-md">
                      <p className="text-gray-500 mb-2">Select destinations to search for hotels</p>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("destinations")}>
                        Add Destinations
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Selected Hotels</h3>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/hotels">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Hotels
                          </Link>
                        </Button>
                      </div>
                      
                      {selectedHotels.length === 0 ? (
                        <p className="text-gray-500 italic text-center py-4">No hotels selected yet</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedHotels.map((hotel, index) => (
                            <div key={index} className="flex items-center justify-between border rounded-md p-3">
                              <div className="flex items-center">
                                <div className="w-14 h-14 mr-3 rounded-md overflow-hidden">
                                  <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="font-medium">{hotel.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {hotel.city} • ${hotel.price}/night • {hotel.rating} <Star className="h-3 w-3 inline" />
                                  </p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500"
                                onClick={() => setSelectedHotels(selectedHotels.filter((_, i) => i !== index))}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("planner")}>
                  Back to Planner
                </Button>
                <Button onClick={handleSaveItinerary} disabled={saveItineraryMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {saveItineraryMutation.isPending ? "Saving..." : "Save Itinerary"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Trip Summary
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Trip Name</p>
                  <p className="font-medium">{itineraryName || "My Trip"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date Range</p>
                  <p className="font-medium">
                    {dateRange.startDate} - {dateRange.endDate}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(() => {
                      const start = new Date(dateRange.startDate);
                      const end = new Date(dateRange.endDate);
                      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                      return `${days} days`;
                    })()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Destinations</p>
                  {selectedDestinationObjects.length === 0 ? (
                    <p className="text-sm italic text-gray-400">No destinations selected</p>
                  ) : (
                    <ul className="list-disc list-inside">
                      {selectedDestinationObjects.map(destination => (
                        <li key={destination.id} className="text-sm">{destination.name}, {destination.country}</li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <CostSummary 
                  flights={selectedFlights}
                  hotels={selectedHotels}
                  activities={activities}
                />
                
                <div className="pt-4 border-t">
                  <Button className="w-full" onClick={handleSaveItinerary} disabled={saveItineraryMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {saveItineraryMutation.isPending ? "Saving..." : "Save Itinerary"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Import the Plane and Home components at the top
import { Plane, Home } from "lucide-react";
