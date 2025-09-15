import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Globe,
  Mail,
  Shield,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ToggleRow } from "@/components/ToggleRow";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    maintenance: false,
    registrations: true,
    emailNotifications: true,
    currency: "USD",
    minDeposit: 5,
    maxDeposit: 1000,
  });

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/admin/settings");
        if (res.data.settings) {
          const s = res.data.settings;
          setSettings({
            siteName: s.site_name || "",
            siteDescription: s.site_description || "",
            maintenance: !!s.maintenance,
            registrations: !!s.registrations,
            emailNotifications: !!s.email_notifications,
            currency: s.currency || "USD",
            minDeposit: s.min_deposit || 5,
            maxDeposit: s.max_deposit || 1000,
          });
        }
      } catch (err) {
        console.error("Error fetching admin settings:", err);
      }
    };
    fetchSettings();
  }, []);

  // Save settings to backend
  const handleSave = async () => {
    try {
      await axios.post("/api/admin/settings", settings);
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Configure your application settings
            </p>
          </div>
          <Button onClick={handleSave} className="primary-gradient hover-glow">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* GENERAL TAB */}
          <TabsContent value="general" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" /> Site Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        siteDescription: e.target.value,
                      })
                    }
                  />
                </div>
                <ToggleRow
                  label="Maintenance Mode"
                  description="Temporarily disable site access"
                  checked={settings.maintenance}
                  onChange={(val) =>
                    setSettings({ ...settings, maintenance: val })
                  }
                />
                <ToggleRow
                  label="User Registrations"
                  description="Allow new user registrations"
                  checked={settings.registrations}
                  onChange={(val) =>
                    setSettings({ ...settings, registrations: val })
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* EMAIL TAB */}
          <TabsContent value="email" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" /> Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input id="smtpUser" placeholder="noreply@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPass">SMTP Password</Label>
                  <Input id="smtpPass" type="password" placeholder="••••••••" />
                </div>
                <ToggleRow
                  label="Email Notifications"
                  description="Send order and account notifications"
                  checked={settings.emailNotifications}
                  onChange={(val) =>
                    setSettings({ ...settings, emailNotifications: val })
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMS TAB */}
          <TabsContent value="sms" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> SMS Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smsProvider">SMS Provider</Label>
                  <Select defaultValue="twilio">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="vonage">Vonage</SelectItem>
                      <SelectItem value="messagebird">MessageBird</SelectItem>
                      <SelectItem value="aws-sns">AWS SNS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsApiKey">API Key</Label>
                  <Input
                    id="smsApiKey"
                    type="password"
                    placeholder="Enter your SMS API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsApiSecret">API Secret</Label>
                  <Input
                    id="smsApiSecret"
                    type="password"
                    placeholder="Enter your SMS API secret"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsSenderId">Sender ID</Label>
                  <Input id="smsSenderId" placeholder="DRIPPANEL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsWebhookUrl">Webhook URL</Label>
                  <Input
                    id="smsWebhookUrl"
                    placeholder="https://yoursite.com/webhook/sms"
                  />
                </div>
                <ToggleRow
                  label="SMS Notifications"
                  description="Enable SMS notifications for users"
                  checked={true}
                  onChange={() => {}}
                />
                <ToggleRow
                  label="SMS OTP Verification"
                  description="Use SMS for two-factor authentication"
                  checked={false}
                  onChange={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input id="sessionTimeout" type="number" placeholder="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input id="maxLoginAttempts" type="number" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">
                    Minimum Password Length
                  </Label>
                  <Input id="passwordMinLength" type="number" placeholder="8" />
                </div>
                <ToggleRow
                  label="Two-Factor Authentication"
                  description="Require 2FA for admin accounts"
                  checked={false}
                  onChange={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* PAYMENTS TAB */}
          <TabsContent value="payments" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) =>
                      setSettings({ ...settings, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minDeposit">Minimum Deposit</Label>
                  <Input
                    id="minDeposit"
                    type="number"
                    value={settings.minDeposit}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        minDeposit: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDeposit">Maximum Deposit</Label>
                  <Input
                    id="maxDeposit"
                    type="number"
                    value={settings.maxDeposit}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxDeposit: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                  <Input id="paypalClientId" placeholder="PayPal client ID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripePublishable">
                    Stripe Publishable Key
                  </Label>
                  <Input id="stripePublishable" placeholder="pk_live_..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
