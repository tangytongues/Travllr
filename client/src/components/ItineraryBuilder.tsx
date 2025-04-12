import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { addDays, format, differenceInDays } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, ItineraryDay } from '@shared/schema';
import { Calendar as CalendarIcon, Plus, Save, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import DayPlan from './DayPlan';

interface ItineraryBuilderProps {
  destinationId?: number;
  activities: Activity[];
  onSave: (itinerary: any) => void;
}

export default function ItineraryBuilder({ destinationId, activities, onSave }: ItineraryBuilderProps) {
  const { toast } = useToast();
  const [name, setName] = useState('My Trip');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  
  // Initialize days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const dayCount = differenceInDays(endDate, startDate) + 1;
      
      if (dayCount > 0) {
        // Create array of day objects
        const newDays: ItineraryDay[] = Array.from({ length: dayCount }, (_, i) => {
          const currentDate = addDays(startDate, i);
          
          // Try to preserve existing day data if available
          const existingDay = days[i];
          
          return {
            date: format(currentDate, 'yyyy-MM-dd'),
            activities: existingDay?.activities || [],
            notes: existingDay?.notes || '',
            accommodation: existingDay?.accommodation,
            transportation: existingDay?.transportation
          };
        });
        
        setDays(newDays);
      }
    }
  }, [startDate, endDate]);
  
  // Calculate total cost whenever days change
  useEffect(() => {
    let cost = 0;
    
    days.forEach(day => {
      // Add activity costs
      day.activities.forEach(activity => {
        cost += activity.price;
      });
      
      // Add accommodation cost if any
      if (day.accommodation) {
        cost += day.accommodation.price;
      }
      
      // Add transportation cost if any
      if (day.transportation) {
        cost += day.transportation.price;
      }
    });
    
    setTotalCost(cost);
  }, [days]);
  
  // Handle when an activity is dragged
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // If dragging between different day lists
    if (source.droppableId !== destination.droppableId) {
      const sourceDay = parseInt(source.droppableId);
      const destDay = parseInt(destination.droppableId);
      
      const sourceActivities = [...days[sourceDay].activities];
      const destActivities = [...days[destDay].activities];
      
      const [removed] = sourceActivities.splice(source.index, 1);
      destActivities.splice(destination.index, 0, removed);
      
      const newDays = [...days];
      newDays[sourceDay] = {
        ...days[sourceDay],
        activities: sourceActivities
      };
      newDays[destDay] = {
        ...days[destDay],
        activities: destActivities
      };
      
      setDays(newDays);
    } 
    // If dragging within the same day list
    else {
      const dayIndex = parseInt(source.droppableId);
      const activities = [...days[dayIndex].activities];
      const [removed] = activities.splice(source.index, 1);
      activities.splice(destination.index, 0, removed);
      
      const newDays = [...days];
      newDays[dayIndex] = {
        ...days[dayIndex],
        activities
      };
      
      setDays(newDays);
    }
  };
  
  // Add an activity to a specific day
  const addActivity = (activity: Activity, dayIndex: number) => {
    const activityToAdd = {
      id: activity.id,
      name: activity.name,
      description: activity.description,
      imageUrl: activity.imageUrl,
      price: activity.price,
      duration: activity.duration,
      startTime: '09:00' // Default start time
    };
    
    const newDays = [...days];
    newDays[dayIndex] = {
      ...days[dayIndex],
      activities: [...days[dayIndex].activities, activityToAdd]
    };
    
    setDays(newDays);
    
    toast({
      title: "Activity added",
      description: `${activity.name} added to Day ${dayIndex + 1}`,
    });
  };
  
  // Remove an activity from a day
  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].activities.splice(activityIndex, 1);
    setDays(newDays);
    
    toast({
      title: "Activity removed",
      description: "The activity has been removed from your itinerary",
    });
  };
  
  // Update activity details (like start time)
  const updateActivity = (dayIndex: number, activityIndex: number, updatedActivity: any) => {
    const newDays = [...days];
    newDays[dayIndex].activities[activityIndex] = {
      ...newDays[dayIndex].activities[activityIndex],
      ...updatedActivity
    };
    setDays(newDays);
  };
  
  // Add accommodation to a day
  const addAccommodation = (dayIndex: number, accommodation: any) => {
    const newDays = [...days];
    newDays[dayIndex] = {
      ...days[dayIndex],
      accommodation
    };
    setDays(newDays);
  };
  
  // Add transportation to a day
  const addTransportation = (dayIndex: number, transportation: any) => {
    const newDays = [...days];
    newDays[dayIndex] = {
      ...days[dayIndex],
      transportation
    };
    setDays(newDays);
  };
  
  // Update day notes
  const updateNotes = (dayIndex: number, notes: string) => {
    const newDays = [...days];
    newDays[dayIndex] = {
      ...days[dayIndex],
      notes
    };
    setDays(newDays);
  };
  
  // Save the itinerary
  const saveItinerary = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates for your trip",
        variant: "destructive"
      });
      return;
    }
    
    const itinerary = {
      name,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      totalCost,
      days
    };
    
    // Save to localStorage first
    const savedItineraries = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ITINERARIES) || '[]');
    savedItineraries.push(itinerary);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ITINERARIES, JSON.stringify(savedItineraries));
    
    // Then call the onSave callback
    onSave(itinerary);
    
    toast({
      title: "Itinerary saved",
      description: "Your itinerary has been saved successfully"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white rounded-lg shadow">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Trip Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name for your trip"
            className="w-full"
          />
        </div>
        
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => startDate ? date < startDate : false}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Estimated Cost</label>
          <div className="h-10 flex items-center px-3 border rounded-md bg-gray-50">
            <span className="font-medium text-primary">${totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-6">
          {days.map((day, dayIndex) => (
            <DayPlan
              key={day.date}
              day={day}
              dayIndex={dayIndex}
              availableActivities={activities}
              onAddActivity={(activity) => addActivity(activity, dayIndex)}
              onRemoveActivity={(activityIndex) => removeActivity(dayIndex, activityIndex)}
              onUpdateActivity={(activityIndex, updatedActivity) => 
                updateActivity(dayIndex, activityIndex, updatedActivity)}
              onAddAccommodation={(accommodation) => addAccommodation(dayIndex, accommodation)}
              onAddTransportation={(transportation) => addTransportation(dayIndex, transportation)}
              onUpdateNotes={(notes) => updateNotes(dayIndex, notes)}
            />
          ))}
        </div>
      </DragDropContext>
      
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => {
            if (window.confirm("Are you sure you want to reset your itinerary?")) {
              setDays(days.map(day => ({ ...day, activities: [], accommodation: undefined, transportation: undefined, notes: '' })));
            }
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button className="bg-primary hover:bg-primary/90" onClick={saveItinerary}>
          <Save className="mr-2 h-4 w-4" />
          Save Itinerary
        </Button>
      </div>
    </div>
  );
}
