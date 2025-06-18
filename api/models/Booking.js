const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    decorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    cateringIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    menuIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    eventDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
