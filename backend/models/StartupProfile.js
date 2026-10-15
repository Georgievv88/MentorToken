const mongoose = require("mongoose");

const startupProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  startupName: {
    type: String,
    required: true,
    trim: true,
  },
  legalRepresentative: {
    type: String,
    required: true,
    trim: true,
  },
  businessAddress: {
    type: String,
    required: true,
    trim: true,
  },
  mentorEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: "",
  },
  profileImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("StartupProfile", startupProfileSchema);
