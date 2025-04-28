const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

// Routes
const therapistRoutes = require("./routes/therapistRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const therapyPlansRoutes = require("./routes/therapyPlanRoutes");

const PORT = process.env.PORT; // Remove default 4000 to enforce .env value

console.log("Loaded environment variables:", {
  PORT: process.env.PORT,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY ? process.env.YOUTUBE_API_KEY.substring(0, 5) + "..." : "undefined",
});

const app = express();
app.use(express.json());

// Enhanced CORS: Allow  deployed frontend
const allowedOrigins = [
  
   "https://echoease.netlify.app",
   " http://localhost:5173/" ,
   "https://s69-ayishath-nahda-capstone-echo-ease.vercel.app/"
  
];

app.use(
  cors({
    origin: allowedOrigins, // Use the allowedOrigins array
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/therapy-plans", therapyPlansRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).send("Internal Server Error");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});