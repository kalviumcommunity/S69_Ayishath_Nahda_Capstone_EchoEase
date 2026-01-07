const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Therapist = require("../models/Therapist");
// const transporter = require("../utils/otpService");
const {verifyOTP}=require("../utils/otpService");
const otpService=require("../utils/otpService");
const JWT_SECRET = process.env.JWT_SECRET;

// // ** Check if JWT_SECRET is properly set **
// if (!JWT_SECRET) {
//     console.error("🚨 Missing JWT_SECRET in environment variables");
//     process.exit(1); // Stop the server
// }

// **Signup Route**        //db write
router.post("/signup", async (req, res) => {
    try {
        const { fullname, email, designation, hospital, password } = req.body;

        if (!fullname || !email || !designation || !hospital || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const emailLower = email.toLowerCase();
        const existingTherapist = await Therapist.findOne({ email: emailLower });

        if (existingTherapist) {
            return res.status(400).json({ error: "User already registered with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const therapist = new Therapist({
            fullname,
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

        if (!therapist.password) {
            return res.status(400).json({ error: "Invalid user data" });
        }

        const isMatch = await bcrypt.compare(password.trim(), therapist.password);

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
router.post("/forgot-password", [
    body("email").isEmail().withMessage("Valid email is required.")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    try {
        const therapist = await Therapist.findOne({ email });
        if (!therapist) return res.status(404).json({ message: "Therapist not found." });

        const otp = otpService.generateOTP();
        otpService.sendOTP(email, otp);
        otpService.storeOTP(email, otp);
        
        return res.status(200).json({ message: "OTP sent successfully." });
    } catch (err) {
        console.error("Forgot Password Error:", err);
        return res.status(500).json({ message: "Server error." });
    }
});


// **Verify OTP**
router.post("/verify-reset-otp", async (req, res) => {
    const { email, otp } = req.body;

    try {
        const isValid = verifyOTP(email, otp);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        return res.json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Server error" }); }
});

// **Reset Password**
router.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const therapist = await Therapist.findOne({ email });
        if (!therapist) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password
        therapist.password = hashedPassword;
        await therapist.save();

        return res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
