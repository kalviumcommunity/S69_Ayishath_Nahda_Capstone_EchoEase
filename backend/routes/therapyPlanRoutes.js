const express = require("express");
const mongoose=require("mongoose");
const router = express.Router();
const NewPatient = require("../models/Add-newPatient"); // Ensure correct path

const Patient = require("../models/PatientList");
const authMiddleware = require("../middleware/authMiddleware"); 
const TherapyPlan = require("../models/TherapyPlan");

//POST: Add therapy plans for the patient
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { patientId, goals, activities, youtubeLinks } = req.body;

        // Validate patient existence
        const patientExists = await NewPatient.findById(patientId);
        if (!patientExists) {
            return res.status(404).json({ error: "Patient not found in database" });
        }

        const newPlan = new TherapyPlan({
            patientId,
            goals,
            activities,
            youtubeLinks
        });

        const savedPlan = await newPlan.save();

        // Update the patient's therapyPlan field
        patientExists.therapyPlan = savedPlan._id;
        await patientExists.save();

        res.status(201).json({ message: "Therapy plan added successfully!", therapyPlan: savedPlan });

    } catch (err) {
        console.error("Error adding therapy plan:", err);
        res.status(500).json({ error: "Server error" });
    }
});



//GET method to fetch therapy plans for a specific patient

router.get("/:patientId", authMiddleware, (req,res)=>{
    TherapyPlan.find({patientId: req.params.patientId})
    .then(therapyPlans =>{
        if(!therapyPlans || therapyPlans.length === 0) {
            return res.status(404).json({error:"No therapy plans found for this patient"});
        }
        res.json(therapyPlans);
    })
    .catch(err =>res.status(500).json({error:"Server error",err}));
});




//PUT Method to update or make eidts to the goals n activites

router.put("/:patientId", authMiddleware, async (req, res) => {
    try {
        const { goals, activities, youtubeLinks } = req.body;

        const updatedPlan = await TherapyPlan.findOneAndUpdate(
            { patientId: req.params.patientId },  // Find by patientId
            { $set: { goals, activities, youtubeLinks } }, // Update the fields
            { new: true } // Return the updated document
        );

        if (!updatedPlan) {
            return res.status(404).json({ error: "Therapy plan not found" });
        }

        res.json({ message: "Therapy plan updated successfully!", therapyPlan: updatedPlan });
    } catch (error) {
        console.error("Error updating therapy plan:", error);
        res.status(500).json({ error: "Server error" });
    }
});

//  GET: Fetch all therapy plans
router.get("/", authMiddleware, async (req, res) => {
    try {
        const therapyPlans = await TherapyPlan.find();
        res.status(200).json(therapyPlans);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});


module.exports=router;