const mongoose=require("mongoose");

const TherapyPlanSchema= new mongoose.Schema({
    patientName:{
        type: String,
        required:true  //Link therapyplan using patientname
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