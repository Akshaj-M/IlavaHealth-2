import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Splash from "@/pages/Splash";
import Login from "@/pages/Login";
import FarmerDashboard from "@/pages/FarmerDashboard";
import BuyerDashboard from "@/pages/BuyerDashboard";
import SellWaste from "@/pages/SellWaste";
import MyOrders from "@/pages/MyOrders";
import Favorites from "@/pages/Favorites";
import Profile from "@/pages/Profile";
import Categories from "@/pages/Categories";
import Cart from "@/pages/Cart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/login" component={Login} />
      <Route path="/home" component={Home} />

      {/* Farmer Routes */}
      <Route path="/farmer" component={FarmerDashboard} />
      <Route path="/sell-waste" component={SellWaste} />

      {/* Buyer Routes */}
      <Route path="/buyer" component={BuyerDashboard} />

      {/* Shared Routes */}
      <Route path="/my-orders" component={MyOrders} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/profile" component={Profile} />
      <Route path="/categories" component={Categories} />
      <Route path="/cart" component={Cart} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Switch>
            <Route path="/" component={Splash} />
            <Route path="/home" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/farmer" component={FarmerDashboard} />
            <Route path="/buyer" component={BuyerDashboard} />
            <Route path="/sell-waste" component={SellWaste} />
            <Route path="/my-orders" component={MyOrders} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/profile" component={Profile} />
            <Route path="/categories" component={Categories} />
            <Route path="/cart" component={Cart} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;