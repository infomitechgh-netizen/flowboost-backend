// src/components/layout/DashboardLayout.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, Wallet, LogOut, Search } from "lucide-react";
import { io, Socket } from "socket.io-client";
import Logo from "@/assets/logo.jpg";
import Title from "@/assets/flowpane.png";
import { AppSidebar } from "./Sidebar";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCartIcon } from "lucide-react";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

type TicketReplyMessage = {
  ticket_id: string;
  content: string;
  // Add other fields if needed
};

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  balance: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: UserProfile | null;
}

export const DashboardLayout = ({ children, user }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const [balance, setBalance] = useState<number>(() => {
    const storedBalance = localStorage.getItem("balance");
    return user?.balance || (storedBalance ? Number(storedBalance) : 0);
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(
    user || null
  );
  const [socket, setSocket] = useState<Socket | null>(null);

  // Notifications
  const [notificationsCount, setNotificationsCount] = useState<number>(0);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("balance");
    navigate("/login");
  };

  // Search function
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${BASE_URL}/api/search?q=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      }
    }, 400);
  };

  // Fetch user profile
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      const profile = data.user || data;
      setCurrentUser(profile);
      setBalance(profile.balance);
      if (profile.balance !== undefined)
        localStorage.setItem("balance", String(profile.balance));
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  // Fetch unread ticket notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/tickets/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotificationsCount(data.count || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setBalance(user.balance);
      localStorage.setItem("balance", String(user.balance));
    } else {
      fetchUser();
    }

    fetchNotifications();
  }, [user]);

  // Socket.IO for wallet updates + ticket notifications
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !currentUser) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });
    setSocket(newSocket);

    // Wallet updates
    newSocket.on(
      "walletUpdated",
      ({ userId, newBalance }: { userId: number; newBalance: number }) => {
        if (currentUser && userId === currentUser.id) {
          setBalance(newBalance);
          localStorage.setItem("balance", String(newBalance));
          setCurrentUser((prev) =>
            prev ? { ...prev, balance: newBalance } : prev
          );
        }
      }
    );

    // Ticket reply notifications
    newSocket.on(
      "ticketReply",
      ({
        userId,
        message,
      }: {
        userId: string;
        message: TicketReplyMessage;
      }) => {
        if (currentUser && userId === String(currentUser.id)) {
          setNotificationsCount((prev) => prev + 1);

          toast(`Admin replied to your ticket #${message.ticket_id}`, {
            action: {
              label: "View",
              onClick: () => navigate(`/support?ticket=${message.ticket_id}`),
            },
          });
        }
      }
    );

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser?.id]);

  return (
    <div className="flex h-screen bg-background text-sm">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-border/50 bg-card">
        <div className="h-16 flex items-center gap-3 px-4 border-b border-border/50">
          <img
            src={Logo}
            alt="Logo"
            className="h-8 w-8 rounded-md object-cover"
          />
          <img
            src={Title}
            alt="FlowBoostPanel"
            className="h-16 object-contain"
          />
        </div>

        <AppSidebar role={currentUser?.role || localStorage.getItem("role")} />

        <div className="p-4 border-t border-border/50">
          <button
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive text-destructive-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-card shadow-lg flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-8 w-8 rounded-md object-cover"
                />
                <img
                  src={Title}
                  alt="FlowBoostPanel"
                  className="h-6 object-contain"
                />
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <AppSidebar
              role={currentUser?.role || localStorage.getItem("role")}
            />

            <div className="p-4 border-t border-border/50">
              <button
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive text-destructive-foreground"
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 py-3 border-b border-border/50 bg-card/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md lg:hidden hover:bg-muted/20"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="hidden md:block max-w-xl mx-auto w-full">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              👋 Welcome back, {currentUser?.name?.split(" ")[0] || "Friend"}!
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-md hover:bg-primary"
              title="Place an Order"
              onClick={() => navigate("/placeorder")}
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>

            {/* Bell Notifications */}
            <button
              className="relative p-2 rounded-md hover:bg-primary"
              title="Notifications"
              onClick={() => {
                setNotificationsCount(0); // reset counter on click
                navigate("/support/usersupport");
              }}
            >
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-destructive text-white text-[10px] px-1">
                  {notificationsCount}
                </span>
              )}
            </button>

            <button
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-muted lg:px-3 lg:gap-2"
              onClick={() => navigate("/wallet")}
              title="Wallet"
            >
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-medium">
                ₵{Number(balance || 0).toFixed(2)}
              </span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-muted"
                  title="Profile"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {currentUser?.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <span className="hidden sm:inline-block text-sm font-medium">
                    {currentUser?.name || "My Account"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
