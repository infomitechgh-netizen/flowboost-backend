// backend/controllers/serviceController.js
import axios from "axios";
import qs from "qs";
import pool from "../config/db.js";

const API_KEY = process.env.DRIPFEEDPANEL_KEY;
const BASE_URL = process.env.DRIPFEEDPANEL_URL;

/**
 * Sync services from DripFeedPanel to local DB
 */
export const syncDripFeedServices = async (req, res) => {
  try {
    // Only admin can trigger sync
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can sync services" });
    }

    // Fetch services from DripFeedPanel
    const response = await axios.post(
      BASE_URL,
      qs.stringify({ key: API_KEY, action: "services" }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const rawServices = response.data?.result || response.data || [];
    const errors = [];

    // Parse markup and conversion
    const markup = parseFloat(req.body.markupPercentage) || 0;
    const USD_TO_GHS = 14; // ⚡ Replace with live rate if needed

    for (const s of rawServices) {
      try {
        const [rows] = await pool.query(
          "SELECT id FROM services WHERE api_service_id = ?",
          [s.service]
        );

        // Convert to GHS and apply markup
        const priceUSD = parseFloat(s.rate);
        const userPrice = (priceUSD + (priceUSD * markup) / 100) * USD_TO_GHS;

        if (rows.length > 0) {
          // Update existing service
          await pool.query(
            `UPDATE services SET
              name = ?, 
              category = ?, 
              api_price = ?,
              user_price = ?, 
              min_quantity = ?, 
              max_quantity = ?, 
              delivery_time = ?, 
              status = 'active',
              updated_at = NOW()
            WHERE api_service_id = ?`,
            [s.name, s.category, priceUSD, userPrice, s.min, s.max, s.refill, s.service]
          );
        } else {
          // Insert new service
          await pool.query(
            `INSERT INTO services
              (api_service_id, name, category, api_price, user_price, min_quantity, max_quantity, delivery_time, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
            [s.service, s.name, s.category, priceUSD, userPrice, s.min, s.max, s.refill]
          );
        }
      } catch (err) {
        console.error(`Failed to process service ${s.name}:`, err.message);
        errors.push(`Service ${s.name} failed: ${err.message}`);
      }
    }

    return res.status(200).json({
      message: `DripFeedPanel services synced successfully with ${markup}% markup and converted to GHS!`,
      errors: errors.length ? errors : null,
    });
  } catch (err) {
    console.error("Error syncing DripFeedPanel services:", err.response?.data || err.message);
    return res.status(500).json({ message: "Failed to sync services" });
  }
};

// Get all unique categories
export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT category FROM services");
    const categories = rows.map(row => row.category);
    res.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};


// GET /api/services
export const getServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search ? req.query.search.toLowerCase() : "";
    const category = req.query.category ? req.query.category.toLowerCase() : "";
    const forOrderPage = req.query.forOrderPage === "true"; // detect order page

    const offset = (page - 1) * limit;

    let baseQuery = "SELECT * FROM services WHERE 1";
    let countQuery = "SELECT COUNT(*) as total FROM services WHERE 1";
    const params = [];
    const countParams = [];

    if (search) {
      baseQuery += " AND LOWER(name) LIKE ?";
      countQuery += " AND LOWER(name) LIKE ?";
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    if (category) {
      baseQuery += " AND LOWER(category) LIKE ?";
      countQuery += " AND LOWER(category) LIKE ?";
      params.push(`%${category}%`);
      countParams.push(`%${category}%`);
    }

    // Only paginate if NOT for order page
    if (!forOrderPage) {
      baseQuery += " ORDER BY id DESC LIMIT ? OFFSET ?";
      params.push(limit, offset);
    } else {
      baseQuery += " ORDER BY id DESC"; // fetch all for order page
    }

    const [services] = await pool.query(baseQuery, params);

    if (!forOrderPage) {
      const [[{ total }]] = await pool.query(countQuery, countParams);
      const totalPages = Math.ceil(total / limit);
      res.json({ services, currentPage: page, totalPages });
    } else {
      res.json({ services });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    let query = "SELECT * FROM services WHERE status = 'active'";
    const params = [];

    if (category) {
      query += " AND category LIKE ?";
      params.push(`%${category}%`);
    }

    query += " ORDER BY name ASC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching services by category:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};



