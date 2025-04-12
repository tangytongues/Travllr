import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Hotel, Calendar as CalendarIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CITIES, HOTEL_RATING_OPTIONS } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  city: z.string().min(2, {
    message: "City is required",
  }),
  checkIn: z.date({
    required_error: "Check-in date is required",
  }),
  checkOut: z.date({
    required_error: "Check-out date is required",
  }),
  guests: z.string().min(1, {
    message: "Number of guests is required",
  }),
  rooms: z.string().min(1, {
    message: "Number of rooms is required",
  }),
  rating: z.string().min(1, {
    message: "Rating is required",
  }),
  maxPrice: z.number().min(0),
  amenities: z.array(z.string()).optional(),
}).refine(data => data.checkOut > data.checkIn, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
});

interface HotelSearchFormProps {
  onSearch: (data: z.infer<typeof formSchema>) => void;
}

export default function HotelSearchForm({ onSearch }: HotelSearchFormProps) {
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
      guests: '2',
      rooms: '1',
      rating: 'any',
      maxPrice: 500,
      amenities: [],
    },
  });
  
  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    onSearch(values);
  }
  
  const amenities = [
    { id: 'wifi', label: 'Free WiFi' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'pool', label: 'Pool' },
    { id: 'parking', label: 'Free Parking' },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Hotel className="h-5 w-5 text-primary" />
          Hotel Search
        </CardTitle>
        <CardDescription>
          Find perfect accommodations for your stay
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CITIES.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const checkIn = form.getValues("checkIn");
                            return date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                                   (checkIn && date <= checkIn);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guests</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="flex items-center justify-center bg-gray-100 px-3 rounded-l-md border border-r-0 border-gray-200">
                          <Users className="h-4 w-4 text-gray-500" />
                        </div>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          className="rounded-l-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rooms</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="flex items-center justify-center bg-gray-100 px-3 rounded-l-md border border-r-0 border-gray-200">
                          <Hotel className="h-4 w-4 text-gray-500" />
                        </div>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          className="rounded-l-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Rating</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {HOTEL_RATING_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Range (per night): Up to ${field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={50}
                      max={1000}
                      step={50}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Amenities</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {amenities.map((amenity) => (
                      <FormField
                        key={amenity.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={amenity.id}
                              className="flex items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-primary border-gray-300 rounded"
                                  checked={field.value?.includes(amenity.id)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    const currentValue = field.value || [];
                                    const newValues = checked
                                      ? [...currentValue, amenity.id]
                                      : currentValue.filter(
                                          (value) => value !== amenity.id
                                        );
                                    field.onChange(newValues);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-sm cursor-pointer">
                                {amenity.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <Hotel className="mr-2 h-4 w-4" />
              Search Hotels
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
