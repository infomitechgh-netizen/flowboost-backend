import pool from "../config/db.js";

export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT category FROM services");
    const categories = rows.map(r => r.category).filter(Boolean);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
