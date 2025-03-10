const mongoose=require("mongoose");

const TherapyPlanSchema= new mongoose.Schema({
    goals:{
        type: [String],
        required: true
    },
    activities: {
        type: [String],
        required: true
    },
    youtubeLinks:{
        type: [String],   //AUto fetched yt links for activities will pophere
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('TherapyPlan',TherapyPlanSchema);