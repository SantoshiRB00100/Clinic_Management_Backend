const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const doctorRoutes = require("./routes/doctor.routes")
const appointmentRoutes = require("./routes/appointment.routes")
const prescriptionRoutes = require("./routes/prescription.routes")


const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes)
app.use("/api/prescriptions", prescriptionRoutes)

app.get("/",(req,res)=>{
    res.send("Welcome to clinic management system");
})

module.exports = app;