const express = require("express");
const router = express.Router();
const NewPatient = require("../models/Add-newPatient");  // Correct schema import
const authMiddleware = require("../middleware/authMiddleware");

// POST: Add a new patient
router.post("/", authMiddleware, async (req, res) => {
    try {
        console.log("🔹 Request received:", req.body); // Debugging log

        const { patientName, age, nativeLanguage } = req.body;

        if (!patientName || !age || !nativeLanguage) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newPatient = new NewPatient({ patientName, age, nativeLanguage });

        await newPatient.save();
        console.log(" Patient saved successfully:", newPatient); // Debugging log
        res.status(201).json({ message: "Patient added successfully!", patient: newPatient });
    } catch (error) {
        console.error("Error adding patient:", error); // Debugging log
        res.status(500).json({ error: "Server error" });
    }
});

// GET: Fetch all patients
router.get("/", authMiddleware, (req, res) => {
    NewPatient.find()
        .then(patients => res.json(patients))
        .catch(err => res.status(500).json({ error: "Server Error", err }));
});

// GET: Fetch a single patient by Name
router.get("/:patientName", authMiddleware, (req, res) => {
    NewPatient.findOne({ patientName: { $regex: new RegExp("^"+req.params.patientName+ "$","i")}}) // Match by patientName and (regex for case-sensitive search)
        .then(patient => {
            if (!patient) return res.status(404).json({ error: "Patient not found" });
            res.json(patient);
        })
        .catch(err => res.status(500).json({ error: "Server error", err }));
});


module.exports = router;
