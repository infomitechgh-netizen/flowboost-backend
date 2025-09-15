import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
  Users,
  BarChart3,
  DollarSign,
  CheckCircle,
  LayoutDashboardIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/api/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaMoneyCheck } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
//import SyncServicesUI from "@/components/dashboard/SyncServicesUI";
import SyncServicesModal from "@/components/dashboard/SyncServicesModal";

//import { useState } from "react"
import { Plus, MessageCircle, Clock, AlertCircle } from "lucide-react";
//import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
//import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
//import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
//import { DashboardLayout } from "@/components/layout/DashboardLayout"

// Define what we expect from the profile API
interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  balance: number;
  member_since: string;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const data = await getUserProfile(token);
        setUser(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUser();
  }, []);

  // ✅ Format created_at nicely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Loading...";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- Sync DripFeedPanel services ---
  // Add state for markup
  const [markup, setMarkup] = useState(20); // default 20%
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Updated sync function
  const handleSyncServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      toast({
        title: "Sync started",
        description: "DripFeedPanel services are being synced...",
        variant: "default",
      });

      const res = await fetch("http://localhost:5000/api/services/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ markupPercentage: markup }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sync failed");

      let description = data.message;
      if (data.errors && data.errors.length) {
        description += "\n\nSome services failed:\n" + data.errors.join("\n");
      }

      toast({
        title: "Sync completed",
        description,
        variant: "success",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Sync failed",
        description: err.message || "Error syncing services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Stats Section Header with Buttons */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">
            <LayoutDashboardIcon className="w-8 h-8 text-primary" /> Stats
            Overview
          </h1>

          <div className="flex justify-end gap-3 mb-4">
            <Button
              variant="outline"
              className="hover:bg-blue-600 hover:text-white transition-colors"
            >
              Export Data
            </Button>
            <Button
              variant="outline"
              className="bg-blue-600 hover:text-white transition-colors"
            >
              New Order
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value="1,248"
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Revenue"
            value="$42,731"
            icon={DollarSign}
            variant="success"
          />
          <StatsCard
            title="Reports Reviewed"
            value="328"
            icon={CheckCircle}
            variant="warning"
          />
          <StatsCard title="Analytics" value="Live" icon={BarChart3} />
        </div>

        {/* Activity + Management */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-lg border bg-card p-6 glass-card">
              <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
              <div className="space-y-3">
                <Button className="w-full">Manage Users</Button>
                <Button variant="outline" className="w-full">
                  View Reports
                </Button>
                <Button variant="outline" className="w-full">
                  System Settings
                </Button>

                {/* Sync DripFeedPanel Services */}

                <SyncServicesModal markup={markup} setMarkup={setMarkup} />
              </div>
            </div>

            {/* Admin Info */}
            <div className="rounded-lg border bg-card p-6 glass-card">
              <h3 className="text-lg font-semibold mb-4">Admin Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">
                    {user?.name || "Loading..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">
                    {user?.email || "Loading..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <span className="text-sm font-medium capitalize">
                    {user?.role || "Loading..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Joined</span>
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

export default AdminDashboard;
