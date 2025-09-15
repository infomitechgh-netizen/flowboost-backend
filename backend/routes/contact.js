// routes/contact.js
import express from "express";
import { sendEmail } from "../utils/sendEmail.js"; // adjust path as needed

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const mailText = `
      📩 New Contact Message

      Name: ${name}
      Email: ${email}
      Subject: ${subject}

      Message:
      ${message}
    `;

    await sendEmail("info@mitechgh.com", `Contact: ${subject}`, mailText);

    return res.json({ message: "Your message has been sent successfully!" });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    return res.status(500).json({ message: "Failed to send message. Try again later." });
  }
});

export default router;
