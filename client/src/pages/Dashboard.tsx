import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorageItineraries } from '@/lib/hooks';
import Map from '@/components/Map';
import { Search, MapPin, Plane, Hotel, Calendar, Plus, TrendingUp } from 'lucide-react';
import { Destination } from '@shared/schema';

export default function Dashboard() {
  const { itineraries } = useLocalStorageItineraries();
  
  // Fetch destinations
  const { data: destinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-3">Plan Your Perfect Trip</h1>
          <p className="text-gray-600 text-lg mb-6">
            Discover destinations, build itineraries, and organize your travel plans all in one place.
          </p>
          <div className="flex gap-4">
            <Link href="/destinations">
              <Button className="bg-primary hover:bg-primary/90">
                <Search className="mr-2 h-4 w-4" />
                Explore Destinations
              </Button>
            </Link>
            <Link href="/planner">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Start Planning
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col h-full">
          <Card className="border-primary/20 shadow-md h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Your Travel Stats
              </CardTitle>
              <CardDescription>Overview of your travel planning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">{itineraries.length}</div>
                  <div className="text-sm text-gray-600">Itineraries Created</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {destinations?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Available Destinations</div>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="font-medium mb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/destinations">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      Destinations
                    </Button>
                  </Link>
                  <Link href="/flights">
                    <Button variant="outline" className="w-full justify-start">
                      <Plane className="mr-2 h-4 w-4 text-primary" />
                      Flights
                    </Button>
                  </Link>
                  <Link href="/hotels">
                    <Button variant="outline" className="w-full justify-start">
                      <Hotel className="mr-2 h-4 w-4 text-primary" />
                      Hotels
                    </Button>
                  </Link>
                  <Link href="/planner">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      Planner
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Explore Popular Destinations</h2>
          
          {destinations && (
            <Map destinations={destinations} height="400px" />
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Itineraries</h2>
            <Link href="/planner">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create New Itinerary
              </Button>
            </Link>
          </div>
          
          {itineraries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.slice(0, 3).map((itinerary, index) => (
                <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle>{itinerary.name}</CardTitle>
                    <CardDescription>
                      {itinerary.startDate} to {itinerary.endDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <div>{itinerary.days.length} days</div>
                      <div>${itinerary.totalCost.toFixed(2)}</div>
                    </div>
                    <Link href="/itineraries">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-gray-400 mb-4">
                  <Calendar className="h-12 w-12" />
                </div>
                <p className="text-gray-600 mb-4 text-center">
                  You haven't created any itineraries yet.
                </p>
                <Link href="/planner">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Itinerary
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
          
          {itineraries.length > 0 && (
            <div className="mt-4 text-center">
              <Link href="/itineraries">
                <Button variant="link" className="text-primary">
                  View All Itineraries
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
