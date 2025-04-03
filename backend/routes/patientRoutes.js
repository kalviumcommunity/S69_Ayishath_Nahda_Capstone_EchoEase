const express = require("express");
const router = express.Router();
const NewPatient = require("../models/Add-newPatient");  // Correct schema import

const authMiddleware = require("../middleware/authMiddleware");

//POST: Add a New Patient
router.post("/", authMiddleware, async (req, res) => {
    try {
        console.log(" Request received:", req.body); // Debugging log

        const { patientName, age, nativeLanguage } = req.body;

        //  Check for missing fields first
        if (!patientName || !age || !nativeLanguage) {
            return res.status(400).json({ error: "All fields are required" });
        }

        //  Correct duplicate check using `NewPatient` model
        const existingPatient = await NewPatient.findOne({ patientName, nativeLanguage });
        if (existingPatient) {
            return res.status(400).json({ error: "Patient already exists", patient: existingPatient });
        }

        //  Save the new patient if no duplicate is found
        const newPatient = new NewPatient({ patientName, age, nativeLanguage });
        await newPatient.save();

        console.log(" Patient saved successfully:", newPatient);
        res.status(201).json({ message: "Patient added successfully!", patient: newPatient });

    } catch (error) {
        console.error(" Error adding patient:", error);
        res.status(500).json({ error: "Server error" });
    }
});



// GET: Fetch all patients with sorting, filtering and pagination
router.get("/", authMiddleware, async (req, res) => {
    try {
      const { search, sortBy, sortOrder, page = 1, limit = 10 } = req.query;
      
      // Build query
      const query = {};
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

//GET  fetch a single patient by ID
router.get("/:patientId", authMiddleware, (req, res) => {
    NewPatient.findById(req.params.patientId) // 🔹 Now searching by `patientId`
        .then(patient => {
            if (!patient) return res.status(404).json({ error: "Patient not found" });
            res.json(patient);
        })
        .catch(err => res.status(500).json({ error: "Server error", err }));
});

module.exports = router;

