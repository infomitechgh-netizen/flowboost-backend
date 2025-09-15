// /routes/tickets.js
import express from "express";
import pool from "../config/db.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =======================
// GET all tickets (admin)
// =======================
router.get("/", async (req, res) => {
  try {
    const [tickets] = await pool.query(`
      SELECT 
        t.id,
        t.subject,
        t.status,
        t.priority,
        u.email AS user_email,
        t.created_at,
        t.updated_at,
        (
          SELECT tm.message
          FROM ticket_messages tm
          WHERE tm.ticket_id = t.id
          ORDER BY tm.created_at ASC
          LIMIT 1
        ) AS first_message,
        (
          SELECT tm.message
          FROM ticket_messages tm
          WHERE tm.ticket_id = t.id
          ORDER BY tm.created_at DESC
          LIMIT 1
        ) AS last_message,
        (
          SELECT tm.created_at
          FROM ticket_messages tm
          WHERE tm.ticket_id = t.id
          ORDER BY tm.created_at DESC
          LIMIT 1
        ) AS last_message_at,
        (
          SELECT COUNT(*)
          FROM ticket_messages tm
          WHERE tm.ticket_id = t.id
        ) AS messages_count
      FROM tickets t
      JOIN users u ON u.id = t.user_id
      ORDER BY t.updated_at DESC
    `);

    res.json(tickets);
  } catch (err) {
    console.error("Failed to fetch tickets:", err);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
});

// =======================
// GET tickets for a specific user
// =======================
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [tickets] = await pool.query(
      `
      SELECT 
        t.id,
        t.subject,
        t.status,
        t.priority,
        u.email AS user_email,
        t.created_at,
        t.updated_at,
        (
          SELECT tm.message
          FROM ticket_messages tm
          WHERE tm.ticket_id = t.id
          ORDER BY tm.created_at ASC
          LIMIT 1
        ) AS first_message,
        (
          SELECT tm.message
          FROM ticket_messages tm
          WHERE tm.ticket_id = t.id
          ORDER BY tm.created_at DESC
          LIMIT 1
        ) AS last_message,
        (
          SELECT tm.created_at
          FROM ticket_messages tm
          WHERE tm.ticket_id = t.id
          ORDER BY tm.created_at DESC
          LIMIT 1
        ) AS last_message_at,
        (
          SELECT COUNT(*)
          FROM ticket_messages tm
          WHERE tm.ticket_id = t.id
        ) AS messages_count
      FROM tickets t
      JOIN users u ON u.id = t.user_id
      WHERE t.user_id = ?
      ORDER BY t.updated_at DESC
    `,
      [id]
    );

    res.json(tickets);
  } catch (err) {
    console.error("Failed to fetch user tickets:", err);
    res.status(500).json({ message: "Failed to fetch user tickets" });
  }
});

// =======================
// GET all messages for a ticket
// =======================
router.get("/:id/messages", async (req, res) => {
  const { id } = req.params;
  try {
    const [messages] = await pool.query(
      `
      SELECT 
        m.id,
        m.message,
        m.sender_type,
        m.created_at,
        u.email AS user_email
      FROM ticket_messages m
      LEFT JOIN users u ON u.id = m.user_id
      WHERE m.ticket_id = ?
      ORDER BY m.created_at ASC
    `,
      [id]
    );

    res.json(messages);
  } catch (err) {
    console.error("Failed to fetch ticket messages:", err);
    res.status(500).json({ message: "Failed to fetch ticket messages" });
  }
});

// =======================
// POST new ticket
// =======================
router.post("/", authenticate, async (req, res) => {
  const { subject, description, priority, category } = req.body;
  const userId = req.user.id;
  const userEmail = req.user.email;

  try {
    const [ticketResult] = await pool.query(
      `INSERT INTO tickets 
        (subject, priority, category, status, user_email, user_id, created_at, updated_at)
       VALUES (?, ?, ?, 'open', ?, ?, NOW(), NOW())`,
      [subject, priority, category, userEmail, userId]
    );

    const ticketId = ticketResult.insertId;

    // Add the first message
    await pool.query(
      `INSERT INTO ticket_messages 
        (ticket_id, message, user_id, created_at) VALUES (?, ?, ?, NOW())`,
      [ticketId, description, userId]
    );

    // Return ticket with last_message info
    res.status(201).json({
      id: ticketId,
      subject,
      priority,
      category,
      status: "open",
      user_email: userEmail,
      messages_count: 1,
      first_message: description,
      last_message: description,
      last_message_at: new Date(),
    });
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ message: "Failed to create ticket" });
  }
});

// =======================
// PUT update ticket (admin)
// =======================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status, priority } = req.body;
  try {
    await pool.query(
      `UPDATE tickets SET status = ?, priority = ?, updated_at = NOW() WHERE id = ?`,
      [status, priority, id]
    );
    res.json({ message: "Ticket updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update ticket" });
  }
});

// =======================
// POST new message (with Socket.IO notification)
// =======================
router.post("/:id/messages", authenticate, async (req, res) => {
  const { message, sender_type } = req.body;
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO ticket_messages (ticket_id, message, user_id, sender_type, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [req.params.id, message, userId, sender_type || "user"]
    );

    const [newMessage] = await pool.query(
      `SELECT id, message, user_id, sender_type, created_at, ticket_id 
       FROM ticket_messages WHERE id = ?`,
      [result.insertId]
    );

    // Emit real-time notification if admin replied
    const io = req.app.get("io");
    const [ticketOwner] = await pool.query(
      `SELECT user_id FROM tickets WHERE id = ?`,
      [req.params.id]
    );

    if (ticketOwner.length > 0 && sender_type === "admin") {
      io.emit("ticketReply", {
        userId: ticketOwner[0].user_id,
        message: newMessage[0],
      });
    }

    res.status(201).json(newMessage[0]);
  } catch (err) {
    console.error("Failed to send message:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
