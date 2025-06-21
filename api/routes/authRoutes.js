const express = require("express");
const { register, login } = require("../controllers/authController");
const upload = require("../middleware/upload"); // ✅ Your multer setup

const router = express.Router();

router.post("/register", upload.single("image"), register);
router.post("/login", login);

module.exports = router;
