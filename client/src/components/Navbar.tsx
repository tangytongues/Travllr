import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MobileNavigation } from "./MobileNavigation"; 
import { User, LogOut, Menu, Map, Plane, Hotel, Calendar, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: BookMarked },
    { href: "/destinations", label: "Destinations", icon: Map },
    { href: "/flights", label: "Flights", icon: Plane },
    { href: "/hotels", label: "Hotels", icon: Hotel },
    { href: "/planner", label: "Itinerary Builder", icon: Calendar },
    { href: "/itineraries", label: "Saved Itineraries", icon: BookMarked },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Plane className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">TravelPlanner</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === item.href
                    ? "text-primary"
                    : "text-gray-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8 bg-primary text-white">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1 rounded-md text-sm",
                          location === item.href 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-gray-600 hover:text-primary hover:bg-gray-100"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
