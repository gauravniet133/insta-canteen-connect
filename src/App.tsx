
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
import Orders from "./pages/Orders";
import OrderConfirmation from "./components/OrderConfirmation";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import SellerDashboard from "./pages/SellerDashboard";
import SellerMenuManagement from "./pages/SellerMenuManagement";
import SellerOrderManagement from "./pages/SellerOrderManagement";
import SellerCanteenSettings from "./pages/SellerCanteenSettings";
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
                  <Route path="search" element={<Search />} />
                  <Route path="auth" element={<Auth />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
                  
                  {/* Seller Routes */}
                  <Route path="seller/dashboard" element={<SellerDashboard />} />
                  <Route path="seller/orders" element={<SellerOrderManagement />} />
                  <Route path="seller/menu" element={<SellerMenuManagement />} />
                  <Route path="seller/canteen" element={<SellerCanteenSettings />} />
                  <Route path="seller/settings" element={<SellerCanteenSettings />} />
                  
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
