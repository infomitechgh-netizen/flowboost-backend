import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import io from "socket.io-client";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
interface ActivityItem {
  id: string | number;
  user: string;
  action: string;
  service?: string; // optional for wallet top-ups
  status: "completed" | "processing" | "pending" | "cancelled";
  amount: number;
  timestamp: string;
}

// Connect to Socket.IO
const socket = io(`${BASE_URL}`); // adjust if your server URL differs

export const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [currentUser, setCurrentUser] = useState<{ name: string } | null>(null);

  const token = localStorage.getItem("token");

  // Fetch current user info
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setCurrentUser({ name: data.name });
      } catch (err) {
        console.error("Error fetching user:", err);
        setCurrentUser({ name: "You" }); // fallback
      }
    };

    fetchUser();
  }, [token]);

  const fetchActivities = async () => {
    if (!token) return;

    try {
      // Fetch orders
      const ordersRes = await fetch(`${BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!ordersRes.ok) throw new Error("Failed to fetch orders");
      const ordersData = await ordersRes.json();

      const orderActivities: ActivityItem[] = ordersData.map((order: any) => ({
        id: `order-${order.id}`,
        user: order.user_name || "You",
        action:
          order.status === "pending"
            ? "Order placed"
            : order.status === "processing"
            ? "Order processing"
            : order.status === "completed"
            ? "Order completed"
            : order.status === "cancelled"
            ? "Order cancelled"
            : "Updated",
        service: order.service,
        status: order.status,
        amount: order.price || 0,
        timestamp: new Date(order.created_at).toISOString(),
      }));

      // Fetch wallet transactions
      const walletRes = await fetch(`${BASE_URL}/api/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!walletRes.ok) throw new Error("Failed to fetch wallet transactions");
      const walletData = await walletRes.json();

      const walletActivities: ActivityItem[] = walletData.transactions.map(
        (tx: any) => ({
          id: `wallet-${tx.id}`,
          user: currentUser?.name || "You",
          action: tx.type === "deposit" ? "Wallet top-up" : tx.type,
          status: tx.status === "success" ? "completed" : tx.status,
          amount: tx.amount || 0,
          timestamp: new Date(tx.created_at).toISOString(),
        })
      );

      // Merge & sort by timestamp (newest first)
      const merged = [...orderActivities, ...walletActivities].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(merged.slice(0, 5)); // show latest 5
    } catch (err) {
      console.error("Error fetching recent activities:", err);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Real-time updates
    socket.on("orderUpdated", fetchActivities);
    socket.on("walletUpdated", fetchActivities);

    return () => {
      socket.off("orderUpdated", fetchActivities);
      socket.off("walletUpdated", fetchActivities);
    };
  }, [currentUser]); // re-fetch when user info is loaded

  const timeAgo = (timestamp: string) => {
    const diff = Math.floor(
      (Date.now() - new Date(timestamp).getTime()) / 1000
    );
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const getStatusBadge = (status: ActivityItem["status"]) => {
    const colors = {
      completed: "bg-success/10 text-success border-success/20",
      processing: "bg-primary/10 text-primary border-primary/20",
      pending: "bg-warning/10 text-warning border-warning/20",
      cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-3 sm:space-y-4">
          {activities.length === 0 && (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
          {activities.map((item) => {
            const isWallet = item.action === "Wallet top-up";

            return (
              <div
                key={item.id}
                className="flex items-center space-x-4 rounded-lg border border-border/50 p-4 hover-lift"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback
                    className={
                      isWallet
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-primary/10 text-primary"
                    }
                  >
                    {item.user
                      ? item.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {item.user}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(item.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm ${
                        isWallet ? "text-yellow-600" : "text-muted-foreground"
                      }`}
                    >
                      {item.action} {item.service && `• ${item.service}`}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        ₵{(Number(item.amount) || 0).toFixed(2)}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
