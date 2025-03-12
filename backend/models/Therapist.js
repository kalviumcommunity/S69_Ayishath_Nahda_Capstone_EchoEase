const mongoose = require("mongoose");

const TherapistSchema = new mongoose.Schema({       //therapist/audiologist schema
  name: { type: String, required: true },
  designation: { type: String, required: true },
  hospital: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("Therapist", TherapistSchema);
