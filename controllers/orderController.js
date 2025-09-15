import pool from "../config/db.js";
import axios from "axios";

// ----------------------
// Create a new order
// ----------------------

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update order status" });
    }

    const [result] = await pool.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const io = req.app.get("io");
    io.emit("orderUpdated", { orderId });

    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Failed to update order status:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// ----------------------
// Create a new order with wallet deduction
// ----------------------
// ----------------------

export const createOrder = async (req, res) => {
  const connection = await pool.getConnection(); // optional: for transactions
  try {
    const { service_id, link, quantity } = req.body;

    // 1️⃣ Get user and service info
    const [userRows] = await connection.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    const user = userRows[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    const [serviceRows] = await connection.query("SELECT * FROM services WHERE id = ?", [service_id]);
    const service = serviceRows[0];
    if (!service) return res.status(404).json({ message: "Service not found" });

 // const totalUserPrice = service.user_price * quantity;
    const totalUserPrice = (service.user_price * quantity) / 1000; // ⚡ divide by 1000 to match frontend

    // 2️⃣ Check if user has enough balance
    if (user.balance < totalUserPrice) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // 3️⃣ Deduct user price from wallet
    await connection.query("UPDATE users SET balance = balance - ? WHERE id = ?", [totalUserPrice, user.id]);

    // 4️⃣ Insert order into local database
    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, service_id, link, quantity, status, price, start_count, remains, refill_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [user.id, service_id, link, quantity, "pending", totalUserPrice, quantity, quantity, 0]
    );

    const orderId = orderResult.insertId;

    // 5️⃣ Submit order to DripFeedPanel using API
    const payload = new URLSearchParams();
    payload.append("key", process.env.DRIPFEED_API_KEY);
    payload.append("action", "add");
    payload.append("service", service.api_service_id); // ⚠️ use API service ID
    payload.append("link", link);
    payload.append("quantity", quantity);

    let dripfeedId = null;
    try {
      const response = await axios.post(process.env.DRIPFEED_API_URL, payload);
      if (response.data.order) {
        dripfeedId = response.data.order;
        await connection.query(
          "UPDATE orders SET dripfeed_id = ?, status = 'processing' WHERE id = ?",
          [dripfeedId, orderId]
        );
      } else {
        console.error("DripFeedPanel error:", response.data);
      }
    } catch (err) {
      console.error("Failed to submit order to DripFeedPanel:", err.message);
    }

    // 6️⃣ Emit socket event
    const io = req.app.get("io");
    io.emit("orderUpdated", { userId: user.id });

    res.status(201).json({
      message: "Order placed successfully",
      orderId,
      dripfeedId,
      totalUserPrice
    });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  } finally {
    if (connection) connection.release();
  }
};


