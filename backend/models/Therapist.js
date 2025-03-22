const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");

const TherapistSchema = new mongoose.Schema({       //therapist/audiologist schema
  name: {
     type: String, 
     required: true 
    },
  email:{
    type: String,
    required: true,
    unique: true
  },
  designation: { 
    type: String,
    required: true
   },
  hospital: {
     type: String,
    required: true
   },
  password: { 
    type: String,
    required: true
  },
  resetOtp:{
    type:String,
    default: null
  },
  otpExpiry:{
    type: Date,
    default: null 
  }
});

//Hash password before saving

TherapistSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    // Only hash if the password isn’t already hashed
    if (!this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Therapist", TherapistSchema);
