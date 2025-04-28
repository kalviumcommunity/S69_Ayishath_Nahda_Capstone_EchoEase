const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String, required: true },
  clarityScore: { type: Number, required: true, min: 1, max: 10 },
});

module.exports = mongoose.model("Progress", progressSchema);