import express from "express";
import pool from "../config/db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ results: [] });

  try {
    const [services] = await pool.query(
      "SELECT id, name, category FROM services WHERE name LIKE ? OR category LIKE ?",
      [`%${q}%`, `%${q}%`]
    );

    const [orders] = await pool.query(
      "SELECT id, link, status FROM orders WHERE link LIKE ? OR status LIKE ?",
      [`%${q}%`, `%${q}%`]
    );

    const results = [
      ...services.map((s) => ({ ...s, type: "Service" })),
      ...orders.map((o) => ({ ...o, type: "Order" })),
    ];

    res.json({ results });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

export default router;
