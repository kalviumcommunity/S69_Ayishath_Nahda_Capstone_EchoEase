const express = require("express");
const router = express.Router();
const Therapist = require("../models/Therapist");
const authMiddleware = require("../middleware/authMiddleware");

// GET Therapist/Audiologist Profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const therapist = await Therapist.findById(req.user.id).select("-password");
        if (!therapist) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(therapist);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// UPDATE Therapist/Audiologist Profile
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { name, designation, hospital, profilePic } = req.body;

        const updatedProfile = await Therapist.findByIdAndUpdate(
            req.user.id,
            { name, designation, hospital, profilePic },
            { new: true, select: "-password" } //  exclude password
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Profile updated successfully!", therapist: updatedProfile });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
