// backend/controllers/walletController.js
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

// Get wallet balance + transactions + payment methods
export const getWallet = async (req, res) => {
  try {
    const [userRows] = await pool.query("SELECT balance FROM users WHERE id = ?", [req.user.id]);
    const balance = parseFloat(userRows[0]?.balance) || 0;

    const [transactions] = await pool.query(
      "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    const [methods] = await pool.query("SELECT * FROM payment_methods WHERE status='active'");

    const mappedMethods = methods.map((m) => ({
      ...m,
      slug: m.name.toLowerCase().replace(/\s+/g, ""),
    }));

    res.json({ balance, transactions, paymentMethods: mappedMethods });
  } catch (err) {
    console.error("Wallet fetch error:", err);
    res.status(500).json({ message: "Failed to fetch wallet data" });
  }
};

// Initialize Paystack Payment
export const initPaystack = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 🔑 Get user's email from DB
    const [userRows] = await pool.query("SELECT email FROM users WHERE id = ?", [userId]);
    const userEmail = userRows[0]?.email;
    if (!userEmail) return res.status(400).json({ message: "User email not found" });

    const reference = `ref_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail, // ✅ real user email from DB
        amount: Math.round(amount * 100),
        currency: "GHS",
        reference,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json({ message: data.message || "Paystack init failed" });
    }

    res.json({ reference, email: userEmail }); // 👈 also send email back to frontend
  } catch (err) {
    console.error("Paystack init error:", err);
    res.status(500).json({ message: "Server error initializing Paystack" });
  }
};

// Verify Paystack Payment
export const verifyPaystack = async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ message: "Reference is required" });

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });

    const data = await verifyRes.json();
    if (!data.status) return res.status(400).json({ message: data.message });

    const userId = req.user.id;

    if (data.data.status === "success") {
      const amount = data.data.amount / 100;

      // Update user's balance
      await pool.query("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, userId]);

      const [existing] = await pool.query("SELECT id FROM transactions WHERE reference = ?", [reference]);
      if (existing.length > 0) {
        await pool.query(
          "UPDATE transactions SET status='completed', updated_at=NOW() WHERE reference=?",
          [reference]
        );
      } else {
        await pool.query(
          "INSERT INTO transactions (user_id, type, method, amount, status, reference, created_at) VALUES (?, 'deposit', 'Paystack', ?, 'completed', ?, NOW())",
          [userId, amount, reference]
        );
      }

      // ✅ Emit Socket.IO event to update recent activity
      const io = req.app.get("io");
      io.emit("walletUpdated", { userId });

      return res.json({ message: "Payment verified", amount });
    } else {
      await pool.query("UPDATE transactions SET status='failed', updated_at=NOW() WHERE reference=?", [reference]);
      return res.status(400).json({ message: "Payment failed" });
    }
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};

