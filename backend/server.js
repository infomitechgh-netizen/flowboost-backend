// backend/server.js
import express from "express";
// import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import walletRoutes from "./routes/walletRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

import dripfeedRoutes from "./routes/dripfeedRoutes.js";
import contactRoutes from "./routes/contact.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import ticketsRouter from "./routes/tickets.js";
import usersRouter from "./routes/users.js";
import adminsettings from "./routes/adminSettings.js";
import searchRoutes from "./routes/search.js";



import dotenv from "dotenv";
dotenv.config({ path: "/etc/secrets/.env" });


const app = express();
const server = http.createServer(app); // Wrap Express with HTTP server

// Initialize Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
});

// Make io accessible in routes/controllers
app.set("io", io);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/user/settings", settingsRoutes);
app.use("/api/services", serviceRoutes);

app.use("/api/users", usersRouter);
app.use("/api/dripfeed", dripfeedRoutes);
// Mount the tickets router
app.use("/api/tickets", ticketsRouter);
app.use("/api", contactRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.send("FlowBoost Backend is running 🚀");
});



app.use("/api/categories", categoryRoutes);

// Listen for Socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
