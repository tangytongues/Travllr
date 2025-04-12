import { Destination } from '@shared/schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Info } from 'lucide-react';
import { Link } from 'wouter';

interface DestinationCardProps {
  destination: Destination;
  onClick?: () => void;
}

export default function DestinationCard({ destination, onClick }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={destination.imageUrl} 
          alt={destination.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center text-white">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{destination.country}</span>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{destination.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <CardDescription className="line-clamp-2 text-sm text-gray-600">
          {destination.description}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClick}
          className="text-gray-600"
        >
          <Info className="h-4 w-4 mr-1" />
          Details
        </Button>
        <Link href="/planner">
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Calendar className="h-4 w-4 mr-1" />
            Plan Trip
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
