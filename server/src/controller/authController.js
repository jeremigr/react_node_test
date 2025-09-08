// server/src/controller/authController.js

const { addLogin, addLogout } = require('../models/userLogsStore');
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { FullName, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            FullName,
            email,
            password: hashedPassword,
            role: role || "user"   // Default role is "user"
        });
        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Log registration as login too
        addLogin({
            userId: user._id.toString(),
            userName: user.FullName,
            role: user.role,
            tokenName: "jwt",
            ip: req.ip
        });

        res.json({ token, userId: user._id, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Login existing user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Log login
        addLogin({
            userId: user._id.toString(),
            userName: user.FullName,
            role: user.role,
            tokenName: "jwt",
            ip: req.ip
        });

        res.json({ token, userId: user._id, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Logout user
const logoutUser = (req, res) => {
    try {
        const userId = req.user.userId;
        addLogout({ userId });
        res.json({ message: "Logged out" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser, logoutUser };
