// models/Add-newPatient.js
const mongoose = require("mongoose");

const NewPatientSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  nativeLanguage: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  aphasiaSeverity: {
    type: String,
    trim: true,
    lowercase: true,
    enum: ['mild', 'moderate', null],
    default: null
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  therapyPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TherapyPlan",
    default: null
  },
  therapistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Therapist",
    required: true // Ensure every patient is tied to a therapist
  }
}, { timestamps: true });

// Update the index to include therapistId for uniqueness per therapist
NewPatientSchema.index(
  { patientName: 1, nativeLanguage: 1, therapistId: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

NewPatientSchema.pre('save', function(next) {
  if (this.diagnosis === 'aphasia' && !this.aphasiaSeverity) {
    return next(new Error('Severity is required for Aphasia diagnosis'));
  }
  next();
});

module.exports = mongoose.model("NewPatient", NewPatientSchema);