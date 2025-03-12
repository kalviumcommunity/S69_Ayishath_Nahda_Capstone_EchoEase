const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");

const TherapistSchema = new mongoose.Schema({       //therapist/audiologist schema
  name: { type: String, required: true },
  designation: { type: String, required: true },
  hospital: { type: String, required: true },
  password: { type: String, required: true } //keep this hashed for security
});

//Hash password before saving

TherapistSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();
  try{
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();

  }catch(err){
    next(err);
  }
 
});

module.exports = mongoose.model("Therapist", TherapistSchema);
