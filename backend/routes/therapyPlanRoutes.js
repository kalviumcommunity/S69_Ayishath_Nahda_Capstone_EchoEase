// therapyPlanRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  generateTherapyPlan,
  createTherapyPlan,
  searchVideos,
  updateTherapyPlan
} = require("../controllers/therapyPlanControllers");
const TherapyPlan = require("../models/TherapyPlan");
const NewPatient = require("../models/Add-newPatient");

router.post('/generate', authMiddleware, generateTherapyPlan);

router.post("/", authMiddleware, createTherapyPlan);

// GET: Fetch therapy plan for a patient, ensure therapist owns the patient
router.get("/patient/:patientId", authMiddleware, async (req, res) => {
  try {
    // First, verify the patient belongs to the therapist
    const patient = await NewPatient.findOne({
      _id: req.params.patientId,
      therapistId: req.user.id
    });
    if (!patient) {
      return res.status(404).json({ 
        status: "error",
        message: "Patient not found or you do not have access",
        details: `No patient found with ID ${req.params.patientId} for this therapist`
      });
    }

    const plan = await TherapyPlan.findOne({ patientId: req.params.patientId }).populate("patientId");
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

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const plan = await TherapyPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        status: "error",
        message: "Therapy plan not found"
      });
    }

    // Verify the patient associated with the plan belongs to the therapist
    const patient = await NewPatient.findOne({
      _id: plan.patientId,
      therapistId: req.user.id
    });
    if (!patient) {
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to update this therapy plan"
      });
    }

    const updatedPlan = await TherapyPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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
// GET: Fetch therapy plan for a patient, ensure therapist owns the patient
router.get("/patient/:patientId", authMiddleware, async (req, res) => {
  try {
    // First, verify the patient belongs to the therapist
    const patient = await NewPatient.findOne({
      _id: req.params.patientId,
      therapistId: req.user.id
    });
    if (!patient) {
      return res.status(404).json({ 
        status: "error",
        message: "Patient not found or you do not have access",
        details: `No patient found with ID ${req.params.patientId} for this therapist`
      });
    }

    const plan = await TherapyPlan.findOne({ patientId: req.params.patientId }).populate("patientId");
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

router.post("/search-videos", authMiddleware, searchVideos);

module.exports = router;