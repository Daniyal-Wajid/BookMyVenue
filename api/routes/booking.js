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

module.exports = router;
