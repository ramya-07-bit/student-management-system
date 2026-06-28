const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use("/students", studentRoutes);

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