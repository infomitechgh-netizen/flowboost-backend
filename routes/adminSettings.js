import express from "express";
import pool from "../config/db.js"; // your database connection

const router = express.Router();

// GET admin settings
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM admin_settings LIMIT 1");
    if (rows.length > 0) {
      res.json({ settings: rows[0] });
    } else {
      res.json({ settings: {} });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

// POST admin settings
router.post("/", async (req, res) => {
  try {
    const settings = req.body;
    await pool.query(
      `UPDATE admin_settings SET 
        site_name=?, site_description=?, maintenance=?, registrations=?, 
        email_notifications=?, currency=?, min_deposit=?, max_deposit=?`,
      [
        settings.siteName,
        settings.siteDescription,
        settings.maintenance ? 1 : 0,
        settings.registrations ? 1 : 0,
        settings.emailNotifications ? 1 : 0,
        settings.currency,
        settings.minDeposit,
        settings.maxDeposit,
      ]
    );
    res.json({ message: "Settings saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save settings" });
  }
});

export default router;
