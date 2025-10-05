import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import FurnitureListing from "./pages/FurnitureListing";
import FurnitureDetail from "./pages/FurnitureDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserSignup from "./pages/UserSignup";
import AdminSignup from "./pages/AdminSignup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/about";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import IntegrationTest from "./components/IntegrationTest";
import AuthTest from "./components/AuthTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/furniture" element={<FurnitureListing />} />
              <Route path="/furniture/:id" element={<FurnitureDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/user" element={<UserSignup />} />
              <Route path="/signup/admin" element={<AdminSignup />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/test" element={<IntegrationTest />} />
              <Route path="/auth-test" element={<AuthTest />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
