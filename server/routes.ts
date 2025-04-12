import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDestinationSchema, 
  insertFlightSchema, 
  insertHotelSchema, 
  insertActivitySchema,
  insertItinerarySchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes prefix
  const apiPrefix = "/api";

  // Destinations Routes
  app.get(`${apiPrefix}/destinations`, async (req: Request, res: Response) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  app.get(`${apiPrefix}/destinations/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }

      const destination = await storage.getDestination(id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }

      res.json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destination" });
    }
  });

  app.post(`${apiPrefix}/destinations`, async (req: Request, res: Response) => {
    try {
      const validatedData = insertDestinationSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid destination data", errors: validatedData.error.format() });
      }

      const destination = await storage.createDestination(validatedData.data);
      res.status(201).json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to create destination" });
    }
  });

  // Flights Routes
  app.get(`${apiPrefix}/flights`, async (req: Request, res: Response) => {
    try {
      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;
      
      const flights = await storage.getFlights(from, to);
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flights" });
    }
  });

  app.get(`${apiPrefix}/flights/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid flight ID" });
      }

      const flight = await storage.getFlight(id);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }

      res.json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flight" });
    }
  });

  app.post(`${apiPrefix}/flights`, async (req: Request, res: Response) => {
    try {
      const validatedData = insertFlightSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid flight data", errors: validatedData.error.format() });
      }

      const flight = await storage.createFlight(validatedData.data);
      res.status(201).json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to create flight" });
    }
  });

  // Hotels Routes
  app.get(`${apiPrefix}/hotels`, async (req: Request, res: Response) => {
    try {
      const city = req.query.city as string | undefined;
      
      const hotels = await storage.getHotels(city);
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotels" });
    }
  });

  app.get(`${apiPrefix}/hotels/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }

      const hotel = await storage.getHotel(id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      res.json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotel" });
    }
  });

  app.post(`${apiPrefix}/hotels`, async (req: Request, res: Response) => {
    try {
      const validatedData = insertHotelSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid hotel data", errors: validatedData.error.format() });
      }

      const hotel = await storage.createHotel(validatedData.data);
      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Failed to create hotel" });
    }
  });

  // Activities Routes
  app.get(`${apiPrefix}/activities`, async (req: Request, res: Response) => {
    try {
      const destinationId = req.query.destinationId 
        ? parseInt(req.query.destinationId as string) 
        : undefined;
      
      if (req.query.destinationId && isNaN(destinationId as number)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      
      const activities = await storage.getActivities(destinationId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get(`${apiPrefix}/activities/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid activity ID" });
      }

      const activity = await storage.getActivity(id);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });

  app.post(`${apiPrefix}/activities`, async (req: Request, res: Response) => {
    try {
      const validatedData = insertActivitySchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid activity data", errors: validatedData.error.format() });
      }

      const activity = await storage.createActivity(validatedData.data);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Itinerary Routes
  app.get(`${apiPrefix}/itineraries`, async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId 
        ? parseInt(req.query.userId as string) 
        : undefined;
      
      if (req.query.userId && isNaN(userId as number)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const itineraries = await storage.getItineraries(userId);
      res.json(itineraries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch itineraries" });
    }
  });

  app.get(`${apiPrefix}/itineraries/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid itinerary ID" });
      }

      const itinerary = await storage.getItinerary(id);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      res.json(itinerary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch itinerary" });
    }
  });

  app.post(`${apiPrefix}/itineraries`, async (req: Request, res: Response) => {
    try {
      const validatedData = insertItinerarySchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid itinerary data", errors: validatedData.error.format() });
      }

      const itinerary = await storage.createItinerary(validatedData.data);
      res.status(201).json(itinerary);
    } catch (error) {
      res.status(500).json({ message: "Failed to create itinerary" });
    }
  });

  app.put(`${apiPrefix}/itineraries/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid itinerary ID" });
      }

      // Validate only the fields being updated
      const updateSchema = z.object({
        name: z.string().optional(),
        userId: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        totalCost: z.number().optional(),
        days: z.any().optional()
      });

      const validatedData = updateSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid itinerary update data", errors: validatedData.error.format() });
      }

      const updatedItinerary = await storage.updateItinerary(id, validatedData.data);
      if (!updatedItinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      res.json(updatedItinerary);
    } catch (error) {
      res.status(500).json({ message: "Failed to update itinerary" });
    }
  });

  app.delete(`${apiPrefix}/itineraries/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid itinerary ID" });
      }

      const success = await storage.deleteItinerary(id);
      if (!success) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete itinerary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
