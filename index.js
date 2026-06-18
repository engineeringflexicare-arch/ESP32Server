require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const apiRoutes = require("./routes/apiRoutes");

const app = express();

// ==========================================
// Middleware
// ==========================================

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin);

      callback(null, true);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Request Logger
// ==========================================

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ESP32 MongoDB Server Running",
  });
});

// ==========================================
// API Routes
// ==========================================

app.use("/api", apiRoutes);

// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==========================================
// Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==========================================
// MongoDB Connection
// ==========================================

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log("================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 http://localhost:${PORT}`);
      console.log("================================");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
