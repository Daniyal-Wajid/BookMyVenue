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
      type: String, // Keep as string to match frontend's "YYYY-MM-DD"
      required: true,
    },
    startTime: {
      type: String, // Format: "HH:mm"
      required: true,
    },
    endTime: {
      type: String, // Format: "HH:mm"
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"], // <-- added Completed here
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Refunded"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
