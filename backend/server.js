require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const therapistRoutes = require("./routes/therapistRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const therapyPlansRoutes = require("./routes/therapyPlanRoutes");


const PORT = process.env.PORT || 5000;


const app = express();
app.use(express.json());

// Enhanced CORS settings
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust based on your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
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