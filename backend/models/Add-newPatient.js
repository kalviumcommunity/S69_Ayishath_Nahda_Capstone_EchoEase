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
    diagnosis: {  // Add this field
        type: String,
        required: true  // Make it required since your logic depends on it
    },
    therapyPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TherapyPlan", // Link to TherapyPlan
        default: null
    }
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

module.exports = mongoose.model("NewPatient", NewPatientSchema);