const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Service = require("../models/Service");

router.post("/add-service", auth, async (req, res) => {
  try {
    const { title, description, image } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ msg: "Title and description are required" });
    }

    const newService = new Service({
      userId: req.user.userId, // <-- Use userId from JWT payload here
      title,
      description,
      image,
    });

    await newService.save();
    res.status(201).json({ msg: "Service added successfully" });
  } catch (err) {
    console.error("Error adding service:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/my-services", auth, async (req, res) => {
  try {
    const services = await Service.find({ userId: req.user.userId });
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all services (for customers to browse)
router.get("/all-services", async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get single service by ID (for the logged-in business user)
router.get("/service/:id", auth, async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update service
router.put("/service/:id", auth, async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete service
router.delete("/service/:id", auth, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    console.error("Error fetching service:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
