const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Therapist = require("../models/Therapist");
const JWT_SECRET = process.env.JWT_SECRET;
const transporter = require("../utils/emailConfig");

// **Signup Route**
router.post("/signup", async (req, res) => {
    try {
        const { name, email, designation, hospital, password } = req.body;

        if (!name || !email || !designation || !hospital || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        //  Ensure email is unique
        const existingTherapist = await Therapist.findOne({ email });
        if (existingTherapist) {
            return res.status(400).json({ error: "User already registered with this email" });
        }

        console.log("Raw Password Before Hashing:", password);

        //  Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Generated Hashed Password:", hashedPassword);

        const therapist = new Therapist({
            name,
            email,
            designation,
            hospital,
            password: hashedPassword
        });

        await therapist.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Error saving User", details: error.message });
    }
});

// **Login Route**
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        //  Find therapist by email
        const therapist = await Therapist.findOne({ email });
        if (!therapist) {
            return res.status(400).json({ error: "User not found" });
        }

        console.log("Stored Hashed Password:", therapist.password);
        console.log("Entered Password:", password);

        //  Compare passwords
        const isMatch = await bcrypt.compare(password, therapist.password);
        console.log("Password Match Result:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        //  Generate JWT token
        const token = jwt.sign({ id: therapist._id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, therapist });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

//FORGOT PASSWORD-OTP generation

router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ error: "Email is required" });

        const therapist = await Therapist.findOne({ email: email.toLowerCase() });
        if (!therapist) return res.status(400).json({ error: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 mins

        therapist.resetOtp = otp;
        therapist.otpExpiry = otpExpiry;
        await therapist.save();

        console.log("Generated OTP:", otp);

        // Send OTP via Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP - EchoEase",
            text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent successfully!" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: "Error sending OTP", details: error.message });
    }
});

//Verify OTP

router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        const therapist = await Therapist.findOne({ email });
        if (!therapist || therapist.resetOtp !== otp) {
            return res.status(400).json({ error: "Invalid OTP or expired" });
        }

        // Check if OTP is expired
        if (therapist.otpExpiry < new Date()) {
            return res.status(400).json({ error: "OTP expired" });
        }

        // Clear OTP after verification
        therapist.resetOtp = null;
        therapist.otpExpiry = null;
        await therapist.save();

        res.json({ message: "OTP verified successfully!" });

    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

//Rest Password
router.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: "Email and new password are required" });
        }

        // Find the therapist by email
        const therapist = await Therapist.findOne({ email: email.toLowerCase() });
        if (!therapist) {
            return res.status(400).json({ error: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the therapist's password
        therapist.password = hashedPassword;
        await therapist.save();

        res.json({ message: "Password reset successfully!" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Error resetting password", details: error.message });
    }
});

module.exports = router;
