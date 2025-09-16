// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Wallet, ShoppingCart, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Define the user profile type
interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  balance: number;
  member_since: string;
}

const socket = io(BASE_URL); // replace with your server URL if different

const Dashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeOrders, setActiveOrders] = useState<number>(0);
  const [completedOrders, setCompletedOrders] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch user profile
  const fetchProfile = async () => {
    if (!token) return;
    try {

      const res = await fetch( `${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      console.log("profile response:", data);

      // ✅ the user object is inside data.user
      setUser(data.user);

      // keep balance in localStorage for fallback
      if (data.user?.balance !== undefined) {
        localStorage.setItem("balance", String(data.user.balance));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Fetch order counts
  const fetchActiveOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/orders/active-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch active orders count");
      const data = await res.json();
      setActiveOrders(data.activeCount || 0);
    } catch (err) {
      console.error("Error fetching active orders:", err);
    }
  };

  const fetchCompletedOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/orders/completed-count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch completed orders count");
      const data = await res.json();
      setCompletedOrders(data.completedCount || 0);
    } catch (err) {
      console.error("Error fetching completed orders:", err);
    }
  };

  const fetchTotalOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/orders/total-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch total orders count");
      const data = await res.json();
      setTotalOrders(data.totalCount || 0);
    } catch (err) {
      console.error("Error fetching total orders:", err);
    }
  };

  const fetchAllStats = () => {
    fetchProfile();
    fetchActiveOrders();
    fetchCompletedOrders();
    fetchTotalOrders();
  };

  useEffect(() => {
    fetchAllStats();

    // Listen for real-time order updates
    socket.on("orderUpdated", (payload: { userId: number }) => {
      if (payload.userId === user?.id) {
        fetchAllStats();
      }
    });

    return () => {
      socket.off("orderUpdated");
    };
  }, [user?.id]);

  // Quick action handlers
  const handlePlaceOrder = () => navigate("/placeorder");
  const handleAddFunds = () => navigate("/wallet");
  const handleViewServices = () => navigate("/services");

  return (
    <DashboardLayout user={user}>
      <div className="p-3 sm:p-6 space-y-6">
        {/* Stats Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Account Balance"
            value={`₵${
              user
                ? Number(user.balance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"
            }`}
            change={{ value: 12.3, label: "from last month" }}
            icon={Wallet}
            variant="success"
          />
          <StatsCard
            title="Active Orders"
            value={activeOrders.toString()}
            change={{ value: -2.1, label: "from yesterday" }}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Completed Orders"
            value={completedOrders.toString()}
            change={{ value: 8.7, label: "from last month" }}
            icon={CheckCircle}
            variant="success"
          />
          <StatsCard
            title="Total Orders"
            value={totalOrders.toString()}
            change={{ value: 5.4, label: "from last month" }}
            icon={ShoppingCart}
          />
        </div>

        {/* Recent Activity + Sidebar Widgets */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Right Sidebar Widgets */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-lg border border-border/50 bg-card p-6 glass-card">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full primary-gradient hover-glow"
                  size="lg"
                  onClick={handlePlaceOrder}
                >
                  Place New Order
                </Button>
                <Button
                  variant="outline"
                  className="w-full hover-glow"
                  size="lg"
                  onClick={handleAddFunds}
                >
                  Add Funds
                </Button>
                <Button
                  variant="outline"
                  className="w-full hover-glow"
                  size="lg"
                  onClick={handleViewServices}
                >
                  View Services
                </Button>
              </div>
            </div>

            {/* Account Status */}
            <div className="rounded-lg border border-border/50 bg-card p-6 glass-card">
              <h3 className="text-lg font-semibold mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Full Name
                  </span>
                  <span className="text-sm font-medium">
                    {user?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">
                    {user?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    API Access
                  </span>
                  <span className="text-sm font-medium text-success">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <span className="text-sm font-medium capitalize">
                    {user?.role || "user"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Member Since
                  </span>
                  <span className="text-sm font-medium">
                    {user?.member_since
                      ? new Date(user.member_since).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
