const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ඔබගේ අලුත් API Routes ගොනුව මෙතැනින් ලබාගන්න
const apiRoutes = require("./routes/apiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API Routes මෙතැනින් සම්බන්ධ වේ
app.use("/api", apiRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// සර්වර් එක ආරම්භ කිරීම
app.listen(5000, "0.0.0.0", () => console.log("🚀 Server running on port 5000"));
