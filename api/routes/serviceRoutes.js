// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// Search services by keyword (only for type "venue")
router.get("/search", async (req, res) => {
  const keyword = req.query.keyword;

  try {
    const regex = new RegExp(keyword, "i"); // case-insensitive

    const results = await Service.find({
      type: "venue", // only venues
      $or: [
        { title: regex },
        { description: regex },
        { type: regex },
        { occasionTypes: regex },
      ],
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
