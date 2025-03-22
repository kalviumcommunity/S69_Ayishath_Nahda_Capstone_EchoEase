const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Therapist = require("../models/Therapist");
const transporter = require("../utils/emailConfig");
const JWT_SECRET = process.env.JWT_SECRET;

// **Signup Route**
router.post("/signup", async (req, res) => {
    try {
        const { name, email, designation, hospital, password } = req.body;

        if (!name || !email || !designation || !hospital || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const emailLower = email.toLowerCase();
        const existingTherapist = await Therapist.findOne({ email: emailLower });
        if (existingTherapist) {
            return res.status(400).json({ error: "User already registered with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const therapist = new Therapist({
            name,
            email: emailLower,
            designation,
            hospital,
            password: hashedPassword
        });

        await therapist.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("🚨 Signup Error:", error);
        res.status(500).json({ error: "Error saving user", details: error.message });
    }
});

// **Login Route**
// **Login Route**
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const emailLower = email.toLowerCase();
        const therapist = await Therapist.findOne({ email: emailLower });

        if (!therapist) {
            return res.status(400).json({ error: "User not found" });
        }

        // Explicitly ensure therapist exists before proceeding
        if (!therapist || !therapist.password) {
            return res.status(400).json({ error: "Invalid user data" });
        }

        const trimmedPassword = password.trim();
        const isMatch = await bcrypt.compare(trimmedPassword, therapist.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        const token = jwt.sign({ id: therapist._id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful!", token, therapist });
    } catch (error) {
        console.error("🚨 Login Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});
// **Forgot Password - OTP Generation**
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const therapist = await Therapist.findOne({ email });
        if (!therapist) {
            return res.status(400).json({ error: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        therapist.resetOtp = otp;
        therapist.otpExpiry = otpExpiry;
        await therapist.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP - EchoEase",
            text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent successfully!" });
    } catch (error) {
        console.error("🚨 Forgot Password Error:", error);
        res.status(500).json({ error: "Error sending OTP", details: error.message });
    }
});

// **Verify OTP**
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        const therapist = await Therapist.findOne({ email });
        if (!therapist || therapist.resetOtp !== otp) {
            return res.status(400).json({ error: "Invalid OTP or expired" });
        }

        if (therapist.otpExpiry < new Date()) {
            return res.status(400).json({ error: "OTP expired" });
        }

        therapist.resetOtp = null;
        therapist.otpExpiry = null;
        await therapist.save();

        res.json({ message: "OTP verified successfully!" });
    } catch (error) {
        console.error("🚨 OTP Verification Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// **Reset Password**
router.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: "Email and new password are required" });
        }

        const therapist = await Therapist.findOne({ email });
        if (!therapist) {
            return res.status(400).json({ error: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        therapist.password = hashedPassword;

        await therapist.save();
        res.json({ message: "Password reset successfully!" });
    } catch (error) {
        console.error("🚨 Reset Password Error:", error);
        res.status(500).json({ error: "Error resetting password", details: error.message });
    }
});

module.exports = router;