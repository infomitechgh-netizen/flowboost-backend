// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ServicesProvider } from "./context/ServicesContext"; // ✅ context
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Services from "./pages/Services";
import Orders from "./pages/Orders";
import Wallet from "./pages/Wallet";
import Tickets from "./pages/admin/Tickets";
import Users from "./pages/admin/Users";
import AdminSettings from "./pages/admin/AdminSettings";
import Settings from "./pages/UserSettings";
import Payments from "./pages/admin/Payments";
import Analytics from "./pages/admin/Analytics";
import Documentation from "./pages/support/Documentation";
import UserSupport from "./pages/support/UserSupport";
import { Hero } from "./components/landing/Hero";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AddOrder from "./pages/AddOrder";
import NewOrderPage from "./pages/orders/new";
import PlaceOrder from "./pages/PlaceOrder";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        {/* ✅ Wrap inside ServicesProvider */}
        <ServicesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/services" element={<Services />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/support/tickets" element={<Tickets />} />
              <Route
                path="/support/documentation"
                element={<Documentation />}
              />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/support/usersupport" element={<UserSupport />} />
              <Route path="/admin/payments" element={<Payments />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/addorder" element={<AddOrder />} />
              <Route path="/orders/new" element={<NewOrderPage />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/pages/contact" element={<Contact />} />
              {/* Protected user dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Protected admin dashboard */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ServicesProvider>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
