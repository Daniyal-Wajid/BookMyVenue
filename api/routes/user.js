const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // Import multer configuration
const User = require("../models/User");
const { getProfile, updateProfile } = require("../controllers/userController");

// GET profile
router.get("/profile", auth, getProfile);

// PUT profile with image upload
router.put("/profile", auth, upload.single("image"), updateProfile); // Using multer middleware to handle image upload

router.get("/all", auth, async (req, res) => {
  try {
    const users = await User.find({}, "name email phoneNumber userType image");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
