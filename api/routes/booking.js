const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Booking = require("../models/Booking");

// Get bookings for business owner
router.get("/business-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ businessId: req.user.userId })
      .populate("customerId", "name email")
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
// routes/booking.js
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.userId })
      .populate("venueId")
      .populate("decorIds")
      .populate("cateringIds")
      .populate("menuIds");
    res.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/book", auth, async (req, res) => {
  try {
    const {
      venueId,
      decorIds = [],
      cateringIds = [],
      menuIds = [],
      eventDate,
      businessId,
    } = req.body;

    if (!venueId || !eventDate || !businessId) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    const booking = new Booking({
      customerId: req.user.userId,
      businessId,
      venueId,
      decorIds,
      cateringIds,
      menuIds,
      eventDate,
    });

    await booking.save();
    res.status(201).json({ msg: "Booking successful", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/my-pending-bookings", auth, async (req, res) => {
  try {
    console.log("userId from token:", req.user.userId);

    const bookings = await Booking.find({
      businessId: req.user.userId,
      status: "Pending",
    }).populate("venueId");

    console.log("Found bookings:", bookings.length);
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching pending bookings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

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
// Cancel a booking by changing status to "Cancelled"
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only customer who booked or business owner can cancel
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

    booking.status = "Confirmed";
    await booking.save();

    res.json({ message: "Booking marked as completed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get booking history (Completed or Cancelled) for logged-in customer
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
      .sort({ eventDate: -1 }); // Most recent first

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching booking history:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
