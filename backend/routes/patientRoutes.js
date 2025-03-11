const express=require("express");
const router=express.Router();
const Patient=require("../models/Patient");
const authMiddleware = require("../middleware/authMiddleware");
const { error } = require("console");
const { errorMonitor } = require("events");


//GET method to fetch all patients

router.get("/",authMiddleware,(req,res)=>{
    Patient.find()
    .then(patients =>res.json(patients))
    .catch(err=>res.status(500).json({error:"Server Errors",err}));
});

//GET method to fetch a single patient by ID

router.get("/:id",authMiddleware,(req,res)=>{
    Patient.findById(req.params.id)
    .then(patient =>{
        if(!patient) return res.status(404).json({error:"Patient not found"})
        res.json(patient);
    })
    .catch(err=>res.status(500).json({error:"Server error",err}));
});

module.exports=router;