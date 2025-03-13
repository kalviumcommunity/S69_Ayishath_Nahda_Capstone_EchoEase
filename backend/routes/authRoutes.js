const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const Therapist=require("../models/Therapist");
const JWT_SECRET=process.env.JWT_SECRET;
const { error } = require("console");


//signup route

router.post("/signup", (req, res) => {
    const { name, designation, hospital, password } = req.body;
  
    // Check if the therapist/audiologist already exists by name + hospital 
    Therapist.findOne({ name, hospital })
      .then(existingTherapist => {
        if (existingTherapist) return res.status(400).json({ error: "User already registered" });
  
        bcrypt.hash(password, 10)
          .then(hashedPassword => {
            const therapist = new Therapist({ name, designation, hospital, password: hashedPassword });
  
            therapist.save()
              .then(() => res.status(201).json({ message: "User registered successfully!" }))
              .catch(err => res.status(500).json({ error: "Error saving User" }));
          })
          .catch(err => res.status(500).json({ error: "Error hashing password" }));
      })
      .catch(err => res.status(500).json({ error: "Server error" }));
  });

  //Therapist/Audiologists login route

  router.post("/login",(req,res)=>{
    const {name,password}=req.body;

    Therapist.findOne({name})
     .then(therapist =>{
        if(!therapist) return res.status(400).json({error: "User not found"});

        console.log("Stored Hashed Password",therapist.password);
        console.log("Entered Password",password);

        bcrypt.compare(password,therapist.password)
           .then(isMatch =>{
                if(!isMatch) return res.status(400).json({error: "Invalid credentials"});
                
                jwt.sign({id: therapist._id}, JWT_SECRET, {expiresIn: "1h"}, (err, token)=>{
                    if (err){
                        console.error("JWT Error",err);
                        return res.status(500).json({error: "Error generating token"});
                    }

                    res.json({token,therapist});
                });
           })
           .catch(err => {
            console.error("Bcrypt Error:", err);
            res.status(500).json({ error: "Error comparing password" });
          });



    })
    .catch(err => res.status(500).json({error: "Server error"}));

  });

  module.exports=router;