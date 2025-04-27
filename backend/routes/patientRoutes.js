// patientRoutes.js
const express = require("express");
const router = express.Router();
const NewPatient = require("../models/Add-newPatient");
const authMiddleware = require("../middleware/authMiddleware");

// POST: Add a New Patient
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Request received:", req.body);

    const { patientName, age, nativeLanguage, diagnosis, aphasiaSeverity } = req.body;

    // Check for missing required fields
    if (!patientName || !age || !nativeLanguage || !diagnosis) {
      return res.status(400).json({ 
        error: "All fields (patientName, age, nativeLanguage, diagnosis) are required" 
      });
    }

    // Validate aphasiaSeverity for aphasia diagnosis
    if (diagnosis.toLowerCase() === 'aphasia' && !aphasiaSeverity) {
      return res.status(400).json({ 
        error: "Severity is required for Aphasia diagnosis" 
      });
    }

    // Normalize fields to lowercase for consistency
    const normalizedPatientName = patientName.trim().toLowerCase();
    const normalizedNativeLanguage = nativeLanguage.trim().toLowerCase();
    const normalizedDiagnosis = diagnosis.trim().toLowerCase();
    const normalizedAphasiaSeverity = aphasiaSeverity ? aphasiaSeverity.trim().toLowerCase() : null;

    // Check for duplicate patient (case-insensitive) for this therapist
    const existingPatient = await NewPatient.findOne({ 
      patientName: { $regex: `^${normalizedPatientName}$`, $options: 'i' }, 
      nativeLanguage: { $regex: `^${normalizedNativeLanguage}$`, $options: 'i' },
      therapistId: req.user.id
    });
    if (existingPatient) {
      return res.status(400).json({ 
        error: "Patient already exists for this therapist", 
        patient: existingPatient 
      });
    }

    // Save the new patient with normalized fields and therapistId
    const newPatient = new NewPatient({ 
      patientName: normalizedPatientName, 
      age, 
      nativeLanguage: normalizedNativeLanguage, 
      diagnosis: normalizedDiagnosis,
      aphasiaSeverity: normalizedDiagnosis === 'aphasia' ? normalizedAphasiaSeverity : null,
      therapistId: req.user.id // Set the therapistId from the authenticated user
    });
    await newPatient.save();

    console.log("Patient saved successfully:", newPatient);
    res.status(201).json({ 
      message: "Patient added successfully!", 
      patient: newPatient 
    });

  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

// GET: Fetch all patients for the logged-in therapist with sorting, filtering, and pagination
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search, sortBy, sortOrder, page = 1, limit = 10 } = req.query;
    
    // Build query, filter by therapistId
    const query = { therapistId: req.user.id };
    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { diagnosis: { $regex: search, $options: 'i' } },
        { nativeLanguage: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by newest first
    }

    // Execute query with pagination
    const patients = await NewPatient.find(query)
      .populate("therapyPlan")
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await NewPatient.countDocuments(query);

    res.status(200).json({
      success: true,
      data: patients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Error fetching patients", 
      details: error.message 
    });
  }
});

// GET: Fetch a single patient by ID, ensure therapist owns the patient
router.get("/:patientId", authMiddleware, async (req, res) => {
  try {
    const patient = await NewPatient.findOne({
      _id: req.params.patientId,
      therapistId: req.user.id
    }).lean();

    if (!patient) {
      return res.status(404).json({
        error: "Patient not found or you do not have access"
      });
    }

    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
});

// DELETE: Delete a patient by ID (optional, for cleanup), ensure therapist owns the patient
router.delete("/:patientId", authMiddleware, async (req, res) => {
  try {
    const patient = await NewPatient.findOneAndDelete({
      _id: req.params.patientId,
      therapistId: req.user.id
    });
    if (!patient) {
      return res.status(404).json({ 
        error: "Patient not found or you do not have access" 
      });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;