const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch(err => console.log(err));

// Routes
app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Student Management System is Running...");
});

app.delete("/test", (req, res) => {
    res.send("Delete route is working");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});