export const reorderService = async (req, res) => {
  try {
    const originalOrderId = req.params.id; // ✅ get ID from URL param

    // 1️⃣ Fetch the original order
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [originalOrderId]);
    const originalOrder = rows[0];
    if (!originalOrder) return res.status(404).json({ message: "Original order not found" });

    // 2️⃣ Fetch user balance
    const [userRows] = await pool.query("SELECT balance FROM users WHERE id = ?", [req.user.id]);
    const user = userRows[0];

    const totalCharge = originalOrder.price / 1000;

    if (user.balance < totalCharge) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // 3️⃣ Deduct from user wallet
    await pool.query("UPDATE users SET balance = balance - ? WHERE id = ?", [totalCharge, req.user.id]);

    // 4️⃣ Insert a new order locally
    const [result] = await pool.query(
      `INSERT INTO orders 
       (user_id, service_id, link, quantity, status, price, start_count, remains, refill_count) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        originalOrder.service_id,
        originalOrder.link,
        originalOrder.quantity,
        "pending",
        totalCharge,
        originalOrder.quantity,
        originalOrder.quantity,
        0
      ]
    );

    const newOrderId = result.insertId;

    // 5️⃣ Submit to DripFeedPanel API
    const [serviceRows] = await pool.query("SELECT * FROM services WHERE id = ?", [originalOrder.service_id]);
    const service = serviceRows[0];
    if (!service) return res.status(404).json({ message: "Service not found" });

    const payload = new URLSearchParams();
    payload.append("key", process.env.DRIPFEED_API_KEY);
    payload.append("action", "add");
    payload.append("service", service.api_service_id);
    payload.append("link", originalOrder.link);
    payload.append("quantity", originalOrder.quantity);

    const response = await axios.post(process.env.DRIPFEED_API_URL, payload);

    if (!response.data.order) {
      await pool.query("UPDATE users SET balance = balance + ? WHERE id = ?", [totalCharge, req.user.id]);
      return res.status(400).json({ message: "Failed to submit order to DripFeedPanel", data: response.data });
    }

    const dripfeedId = response.data.order;

    await pool.query("UPDATE orders SET dripfeed_id = ?, status = 'processing' WHERE id = ?", [
      dripfeedId,
      newOrderId
    ]);

    res.json({
      message: "Reorder successful and sent to DripFeedPanel",
      orderId: newOrderId,
      dripfeedId
    });

  } catch (error) {
    console.error("Reorder error:", error);
    res.status(500).json({ message: "Failed to reorder", error: error.message });
  }
};



// ----------------------
// Fetch all orders
// ----------------------
export const getOrders = async (req, res) => {
  try {
    let query = `
      SELECT o.id, o.link, o.quantity, o.start_count, o.remains, o.status, o.price, o.created_at,
             o.refill_count, o.dripfeed_id, s.name AS service, u.name AS user_name, o.user_id
      FROM orders o
      LEFT JOIN services s ON o.service_id = s.id
      LEFT JOIN users u ON o.user_id = u.id
    `;
    const params = [];

    if (req.user.role !== "admin") {
      query += " WHERE o.user_id = ?";
      params.push(req.user.id);
    }

    query += " ORDER BY o.created_at DESC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ----------------------
// Refill an order
// ----------------------
export const refillOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const orderId = req.params.id;

    // 1️⃣ Fetch order
    const [rows] = await connection.query("SELECT * FROM orders WHERE id = ?", [orderId]);
    const order = rows[0];
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.user_id !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to refill this order" });
    }

    // 2️⃣ Calculate remaining quantity
    const delivered = order.quantity - order.remains;
    const missing = order.quantity - delivered;
    if (missing <= 0) return res.status(400).json({ message: "No refill needed, order is fully delivered" });

    // 3️⃣ Update local order
    await connection.query(
      "UPDATE orders SET remains = ?, status = 'processing', refill_count = refill_count + 1, updated_at = NOW() WHERE id = ?",
      [missing, orderId]
    );

    // 4️⃣ Fetch service info for API
    const [serviceRows] = await connection.query("SELECT * FROM services WHERE id = ?", [order.service_id]);
    const service = serviceRows[0];
    if (!service) return res.status(404).json({ message: "Service not found" });

    // 5️⃣ Submit refill to DripFeedPanel
    const payload = new URLSearchParams();
    payload.append("key", process.env.DRIPFEED_API_KEY);
    payload.append("action", "add");
    payload.append("service", service.api_service_id); // API service ID
    payload.append("link", order.link);
    payload.append("quantity", missing);

    let dripfeedId = order.dripfeed_id;
    try {
      const response = await axios.post(process.env.DRIPFEED_API_URL, payload);
      if (response.data.order) {
        dripfeedId = response.data.order;

        // Update order with new dripfeed_id (optional: only if DripFeed requires a new ID)
        await connection.query("UPDATE orders SET dripfeed_id = ? WHERE id = ?", [dripfeedId, orderId]);
      } else {
        console.error("DripFeedPanel error on refill:", response.data);
      }
    } catch (err) {
      console.error("Failed to submit refill to DripFeedPanel:", err.message);
    }

    // 6️⃣ Emit socket event
    const io = req.app.get("io");
    io.emit("orderUpdated", { userId: req.user.id });

    res.json({
      message: `Order refill started for ${missing} remaining items.`,
      refillCount: order.refill_count + 1,
      dripfeedId
    });

  } catch (error) {
    console.error("Refill error:", error);
    res.status(500).json({ message: "Failed to refill order", error: error.message });
  } finally {
    if (connection) connection.release();
  }
};

// ----------------------
// Get active orders count for a user
// ----------------------
export const getActiveOrdersCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT COUNT(*) AS active_count FROM orders WHERE user_id = ? AND status IN ('pending', 'processing')",
      [userId]
    );

    res.json({ activeCount: rows[0].active_count });
  } catch (error) {
    console.error("Error fetching active orders:", error);
    res.status(500).json({ message: "Failed to fetch active orders" });
  }
};

// ----------------------
// Get completed orders count for a user
// ----------------------
export const getCompletedOrdersCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT COUNT(*) AS completed_count FROM orders WHERE user_id = ? AND LOWER(status) = 'completed'",
      [userId]
    );

    res.json({ completedCount: rows[0].completed_count });
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ message: "Failed to fetch completed orders" });
  }
};

// ----------------------
// Get total orders count for a user
// ----------------------
export const getTotalOrdersCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total_count FROM orders WHERE user_id = ?",
      [userId]
    );

    res.json({ totalCount: rows[0].total_count });
  } catch (error) {
    console.error("Error fetching total orders:", error);
    res.status(500).json({ message: "Failed to fetch total orders" });
  }
};

// ----------------------
// Submit order to DripFeedPanel (Admin only)
// ----------------------
export const submitOrderToDripFeed = async (req, res) => {
  try {
    const orderId = req.params.id;

    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [orderId]);
    const order = rows[0];
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can submit orders to DripFeedPanel" });
    }

    if (order.dripfeed_id) {
      return res.status(400).json({ message: "Order already submitted to DripFeedPanel" });
    }

    const [serviceRows] = await pool.query("SELECT * FROM services WHERE id = ?", [order.service_id]);
    const service = serviceRows[0];
    if (!service) return res.status(404).json({ message: "Service not found" });

    const payload = new URLSearchParams();
    payload.append("key", process.env.DRIPFEED_API_KEY);
    payload.append("action", "add");
    payload.append("service", service.id);
    payload.append("link", order.link);
    payload.append("quantity", order.quantity);

    const response = await axios.post(process.env.DRIPFEED_API_URL, payload);

    if (!response.data.order) {
      return res.status(400).json({ message: "Failed to submit order", data: response.data });
    }

    const dripfeedId = response.data.order;

    await pool.query("UPDATE orders SET dripfeed_id = ?, status = 'processing' WHERE id = ?", [
      dripfeedId,
      orderId,
    ]);

    // Emit socket event for this user
    const io = req.app.get("io");
    io.emit("orderUpdated", { userId: req.user.id });

    res.json({ message: "Order submitted to DripFeedPanel", dripfeed_id: dripfeedId });
  } catch (error) {
    console.error("Error submitting order:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
