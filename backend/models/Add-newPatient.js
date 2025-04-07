const mongoose = require("mongoose");

const NewPatientSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    nativeLanguage: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    therapyPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TherapyPlan",
        default: null
    }
}, { timestamps: true });

// Add a compound index for patientName and nativeLanguage (case-insensitive)
NewPatientSchema.index(
    { patientName: 1, nativeLanguage: 1 },
    { unique: true, collation: { locale: 'en', strength: 2 } }
);

module.exports = mongoose.model("NewPatient", NewPatientSchema);