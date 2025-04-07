const express = require("express");
const router = express.Router();
const Therapist = require("../models/Therapist");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const fs = require("fs");
const path = require("path"); // Added this line

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Ensure uploads directory exists
      if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads');
      }
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Fetch therapist details using token
router.get("/", authMiddleware, async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.user.id).select("-password");
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }
    res.json(therapist);
  } catch (error) {
    console.error("Error fetching therapist:", error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// GET Therapist/Audiologist Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.user.id).select("-password");
    if (!therapist) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(therapist);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// UPDATE Therapist/Audiologist Profile with file upload
router.put('/profile', authMiddleware, upload.single('profilePic'), async (req, res) => {
    try {
      const { name, designation, hospital } = req.body;
      const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;
  
      const updateFields = { name, designation, hospital };
      if (profilePic) updateFields.profilePic = profilePic;
  
      const therapist = await Therapist.findByIdAndUpdate(req.user.id, updateFields, { new: true });
  
      res.json({ message: 'Profile updated', therapist });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: 'Server error updating profile.' });
    }
});

module.exports = router;