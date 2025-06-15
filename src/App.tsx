
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Canteens from "./pages/Canteens";
import CanteenDetail from "./pages/CanteenDetail";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./components/OrderConfirmation";
import NotFound from "./pages/NotFound";
import Cart from "./components/Cart";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="canteens" element={<Canteens />} />
                  <Route path="canteen/:id" element={<CanteenDetail />} />
                  <Route path="auth" element={<Auth />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <Cart />
            </CartProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
