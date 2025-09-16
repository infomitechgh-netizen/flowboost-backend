import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { FaCashRegister, FaMoneyBill, FaMoneyCheck } from "react-icons/fa";
import { Wallet2 } from "lucide-react";
import {
  Plus,
  CreditCard,
  Smartphone,
  Bitcoin,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
declare global {
  interface Window {
    PaystackPop: any;
  }
}

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // --- Fetch wallet data ---
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/wallet`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setBalance(parseFloat(res.data.balance) || 0);
        setTransactions(res.data.transactions || []);

        const enabledMethods = [
          "mobile money",
          "bank transfer",
          "bitcoin",
          "paypal",
          "paystack",
        ];
        const filtered = res.data.paymentMethods.filter((m: any) =>
          enabledMethods.some((em) => m.name.toLowerCase().includes(em))
        );

        const order = ["mobile money", "bank transfer"];
        const sorted = filtered.sort((a: any, b: any) => {
          const indexA =
            order.indexOf(a.name.toLowerCase()) >= 0
              ? order.indexOf(a.name.toLowerCase())
              : order.length;
          const indexB =
            order.indexOf(b.name.toLowerCase()) >= 0
              ? order.indexOf(b.name.toLowerCase())
              : order.length;
          return indexA - indexB;
        });

        setPaymentMethods(sorted);
      } catch (err) {
        console.error("Wallet fetch error:", err);
        setPaymentMethods([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  // --- Auto-hide messages ---
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleAddFunds = async () => {
    if (!selectedMethod)
      return setErrorMessage("Please select a payment method.");

    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return setErrorMessage("Enter a valid amount.");

    try {
      if (
        selectedMethod.name.toLowerCase().includes("mobile") ||
        selectedMethod.name.toLowerCase().includes("paystack")
      ) {
        // Request reference from backend
        const res = await axios.post(
          `${BASE_URL}/api/wallet/paystack/init`,
          { amount: amt },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Paystack Init Response:", res.data);

        if (res.data?.reference) {
          const handler = window.PaystackPop.setup({
            key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
            email: res.data.email, // ✅ use backend-provided email
            amount: Math.round(amt * 100),

            currency: "GHS",
            ref: res.data.reference,
            onClose: () => {
              console.log("Payment closed by user.");
            },
            callback: (response: any) => {
              (async () => {
                try {
                  const verify = await axios.post(
                    `${BASE_URL}/api/wallet/paystack/verify`,
                    { reference: response.reference },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );

                  setBalance((prev) => prev + verify.data.amount);
                  setSuccessMessage(
                    `Payment successful! GH₵ ${verify.data.amount.toLocaleString()}  added to your wallet.`
                  );

                  const txRes = await axios.get(`${BASE_URL}/api/wallet`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
                  setTransactions(txRes.data.transactions);
                } catch (err) {
                  console.error("Verification error:", err);
                  setErrorMessage("Payment verification failed.");
                }
              })();
            },
          });

          handler.openIframe();
        } else {
          setErrorMessage("Failed to get payment reference.");
        }
      } else {
        setErrorMessage("Payment method not implemented yet.");
      }
    } catch (err) {
      console.error("Add funds error:", err);
      setErrorMessage("Failed to initialize payment.");
    }
  };

  //  if (loading) return <p>Loading wallet...</p>;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Wallet2 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">
              Manage your funds and transactions
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 text-green-700 bg-green-100 border border-green-300 rounded-md">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass-card md:col-span-2 pt-5">
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold primary-gradient bg-clip-text text-transparent">
                GH₵{" "}
                {Number(balance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                Available for orders
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Add Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder="Amount (GHS)"
                value={amount}
                min={1}
                step={0.01}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) setAmount(value);
                }}
              />
              <Button
                className="w-full primary-gradient hover-glow flex items-center"
                onClick={handleAddFunds}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="add-funds" className="space-y-4">
          <TabsList>
            <TabsTrigger value="add-funds">Add Funds</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="add-funds" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Choose Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {paymentMethods.length === 0 && (
                    <p>No payment methods available.</p>
                  )}
                  {paymentMethods.map((method) => (
                    <Card
                      key={method.id}
                      className={`cursor-pointer hover:border-primary transition-colors ${
                        selectedMethod?.id === method.id
                          ? "border-primary border-2"
                          : ""
                      }`}
                      onClick={() => setSelectedMethod(method)}
                    >
                      <CardContent className="p-4 flex items-center space-x-3">
                        {method.name.toLowerCase().includes("paypal") ? (
                          <CreditCard className="w-8 h-8 text-primary" />
                        ) : method.name.toLowerCase().includes("paystack") ||
                          method.name.toLowerCase().includes("mobile") ? (
                          <Smartphone className="w-8 h-8 text-primary" />
                        ) : method.name.toLowerCase().includes("bitcoin") ? (
                          <Bitcoin className="w-8 h-8 text-primary" />
                        ) : (
                          <CreditCard className="w-8 h-8 text-primary" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium">{method.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Fee:{" "}
                            {parseFloat(method.fee_percentage || 0).toFixed(2)}%
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {transactions.length === 0 && <p>No transactions yet.</p>}
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="glass-card">
                <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    {transaction.type === "deposit" ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{transaction.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.type === "deposit"
                          ? "Deposit"
                          : "Order Payment"}{" "}
                        • {transaction.method}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transaction.amount.toLocaleString() > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.amount
                        ? (transaction.amount > 0 ? "+" : "") +
                          "GH₵ " +
                          parseFloat(
                            transaction.amount.toLocaleString()
                          ).toFixed(2)
                        : "GH₵ 0.00"}
                    </p>
                    <div className="flex items-center gap-2 justify-end">
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {transaction.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {transaction.created_at}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;
