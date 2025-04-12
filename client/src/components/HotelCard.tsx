import { Hotel } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Wifi, Coffee, Waves, Car } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  onSelect?: () => void;
}

const amenityIcons: Record<string, any> = {
  'Free WiFi': Wifi,
  'Breakfast': Coffee,
  'Pool': Waves,
  'Free Parking': Car,
};

export default function HotelCard({ hotel, onSelect }: HotelCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={hotel.imageUrl} 
          alt={hotel.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-16" />
        <div className="absolute bottom-2 right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
          ${hotel.price}/night
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{hotel.name}</h3>
        
        <div className="flex items-center mt-1 text-gray-500 text-sm">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{hotel.city}</span>
        </div>
        
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
              </svg>
            ))}
            {hotel.rating % 1 >= 0.5 && (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
              </svg>
            )}
          </div>
          <span className="ml-1 text-sm text-gray-600">{hotel.rating}</span>
        </div>
        
        <div className="mt-3">
          <div className="text-sm font-medium mb-1">Amenities</div>
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 4).map((amenity) => {
              const IconComponent = amenityIcons[amenity] || null;
              return (
                <div 
                  key={amenity} 
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center"
                >
                  {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                  {amenity}
                </div>
              );
            })}
            {hotel.amenities.length > 4 && (
              <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{hotel.amenities.length - 4} more
              </div>
            )}
          </div>
        </div>
        
        {onSelect && (
          <div className="mt-4">
            <Button 
              onClick={onSelect} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Select Hotel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
