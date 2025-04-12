import { pgTable, text, serial, integer, date, doublePrecision, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Destination model
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

// Flight model (for mocked flight data)
export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  airline: text("airline").notNull(),
  flightNumber: text("flight_number").notNull(),
  departureCity: text("departure_city").notNull(),
  arrivalCity: text("arrival_city").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  price: doublePrecision("price").notNull(),
  duration: text("duration").notNull(),
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
});

// Hotel model (for mocked hotel data)
export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  imageUrl: text("image_url").notNull(),
  price: doublePrecision("price").notNull(),
  rating: doublePrecision("rating").notNull(),
  amenities: text("amenities").array().notNull(),
});

export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
});

// Activity model
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  destinationId: integer("destination_id").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  price: doublePrecision("price").notNull(),
  duration: text("duration").notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

// Itinerary model
export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalCost: doublePrecision("total_cost").notNull(),
  days: jsonb("days").notNull()
});

export const insertItinerarySchema = createInsertSchema(itineraries).omit({
  id: true,
});

// Define types for our models
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;

export type Flight = typeof flights.$inferSelect;
export type InsertFlight = z.infer<typeof insertFlightSchema>;

export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Itinerary = typeof itineraries.$inferSelect;
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;

// Day type for itinerary
export type ItineraryDay = {
  date: string;
  activities: {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    price: number;
    duration: string;
    startTime?: string;
  }[];
  accommodation?: {
    hotelId: number;
    name: string;
    price: number;
  };
  transportation?: {
    flightId?: number;
    type: string;
    from: string;
    to: string;
    departureTime?: string;
    arrivalTime?: string;
    price: number;
  };
  notes?: string;
};
