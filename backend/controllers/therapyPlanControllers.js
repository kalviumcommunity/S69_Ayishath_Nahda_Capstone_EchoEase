const { getTherapyPlan } = require("../data/therapyPlansData");
const TherapyPlan = require("../models/TherapyPlan");
const NewPatient = require("../models/Add-newPatient");

async function createTherapyPlan(req, res) {
  try {
    const { patientId } = req.body;
    console.log("Received patientId:", patientId);

    // 1. Get patient
    const patient = await NewPatient.findById(patientId)
      .select('patientName age diagnosis nativeLanguage therapyPlan')
      .lean();
    console.log("Found patient:", patient);

    if (!patient) {
      return res.status(404).json({ 
        status: "error",
        message: "Patient not found",
        patientId
      });
    }

    // Check if diagnosis exists
    if (!patient.diagnosis) {
      return res.status(400).json({
        status: "error",
        message: "Patient is missing a diagnosis",
        patientId
      });
    }

    // 2. Generate plan data
    const planData = await getTherapyPlan(
      patient.diagnosis.toLowerCase(),
      patient.age,
      patient.nativeLanguage || 'en'
    );
    console.log("Generated planData:", planData);

    if (!planData) {
      return res.status(404).json({
        status: "error",
        message: "No plan template found for this diagnosis/age",
        diagnosis: patient.diagnosis,
        age: patient.age
      });
    }

    // 3. Transform activities
    const activities = planData.activities.map(activity => ({
      name: activity.name,
      videos: activity.videos
    }));
    console.log("Transformed activities:", activities);

    const youtubeLinks = activities.flatMap(a => a.videos.map(v => v.url));
    console.log("Generated youtubeLinks:", youtubeLinks);

    // 4. Create and save the therapy plan
    const newPlan = new TherapyPlan({
      patientId,
      patientName: patient.patientName,
      diagnosis: patient.diagnosis,
      age: patient.age,
      goals: planData.goals,
      activities,
      youtubeLinks,
      aiGenerated: false
    });
    console.log("New plan before save:", newPlan);

    const savedPlan = await newPlan.save();
    console.log("Saved plan:", savedPlan);

    await NewPatient.findByIdAndUpdate(patientId, { 
      therapyPlan: savedPlan._id 
    });

    res.status(201).json({
      status: "success",
      data: savedPlan
    });

  } catch (error) {
    console.error("Error in createTherapyPlan:", error.stack);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
}

module.exports = { createTherapyPlan };