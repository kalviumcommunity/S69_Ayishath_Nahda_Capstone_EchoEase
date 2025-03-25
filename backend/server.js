require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const therapistRoutes = require("./routes/therapistRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const therapyPlansRoutes = require("./routes/therapyPlanRoutes");

const PORT = process.env.PORT || 5000; // Use environment variable for PORT

const app = express();
app.use(express.json());

// Allow frontend to communicate with backend
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error(" MongoDB connection error:", err);
    });

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/therapy-plans", therapyPlansRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(` Server is running on: http://localhost:${PORT}`);
});
