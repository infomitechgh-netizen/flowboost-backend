// src/pages/UserSettings.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Save, User, Bell, Shield, Palette, Settings } from "lucide-react";
import { ToggleRow } from "@/components/ToggleRow";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
// ---- Fetch user profile ----
const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get( `${BASE_URL}/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user; // includes balance
};

// ---- Save user settings ----
const saveUserSettings = async (payload: any) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    `${BASE_URL}/api/users/settings`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.user;
};

const UserSettings = ({ setGlobalUser }: { setGlobalUser?: any }) => {
  const [settings, setSettings] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    timezone: "UTC",
    language: "English",
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotionalEmails: false,
    twoFactorAuth: false,
    theme: "dark",
    compactView: false,
    balance: 0, // <-- keep balance
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("profile");

  const [tabChanges, setTabChanges] = useState({
    profile: false,
    notifications: false,
    security: false,
    preferences: false,
  });

  const tabFields: Record<string, (keyof typeof settings)[]> = {
    profile: ["firstName", "lastName", "email", "phone"],
    notifications: [
      "emailNotifications",
      "smsNotifications",
      "orderUpdates",
      "promotionalEmails",
    ],
    security: ["twoFactorAuth"],
    preferences: ["theme", "compactView"],
  };

  // ---- Load user on mount ----
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await fetchUserProfile();
        if (!user || !user.name) return;

        const nameParts = user.name.split(" ");
        setSettings((prev) => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email || "",
          phone: user.phone || "",
          balance: user.balance || 0,
        }));

        // Update global top-bar wallet if context provided
        if (setGlobalUser) setGlobalUser(user);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    loadProfile();
  }, [setGlobalUser]);

  // ---- Save handler ----
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const fieldsToSave = tabFields[currentTab].reduce((acc, key) => {
        acc[key] = settings[key];
        return acc;
      }, {} as any);

      if (currentTab === "profile") {
        fieldsToSave.name = `${fieldsToSave.firstName || ""} ${
          fieldsToSave.lastName || ""
        }`.trim();
        delete fieldsToSave.firstName;
        delete fieldsToSave.lastName;
      }

      const updatedUser = await saveUserSettings(fieldsToSave);

      // Update global wallet / top-bar balance
      if (setGlobalUser) setGlobalUser(updatedUser);

      setSettings((prev) => ({
        ...prev,
        balance: updatedUser.balance || prev.balance,
      }));
      setSuccess(true);
      setTabChanges({ ...tabChanges, [currentTab]: false });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab: string) => {
    if (tabChanges[currentTab]) {
      const confirmSave = window.confirm(
        "You have unsaved changes. Save before switching?"
      );
      if (confirmSave) handleSave();
    }
    setCurrentTab(newTab);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start  sm:items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="ml-auto">
            <Button
              onClick={handleSave}
              className="primary-gradient hover-glow"
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/*<p>Wallet Balance: ₵ {settings.balance}</p> */}

        {success && <p className="text-green-500">Settings saved!</p>}
        {error && <p className="text-red-500">{error}</p>}

        <Tabs
          defaultValue="profile"
          value={currentTab}
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* PROFILE */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={settings.firstName}
                      onChange={(e) => {
                        setSettings({ ...settings, firstName: e.target.value });
                        setTabChanges({ ...tabChanges, profile: true });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={settings.lastName}
                      onChange={(e) => {
                        setSettings({ ...settings, lastName: e.target.value });
                        setTabChanges({ ...tabChanges, profile: true });
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => {
                      setSettings({ ...settings, email: e.target.value });
                      setTabChanges({ ...tabChanges, profile: true });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone || ""}
                    onChange={(e) => {
                      setSettings({ ...settings, phone: e.target.value });
                      setTabChanges({ ...tabChanges, profile: true });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "emailNotifications",
                  "smsNotifications",
                  "orderUpdates",
                  "promotionalEmails",
                ].map((field) => (
                  <ToggleRow
                    key={field}
                    label={field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    description={`Toggle ${field}`}
                    checked={
                      settings[field as keyof typeof settings] as boolean
                    }
                    onChange={(val) => {
                      setSettings({ ...settings, [field]: val });
                      setTabChanges({ ...tabChanges, notifications: true });
                    }}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ToggleRow
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security"
                  checked={settings.twoFactorAuth}
                  onChange={(val) => {
                    setSettings({ ...settings, twoFactorAuth: val });
                    setTabChanges({ ...tabChanges, security: true });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* PREFERENCES */}
          <TabsContent value="preferences" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Display Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={settings.theme}
                  onValueChange={(val) => {
                    setSettings({ ...settings, theme: val });
                    setTabChanges({ ...tabChanges, preferences: true });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>

                <ToggleRow
                  label="Compact View"
                  description="Enable compact layout for dashboards"
                  checked={settings.compactView}
                  onChange={(val) => {
                    setSettings({ ...settings, compactView: val });
                    setTabChanges({ ...tabChanges, preferences: true });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserSettings;
