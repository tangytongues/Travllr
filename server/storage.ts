import { 
  User, InsertUser, 
  Destination, InsertDestination, 
  Flight, InsertFlight, 
  Hotel, InsertHotel, 
  Activity, InsertActivity, 
  Itinerary, InsertItinerary, 
  ItineraryDay
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Destination operations
  getDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;

  // Flight operations
  getFlights(from?: string, to?: string): Promise<Flight[]>;
  getFlight(id: number): Promise<Flight | undefined>;
  createFlight(flight: InsertFlight): Promise<Flight>;

  // Hotel operations
  getHotels(city?: string): Promise<Hotel[]>;
  getHotel(id: number): Promise<Hotel | undefined>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;

  // Activity operations
  getActivities(destinationId?: number): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Itinerary operations
  getItineraries(userId?: number): Promise<Itinerary[]>;
  getItinerary(id: number): Promise<Itinerary | undefined>;
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
  updateItinerary(id: number, itinerary: Partial<InsertItinerary>): Promise<Itinerary | undefined>;
  deleteItinerary(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private destinations: Map<number, Destination>;
  private flights: Map<number, Flight>;
  private hotels: Map<number, Hotel>;
  private activities: Map<number, Activity>;
  private itineraries: Map<number, Itinerary>;
  
  private userId: number;
  private destinationId: number;
  private flightId: number;
  private hotelId: number;
  private activityId: number;
  private itineraryId: number;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.flights = new Map();
    this.hotels = new Map();
    this.activities = new Map();
    this.itineraries = new Map();
    
    this.userId = 1;
    this.destinationId = 1;
    this.flightId = 1;
    this.hotelId = 1;
    this.activityId = 1;
    this.itineraryId = 1;

    // Initialize with mock data
    this.initializeDestinations();
    this.initializeFlights();
    this.initializeHotels();
    this.initializeActivities();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const id = this.destinationId++;
    const newDestination: Destination = { ...destination, id };
    this.destinations.set(id, newDestination);
    return newDestination;
  }

  // Flight operations
  async getFlights(from?: string, to?: string): Promise<Flight[]> {
    let flights = Array.from(this.flights.values());
    
    if (from) {
      flights = flights.filter(flight => flight.departureCity.toLowerCase() === from.toLowerCase());
    }
    
    if (to) {
      flights = flights.filter(flight => flight.arrivalCity.toLowerCase() === to.toLowerCase());
    }
    
    return flights;
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async createFlight(flight: InsertFlight): Promise<Flight> {
    const id = this.flightId++;
    const newFlight: Flight = { ...flight, id };
    this.flights.set(id, newFlight);
    return newFlight;
  }

  // Hotel operations
  async getHotels(city?: string): Promise<Hotel[]> {
    let hotels = Array.from(this.hotels.values());
    
    if (city) {
      hotels = hotels.filter(hotel => hotel.city.toLowerCase() === city.toLowerCase());
    }
    
    return hotels;
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async createHotel(hotel: InsertHotel): Promise<Hotel> {
    const id = this.hotelId++;
    const newHotel: Hotel = { ...hotel, id };
    this.hotels.set(id, newHotel);
    return newHotel;
  }

  // Activity operations
  async getActivities(destinationId?: number): Promise<Activity[]> {
    let activities = Array.from(this.activities.values());
    
    if (destinationId !== undefined) {
      activities = activities.filter(activity => activity.destinationId === destinationId);
    }
    
    return activities;
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Itinerary operations
  async getItineraries(userId?: number): Promise<Itinerary[]> {
    let itineraries = Array.from(this.itineraries.values());
    
    if (userId !== undefined) {
      itineraries = itineraries.filter(itinerary => itinerary.userId === userId);
    }
    
    return itineraries;
  }

  async getItinerary(id: number): Promise<Itinerary | undefined> {
    return this.itineraries.get(id);
  }

  async createItinerary(itinerary: InsertItinerary): Promise<Itinerary> {
    const id = this.itineraryId++;
    const newItinerary: Itinerary = { ...itinerary, id };
    this.itineraries.set(id, newItinerary);
    return newItinerary;
  }

  async updateItinerary(id: number, itinerary: Partial<InsertItinerary>): Promise<Itinerary | undefined> {
    const existingItinerary = this.itineraries.get(id);
    
    if (!existingItinerary) {
      return undefined;
    }
    
    const updatedItinerary: Itinerary = { ...existingItinerary, ...itinerary };
    this.itineraries.set(id, updatedItinerary);
    return updatedItinerary;
  }

  async deleteItinerary(id: number): Promise<boolean> {
    return this.itineraries.delete(id);
  }

  // Initialize with mock data
  private initializeDestinations() {
    const destinations: InsertDestination[] = [
      {
        name: "Paris",
        country: "France",
        description: "The City of Light, known for its stunning architecture, art museums, and romantic atmosphere.",
        imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        lat: 48.8566,
        lng: 2.3522
      },
      {
        name: "Tokyo",
        country: "Japan",
        description: "A vibrant metropolis that blends ultramodern and traditional, from neon-lit skyscrapers to historic temples.",
        imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        lat: 35.6762,
        lng: 139.6503
      },
      {
        name: "New York",
        country: "United States",
        description: "The Big Apple, featuring iconic skyscrapers, diverse neighborhoods, and world-class entertainment.",
        imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        lat: 40.7128,
        lng: -74.0060
      },
      {
        name: "Santorini",
        country: "Greece",
        description: "Famous for its dramatic views, stunning sunsets, white-washed houses, and blue domed churches.",
        imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        lat: 36.3932,
        lng: 25.4615
      },
      {
        name: "Bali",
        country: "Indonesia",
        description: "A tropical paradise known for its lush landscapes, beautiful beaches, and vibrant spiritual culture.",
        imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        lat: -8.3405,
        lng: 115.0920
      },
      {
        name: "Venice",
        country: "Italy",
        description: "The City of Canals, famous for its waterways, gondolas, and beautiful architecture.",
        imageUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        lat: 45.4408,
        lng: 12.3155
      }
    ];

    destinations.forEach(destination => {
      this.createDestination(destination);
    });
  }

  private initializeFlights() {
    const flights: InsertFlight[] = [
      {
        airline: "Sky Airways",
        flightNumber: "SA123",
        departureCity: "New York",
        arrivalCity: "Paris",
        departureTime: "2023-06-15T08:00:00Z",
        arrivalTime: "2023-06-15T20:00:00Z",
        price: 650,
        duration: "8h 0m"
      },
      {
        airline: "Global Air",
        flightNumber: "GA456",
        departureCity: "London",
        arrivalCity: "Tokyo",
        departureTime: "2023-06-20T10:30:00Z",
        arrivalTime: "2023-06-21T08:45:00Z",
        price: 900,
        duration: "12h 15m"
      },
      {
        airline: "Oceanic Airlines",
        flightNumber: "OA789",
        departureCity: "Los Angeles",
        arrivalCity: "Bali",
        departureTime: "2023-07-05T23:15:00Z",
        arrivalTime: "2023-07-07T06:30:00Z",
        price: 1100,
        duration: "19h 15m"
      },
      {
        airline: "Mediterranean Flights",
        flightNumber: "MF234",
        departureCity: "Rome",
        arrivalCity: "Santorini",
        departureTime: "2023-07-10T14:20:00Z",
        arrivalTime: "2023-07-10T17:40:00Z",
        price: 320,
        duration: "3h 20m"
      },
      {
        airline: "Atlantic Airways",
        flightNumber: "AA567",
        departureCity: "Paris",
        arrivalCity: "New York",
        departureTime: "2023-06-25T13:45:00Z",
        arrivalTime: "2023-06-25T23:15:00Z",
        price: 700,
        duration: "9h 30m"
      },
      {
        airline: "Eastern Express",
        flightNumber: "EE890",
        departureCity: "Tokyo",
        arrivalCity: "London",
        departureTime: "2023-07-15T00:30:00Z",
        arrivalTime: "2023-07-15T18:15:00Z",
        price: 850,
        duration: "13h 45m"
      },
      {
        airline: "Pacific Voyager",
        flightNumber: "PV321",
        departureCity: "San Francisco",
        arrivalCity: "Tokyo",
        departureTime: "2023-08-01T11:20:00Z",
        arrivalTime: "2023-08-02T15:05:00Z",
        price: 780,
        duration: "11h 45m"
      },
      {
        airline: "Island Hopper",
        flightNumber: "IH654",
        departureCity: "Athens",
        arrivalCity: "Venice",
        departureTime: "2023-08-10T09:10:00Z",
        arrivalTime: "2023-08-10T11:25:00Z",
        price: 240,
        duration: "2h 15m"
      }
    ];

    flights.forEach(flight => {
      this.createFlight(flight);
    });
  }

  private initializeHotels() {
    const hotels: InsertHotel[] = [
      {
        name: "Grand Plaza Hotel",
        city: "Paris",
        address: "15 Rue de Rivoli, 75001 Paris, France",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 250,
        rating: 4.8,
        amenities: ["Free WiFi", "Spa", "Pool", "Restaurant", "Fitness Center"]
      },
      {
        name: "Imperial Tokyo",
        city: "Tokyo",
        address: "1-1-1 Uchisaiwaicho, Chiyoda City, Tokyo 100-0011, Japan",
        imageUrl: "https://images.unsplash.com/photo-1590073242678-70ee3fc28f17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 320,
        rating: 4.9,
        amenities: ["Free WiFi", "Hot Spring", "Restaurant", "Bar", "Concierge"]
      },
      {
        name: "Manhattan Heights",
        city: "New York",
        address: "123 5th Avenue, New York, NY 10010, USA",
        imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 280,
        rating: 4.7,
        amenities: ["Free WiFi", "Room Service", "Gym", "Business Center", "Rooftop Bar"]
      },
      {
        name: "Azure Santorini",
        city: "Santorini",
        address: "Oia 847 02, Greece",
        imageUrl: "https://images.unsplash.com/photo-1570213489059-0aac6626d89c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 420,
        rating: 4.9,
        amenities: ["Free WiFi", "Infinity Pool", "Sea View", "Breakfast", "Airport Shuttle"]
      },
      {
        name: "Bali Paradise Resort",
        city: "Bali",
        address: "Jl. Sunset Road No. 88, Kuta, Bali 80361, Indonesia",
        imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 180,
        rating: 4.6,
        amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Beach Access"]
      },
      {
        name: "Canal View Suites",
        city: "Venice",
        address: "Calle Larga XXII Marzo, 2399, 30124 Venezia VE, Italy",
        imageUrl: "https://images.unsplash.com/photo-1594556787269-7b64f8edc067?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 350,
        rating: 4.8,
        amenities: ["Free WiFi", "Breakfast", "Canal View", "Concierge", "Air Conditioning"]
      }
    ];

    hotels.forEach(hotel => {
      this.createHotel(hotel);
    });
  }

  private initializeActivities() {
    const activities: InsertActivity[] = [
      // Paris activities
      {
        name: "Eiffel Tower Tour",
        destinationId: 1,
        description: "Visit the iconic Eiffel Tower and enjoy panoramic views of Paris.",
        imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 25,
        duration: "2h 0m"
      },
      {
        name: "Louvre Museum Visit",
        destinationId: 1,
        description: "Explore the world's largest art museum and see the Mona Lisa.",
        imageUrl: "https://images.unsplash.com/photo-1565783417722-9d90d34a69f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 15,
        duration: "3h 0m"
      },
      {
        name: "Seine River Cruise",
        destinationId: 1,
        description: "Relax on a scenic cruise along the Seine River and see Paris from the water.",
        imageUrl: "https://images.unsplash.com/photo-1520939817895-060bdaf4bc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 20,
        duration: "1h 30m"
      },

      // Tokyo activities
      {
        name: "Meiji Shrine Visit",
        destinationId: 2,
        description: "Visit Tokyo's most famous Shinto shrine set in a beautiful forest.",
        imageUrl: "https://images.unsplash.com/photo-1583840724806-76918f5fe5f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 0,
        duration: "1h 30m"
      },
      {
        name: "Shibuya Crossing Experience",
        destinationId: 2,
        description: "Experience the world's busiest pedestrian crossing.",
        imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 0,
        duration: "1h 0m"
      },
      {
        name: "Tokyo Skytree Observation",
        destinationId: 2,
        description: "Enjoy breathtaking views from Tokyo's tallest structure.",
        imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 18,
        duration: "2h 0m"
      },

      // New York activities
      {
        name: "Statue of Liberty Tour",
        destinationId: 3,
        description: "Visit America's iconic symbol of freedom.",
        imageUrl: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 24,
        duration: "4h 0m"
      },
      {
        name: "Central Park Bike Rental",
        destinationId: 3,
        description: "Explore Central Park on a bike at your own pace.",
        imageUrl: "https://images.unsplash.com/photo-1517090186835-e348b621c9ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 15,
        duration: "2h 0m"
      },
      {
        name: "Broadway Show",
        destinationId: 3,
        description: "Experience the magic of a Broadway performance.",
        imageUrl: "https://images.unsplash.com/photo-1516307343428-301c0a6eeafb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 120,
        duration: "2h 30m"
      },

      // Santorini activities
      {
        name: "Oia Sunset Tour",
        destinationId: 4,
        description: "Witness the famous sunset in Oia village.",
        imageUrl: "https://images.unsplash.com/photo-1527239441953-cafbcef4b4d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 30,
        duration: "2h 0m"
      },
      {
        name: "Caldera Cruise",
        destinationId: 4,
        description: "Sail around the volcanic caldera and enjoy hot springs.",
        imageUrl: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 85,
        duration: "5h 0m"
      },
      {
        name: "Wine Tasting Tour",
        destinationId: 4,
        description: "Sample local wines from Santorini's unique vineyards.",
        imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 45,
        duration: "3h 0m"
      },

      // Bali activities
      {
        name: "Ubud Monkey Forest",
        destinationId: 5,
        description: "Visit a natural sanctuary for Balinese long-tailed macaques.",
        imageUrl: "https://images.unsplash.com/photo-1578469645742-46cae010e5d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 10,
        duration: "2h 0m"
      },
      {
        name: "Tegallalang Rice Terraces",
        destinationId: 5,
        description: "Explore the stunning landscape of Bali's terraced rice fields.",
        imageUrl: "https://images.unsplash.com/photo-1536152470836-b943b246224c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 8,
        duration: "3h 0m"
      },
      {
        name: "Uluwatu Temple Sunset",
        destinationId: 5,
        description: "Watch the sunset from this cliff-top temple with Kecak fire dance.",
        imageUrl: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 25,
        duration: "3h 0m"
      },

      // Venice activities
      {
        name: "Grand Canal Gondola Ride",
        destinationId: 6,
        description: "Experience Venice from its famous canals on a traditional gondola.",
        imageUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 80,
        duration: "30m"
      },
      {
        name: "St. Mark's Basilica Tour",
        destinationId: 6,
        description: "Explore the opulent cathedral at the heart of Venice.",
        imageUrl: "https://images.unsplash.com/photo-1529260830199-42c24126f198?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 22,
        duration: "1h 30m"
      },
      {
        name: "Murano Glass Factory Visit",
        destinationId: 6,
        description: "Watch master glassblowers create Venetian glass masterpieces.",
        imageUrl: "https://images.unsplash.com/photo-1529154036614-a60975f5c760?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        price: 35,
        duration: "2h 0m"
      }
    ];

    activities.forEach(activity => {
      this.createActivity(activity);
    });
  }
}

export const storage = new MemStorage();
