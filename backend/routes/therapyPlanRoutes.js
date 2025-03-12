const express = require("express");
const router = express.Router();
const Patient = require("../models/PatientList");
const authMiddleware = require("../middleware/authMiddleware"); 
const TherapyPlan = require("../models/TherapyPlan");

//POST: Add therapy plans for the patient

router.post("/", authMiddleware, (req, res) => {
    const { patientName,goals, activities, youtubeLinks } = req.body;

    const newPlan = new TherapyPlan({
        patientName,
        goals,
        activities,
        youtubeLinks // Store AI-generated YouTube links
    });

    newPlan.save()
        .then(savedPlan => res.status(201).json({ message: "Therapy plan added successfully!", therapyPlan: savedPlan }))
        .catch(err => res.status(500).json({ error: "Error saving therapy plan" }));
});



//GET method to fetch therapy plans for a specific patient

router.get("/:patientName", authMiddleware, (req,res)=>{
    TherapyPlan.find({patientName: req.params.patientName})
    .then(therapyPlans =>{
        if(!therapyPlans) return res.status(404).json({error:"No therapy plans found for this patient"});
        res.json(therapyPlans);
    })
    .catch(err =>res.status(500).json({error:"Server error",err}));
});


module.exports=router;