import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "mitechgh.com",       // your domain's mail server
      port: 465,                  // SMTP port
      secure: true,               // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER, // e.g. info@mitechgh.com
        pass: process.env.EMAIL_PASS, // your email password
      },
    });

    await transporter.sendMail({
      from: `"FlowBoostPanel Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("📩 Email sent to:", to);
  } catch (err) {
    console.error("❌ Email send error:", err);
    throw err;
  }
};
