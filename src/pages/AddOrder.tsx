import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import axios from "axios";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaTiktok,
  FaSpotify,
} from "react-icons/fa";
import {
  SiTelegram,
  SiThreads,
  SiDiscord,
  SiTwitch,
  SiLinkedin,
  SiReddit,
  SiSoundcloud,
} from "react-icons/si";

// Categories with icons
const CATEGORIES = [
  { name: "YouTube", icon: <FaYoutube size={30} color="#FF0000" /> },
  { name: "Instagram", icon: <FaInstagram size={30} color="#C13584" /> },
  { name: "Facebook", icon: <FaFacebook size={30} color="#1877F2" /> },
  { name: "Twitter", icon: <FaTwitter size={30} color="#1DA1F2" /> },
  { name: "TikTok", icon: <FaTiktok size={30} color="#000000" /> },
  { name: "Spotify", icon: <FaSpotify size={30} color="#1DB954" /> },
  { name: "Telegram", icon: <SiTelegram size={30} color="#0088CC" /> },
  { name: "Threads", icon: <SiThreads size={30} color="#000000" /> },
  { name: "Discord", icon: <SiDiscord size={30} color="#5865F2" /> },
  { name: "Twitch", icon: <SiTwitch size={30} color="#9146FF" /> },
  { name: "LinkedIn", icon: <SiLinkedin size={30} color="#0A66C2" /> },
  { name: "SoundCloud", icon: <SiSoundcloud size={30} color="#FF8800" /> },
  { name: "Reddit", icon: <SiReddit size={30} color="#FF4500" /> },
  { name: "Other", icon: <SiThreads size={30} color="#AAAAAA" /> },
];

const AddOrder = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [charge, setCharge] = useState(0);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch services when category changes
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.filter(
          (s: any) => s.category.toLowerCase() === selectedCategory.toLowerCase()
        );
        setServices(filtered);
        setSelectedService(null);
        setQuantity(0);
        setCharge(0);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, [selectedCategory, token]);

  // Update charge in real-time
  useEffect(() => {
    if (selectedService && quantity > 0) {
      setCharge((selectedService.price / 1000) * quantity);
    } else {
      setCharge(0);
    }
  }, [selectedService, quantity]);

  const handleSubmit = async () => {
    if (!selectedService || !link || quantity <= 0) {
      return setMessage("Please fill all fields correctly.");
    }

    if (
      quantity < selectedService.min_quantity ||
      quantity > selectedService.max_quantity
    ) {
      return setMessage(
        `Quantity must be between ${selectedService.min_quantity} and ${selectedService.max_quantity}.`
      );
    }

    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          service_id: selectedService.id,
          link,
          quantity,
          price: charge,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully!");
      setSelectedCategory("");
      setSelectedService(null);
      setLink("");
      setQuantity(0);
      setCharge(0);
      setMessage("");
    } catch (err: any) {
      console.error("Order submission error:", err);
      setMessage("Failed to place order: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Place New Order</h1>
        {message && <p className="text-red-500">{message}</p>}

        {/* Category Selection */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-4">
          {CATEGORIES.map((cat) => (
            <Card
              key={cat.name}
              className={`cursor-pointer p-4 text-center ${
                selectedCategory === cat.name ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <div className="mx-auto">{cat.icon}</div>
              <p className="mt-2 font-medium">{cat.name}</p>
            </Card>
          ))}
        </div>

        {/* Service Selection */}
        {selectedCategory && services.length > 0 && (
          <div className="space-y-4 mt-4">
            <label>Service</label>
            <select
              className="w-full border rounded p-2"
              value={selectedService?.id || ""}
              onChange={(e) =>
                setSelectedService(
                  services.find((s) => s.id === parseInt(e.target.value))
                )
              }
            >
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (${s.price}/1000)
                </option>
              ))}
            </select>

            {/* Link input */}
            <label>Link</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter post/profile URL"
            />

            {/* Quantity */}
            <label>Quantity</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              min={selectedService?.min_quantity || 1}
              max={selectedService?.max_quantity || 1000000}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />

            {/* Charge */}
            <p>Charge: ${charge.toFixed(2)}</p>

            {/* Submit */}
            <Button className="primary-gradient w-full" onClick={handleSubmit}>
              Submit Order
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AddOrder;
