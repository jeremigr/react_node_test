// server/src/routes/authRoutes.js
const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controller/authController");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

module.exports = router;
