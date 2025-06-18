const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  price: { type: Number },
  location: { type: String },
  type: {
    type: String,
    enum: ["decor", "catering", "venue", "menu"],
  },
  occasionTypes: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Service", serviceSchema);
