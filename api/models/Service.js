const mongoose = require("mongoose");

// models/Service.js
const serviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: {
    type: String,
    required: function () {
      return this.type !== "menu"; // menu can skip description
    },
  },
  image: { type: String },
  price: { type: Number },
  location: { type: String },
  type: {
    type: String,
    enum: ["decor", "catering", "venue", "menu"],
    required: true,
  },
  occasionTypes: [{ type: String }],

  // 💡 Conditionally required venueId
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: function () {
      return this.type !== "venue"; // decor, catering, and menu require it
    },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Service", serviceSchema);
