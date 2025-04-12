import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Destinations from "@/pages/Destinations";
import Flights from "@/pages/Flights";
import Hotels from "@/pages/Hotels";
import ItineraryPlanner from "@/pages/ItineraryPlanner";
import SavedItineraries from "@/pages/SavedItineraries";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/destinations" component={Destinations} />
        <Route path="/flights" component={Flights} />
        <Route path="/hotels" component={Hotels} />
        <Route path="/planner" component={ItineraryPlanner} />
        <Route path="/itineraries" component={SavedItineraries} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
