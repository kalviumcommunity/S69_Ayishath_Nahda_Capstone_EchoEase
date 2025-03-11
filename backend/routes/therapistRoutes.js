const express = require("express");
const router = express.Router();
const Therapist = require("../models/Therapist");
const authMiddleware = require("../middleware/authMiddleware"); 

// GET Therapis/Audiologists  Profile

router.get("/profile", authMiddleware, (req, res) => {
    Therapist.findById(req.user.id) // 
        .select("-password") // Exclude password
        .then(therapist => {
            if (!therapist) return res.status(404).json({ error: "User not found" });
            res.json(therapist);
        })
        .catch(error => res.status(500).json({ error: "Server error" }));
});

// UPDATE Therapist/Audilogist Profile
router.put("/profile", authMiddleware, (req, res) => {
    const { name, designation, hospital, profilePic } = req.body;

    Therapist.findByIdAndUpdate(
        req.user.id, 
        { name, designation, hospital, profilePic },
        { new: true }
    )
    .select("-password") // exclude password from response
    .then(updatedTherapist => {
        if (!updatedTherapist) return res.status(404).json({ error: "User not found" });
        res.json({ message: "Profile updated successfully!", therapist: updatedTherapist });
    })
    .catch(error => res.status(500).json({ error: "Server error" }));
});

module.exports = router;
