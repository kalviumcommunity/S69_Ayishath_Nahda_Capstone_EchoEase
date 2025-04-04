const mongoose = require("mongoose");

const TherapyPlanSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewPatient",
        required: true
    },
    patientName: String,
    diagnosis: String,
    goals: [String],
    activities: [{
        name: String,
        videos: [{
            title: String,
            url: String,
            thumbnail: String
        }]
    }],
    youtubeLinks: [String],
    aiGenerated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("TherapyPlan", TherapyPlanSchema);