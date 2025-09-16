import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import images
import Logo from "@/assets/logo.jpg";
import Title from "@/assets/flowpane.png";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

interface HeaderProps {
  children?: ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  // Notifications state
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [topups, setTopups] = useState<any[]>([]);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchNotifications = async () => {
      try {
        // Fetch tickets
        const ticketsRes = await axios.get(
          `${BASE_URL}/api/tickets/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTickets(ticketsRes.data.slice(-5).reverse()); // last 5 tickets

        // Fetch orders
        const ordersRes = await axios.get(
          `${BASE_URL}/api/orders/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(ordersRes.data.slice(-5).reverse()); // last 5 orders

        // Fetch wallet topups
        const topupsRes = await axios.get(
          `${BASE_URL}/api/wallet/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTopups(topupsRes.data.slice(-5).reverse()); // last 5 topups
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [userId, token]);

  const unreadCount = tickets.filter((t) => !t.seen).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          {children}

          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="Logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <img
              src={Title}
              alt="FlowBoostPanel"
              className="h-16 object-contain"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="w-[300px] pl-9"
            />
          </div>

          {/* 🔔 Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-pulse" />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-96 max-h-96 overflow-y-auto"
            >
              <DropdownMenuItem className="font-bold pointer-events-none">
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* Orders */}
              <DropdownMenuItem className="font-semibold pointer-events-none">
                Orders
              </DropdownMenuItem>
              {orders.length === 0 ? (
                <DropdownMenuItem>No recent orders</DropdownMenuItem>
              ) : (
                orders.map((order) => (
                  <DropdownMenuItem
                    key={order.id}
                    onClick={() => navigate("/orders")}
                    className="flex flex-col items-start"
                  >
                    <span>Order #{order.id}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {order.item} — {order.status}
                    </span>
                  </DropdownMenuItem>
                ))
              )}

              <DropdownMenuSeparator />

              {/* Wallet Top-ups */}
              <DropdownMenuItem className="font-semibold pointer-events-none">
                Wallet Top-ups
              </DropdownMenuItem>
              {topups.length === 0 ? (
                <DropdownMenuItem>No recent top-ups</DropdownMenuItem>
              ) : (
                topups.map((t) => (
                  <DropdownMenuItem
                    key={t.id}
                    onClick={() => navigate("/wallet")}
                    className="flex flex-col items-start"
                  >
                    <span>+${t.amount}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {new Date(t.created_at).toLocaleString()}
                    </span>
                  </DropdownMenuItem>
                ))
              )}

              <DropdownMenuSeparator />

              {/* Tickets */}
              <DropdownMenuItem className="font-semibold pointer-events-none">
                Support Tickets
              </DropdownMenuItem>
              {tickets.length === 0 ? (
                <DropdownMenuItem>No recent tickets</DropdownMenuItem>
              ) : (
                tickets.map((t) => (
                  <DropdownMenuItem
                    key={t.id}
                    onClick={() => navigate("/support")}
                    className="flex flex-col items-start"
                  >
                    <span>{t.subject}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {t.last_message || t.first_message}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/account")}>
                My Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/support")}>
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/login")}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
