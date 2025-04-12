import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plane, Calendar as CalendarIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CITIES, FLIGHT_CLASSES } from '@/lib/constants';

const formSchema = z.object({
  from: z.string().min(2, {
    message: "From city is required",
  }),
  to: z.string().min(2, {
    message: "To city is required",
  }),
  departDate: z.date({
    required_error: "Departure date is required",
  }),
  returnDate: z.date().optional(),
  passengers: z.string().min(1, {
    message: "Number of passengers is required",
  }),
  class: z.string().min(1, {
    message: "Class is required",
  }),
}).refine(data => data.from !== data.to, {
  message: "From and To cities cannot be the same",
  path: ["to"],
});

interface FlightSearchFormProps {
  onSearch: (data: z.infer<typeof formSchema>) => void;
}

export default function FlightSearchForm({ onSearch }: FlightSearchFormProps) {
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: '',
      to: '',
      passengers: '1',
      class: 'economy',
    },
  });
  
  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    onSearch(values);
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Plane className="h-5 w-5 text-primary" />
          Flight Search
        </CardTitle>
        <CardDescription>
          Find the best flights for your journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={isRoundTrip ? "default" : "outline"}
                onClick={() => setIsRoundTrip(true)}
                className={cn(
                  "flex-1",
                  isRoundTrip ? "bg-primary text-white" : "text-gray-600"
                )}
              >
                Round Trip
              </Button>
              <Button
                type="button"
                variant={!isRoundTrip ? "default" : "outline"}
                onClick={() => setIsRoundTrip(false)}
                className={cn(
                  "flex-1",
                  !isRoundTrip ? "bg-primary text-white" : "text-gray-600"
                )}
              >
                One Way
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select departure city" />
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
              
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select arrival city" />
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Departure Date</FormLabel>
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
              
              {isRoundTrip && (
                <FormField
                  control={form.control}
                  name="returnDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Return Date</FormLabel>
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
                              const departDate = form.getValues("departDate");
                              return date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                                     (departDate && date < departDate);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passengers</FormLabel>
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
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FLIGHT_CLASSES.map((flightClass) => (
                          <SelectItem key={flightClass.value} value={flightClass.value}>
                            {flightClass.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <Plane className="mr-2 h-4 w-4" />
              Search Flights
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
