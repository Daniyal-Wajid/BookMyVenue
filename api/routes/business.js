const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Service = require("../models/Service");

router.post("/add-multiple-services", auth, async (req, res) => {
  try {
    const { decorItems = [], cateringItems = [], menuItems = [] } = req.body;
    const userId = req.user.userId;

    const mapItems = (items, type) =>
      items.map((item) => ({
        userId,
        title: item.title,
        description: item.description,
        image: item.image || "",
        price: item.price || 0,
        location: item.location || "", // will store empty string if not provided
        type,
        occasionTypes: item.occasionTypes || [], // optional for future
      }));

    const servicesToSave = [
      ...mapItems(decorItems, "decor"),
      ...mapItems(cateringItems, "catering"),
      ...mapItems(menuItems, "menu"),
    ];

    if (servicesToSave.length === 0) {
      return res.status(400).json({ msg: "No services provided." });
    }

    await Service.insertMany(servicesToSave);
    res.status(201).json({ msg: "All services added successfully." });
  } catch (err) {
    console.error("Error adding multiple services:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// routes/business.js
router.post("/add-service", auth, async (req, res) => {
  try {
    const { title, description, image, type, price, location, occasionTypes } =
      req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ msg: "Title and description are required" });
    }

    const newService = new Service({
      userId: req.user.userId,
      title,
      description,
      image,
      type,
      price: price || 0,
      location: location || "",
      occasionTypes: type === "venue" ? occasionTypes || [] : [],
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

router.get("/services/:id", async (req, res) => {
  try {
    const venue = await Service.findById(req.params.id);
    if (!venue || venue.type !== "venue") {
      return res.status(404).json({ message: "Venue not found" });
    }

    const userId = venue.userId;

    const [decorItems, cateringItems, menuItems] = await Promise.all([
      Service.find({ userId, type: "decor" }),
      Service.find({ userId, type: "catering" }),
      Service.find({ userId, type: "menu" }),
    ]);

    res.json({
      venue,
      decorItems,
      cateringItems,
      menuItems,
    });
  } catch (err) {
    console.error("Error fetching service details:", err.message);
    res.status(500).json({ message: "Server error" });
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
