const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["customer", "business", "admin"],
    default: "customer",
  },
  image: { type: String }, // Path to uploaded image
});

module.exports = mongoose.model("User", UserSchema);
