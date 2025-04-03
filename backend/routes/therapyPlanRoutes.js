const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const TherapyPlan = require("../models/TherapyPlan");
const NewPatient = require("../models/Add-newPatient");
const { generateTherapyPlanWithGemini, fetchYouTubeLinks } = require("../utils/aiUtils");
const { generateTherapyPlanHandler } = require("../controllers/therapyPlanControllers");

// Generate therapy plan content (AI)
router.post("/generate", generateTherapyPlanHandler);

// Create new therapy plan
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { patientId } = req.body;
    const patient = await NewPatient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: "Patient not found",
        details: `Patient with ID ${patientId} not found`
      });
    }

    const { goals, activities } = await generateTherapyPlanWithGemini(patient.age, patient.diagnosis);

    if (!goals?.length || !activities?.length) {
      return res.status(500).json({
        message: "Failed to generate therapy plan content",
        details: "AI service returned empty goals or activities"
      });
    }

    const youtubeLinks = await fetchYouTubeLinks(activities);
    const newPlan = new TherapyPlan({ 
      patientId, 
      patientName: patient.patientName, // Include patient name
      age: patient.age,
      diagnosis: patient.diagnosis,
      goals, 
      activities, 
      youtubeLinks 
    });

    const savedPlan = await newPlan.save();
    patient.therapyPlan = savedPlan._id;
    await patient.save();

    res.status(201).json({ 
      status: "success",
      message: "Therapy plan created successfully",
      data: savedPlan
    });

  } catch (error) {
    console.error("Error creating therapy plan:", error);
    res.status(500).json({ 
      status: "error",
      message: "Failed to create therapy plan",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get therapy plan by patient ID
router.get("/patient/:patientId", authMiddleware, async (req, res) => {
  try {
    const plan = await TherapyPlan.findOne({ patientId: req.params.patientId });
    if (!plan) {
      return res.status(404).json({ 
        status: "error",
        message: "Therapy plan not found",
        details: `No plan found for patient ${req.params.patientId}`
      });
    }
    res.status(200).json({
      status: "success",
      data: plan
    });
  } catch (error) {
    console.error("Error fetching therapy plan:", error);
    res.status(500).json({ 
      status: "error",
      message: "Failed to fetch therapy plan",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update therapy plan
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedPlan = await TherapyPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({
        status: "error",
        message: "Therapy plan not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedPlan
    });
  } catch (error) {
    console.error("Error updating therapy plan:", error);
    res.status(500).json({ 
      status: "error",
      message: "Failed to update therapy plan",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;