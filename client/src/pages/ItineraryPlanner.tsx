import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorageItineraries } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Destination } from '@shared/schema';
import ItineraryBuilder from '@/components/ItineraryBuilder';
import Map from '@/components/Map';
import { Globe, Calendar, Check } from 'lucide-react';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

export default function ItineraryPlanner() {
  const { toast } = useToast();
  const { saveItinerary } = useLocalStorageItineraries();
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);
  
  // Fetch destinations
  const { data: destinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });
  
  // Get activities for selected destination
  const { data: activities } = useQuery<Activity[]>({
    queryKey: ['/api/activities', selectedDestinationId],
    enabled: !!selectedDestinationId,
  });
  
  // Get selected destination object
  const selectedDestination = destinations?.find(d => d.id === selectedDestinationId);
  
  // Load saved current itinerary from localStorage if exists
  useEffect(() => {
    const savedCurrentItinerary = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_ITINERARY);
    if (savedCurrentItinerary) {
      try {
        const itinerary = JSON.parse(savedCurrentItinerary);
        // Could populate state from saved itinerary if needed
      } catch (error) {
        console.error('Failed to parse saved itinerary:', error);
      }
    }
  }, []);
  
  const handleSaveItinerary = (itinerary: any) => {
    saveItinerary(itinerary);
    
    toast({
      title: "Itinerary saved successfully",
      description: "Your itinerary has been saved and can be viewed in the Saved Itineraries section.",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Plan Your Trip</h1>
        <p className="text-gray-600">Create a detailed day-by-day itinerary for your next adventure</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Globe className="mr-2 h-5 w-5 text-primary" />
              Select Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                value={selectedDestinationId?.toString() || ''}
                onValueChange={(value) => setSelectedDestinationId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations?.map((destination) => (
                    <SelectItem key={destination.id} value={destination.id.toString()}>
                      {destination.name}, {destination.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedDestination && (
                <div className="pt-2">
                  <Map
                    destinations={[selectedDestination]}
                    center={[selectedDestination.lat, selectedDestination.lng]}
                    zoom={8}
                    height="300px"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Planning Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span>Select a destination to start planning your itinerary</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span>Set your travel dates to create a day-by-day plan</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span>Drag and drop activities to rearrange your schedule</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span>Add accommodation and transportation details</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span>Your itinerary is automatically saved as you work</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="itinerary" className="space-y-6">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="itinerary" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Itinerary Builder
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Available Activities
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="itinerary">
          {selectedDestination ? (
            <ItineraryBuilder 
              destinationId={selectedDestination.id}
              activities={activities || []}
              onSave={handleSaveItinerary}
            />
          ) : (
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <div className="text-gray-400 mb-4">
                  <Globe className="h-16 w-16" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Select a Destination to Begin
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Choose a destination from the dropdown above to start building your perfect itinerary.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="activities">
          {selectedDestination ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                Activities in {selectedDestination.name}
              </h2>
              
              {activities && activities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity) => (
                    <Card key={activity.id}>
                      <div className="h-40 overflow-hidden">
                        {activity.imageUrl && (
                          <img 
                            src={activity.imageUrl} 
                            alt={activity.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-1">{activity.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {activity.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Duration: {activity.duration}
                          </div>
                          <div className="font-medium text-primary">
                            ${activity.price}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-600">No activities found for this destination.</p>
                </div>
              )}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <div className="text-gray-400 mb-4">
                  <Check className="h-16 w-16" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Select a Destination First
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Choose a destination to view available activities.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
