const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// Get all attendance
router.get("/", async (req, res) => {
    try {
        const attendance = await Attendance.find().populate("studentId");
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add attendance
router.post("/", async (req, res) => {
    try {
        const attendance = new Attendance(req.body);
        await attendance.save();
        res.json(attendance);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;