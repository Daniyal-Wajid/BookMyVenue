const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Service = require("../models/Service");
const upload = require("../middleware/upload");

// Add Venue
router.post("/add-service", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, type, price, location, occasionTypes } =
      req.body;

    const newService = new Service({
      userId: req.user.userId,
      title,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      type,
      price: price || 0,
      location: location || "",
      occasionTypes: type === "venue" ? occasionTypes || [] : [],
    });

    await newService.save();
    res
      .status(201)
      .json({ msg: "Service added successfully", venueId: newService._id });
  } catch (err) {
    console.error("Error adding service:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Add Related Services (decor/catering/menu)
router.post("/add-multiple-services", auth, upload.any(), async (req, res) => {
  try {
    const userId = req.user.userId;
    const venueId = req.body.venueId;
    if (!venueId)
      return res
        .status(400)
        .json({ msg: "venueId is required for related services." });

    const decorItems = JSON.parse(req.body.decorItems || "[]");
    const cateringItems = JSON.parse(req.body.cateringItems || "[]");
    const menuItems = JSON.parse(req.body.menuItems || "[]");

    const findImage = (type, index) => {
      const key = `${type}Image_${index}`;
      const file = req.files.find((f) => f.fieldname === key);
      return file ? `/uploads/${file.filename}` : "";
    };

    const mapItems = (items, type) =>
      items
        .filter((item) => item && (item.title || item.name))
        .map((item, index) => ({
          userId,
          title: item.title || item.name,
          description: item.description || "",
          image: findImage(type, index),
          price: item.price || 0,
          location: item.location || "",
          type,
          occasionTypes: item.occasionTypes || [],
          category: item.category || undefined,
          venueId, // ✅ add venueId
        }));

    const servicesToSave = [
      ...mapItems(decorItems, "decor"),
      ...mapItems(cateringItems, "catering"),
      ...mapItems(menuItems, "menu"),
    ];

    if (servicesToSave.length === 0)
      return res.status(400).json({ msg: "No services provided." });

    await Service.insertMany(servicesToSave);
    res.status(201).json({ msg: "All services added successfully." });
  } catch (err) {
    console.error("Error adding multiple services:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get All Services (admin/customer browse)
router.get("/all-services", async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get My Services (business dashboard)
router.get("/my-services", auth, async (req, res) => {
  try {
    const services = await Service.find({ userId: req.user.userId });
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get Venue and its Related Services
router.get("/service/:id", async (req, res) => {
  try {
    const venue = await Service.findById(req.params.id);
    if (!venue || venue.type !== "venue")
      return res.status(404).json({ message: "Venue not found" });

    const venueId = venue._id;

    const [decorItems, cateringItems, menuItems] = await Promise.all([
      Service.find({ venueId, type: "decor" }),
      Service.find({ venueId, type: "catering" }),
      Service.find({ venueId, type: "menu" }),
    ]);

    res.json({ venue, decorItems, cateringItems, menuItems });
  } catch (err) {
    console.error("Error fetching service details:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Venue and Related Services
router.put("/service/:id", auth, async (req, res) => {
  const venueId = req.params.id;
  const userId = req.user.userId;

  const {
    title,
    location,
    price,
    description,
    image,
    occasionTypes,
    decorItems = [],
    cateringItems = [],
    menuItems = [],
  } = req.body;

  try {
    // ✅ Update venue
    const updatedVenue = await Service.findOneAndUpdate(
      { _id: venueId, userId, type: "venue" },
      { title, location, price, description, image, occasionTypes },
      { new: true, runValidators: true }
    );
    if (!updatedVenue)
      return res
        .status(404)
        .json({ message: "Venue not found or unauthorized" });

    // ✅ Helper for creating/updating services
    const upsertItems = async (items, type) => {
      for (const item of items) {
        const itemTitle = item.title || item.name;
        if (!itemTitle) continue;

        if (item._id && !item._id.toString().startsWith("new-")) {
          // Update
          await Service.findOneAndUpdate(
            { _id: item._id, userId, type },
            {
              title: itemTitle,
              description: item.description,
              price: item.price,
              image: item.image,
              category: item.category || undefined,
            },
            { new: true, runValidators: true }
          );
        } else {
          // Create (✅ add venueId)
          const newItem = new Service({
            userId,
            title: itemTitle,
            description: item.description,
            price: item.price,
            image: item.image,
            type,
            location: "",
            occasionTypes: [],
            category: item.category || undefined,
            venueId, // ✅ FIXED: include venue reference
          });
          await newItem.save();
        }
      }
    };

    await upsertItems(decorItems, "decor");
    await upsertItems(cateringItems, "catering");
    await upsertItems(menuItems, "menu");

    res.json({ message: "Venue and related services updated successfully" });
  } catch (err) {
    console.error("Error updating venue/services:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Any Service
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

module.exports = router;
