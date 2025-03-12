const mongoose=require("mongoose");

const PatientListSchema=new mongoose.Schema({
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
   
    progress: {
        type: Number, 
        default: 0
    },
    therapyPlan: {
        type: mongoose.Schema.Types.ObjectId,
         ref: "TherapyPlan"
    }
});

module.exports=mongoose.model("PatientList",PatientListSchema);