const express = require("express");
const router = express.Router();
const Patient = require("../models/PatientList");
const authMiddleware = require("../middleware/authMiddleware"); 
const TherapyPlan = require("../models/TherapyPlan");

//POST: Add therapy plans for the patient

router.post("/", authMiddleware, (req, res) => {
    const { patientId,goals, activities, youtubeLinks } = req.body;

    const newPlan = new TherapyPlan({
        patientId,  //linking w patient id
        goals,
        activities,
        youtubeLinks // Store AI-generated YouTube links
    });

    newPlan.save()
        .then(savedPlan => res.status(201).json({ message: "Therapy plan added successfully!", therapyPlan: savedPlan }))
        .catch(err => res.status(500).json({ error: "Error saving therapy plan" }));
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


module.exports=router;