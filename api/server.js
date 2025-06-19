const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/business");

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check (optional)
app.get("/", (req, res) => res.send("API is running..."));

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/business", businessRoutes);
app.use("/api/booking", require("./routes/booking"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
