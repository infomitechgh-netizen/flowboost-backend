import axios from "axios";

const API_KEY = process.env.DRIPFEED_API_KEY;
const API_URL = process.env.DRIPFEED_API_URL;

// Fetch services from DripFeedPanel
export const getDripfeedServices = async (req, res) => {
  try {
    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: "services",
    });

    // Map to frontend-friendly format
    const services = response.data.map(s => ({
      id: s.service,
      name: s.name,
      category: s.category,
      price: Number(s.rate),
      min_quantity: Number(s.min),
      max_quantity: Number(s.max),
      delivery_time: s.refill ? "Dripfeed" : "Standard",
      status: "active",
    }));

    res.json(services);
  } catch (err) {
    console.error("Dripfeed services error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// Place order via DripFeedPanel
export const createDripfeedOrder = async (req, res) => {
  try {
    const { service_id, link, quantity } = req.body;

    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: "add",
      service: service_id,
      link,
      quantity,
    });

    res.status(201).json({ order: response.data.order });
  } catch (err) {
    console.error("Dripfeed order error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to place order" });
  }
};
