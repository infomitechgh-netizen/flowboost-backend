// backend/controllers/authController.js
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

// Helper to generate token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      balance: user.balance || 0 // ✅ add balance here
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "user";

    const [result] = await pool.query(
      "INSERT INTO users (name, email, phone, password, role, balance) VALUES (?, ?, ?, ?, ?, 0)",
      [name, email, phone, hashedPassword, role]
    );

    const token = generateToken({ id: result.insertId, name, email, phone, role, balance: 0 });
    res.status(201).json({ 
      token, 
      role,
      id: result.insertId,
      name,
      balance: 0
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user);

    // ✅ Send user info along with token
  // const token = generateToken(user);

// ✅ Send user info along with token
res.json({ 
  token, 
  role: user.role || "user",
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    balance: user.balance || 0
  }
});

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get profile
export const getProfile = async (req, res) => {
  console.log("REQ.USER:", req.user); // <--- add this
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT id, name, email, role, balance, created_at AS member_since FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

   res.json({ user: rows[0] });

  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// Update user settings
export const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Build SQL dynamically
    const fields = [];
    const values = [];

    for (const key in updates) {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    }

    if (fields.length > 0) {
      await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, [
        ...values,
        userId,
      ]);
    }

    // Fetch the updated user including balance
    const [rows] = await pool.query(
      "SELECT id, name, email, role, balance FROM users WHERE id = ?",
      [userId]
    );

    res.json({ user: rows[0] }); // full user object including balance
  } catch (err) {
    console.error("Update user settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.json({ message: "If this email exists, a reset link has been sent." });
    }

    const user = rows[0];
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    await pool.query("UPDATE users SET reset_token = ? WHERE id = ?", [resetToken, user.id]);

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Send email
    await sendEmail(
      user.email,
      "Password Reset Request",
      `Hello ${user.name},\n\nClick below to reset your password:\n${resetLink}\n\nThis link expires in 15 minutes.`
    );

    res.json({ message: "Password reset link has been sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password = ?, reset_token = NULL WHERE id = ?", [hashedPassword, decoded.id]);

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
