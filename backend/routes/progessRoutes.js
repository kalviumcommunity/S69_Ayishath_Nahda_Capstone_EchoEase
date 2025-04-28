const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

router.get("/:patientId", async (req, res) => {
  try {
    const progress = await Progress.find({ patientId: req.params.patientId });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress" });
  }
});

router.post("/:patientId", async (req, res) => {
  const { date, notes, clarityScore } = req.body;
  try {
    const newProgress = new Progress({
      patientId: req.params.patientId,
      date,
      notes,
      clarityScore,
    });
    await newProgress.save();
    res.status(201).json(newProgress);
  } catch (error) {
    res.status(500).json({ message: "Error saving progress" });
  }
});

module.exports = router;
