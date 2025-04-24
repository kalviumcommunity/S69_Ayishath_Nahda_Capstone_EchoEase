const { getTherapyPlan } = require("../data/therapyPlansData");
const TherapyPlan = require("../models/TherapyPlan");
const NewPatient = require("../models/Add-newPatient");

async function generateTherapyPlan(req, res) {
  try {
    const { diagnosis, age, language = 'en' } = req.body;
    
    if (!diagnosis || !age) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        required: ["diagnosis", "age"]
      });
    }

    const diagnosisKey = diagnosis.toLowerCase();
    console.log("Generating plan for:", { diagnosisKey, age, language });

    const plan = await getTherapyPlan(diagnosisKey, age, language);
    
    if (!plan) {
      console.error("No plan found for criteria:", { diagnosisKey, age });
      return res.status(404).json({
        status: "error",
        message: "No therapy plan found for this criteria",
        diagnosis,
        age
      });
    }

    console.log("Successfully generated plan:", {
      goals: plan.goals.length,
      activities: plan.activities.length
    });

    res.json({
      status: "success",
      data: plan
    });

  } catch (error) {
    console.error("Error generating therapy plan:", {
      message: error.message,
      stack: error.stack,
      details: error.response?.data?.error || {}
    });
    res.status(500).json({
      status: "error",
      message: "Failed to generate therapy plan",
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        details: error.response?.data?.error || {}
      })
    });
  }
}

async function createTherapyPlan(req, res) {
  try {
    const { patientId } = req.body;
    console.log("Received patientId:", patientId);

    const patient = await NewPatient.findById(patientId)
      .select('patientName age diagnosis nativeLanguage')
      .lean();

    if (!patient) {
      console.error("Patient not found with ID:", patientId);
      return res.status(404).json({ 
        status: "error",
        message: "Patient not found",
        patientId
      });
    }

    console.log("Patient data:", {
      name: patient.patientName,
      diagnosis: patient.diagnosis,
      age: patient.age,
      language: patient.nativeLanguage
    });

    if (!patient.diagnosis) {
      console.error("Patient missing diagnosis:", patientId);
      return res.status(400).json({
        status: "error",
        message: "Patient is missing a diagnosis",
        patientId
      });
    }

    const diagnosisKey = patient.diagnosis.toLowerCase();
    console.log("Searching for diagnosis:", diagnosisKey);
    
    const planData = await getTherapyPlan(
      diagnosisKey,
      patient.age,
      patient.nativeLanguage || 'en' // Use patient's native language
    );

    if (!planData) {
      console.error("No plan found for:", {
        diagnosis: diagnosisKey,
        age: patient.age
      });
      return res.status(404).json({
        status: "error",
        message: "No plan template found for this diagnosis/age",
        diagnosis: patient.diagnosis,
        age: patient.age
      });
    }

    console.log("Plan data retrieved:", {
      goals: planData.goals,
      activities: planData.activities.map(a => a.name)
    });
 //fetching for yt ai
    const activities = planData.activities.map(activity => ({
      name: activity.name,
      videos: activity.videos.map(v => ({
        title: v.title || "No title",
        url: v.url || "#",
        thumbnail: v.thumbnail || ""
      }))
    }));

    const youtubeLinks = activities.flatMap(a => 
      a.videos.filter(v => v.url !== "#").map(v => v.url)
    );

    const therapyPlan = new TherapyPlan({
      patientId,
      patientName: patient.patientName,
      diagnosis: patient.diagnosis,
      age: patient.age,
      goals: planData.goals || [],
      activities: activities || [],
      youtubeLinks: youtubeLinks || [],
      aiGenerated: true
    });

    const savedPlan = await therapyPlan.save();
    await NewPatient.findByIdAndUpdate(patientId, { therapyPlan: savedPlan._id });

    console.log("Successfully created therapy plan:", savedPlan._id);
    
    res.status(201).json({
      status: "success",
      data: savedPlan
    });

  } catch (error) {
    console.error("Error in createTherapyPlan:", {
      message: error.message,
      stack: error.stack,
      details: error.response?.data?.error || {}
    });
    res.status(500).json({
      status: "error",
      message: "Failed to create therapy plan",
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        details: error.response?.data?.error || {}
      })
    });
  }
}

module.exports = {
  generateTherapyPlan,
  createTherapyPlan
};