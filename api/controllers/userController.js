const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user); // Return user profile data
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Log incoming request data
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const updates = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
    };

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user); // Return updated user profile
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ msg: "Update failed" });
  }
};
