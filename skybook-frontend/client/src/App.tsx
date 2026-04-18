import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { setRedirectFn } from "./services/api";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";

/**
 * SkyBook Frontend - Premium Flight Booking Application
 * Design: Elevated Luxury with Modern Minimalism
 * Color Palette: Deep Ink, Luxe Gold, Sky Blue, Cream
 * Typography: Playfair Display (display), Outfit (body)
 */

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/search"} component={Search} />
      <Route path={"/booking/:id"} component={Booking} />
      <Route path={"/payment/:id"} component={Payment} />
      <Route path={"/my-bookings"} component={MyBookings} />
      <Route path={"/auth"} component={Auth} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    setRedirectFn(setLocation);
  }, [setLocation]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Navbar />
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
