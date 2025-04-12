import { useState, Fragment } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2, GripVertical, MapPin, Clock, DollarSign } from "lucide-react";
import { Activity, Destination } from "@shared/schema";
import { format, addDays } from "date-fns";

interface DragDropItineraryProps {
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  destinations: Destination[];
  days: number;
  startDate?: Date;
}

export default function DragDropItinerary({
  activities,
  setActivities,
  destinations,
  days,
  startDate
}: DragDropItineraryProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([]);

  // Toggle day expansion
  const toggleDayExpansion = (day: number) => {
    if (expandedDays.includes(day)) {
      setExpandedDays(expandedDays.filter(d => d !== day));
    } else {
      setExpandedDays([...expandedDays, day]);
    }
  };

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(activities);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setActivities(items);
  };

  // Update activity field
  const updateActivity = (id: string, field: keyof Activity, value: any) => {
    setActivities(
      activities.map(activity => 
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );
  };

  // Delete activity
  const deleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  // Group activities by day
  const activitiesByDay = Array.from({ length: days }, (_, i) => {
    const dayNumber = i + 1;
    return {
      day: dayNumber,
      date: startDate ? format(addDays(startDate, i), 'EEE, MMM d') : `Day ${dayNumber}`,
      activities: activities.filter(a => a.day === dayNumber)
    };
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        {activitiesByDay.map(dayData => (
          <Card key={dayData.day} className={expandedDays.includes(dayData.day) ? "border-primary" : ""}>
            <div 
              className="p-4 border-b flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => toggleDayExpansion(dayData.day)}
            >
              <h3 className="font-medium">
                {dayData.date} 
                <span className="text-gray-500 text-sm ml-2">
                  ({dayData.activities.length} activities)
                </span>
              </h3>
              <div>
                {expandedDays.includes(dayData.day) ? "▼" : "►"}
              </div>
            </div>
            
            {expandedDays.includes(dayData.day) && (
              <CardContent className="p-4">
                <Droppable droppableId={`day-${dayData.day}`}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {dayData.activities.length === 0 ? (
                        <div className="text-center p-4 border border-dashed rounded-md">
                          <p className="text-gray-500">No activities planned for this day</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newActivity: Activity = {
                                id: `activity-${Date.now()}`,
                                day: dayData.day,
                                name: "New Activity",
                                description: "",
                                location: destinations.length > 0 ? destinations[0].name : "",
                                startTime: "09:00",
                                endTime: "10:00",
                                cost: 0
                              };
                              setActivities([...activities, newActivity]);
                            }}
                          >
                            Add Activity
                          </Button>
                        </div>
                      ) : (
                        dayData.activities.map((activity, index) => (
                          <Draggable
                            key={activity.id}
                            draggableId={activity.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="border rounded-md p-4 bg-white"
                              >
                                <div className="flex items-start gap-4">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-move text-gray-400 hover:text-gray-600 mt-2"
                                  >
                                    <GripVertical className="h-5 w-5" />
                                  </div>
                                  
                                  <div className="flex-1 space-y-3">
                                    <div>
                                      <Label htmlFor={`activity-name-${activity.id}`}>Activity Name</Label>
                                      <Input
                                        id={`activity-name-${activity.id}`}
                                        value={activity.name}
                                        onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>
                                    
                                    <div>
                                      <Label htmlFor={`activity-desc-${activity.id}`}>Description</Label>
                                      <Textarea
                                        id={`activity-desc-${activity.id}`}
                                        value={activity.description}
                                        onChange={(e) => updateActivity(activity.id, 'description', e.target.value)}
                                        className="mt-1"
                                        rows={2}
                                      />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div>
                                        <Label className="flex items-center">
                                          <MapPin className="h-4 w-4 mr-1" /> Location
                                        </Label>
                                        <Select
                                          value={activity.location}
                                          onValueChange={(value) => updateActivity(activity.id, 'location', value)}
                                        >
                                          <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select location" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {destinations.map((destination) => (
                                              <SelectItem key={destination.id} value={destination.name}>
                                                {destination.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div>
                                        <Label className="flex items-center">
                                          <DollarSign className="h-4 w-4 mr-1" /> Cost
                                        </Label>
                                        <Input
                                          type="number"
                                          value={activity.cost}
                                          onChange={(e) => updateActivity(activity.id, 'cost', Number(e.target.value))}
                                          className="mt-1"
                                          min={0}
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <Label className="flex items-center">
                                          <Clock className="h-4 w-4 mr-1" /> Start Time
                                        </Label>
                                        <Input
                                          type="time"
                                          value={activity.startTime}
                                          onChange={(e) => updateActivity(activity.id, 'startTime', e.target.value)}
                                          className="mt-1"
                                        />
                                      </div>
                                      
                                      <div>
                                        <Label className="flex items-center">
                                          <Clock className="h-4 w-4 mr-1" /> End Time
                                        </Label>
                                        <Input
                                          type="time"
                                          value={activity.endTime}
                                          onChange={(e) => updateActivity(activity.id, 'endTime', e.target.value)}
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteActivity(activity.id)}
                                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </DragDropContext>
  );
}
