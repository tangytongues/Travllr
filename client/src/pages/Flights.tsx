import { useState } from 'react';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import FlightSearchForm from '@/components/FlightSearchForm';
import FlightCard from '@/components/FlightCard';
import { Flight } from '@shared/schema';
import { Plane, Calendar, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const searchFormSchema = z.object({
  from: z.string(),
  to: z.string(),
  departDate: z.date(),
  returnDate: z.date().optional(),
  passengers: z.string(),
  class: z.string(),
});

type SearchFormData = z.infer<typeof searchFormSchema>;

export default function Flights() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchFormData | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch flights when search params change
  const { data: flights, isLoading, isError } = useQuery<Flight[]>({
    queryKey: ['/api/flights', searchParams?.from, searchParams?.to],
    enabled: !!searchParams,
  });
  
  const handleSearch = (data: SearchFormData) => {
    setSearchParams(data);
    
    toast({
      title: "Searching for flights",
      description: `From ${data.from} to ${data.to} on ${format(data.departDate, 'MMM dd, yyyy')}`,
    });
  };
  
  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsDialogOpen(true);
  };
  
  const handleBookFlight = () => {
    toast({
      title: "Flight booked successfully",
      description: "Your booking confirmation has been sent to your email.",
    });
    setIsDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="w-full md:w-1/3">
          <h1 className="text-3xl font-bold mb-6">Find Flights</h1>
          <FlightSearchForm onSearch={handleSearch} />
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="mb-6">
            {searchParams ? (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {searchParams.from} to {searchParams.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{format(searchParams.departDate, 'MMM dd, yyyy')}</span>
                      {searchParams.returnDate && (
                        <>
                          <span>-</span>
                          <span>{format(searchParams.returnDate, 'MMM dd, yyyy')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Search for flights to get started</p>
                <p className="text-sm text-gray-500">Enter your travel details on the left</p>
              </div>
            )}
          </div>
          
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <Card key={n} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-16 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                      <div className="h-10 bg-gray-200 rounded" />
                      <div className="h-6 bg-gray-200 rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load flights. Please try again.
              </AlertDescription>
            </Alert>
          )}
          
          {flights && flights.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-600">No flights found for this route and date.</p>
              <p className="text-sm text-gray-500 mt-2">Try a different date or destination.</p>
            </div>
          )}
          
          {flights && flights.length > 0 && (
            <div className="space-y-4">
              {flights.map((flight) => (
                <FlightCard 
                  key={flight.id} 
                  flight={flight} 
                  onSelect={() => handleFlightSelect(flight)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Flight Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedFlight && (
            <>
              <DialogHeader>
                <DialogTitle>Complete Your Booking</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">Flight Details</h3>
                    <span className="text-sm text-gray-500">
                      {selectedFlight.flightNumber}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xl font-bold">
                        {selectedFlight.departureCity}
                      </div>
                      <div className="text-gray-500">
                        {format(new Date(selectedFlight.departureTime), 'h:mm a')}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="text-gray-400 text-sm">
                        {selectedFlight.duration}
                      </div>
                      <div className="w-32 h-0.5 bg-gray-300 relative">
                        <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 text-gray-400">
                          <Plane className="h-3 w-3 rotate-90" />
                        </div>
                      </div>
                      <div className="text-gray-400 text-xs">
                        {selectedFlight.airline}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xl font-bold">
                        {selectedFlight.arrivalCity}
                      </div>
                      <div className="text-gray-500">
                        {format(new Date(selectedFlight.arrivalTime), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between items-center">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {format(new Date(selectedFlight.departureTime), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      ${selectedFlight.price}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Passenger Information</h3>
                  <p className="text-sm text-gray-500">
                    This is a demo application. No real booking will be made.
                  </p>
                  
                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90" onClick={handleBookFlight}>
                      Book Flight - ${selectedFlight.price}
                    </Button>
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
