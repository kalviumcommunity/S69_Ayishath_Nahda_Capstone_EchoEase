const { getTherapyPlan, fetchYouTubeVideos } = require("../data/therapyPlansData");
const TherapyPlan = require("../models/TherapyPlan");
const NewPatient = require("../models/Add-newPatient");

async function createTherapyPlan(req, res) {
  try {
    const { patientId } = req.body;
    console.log("Received patientId:", patientId);

    if (!patientId) {
      return res.status(400).json({
        status: "error",
        message: "Missing required field: patientId",
      });
    }

    // Verify the patient belongs to the therapist
    const patient = await NewPatient.findOne({
      _id: patientId,
      therapistId: req.user.id
    })
      .select("patientName age diagnosis nativeLanguage aphasiaSeverity")
      .lean();

    if (!patient) {
      return res.status(404).json({
        status: "error",
        message: "Patient not found or you do not have access",
        patientId,
      });
    }

    console.log("Fetched patient data:", patient);

    if (!patient.diagnosis) {
      return res.status(400).json({
        status: "error",
        message: "Patient is missing a diagnosis",
        patientId,
      });
    }

    if (patient.diagnosis.toLowerCase() === "aphasia" && !patient.aphasiaSeverity) {
      return res.status(400).json({
        status: "error",
        message: "Severity is required for Aphasia diagnosis",
        patientId,
      });
    }

    const diagnosisKey = patient.diagnosis.toLowerCase();
    console.log("Searching for diagnosis:", diagnosisKey);

    const planData = await getTherapyPlan(
      diagnosisKey,
      patient.age,
      patient.nativeLanguage || "en",
      patient.aphasiaSeverity
    );

    if (!planData) {
      return res.status(404).json({
        status: "error",
        message: `No plan template found for ${patient.diagnosis}${patient.aphasiaSeverity ? ` with severity: ${patient.aphasiaSeverity}` : ''}`,
        diagnosis: patient.diagnosis,
        age: patient.age,
        severity: patient.aphasiaSeverity,
      });
    }

    console.log("Plan data retrieved (sanitized):", {
      goals: planData.goals.length,
      activities: planData.activities.map((a) => a.name),
    });

    const activities = planData.activities.map((activity) => ({
      name: activity.name,
      videos: activity.videos
        ? activity.videos.map((v) => ({
            title: v.title || "No title",
            url: v.url || "#",
            thumbnail: v.thumbnail || null,
          }))
        : [],
    }));

    const youtubeLinks = activities.flatMap((a) =>
      a.videos.filter((v) => v.url !== "#").map((v) => v.url)
    );

    const therapyPlan = new TherapyPlan({
      patientId,
      patientName: patient.patientName,
      diagnosis: patient.diagnosis,
      age: patient.age,
      nativeLanguage: patient.nativeLanguage || "en",
      aphasiaSeverity: patient.aphasiaSeverity,
      goals: planData.goals || [],
      activities: activities || [],
      youtubeLinks: youtubeLinks || [],
      aiGenerated: true,
    });

    const savedPlan = await therapyPlan.save();
    await NewPatient.findByIdAndUpdate(patientId, { therapyPlan: savedPlan._id });

    console.log("Successfully created therapy plan:", savedPlan._id);

    res.status(201).json({
      status: "success",
      data: savedPlan,
    });
  } catch (error) {
    console.error("Error in createTherapyPlan:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      status: "error",
      message: "Failed to create therapy plan",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
}

async function getTherapyPlanByPatientId(req, res) {
  try {
    const { patientId } = req.params;

    // Verify the patient belongs to the therapist
    const patient = await NewPatient.findOne({
      _id: patientId,
      therapistId: req.user.id
    });
    if (!patient) {
      return res.status(404).json({
        status: "error",
        message: "Patient not found or you do not have access",
        patientId,
      });
    }

    const therapyPlan = await TherapyPlan.findOne({ patientId }).populate(
      "patientId",
      "patientName age diagnosis nativeLanguage aphasiaSeverity"
    );

    if (!therapyPlan) {
      return res.status(404).json({
        status: "error",
        message: "No therapy plan found for this patient",
        patientId,
      });
    }

    res.json({
      status: "success",
      data: therapyPlan,
    });
  } catch (error) {
    console.error("Error fetching therapy plan:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      status: "error",
      message: "Failed to fetch therapy plan",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
}

async function generateTherapyPlan(req, res) {
  try {
    const { patientId, diagnosis, age, language = "en", severity } = req.body;

    if (!patientId || !diagnosis || !age) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        required: ["patientId", "diagnosis", "age"],
      });
    }

    // Verify the patient belongs to the therapist
    const patient = await NewPatient.findOne({
      _id: patientId,
      therapistId: req.user.id
    })
      .select("patientName age diagnosis nativeLanguage aphasiaSeverity")
      .lean();

    if (!patient) {
      return res.status(404).json({
        status: "error",
        message: "Patient not found or you do not have access",
        patientId,
      });
    }

    let effectiveSeverity = severity;
    if (diagnosis.toLowerCase() === "aphasia") {
      if (!effectiveSeverity && patient.aphasiaSeverity) {
        effectiveSeverity = patient.aphasiaSeverity;
      }
      if (!effectiveSeverity) {
        return res.status(400).json({
          status: "error",
          message: "Severity is required for Aphasia diagnosis",
          patientId,
        });
      }
    }

    const diagnosisKey = diagnosis.toLowerCase();
    console.log("Generating plan for:", { diagnosisKey, age, language, severity: effectiveSeverity });

    const plan = await getTherapyPlan(diagnosisKey, age, language, effectiveSeverity);

    if (!plan) {
      return res.status(404).json({
        status: "error",
        message: `No plan template found for ${diagnosis}${effectiveSeverity ? ` with severity: ${effectiveSeverity}` : ''}`,
        diagnosis,
        age,
        severity: effectiveSeverity,
      });
    }

    console.log("Successfully generated plan:", {
      goals: plan.goals.length,
      activities: plan.activities.length,
    });

    res.json({
      status: "success",
      data: plan,
    });
  } catch (error) {
    console.error("Error generating therapy plan:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      status: "error",
      message: "Failed to generate therapy plan",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
}
// therapyPlanControllers.js (only updating searchVideos)
async function searchVideos(req, res) {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Query is required",
      });
    }

    const activity = { name: query, ytKeywords: query };
    const videos = await fetchYouTubeVideos(activity);

    if (!videos || videos.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No videos found for the given query",
      });
    }

    res.json({
      status: "success",
      data: videos,
    });
  } catch (error) {
    console.error("Error searching videos:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch videos",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
async function updateTherapyPlan(req, res) {
  try {
    const { _id, goals, activities, patientId } = req.body;

    if (!_id) {
      return res.status(400).json({
        status: "error",
        message: "Missing required field: _id",
      });
    }

    // Verify the patient belongs to the therapist
    const patient = await NewPatient.findOne({
      _id: patientId,
      therapistId: req.user.id,
    }).lean();

    if (!patient) {
      return res.status(404).json({
        status: "error",
        message: "Patient not found or you do not have access",
        patientId,
      });
    }

    // Update the therapy plan
    const therapyPlan = await TherapyPlan.findByIdAndUpdate(
      _id,
      { goals, activities, patientId }, // Update with the provided activities (including videos)
      { new: true, runValidators: true }
    );

    if (!therapyPlan) {
      return res.status(404).json({
        status: "error",
        message: "Therapy plan not found",
      });
    }

    res.json({
      status: "success",
      data: therapyPlan,
    });
  } catch (error) {
    console.error("Error updating therapy plan:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update therapy plan",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
}


module.exports = {
  generateTherapyPlan,
  createTherapyPlan,
  getTherapyPlanByPatientId,
  searchVideos,
  updateTherapyPlan,
};