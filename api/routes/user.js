const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // Import multer configuration
const { getProfile, updateProfile } = require("../controllers/userController");

// GET profile
router.get("/profile", auth, getProfile);

// PUT profile with image upload
router.put("/profile", auth, upload.single("image"), updateProfile); // Using multer middleware to handle image upload

module.exports = router;
