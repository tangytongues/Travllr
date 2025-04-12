import { ItineraryDay } from '@shared/schema';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, DollarSign, Bed, Plane } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ItinerarySummaryProps {
  name: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  totalCost: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ItinerarySummary({
  name,
  startDate,
  endDate,
  days,
  totalCost,
  onEdit,
  onDelete
}: ItinerarySummaryProps) {
  const formattedStartDate = format(parseISO(startDate), 'MMM d, yyyy');
  const formattedEndDate = format(parseISO(endDate), 'MMM d, yyyy');
  
  // Count total activities
  const totalActivities = days.reduce((sum, day) => sum + day.activities.length, 0);
  
  // Get unique destinations
  const destinations = new Set<string>();
  days.forEach(day => {
    day.activities.forEach(activity => {
      // This is simplified since we don't have destination name in the activity directly
      // In a real app, you'd reference the actual destination
      destinations.add('Location');
    });
  });
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {days.length} days
          </Badge>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedStartDate} - {formattedEndDate}</span>
        </div>
      </CardHeader>
      
      <CardContent className="py-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{destinations.size} destinations</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>{totalActivities} activities</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Bed className="h-4 w-4 mr-2 text-primary" />
              <span>{days.filter(day => day.accommodation).length} hotels</span>
            </div>
            <div className="flex items-center text-sm">
              <Plane className="h-4 w-4 mr-2 text-primary" />
              <span>{days.filter(day => day.transportation?.type === 'flight').length} flights</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">Estimated cost:</div>
          <div className="flex items-center font-semibold text-lg">
            <DollarSign className="h-4 w-4 text-primary" />
            {totalCost.toFixed(2)}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between gap-2">
        {onEdit && (
          <Button variant="outline" className="flex-1" onClick={onEdit}>
            View Details
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
