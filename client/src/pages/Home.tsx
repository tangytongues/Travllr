import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plane, Calendar, Clock, Star } from "lucide-react";
import { Destination } from "@shared/schema";
import MapView from "@/components/MapView";
import DestinationCard from "@/components/DestinationCard";

export default function Home() {
  const { data: destinations, isLoading, error } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-primary rounded-lg overflow-hidden mb-10">
        <div className="relative z-10 py-16 px-6 md:px-10 md:w-3/5">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Plan Your Dream Vacation
          </h1>
          <p className="text-white/90 mb-6 text-lg">
            Create personalized travel itineraries with our interactive planning tools. Search flights, hotels, and attractions all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="font-medium">
              <Link href="/itinerary">Create Itinerary</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 hover:text-primary font-medium">
              <Link href="/flights">Find Flights</Link>
            </Button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-2/5 h-full hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/90 z-10" />
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9')] bg-cover bg-center" />
        </div>
      </section>

      {/* Map Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Explore Destinations</h2>
          <Link href="/itinerary" className="text-primary hover:underline font-medium flex items-center">
            <Plane className="w-4 h-4 mr-1" />
            Create Travel Plan
          </Link>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-[500px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="h-[500px] flex items-center justify-center">
                <p className="text-red-500">Failed to load map data</p>
              </div>
            ) : (
              <MapView destinations={destinations || []} height="500px" />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Popular Destinations Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-6">
            Failed to load destinations. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations?.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Plan with Confidence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Maps</h3>
              <p className="text-gray-600">
                Explore destinations with our interactive maps. View attractions, hotels, and local highlights all in one view.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Day-by-Day Planning</h3>
              <p className="text-gray-600">
                Build your itinerary day by day with our intuitive drag-and-drop interface. Organize activities with ease.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Time & Cost Tracking</h3>
              <p className="text-gray-600">
                Keep track of your trip budget and duration. Our tools help you plan efficiently and stay within budget.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-10 text-center text-white mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Create your custom travel itinerary today and make your dream vacation a reality. It's free and easy to use!
        </p>
        <Button size="lg" variant="secondary" asChild className="font-semibold">
          <Link href="/itinerary">Create Your Itinerary</Link>
        </Button>
      </section>
    </div>
  );
}
