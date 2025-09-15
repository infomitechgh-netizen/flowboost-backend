// backend/controllers/userController.js
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT

    const [rows] = await req.pool.query(
      `SELECT id, name, email, role, balance, created_at AS member_since 
       FROM users WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(rows[0]); // returns user profile
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

