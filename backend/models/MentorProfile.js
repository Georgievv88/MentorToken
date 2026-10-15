const mongoose = require("mongoose");

const mentorprofileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("MentorProfile", mentorprofileSchema);
