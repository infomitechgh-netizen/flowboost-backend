// routes/users.js
import express from "express";
import pool from "../config/db.js"; // your MySQL connection
import bcrypt from "bcryptjs";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ===========================
// CREATE A NEW USER
// ===========================
router.post("/", async (req, res) => {
  const { name, email, role, balance } = req.body;
  try {
    const defaultPassword = "password123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, balance, status, created_at) VALUES (?, ?, ?, ?, ?, 'active', NOW())",
      [name, email, hashedPassword, role, balance || 0]
    );

    const [user] = await pool.query(
      "SELECT id, name, email, role, balance, status, created_at FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(user[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// ===========================
// GET LOGGED-IN USER PROFILE
// ===========================
router.get("/profile", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT id, name, email, phone FROM users WHERE id = ?",
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================
// DELETE USER BY ID
// ===========================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [existingUser] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!existingUser.length) {
      return res.status(404).json({ message: "User not found" });
    }

    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// ===========================
// UPDATE USER BY ID (ADMIN)
// ===========================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;

  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!existing.length) {
      return res.status(404).json({ message: "User not found" });
    }

    await pool.query(
      "UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?",
      [name, email, role, status, id]
    );

    const [updated] = await pool.query(
      "SELECT id, name, email, role, status, balance, created_at FROM users WHERE id = ?",
      [id]
    );

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// ===========================
// GET ALL USERS (PAGINATION + SEARCH + TOTAL ORDERS)
// ===========================
router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const countQuery = search
      ? "SELECT COUNT(*) as count FROM users WHERE name LIKE ? OR email LIKE ?"
      : "SELECT COUNT(*) as count FROM users";
    const countParams = search ? [`%${search}%`, `%${search}%`] : [];
    const [countRows] = await pool.query(countQuery, countParams);
    const totalUsers = countRows[0].count;
    const totalPages = Math.ceil(totalUsers / limit);

    const usersQuery = search
      ? `SELECT u.id, u.name, u.email, u.role, u.balance, u.status, u.created_at,
               IFNULL(o.total_orders, 0) AS orders
         FROM users u
         LEFT JOIN (
           SELECT user_id, COUNT(*) AS total_orders
           FROM orders
           GROUP BY user_id
         ) o ON u.id = o.user_id
         WHERE u.name LIKE ? OR u.email LIKE ?
         LIMIT ? OFFSET ?`
      : `SELECT u.id, u.name, u.email, u.role, u.balance, u.status, u.created_at,
               IFNULL(o.total_orders, 0) AS orders
         FROM users u
         LEFT JOIN (
           SELECT user_id, COUNT(*) AS total_orders
           FROM orders
           GROUP BY user_id
         ) o ON u.id = o.user_id
         LIMIT ? OFFSET ?`;

    const usersParams = search ? [`%${search}%`, `%${search}%`, limit, offset] : [limit, offset];
    const [rows] = await pool.query(usersQuery, usersParams);

    res.json({
      users: rows,
      totalPages,
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================
// UPDATE LOGGED-IN USER SETTINGS
// ===========================
router.post("/settings", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body;

    await pool.query(
      "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name, email, phone, userId]
    );

    const [rows] = await pool.query(
      "SELECT id, name, email, phone FROM users WHERE id = ?",
      [userId]
    );

    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

export default router;
