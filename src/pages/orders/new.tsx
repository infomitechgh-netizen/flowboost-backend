import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaTiktok,
  FaSpotify,
  FaApple,
} from "react-icons/fa";
import {
  SiTelegram,
  SiThreads,
  SiDiscord,
  SiTwitch,
  SiLinkedin,
  SiSoundcloud,
  SiReddit,
  SiCcleaner,
} from "react-icons/si";
import axios from "axios";
import { RefreshCcwIcon, Settings2Icon, Undo2Icon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  CreditCard,
  Smartphone,
  Bitcoin,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const CATEGORIES = [
  { name: "YouTube", icon: <FaYoutube size={24} color="#FF0000" /> },
  { name: "Instagram", icon: <FaInstagram size={24} color="#C13584" /> },
  { name: "Facebook", icon: <FaFacebook size={24} color="#1877F2" /> },
  { name: "Twitter", icon: <FaTwitter size={24} color="#1DA1F2" /> },
  { name: "TikTok", icon: <FaTiktok size={24} color="#000000" /> },
  { name: "Spotify", icon: <FaSpotify size={24} color="#1DB954" /> },
  { name: "Telegram", icon: <SiTelegram size={24} color="#0088CC" /> },
  { name: "Threads", icon: <SiThreads size={24} color="#000000" /> },
  { name: "Discord", icon: <SiDiscord size={24} color="#5865F2" /> },
  { name: "Twitch", icon: <SiTwitch size={24} color="#9146FF" /> },
  { name: "LinkedIn", icon: <SiLinkedin size={24} color="#0A66C2" /> },
  { name: "SoundCloud", icon: <SiSoundcloud size={24} color="#FF8800" /> },
  { name: "Reddit", icon: <SiReddit size={24} color="#FF4500" /> },
  { name: "Other", icon: <SiThreads size={24} color="#AAAAAA" /> },
];

interface Service {
  id: number;
  name: string;
  category: string;
  user_price: number;
  api_price: number;
  min_quantity: number;
  max_quantity: number;
  delivery_time: string;
  status: string;
}

const NewOrderPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [charge, setCharge] = useState(0);

  // Fetch all services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BASE_URL}/api/services?limit=100`,
          // "http://localhost:5000/api/services?limit=100",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setServices(res.data.services);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  const selectedService =
    services.find((s) => s.id === selectedServiceId) || null;

  useEffect(() => {
    if (selectedService) {
      setCharge((selectedService.user_price * quantity) / 1000);
    }
  }, [selectedService, quantity]);

  const handlePlaceOrder = async () => {
    if (!selectedService) return alert("Please select a service");
    if (!link) return alert("Please enter a link");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api/orders`,
        // "http://localhost:5000/api/orders",
        {
          service_id: selectedService.id,
          link,
          quantity,
          price: (selectedService.api_price * quantity) / 1000,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      setLink("");
      setQuantity(selectedService.min_quantity);
    } catch (err: any) {
      console.error(err);
      alert(
        "Failed to place order: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Place New Order</h1>
        <p className=" text-muted-foreground">
          Load your wallet and enjoy placing your orders
        </p>
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.name}
              className={`flex items-center p-4 transition ${
                selectedCategory === cat.name
                  ? "bg-primary text-white"
                  : "bg-white text-gray-800"
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.icon}
              <span className="ml-1">{cat.name}</span>
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setSelectedCategory(null)}
            className="bg-primary hover-glow flex items-center"
          >
            <RefreshCcwIcon />
            Reset Category
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass-card md:col-span-2 pt-5">
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold primary-gradient bg-clip-text text-transparent"></div>
              {/* Order Form */}
              <div className="space-y-4 max-w-md mt-6">
                <div>
                  <Label>Service</Label>
                  <select
                    value={selectedServiceId || ""}
                    onChange={(e) =>
                      setSelectedServiceId(Number(e.target.value))
                    }
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select service</option>
                    {filteredServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    placeholder="Enter post/profile URL"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={selectedService?.min_quantity || 1}
                    max={selectedService?.max_quantity || 1000000}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  {selectedService && (
                    <p className="text-sm text-muted-foreground">
                      Min: {selectedService.min_quantity} - Max:{" "}
                      {selectedService.max_quantity}
                    </p>
                  )}
                </div>

                {selectedService && (
                  <>
                    <p className="text-sm">
                      Average time: {selectedService.delivery_time}
                    </p>
                    <p className="text-sm font-medium">
                      Charge: ₵{charge.toFixed(2)}
                    </p>
                  </>
                )}

                <Button
                  className="primary-gradient w-full"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Add Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="number" placeholder="Amount (GHS)" />
              <Button className="w-full primary-gradient hover-glow flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewOrderPage;
