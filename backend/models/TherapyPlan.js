const mongoose=require("mongoose");

const TherapyPlanSchema= new mongoose.Schema({
    patientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewPatient",
        required:true  
    },
    goals:{
        type: [String],
        required: true
    },
    activities: {
        type: [String],
        required: true
    },
    youtubeLinks:{
        type: [String],   //Auto fetched yt links for activities will pophere
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('TherapyPlan',TherapyPlanSchema);