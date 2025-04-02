// routes/therapyPlanRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const TherapyPlan = require("../models/TherapyPlan");
const NewPatient = require("../models/Add-newPatient");
const { generateTherapyPlanWithGemini, fetchYouTubeLinks } = require("../utils/aiUtils");
const { generateTherapyPlanHandler } = require("../controllers/therapyPlanControllers");

// Route for generating therapy goals and activities
router.post("/generate", generateTherapyPlanHandler);

// Assign AI-Generated Therapy Plan & Fetch YouTube Links
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { patientId } = req.body;
    const patient = await NewPatient.findById(patientId);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // Generate therapy plan using Gemini AI
    const { goals, activities } = await generateTherapyPlanWithGemini(patient.age, patient.diagnosis);

    if (goals.length === 0 || activities.length === 0) {
      return res.status(500).json({
        message: "Failed to generate therapy plan.",
        details: "The Gemini AI API may have failed to generate content.",
      });
    }

    const youtubeLinks = await fetchYouTubeLinks(activities);

    const newPlan = new TherapyPlan({ patientId, goals, activities, youtubeLinks });
    const savedPlan = await newPlan.save();

    // Linking the therapy plan to the patient
    patient.therapyPlan = savedPlan._id;
    await patient.save();

    res.status(201).json({ 
      message: "Therapy plan added successfully!", 
      therapyPlan: savedPlan 
    });
  } catch (error) {
    console.error("Error adding therapy plan:", error);
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

// Update Therapy Plan (PUT route) - unchanged
router.put("/:patientId", authMiddleware, async (req, res) => {
  try {
    const { patientId } = req.params;
    const updatedPlan = req.body;

    const result = await TherapyPlan.findOneAndUpdate(
      { patientId },
      updatedPlan,
      { new: true }
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Therapy plan not found" });
    }
  } catch (err) {
    res.status(500).json({ 
      message: "Server error", 
      details: err.message 
    });
  }
});

module.exports = router;