const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  generateTherapyPlan,
  createTherapyPlan 
} = require("../controllers/therapyPlanControllers"); // Destructured import
const TherapyPlan = require("../models/TherapyPlan");



router.post('/generate', authMiddleware,generateTherapyPlan);

router.post("/", authMiddleware, createTherapyPlan);

// Keep GET and PUT routes as they are
router.get("/patient/:patientId", authMiddleware, async (req, res) => {
  try {
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