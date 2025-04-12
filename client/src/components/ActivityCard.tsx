import { Activity } from '@shared/schema';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Plus } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
  onAddClick?: () => void;
  compact?: boolean;
}

export default function ActivityCard({ 
  activity, 
  onClick, 
  onAddClick,
  compact = false 
}: ActivityCardProps) {
  if (compact) {
    return (
      <Card className="h-full cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-sm">{activity.name}</h4>
              <div className="flex items-center mt-1 text-gray-500 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                <span>{activity.duration}</span>
              </div>
            </div>
            <div className="flex items-center text-primary text-sm font-medium">
              <DollarSign className="h-3 w-3" />
              <span>{activity.price}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <div className="relative h-36 overflow-hidden">
        {activity.imageUrl && (
          <img 
            src={activity.imageUrl} 
            alt={activity.name} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-12" />
        <div className="absolute bottom-2 right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
          ${activity.price}
        </div>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium text-base">{activity.name}</h3>
        <div className="flex items-center mt-1 text-gray-500 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          <span>{activity.duration}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {activity.description}
        </p>
      </CardContent>
      
      {onAddClick && (
        <CardFooter className="p-3 pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-primary hover:text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick();
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to Itinerary
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
