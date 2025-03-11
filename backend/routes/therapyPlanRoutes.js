const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const authMiddleware = require("../middleware/authMiddleware"); 
const TherapyPlan = require("../models/TherapyPlan");

//GET method to fetch therapy plans for a specific patient

router.get(":/patientId", authMiddleware, (req,res)=>{
    TherapyPlan.find({patientName: req.params.patientId})
    .then(therapyPlans =>{
        if(!therapyPlans) return res.status(404).json({error:"No therapy plans found for this patient"});
        res.json(therapyPlans);
    })
    .catch(err =>res.status(500).json({error:"Server error",err}));
});

module.exports=router;