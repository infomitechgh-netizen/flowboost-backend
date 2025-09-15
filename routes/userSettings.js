// backend/routes/userSettings.js
import express from "express";
import { db } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET user settings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM user_settings WHERE user_id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Settings not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE user settings
router.post("/", authMiddleware, async (req, res) => {
  const settings = req.body;
  try {
    await db.query(
      `UPDATE user_settings SET
        phone = ?,
        timezone = ?,
        language = ?,
        email_notifications = ?,
        sms_notifications = ?,
        order_updates = ?,
        promotional_emails = ?,
        two_factor_auth = ?,
        theme = ?,
        compact_view = ?,
        updated_at = NOW()
      WHERE user_id = ?`,
      [
        settings.phone,
        settings.timezone,
        settings.language,
        settings.emailNotifications ? 1 : 0,
        settings.smsNotifications ? 1 : 0,
        settings.orderUpdates ? 1 : 0,
        settings.promotionalEmails ? 1 : 0,
        settings.twoFactorAuth ? 1 : 0,
        settings.theme,
        settings.compactView ? 1 : 0,
        req.user.id,
      ]
    );
    res.json({ success: true, message: "Settings updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
