import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, DollarSign, TrendingUp, Users, Eye, Settings, RefreshCw } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Payments = () => {
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: true,
    cryptoEnabled: false,
    minimumDeposit: 5,
    maximumDeposit: 1000,
    currency: "USD"
  });

  const paymentStats = [
    { title: "Total Revenue", value: "$45,230.89", change: "+20.1%", icon: DollarSign },
    { title: "Active Transactions", value: "2,350", change: "+180", icon: CreditCard },
    { title: "Success Rate", value: "98.5%", change: "+2.1%", icon: TrendingUp },
    { title: "Active Users", value: "1,240", change: "+19%", icon: Users }
  ];

  const recentTransactions = [
    {
      id: "TXN-2024-001",
      user: "john.doe@example.com",
      amount: 150.00,
      method: "Stripe",
      status: "completed",
      date: "2024-01-15 14:30:00",
      type: "deposit"
    },
    {
      id: "TXN-2024-002",
      user: "jane.smith@example.com",
      amount: 75.50,
      method: "PayPal",
      status: "pending",
      date: "2024-01-15 13:45:00",
      type: "deposit"
    },
    {
      id: "TXN-2024-003",
      user: "mike.wilson@example.com",
      amount: 25.00,
      method: "Crypto",
      status: "failed",
      date: "2024-01-15 12:20:00",
      type: "withdrawal"
    },
    {
      id: "TXN-2024-004",
      user: "sarah.connor@example.com",
      amount: 200.00,
      method: "Stripe",
      status: "completed",
      date: "2024-01-15 11:15:00",
      type: "deposit"
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "pending": return "secondary";
      case "failed": return "destructive";
      default: return "outline";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Payment Management</h1>
            <p className="text-muted-foreground">Monitor and configure payment systems</p>
          </div>
          <Button className="primary-gradient hover-glow">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Payment Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {paymentStats.map((stat) => (
            <Card key={stat.title} className="glass-card">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold primary-gradient bg-clip-text text-transparent">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-400">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Payment Settings</TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            {recentTransactions.map((txn) => (
              <Card key={txn.id} className="glass-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">{txn.id}</p>
                      <p className="text-sm text-muted-foreground">{txn.user}</p>
                      <p className="text-xs text-muted-foreground">{txn.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${txn.type === "deposit" ? "text-green-500" : "text-red-500"}`}>
                      {txn.type === "deposit" ? "+" : "-"}${txn.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">{txn.method}</p>
                    <Badge variant={getStatusVariant(txn.status)}>{txn.status}</Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Payment Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Payment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select value={paymentSettings.currency} onValueChange={(value) => setPaymentSettings({...paymentSettings, currency: value})}>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Minimum Deposit</Label>
                    <Input
                      type="number"
                      value={paymentSettings.minimumDeposit}
                      onChange={(e) => setPaymentSettings({...paymentSettings, minimumDeposit: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Maximum Deposit</Label>
                    <Input
                      type="number"
                      value={paymentSettings.maximumDeposit}
                      onChange={(e) => setPaymentSettings({...paymentSettings, maximumDeposit: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="methods" className="space-y-4">
            <Card className="glass-card space-y-6 p-4">
              {["Stripe", "PayPal", "Cryptocurrency"].map((method) => {
                const key = method.toLowerCase();
                return (
                  <div key={method} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{method} Integration</Label>
                      <p className="text-sm text-muted-foreground">Accept {method} payments</p>
                    </div>
                    <Switch
                      checked={paymentSettings[`${key}Enabled` as keyof typeof paymentSettings] as boolean}
                      onCheckedChange={(checked) =>
                        setPaymentSettings({...paymentSettings, [`${key}Enabled`]: checked})
                      }
                    />
                  </div>
                );
              })}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div>
                  <Label>Stripe Secret Key</Label>
                  <Input type="password" placeholder="sk_live_..." />
                </div>
                <div>
                  <Label>PayPal Client ID</Label>
                  <Input placeholder="PayPal client ID" />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
