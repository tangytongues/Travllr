import { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Activity, ItineraryDay } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bed, Bus, Clock, Plus, Trash2, Calendar, Pencil, X } from 'lucide-react';
import { format } from 'date-fns';
import ActivityCard from './ActivityCard';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface DayPlanProps {
  day: ItineraryDay;
  dayIndex: number;
  availableActivities: Activity[];
  onAddActivity: (activity: Activity) => void;
  onRemoveActivity: (activityIndex: number) => void;
  onUpdateActivity: (activityIndex: number, updatedActivity: any) => void;
  onAddAccommodation: (accommodation: any) => void;
  onAddTransportation: (transportation: any) => void;
  onUpdateNotes: (notes: string) => void;
}

export default function DayPlan({
  day,
  dayIndex,
  availableActivities,
  onAddActivity,
  onRemoveActivity,
  onUpdateActivity,
  onAddAccommodation,
  onAddTransportation,
  onUpdateNotes
}: DayPlanProps) {
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showAccommodationDialog, setShowAccommodationDialog] = useState(false);
  const [showTransportationDialog, setShowTransportationDialog] = useState(false);

  // Query for hotels
  const { data: hotels } = useQuery({
    queryKey: ['/api/hotels'],
    refetchOnWindowFocus: false
  });

  // Format date as "Day 1 - Monday, June 15"
  const formattedDate = day.date ? 
    `Day ${dayIndex + 1} - ${format(new Date(day.date), 'EEEE, MMMM d')}` : 
    `Day ${dayIndex + 1}`;

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          {formattedDate}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <Tabs defaultValue="activities">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
            <TabsTrigger value="transportation">Transportation</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Day Activities</h3>
              <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Activity to {formattedDate}</DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {availableActivities.map((activity) => (
                      <div key={activity.id} onClick={() => {
                        onAddActivity(activity);
                        setShowActivityDialog(false);
                      }}>
                        <ActivityCard 
                          activity={activity}
                          onAddClick={() => {
                            onAddActivity(activity);
                            setShowActivityDialog(false);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Droppable droppableId={String(dayIndex)}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[100px] space-y-2"
                >
                  {day.activities.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-24 bg-gray-50 rounded-md border border-dashed border-gray-300">
                      <p className="text-gray-500 text-sm">No activities planned for this day</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={() => setShowActivityDialog(true)}
                      >
                        Add an activity
                      </Button>
                    </div>
                  )}

                  {day.activities.map((activity, index) => (
                    <Draggable key={`${activity.id}-${index}`} draggableId={`${activity.id}-${index}-${dayIndex}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white rounded-md border p-3 relative"
                        >
                          <div className="flex justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                                <Clock className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{activity.name}</h4>
                                <div className="flex items-center mt-1 text-gray-500 text-sm">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{activity.duration}</span>
                                  <span className="mx-2">•</span>
                                  <span>${activity.price}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <div className="relative">
                                <Input
                                  type="time"
                                  value={activity.startTime || ''}
                                  onChange={(e) => onUpdateActivity(index, { startTime: e.target.value })}
                                  className="w-24 text-sm"
                                />
                                <span className="absolute right-2 top-2 text-gray-400 text-xs pointer-events-none">
                                  start
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemoveActivity(index)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Notes</h3>
              <Textarea
                placeholder="Add notes for this day..."
                value={day.notes || ''}
                onChange={(e) => onUpdateNotes(e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="accommodation">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Accommodation</h3>
                <Dialog open={showAccommodationDialog} onOpenChange={setShowAccommodationDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Hotel
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select Accommodation for {formattedDate}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {hotels?.map((hotel: any) => (
                        <Card 
                          key={hotel.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            onAddAccommodation({
                              hotelId: hotel.id,
                              name: hotel.name,
                              price: hotel.price
                            });
                            setShowAccommodationDialog(false);
                          }}
                        >
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={hotel.imageUrl} 
                              alt={hotel.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-3">
                            <h4 className="font-medium">{hotel.name}</h4>
                            <p className="text-sm text-gray-500">{hotel.city}</p>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center text-yellow-500">
                                {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => (
                                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                  </svg>
                                ))}
                                <span className="text-gray-500 text-xs ml-1">{hotel.rating}</span>
                              </div>
                              <span className="font-bold text-primary">${hotel.price}/night</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {day.accommodation ? (
                <div className="bg-white rounded-md border p-4 relative">
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onAddAccommodation(undefined)}
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center">
                      <Bed className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">{day.accommodation.name}</h4>
                      <div className="text-gray-500 text-sm mt-1">
                        <span>${day.accommodation.price} per night</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 bg-gray-50 rounded-md border border-dashed border-gray-300">
                  <p className="text-gray-500 text-sm">No accommodation selected</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => setShowAccommodationDialog(true)}
                  >
                    Select a hotel
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transportation">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Transportation</h3>
                <Dialog open={showTransportationDialog} onOpenChange={setShowTransportationDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Transportation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Transportation for {formattedDate}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <Select 
                          onValueChange={(value) => {
                            onAddTransportation({
                              type: value,
                              from: '',
                              to: '',
                              price: 0
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select transportation type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flight">Flight</SelectItem>
                            <SelectItem value="train">Train</SelectItem>
                            <SelectItem value="bus">Bus</SelectItem>
                            <SelectItem value="car">Car Rental</SelectItem>
                            <SelectItem value="taxi">Taxi/Uber</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {day.transportation ? (
                <div className="bg-white rounded-md border p-4 relative">
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onAddTransportation(undefined)}
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      "w-12 h-12 rounded-md flex items-center justify-center",
                      day.transportation.type === "flight" ? "bg-blue-50" : "bg-green-50"
                    )}>
                      <Bus className={cn(
                        "h-6 w-6",
                        day.transportation.type === "flight" ? "text-blue-500" : "text-green-500"
                      )} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium capitalize">{day.transportation.type}</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">From</label>
                          <Input 
                            value={day.transportation.from || ''} 
                            onChange={(e) => onAddTransportation({
                              ...day.transportation,
                              from: e.target.value
                            })}
                            placeholder="Origin" 
                            className="text-sm h-8"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">To</label>
                          <Input 
                            value={day.transportation.to || ''} 
                            onChange={(e) => onAddTransportation({
                              ...day.transportation,
                              to: e.target.value
                            })}
                            placeholder="Destination" 
                            className="text-sm h-8"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Price</label>
                          <Input 
                            type="number" 
                            value={day.transportation.price || 0} 
                            onChange={(e) => onAddTransportation({
                              ...day.transportation,
                              price: parseFloat(e.target.value)
                            })}
                            placeholder="Cost" 
                            className="text-sm h-8"
                          />
                        </div>
                        {day.transportation.type === "flight" && (
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Flight #</label>
                            <Input 
                              value={day.transportation.flightNumber || ''} 
                              onChange={(e) => onAddTransportation({
                                ...day.transportation,
                                flightNumber: e.target.value
                              })}
                              placeholder="Flight number" 
                              className="text-sm h-8"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 bg-gray-50 rounded-md border border-dashed border-gray-300">
                  <p className="text-gray-500 text-sm">No transportation added</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => setShowTransportationDialog(true)}
                  >
                    Add transportation
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
