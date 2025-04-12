import { useState } from 'react';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import HotelSearchForm from '@/components/HotelSearchForm';
import HotelCard from '@/components/HotelCard';
import { Hotel } from '@shared/schema';
import { Building, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const searchFormSchema = z.object({
  city: z.string(),
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.string(),
  rooms: z.string(),
  rating: z.string(),
  maxPrice: z.number(),
  amenities: z.array(z.string()).optional(),
});

type SearchFormData = z.infer<typeof searchFormSchema>;

export default function Hotels() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchFormData | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch hotels when search params change
  const { data: hotels, isLoading, isError } = useQuery<Hotel[]>({
    queryKey: ['/api/hotels', searchParams?.city],
    enabled: !!searchParams,
  });
  
  // Filter hotels based on additional search criteria
  const filteredHotels = hotels?.filter(hotel => {
    if (!searchParams) return true;
    
    let match = true;
    
    // Filter by price
    if (searchParams.maxPrice && hotel.price > searchParams.maxPrice) {
      match = false;
    }
    
    // Filter by rating
    if (searchParams.rating !== 'any') {
      const minRating = parseInt(searchParams.rating.replace('+', ''));
      if (hotel.rating < minRating) {
        match = false;
      }
    }
    
    // Filter by amenities
    if (searchParams.amenities && searchParams.amenities.length > 0) {
      const hasAllAmenities = searchParams.amenities.every(amenity => 
        hotel.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
      );
      if (!hasAllAmenities) {
        match = false;
      }
    }
    
    return match;
  });
  
  const handleSearch = (data: SearchFormData) => {
    setSearchParams(data);
    
    toast({
      title: "Searching for hotels",
      description: `In ${data.city} from ${format(data.checkIn, 'MMM dd, yyyy')} to ${format(data.checkOut, 'MMM dd, yyyy')}`,
    });
  };
  
  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsDialogOpen(true);
  };
  
  const handleBookHotel = () => {
    toast({
      title: "Hotel booked successfully",
      description: "Your booking confirmation has been sent to your email.",
    });
    setIsDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="w-full md:w-1/3">
          <h1 className="text-3xl font-bold mb-6">Find Hotels</h1>
          <HotelSearchForm onSearch={handleSearch} />
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="mb-6">
            {searchParams ? (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        Hotels in {searchParams.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{format(searchParams.checkIn, 'MMM dd')} - {format(searchParams.checkOut, 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Search for hotels to get started</p>
                <p className="text-sm text-gray-500">Enter your stay details on the left</p>
              </div>
            )}
          </div>
          
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <Card key={n} className="animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load hotels. Please try again.
              </AlertDescription>
            </Alert>
          )}
          
          {filteredHotels && filteredHotels.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-600">No hotels found matching your criteria.</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your filters.</p>
            </div>
          )}
          
          {filteredHotels && filteredHotels.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredHotels.map((hotel) => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  onSelect={() => handleHotelSelect(hotel)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Hotel Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedHotel && (
            <>
              <DialogHeader>
                <DialogTitle>Book Your Stay</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                <div className="mb-6">
                  <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={selectedHotel.imageUrl} 
                      alt={selectedHotel.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">{selectedHotel.name}</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{selectedHotel.address}, {selectedHotel.city}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedHotel.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="bg-gray-100">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="border-t border-b py-3 my-4 flex justify-between">
                    {searchParams && (
                      <div className="text-gray-600">
                        <div className="text-sm">
                          {format(searchParams.checkIn, 'MMM dd, yyyy')} - {format(searchParams.checkOut, 'MMM dd, yyyy')}
                        </div>
                        <div className="text-sm">
                          {searchParams.guests} guests, {searchParams.rooms} rooms
                        </div>
                      </div>
                    )}
                    <div className="text-xl font-bold text-primary">
                      ${selectedHotel.price}<span className="text-sm font-normal">/night</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Booking Information</h3>
                  <p className="text-sm text-gray-500">
                    This is a demo application. No real booking will be made.
                  </p>
                  
                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90" onClick={handleBookHotel}>
                      Book Hotel - ${selectedHotel.price}/night
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
