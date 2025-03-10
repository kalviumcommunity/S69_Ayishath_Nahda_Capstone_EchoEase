const mongoose=require("mongoose");

const PatientSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    origin: {
        type: String,    //Country/State
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    nativeLanguage: {
        type: String,
        required: true
    },
    therapyPlan: {
        type: mongoose.Schema.Types.ObjectId, ref: "TherapyPlan"
    },
    progress: {
        type: Number,
        default: 0
    }
});

module.exports=mongoose.model("Patient",PatientSchema);