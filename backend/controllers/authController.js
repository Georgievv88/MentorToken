const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const MentorProfile = require("../models/MentorProfile");
const StartupProfile = require("../models/StartupProfile");

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
}

function getDisplayName(accountType, profile) {
  return accountType === "startup" ? profile.startupName : profile.name;
}

const registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      accountType,
      name,
      phone,
      address,
      startupName,
      legalRepresentative,
      businessAddress,
      mentorEmail,
    } = req.body;

    if (!email || !password || !accountType) {
      return res.status(400).json({
        message: "Please fill in all the information",
      });
    }

    if (accountType !== "mentor" && accountType !== "startup") {
      return res.status(400).json({ message: "Invalid account type" });
    }

    if (accountType === "mentor" && (!name || !phone || !address)) {
      return res.status(400).json({
        message: "Please fill in all mentor information",
      });
    }

    if (
      accountType === "startup" &&
      (!startupName || !legalRepresentative || !businessAddress)
    ) {
      return res.status(400).json({
        message: "Please fill in all startup information",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      accountType,
    });

    let profile;

    if (accountType === "mentor") {
      profile = await MentorProfile.create({
        user: newUser._id,
        name,
        phone,
        address,
      });
    }

    if (accountType === "startup") {
      profile = await StartupProfile.create({
        user: newUser._id,
        startupName,
        legalRepresentative,
        businessAddress,
        mentorEmail,
      });
    }

    const token = createToken(newUser._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        accountType: newUser.accountType,
        displayName: getDisplayName(newUser.accountType, profile),
      },
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill in all the information",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" }); //Ne davaj info
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" }); //Ne davaj info
    }

    const token = createToken(user._id);
    const profile =
      user.accountType === "startup"
        ? await StartupProfile.findOne({ user: user._id })
        : await MentorProfile.findOne({ user: user._id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
        displayName: getDisplayName(user.accountType, profile),
      },
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to log in" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const profile =
      req.user.accountType === "startup"
        ? await StartupProfile.findOne({ user: req.user._id })
        : await MentorProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        accountType: req.user.accountType,
        displayName: getDisplayName(req.user.accountType, profile),
      },
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
