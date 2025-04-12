import { Flight } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Clock, Calendar, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface FlightCardProps {
  flight: Flight;
  onSelect?: () => void;
}

export default function FlightCard({ flight, onSelect }: FlightCardProps) {
  // Parse ISO dates
  const departureDate = parseISO(flight.departureTime);
  const arrivalDate = parseISO(flight.arrivalTime);
  
  // Format times and dates
  const departureTime = format(departureDate, 'h:mm a');
  const arrivalTime = format(arrivalDate, 'h:mm a');
  const formattedDate = format(departureDate, 'EEE, MMM d');
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="bg-primary/5 border-b p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Plane className="h-4 w-4 text-primary mr-2" />
              <span className="font-medium">{flight.airline}</span>
            </div>
            <span className="text-sm text-gray-500">{flight.flightNumber}</span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-3">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">{formattedDate}</span>
          </div>
          
          <div className="grid grid-cols-12 gap-2 items-center mb-4">
            <div className="col-span-5">
              <div className="font-semibold text-lg">{departureTime}</div>
              <div className="text-sm text-gray-500">{flight.departureCity}</div>
            </div>
            
            <div className="col-span-2 flex flex-col items-center">
              <div className="w-full flex items-center">
                <div className="h-0.5 flex-grow bg-gray-300"></div>
                <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
                <div className="h-0.5 flex-grow bg-gray-300"></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{flight.duration}</div>
            </div>
            
            <div className="col-span-5 text-right">
              <div className="font-semibold text-lg">{arrivalTime}</div>
              <div className="text-sm text-gray-500">{flight.arrivalCity}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{flight.duration}</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-bold text-primary text-lg mr-3">${flight.price}</span>
              {onSelect && (
                <Button onClick={onSelect} className="bg-primary hover:bg-primary/90">
                  Select
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
