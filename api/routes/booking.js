const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Booking = require("../models/Booking");

// Helper: Check time overlap
const isTimeOverlap = (aStart, aEnd, bStart, bEnd) => {
  return !(aEnd <= bStart || aStart >= bEnd);
};

// Book a new service
router.post("/book", auth, async (req, res) => {
  try {
    const {
      venueId,
      decorIds = [],
      cateringIds = [],
      menuIds = [],
      eventDate,
      businessId,
      startTime,
      endTime,
    } = req.body;

    if (!venueId || !eventDate || !businessId || !startTime || !endTime) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ msg: "Start time must be before end time." });
    }

    const existingBookings = await Booking.find({
      venueId,
      eventDate,
      status: { $ne: "Cancelled" },
    });

    const hasConflict = existingBookings.some((b) =>
      isTimeOverlap(startTime, endTime, b.startTime, b.endTime)
    );

    if (hasConflict) {
      return res.status(409).json({ msg: "Time slot already booked." });
    }

    const booking = new Booking({
      customerId: req.user.userId,
      businessId,
      venueId,
      decorIds,
      cateringIds,
      menuIds,
      eventDate,
      startTime,
      endTime,
      paymentStatus: "Unpaid", // 🔹 Set default
    });

    await booking.save();
    res.status(201).json({ msg: "Booking successful", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update payment status
router.put("/:id/payment-status", auth, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const allowed = ["Unpaid", "Paid", "Refunded"];

    if (!allowed.includes(paymentStatus)) {
      return res.status(400).json({ msg: "Invalid payment status." });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: "Booking not found." });

    if (
      booking.customerId.toString() !== req.user.userId &&
      booking.businessId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ msg: "Not authorized." });
    }

    booking.paymentStatus = paymentStatus;
    await booking.save();

    res.json({ msg: "Payment status updated.", booking });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get bookings for business owner
router.get("/business-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ businessId: req.user.userId })
      .populate("customerId", "name email phoneNumber") // <-- added phoneNumber
      .populate("venueId", "title")
      .populate("decorIds", "title")
      .populate("cateringIds", "title")
      .populate("menuIds", "title")
      .sort({ eventDate: 1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching business bookings:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all bookings for the logged-in customer
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.userId })
      .populate("venueId")
      .populate("decorIds")
      .populate("cateringIds")
      .populate("menuIds");

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get pending bookings for business owner
router.get("/my-pending-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      businessId: req.user.userId,
      status: "Pending",
    }).populate("venueId");

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching pending bookings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get booking history for logged-in customer
router.get("/my-booking-history", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerId: req.user.userId,
      status: { $in: ["Cancelled", "Confirmed"] },
    })
      .populate("venueId")
      .populate("decorIds")
      .populate("cateringIds")
      .populate("menuIds")
      .sort({ eventDate: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching booking history:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete booking
router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.businessId.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Cancel booking
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (
      booking.customerId.toString() !== req.user.userId &&
      booking.businessId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id/complete", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.businessId.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    booking.status = "Completed"; // Correct status here
    await booking.save();

    res.json({ message: "Booking marked as completed", booking });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all bookings for a venue
router.get("/bookings-by-venue/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({
      venueId: req.params.id,
      status: { $ne: "Cancelled" },
    });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching venue bookings:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
