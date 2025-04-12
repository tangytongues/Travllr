import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Destination } from '@shared/schema';
import Map from '@/components/Map';
import DestinationCard from '@/components/DestinationCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Search, Calendar, Globe, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Destinations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [open, setOpen] = useState(false);
  
  // Fetch destinations
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });
  
  // Filter destinations based on search term
  const filteredDestinations = destinations?.filter(destination => 
    destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDestinationClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setOpen(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Explore Destinations</h1>
          <p className="text-gray-600 mt-1">Discover amazing places for your next adventure</p>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search destinations..."
              className="pl-10 pr-4 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="map" className="space-y-6">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Details View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="space-y-6">
          {destinations && (
            <Map 
              destinations={destinations} 
              height="600px" 
              onDestinationSelect={handleDestinationClick}
              selectedDestination={selectedDestination}
            />
          )}
          
          {selectedDestination && (
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img 
                      src={selectedDestination.imageUrl} 
                      alt={selectedDestination.name} 
                      className="w-full h-48 object-cover rounded-md" 
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold">{selectedDestination.name}</h2>
                    <div className="flex items-center text-gray-500 mt-1 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{selectedDestination.country}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{selectedDestination.description}</p>
                    <Link href="/planner">
                      <Button className="bg-primary hover:bg-primary/90">
                        <Calendar className="mr-2 h-4 w-4" />
                        Plan a Trip Here
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="grid">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Card key={n} className="h-80 animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDestinations?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => (
                <DestinationCard 
                  key={destination.id} 
                  destination={destination} 
                  onClick={() => handleDestinationClick(destination)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No destinations found matching your search.</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Destination Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          {selectedDestination && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDestination.name}, {selectedDestination.country}</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <img 
                    src={selectedDestination.imageUrl} 
                    alt={selectedDestination.name} 
                    className="w-full h-60 object-cover rounded-md" 
                  />
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-600">{selectedDestination.description}</p>
                  
                  <div className="pt-2">
                    <h3 className="font-medium mb-2">Location</h3>
                    <div className="h-32 bg-gray-100 rounded-md overflow-hidden">
                      <Map
                        destinations={[selectedDestination]}
                        height="100%"
                        center={[selectedDestination.lat, selectedDestination.lng]}
                        zoom={10}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Link href="/planner">
                      <Button className="bg-primary hover:bg-primary/90">
                        <Calendar className="mr-2 h-4 w-4" />
                        Plan a Trip
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
