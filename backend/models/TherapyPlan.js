// models/TherapyPlan.js (suggested schema)
const mongoose = require("mongoose");

const TherapyPlanSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewPatient",
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  nativeLanguage: {
    type: String,
    required: true,
  },
  aphasiaSeverity: {
    type: String,
  },
  goals: [{
    type: String,
  }],
  activities: [{
    name: String,
    videos: [{
      title: String,
      url: String,
      thumbnail: String,
    }],
  }],
  youtubeLinks: [{
    type: String,
  }],
  aiGenerated: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("TherapyPlan", TherapyPlanSchema);