// backend/controllers/settingsController.js
import pool from "../config/db.js";

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query("SELECT * FROM user_settings WHERE user_id = ?", [userId]);

    if (rows.length === 0) return res.json({ settings: null });

    res.json({ settings: rows[0] });
  } catch (err) {
    console.error("Error fetching user settings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update or insert user settings
export const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;

    const [rows] = await pool.query("SELECT * FROM user_settings WHERE user_id = ?", [userId]);

    if (rows.length === 0) {
      // Insert new settings
      await pool.query(
        `INSERT INTO user_settings
        (user_id, first_name, last_name, phone, timezone, language, email_notifications, sms_notifications, order_updates, promotional_emails, two_factor_auth, theme, compact_view)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          settings.firstName,
          settings.lastName,
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
        ]
      );
    } else {
      // Update existing settings
      await pool.query(
        `UPDATE user_settings SET
          first_name=?, last_name=?, phone=?, timezone=?, language=?, email_notifications=?, sms_notifications=?, order_updates=?, promotional_emails=?, two_factor_auth=?, theme=?, compact_view=?, updated_at=NOW()
          WHERE user_id=?`,
        [
          settings.firstName,
          settings.lastName,
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
          userId,
        ]
      );
    }

    res.json({ message: "Settings saved successfully" });
  } catch (err) {
    console.error("Error saving user settings:", err);
    res.status(500).json({ message: "Server error" });
  }
};
