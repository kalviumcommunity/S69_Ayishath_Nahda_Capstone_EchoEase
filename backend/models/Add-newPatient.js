const mongoose=require("mongoose");

const NewPatientSchema=new mongoose.Schema({
    patientName:{
        type: String,
        required:true
    },
    age:{
        type: Number,
        required:true
    },
    nativeLanguage:{
        type:String,
        required:true
    },
    therapyPlan:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"TherapyPlan" , //link therapyPlan
         default: null

    }
});

module.exports=mongoose.model("NewPatient",NewPatientSchema);