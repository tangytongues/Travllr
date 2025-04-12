import { useState } from 'react';
import { useLocalStorageItineraries } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import ItinerarySummary from '@/components/ItinerarySummary';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Calendar, Download, Trash2, Share2, Edit, Plus } from 'lucide-react';
import { Link } from 'wouter';

export default function SavedItineraries() {
  const { toast } = useToast();
  const { itineraries, deleteItinerary } = useLocalStorageItineraries();
  const [selectedItinerary, setSelectedItinerary] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleViewItinerary = (itinerary: any) => {
    setSelectedItinerary(itinerary);
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteIndex(index);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (deleteIndex !== null) {
      deleteItinerary(deleteIndex);
      
      toast({
        title: "Itinerary deleted",
        description: "The itinerary has been permanently removed.",
      });
      
      setIsDeleteDialogOpen(false);
      setDeleteIndex(null);
    }
  };
  
  const handleExport = (itinerary: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(itinerary));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${itinerary.name.replace(/\s+/g, '-')}-itinerary.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Itinerary exported",
      description: "Your itinerary has been exported as a JSON file.",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Saved Itineraries</h1>
          <p className="text-gray-600 mt-1">View, edit, and manage your travel plans</p>
        </div>
        
        <Link href="/planner">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Create New Itinerary
          </Button>
        </Link>
      </div>
      
      {itineraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary, index) => (
            <div 
              key={index} 
              onClick={() => handleViewItinerary(itinerary)}
              className="cursor-pointer"
            >
              <ItinerarySummary
                name={itinerary.name}
                startDate={itinerary.startDate}
                endDate={itinerary.endDate}
                days={itinerary.days}
                totalCost={itinerary.totalCost}
                onDelete={(e) => handleDeleteClick(index, e)}
              />
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No Saved Itineraries
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              You haven't created any itineraries yet. Start planning your next adventure!
            </p>
            <Link href="/planner">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Itinerary
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
      
      {/* Itinerary Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedItinerary && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedItinerary.name}</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4 space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>
                      {format(parseISO(selectedItinerary.startDate), 'MMM d, yyyy')} - {format(parseISO(selectedItinerary.endDate), 'MMM d, yyyy')}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{selectedItinerary.days.length} days</span>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    Total Budget: ${selectedItinerary.totalCost.toFixed(2)}
                  </div>
                </div>
                
                {selectedItinerary.days.map((day: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-4">
                      Day {index + 1} - {format(parseISO(day.date), 'EEEE, MMMM d')}
                    </h3>
                    
                    {day.activities.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-600">Activities</h4>
                        <div className="space-y-2">
                          {day.activities.map((activity: any, actIndex: number) => (
                            <div key={actIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div>
                                <div className="font-medium">{activity.name}</div>
                                <div className="text-sm text-gray-500">{activity.duration}</div>
                              </div>
                              <div className="text-primary font-medium">${activity.price}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No activities planned for this day.</p>
                    )}
                    
                    {day.accommodation && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-600">Accommodation</h4>
                        <div className="p-2 bg-blue-50 rounded mt-1">
                          <div className="font-medium">{day.accommodation.name}</div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Per night</span>
                            <span className="text-blue-600 font-medium">${day.accommodation.price}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {day.transportation && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-600">Transportation</h4>
                        <div className="p-2 bg-green-50 rounded mt-1">
                          <div className="font-medium capitalize">{day.transportation.type}</div>
                          <div className="text-sm text-gray-600">
                            {day.transportation.from} to {day.transportation.to}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Price</span>
                            <span className="text-green-600 font-medium">${day.transportation.price}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {day.notes && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-600">Notes</h4>
                        <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded mt-1">
                          {day.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <DialogFooter className="mt-6 flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => handleExport(selectedItinerary)}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Link href="/planner">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Itinerary
                  </Button>
                </Link>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this itinerary? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
