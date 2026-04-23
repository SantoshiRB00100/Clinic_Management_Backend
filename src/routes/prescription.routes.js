const express = require('express');

const { createPrescription, getPatientPrescriptions, getDoctorPrescriptions } = require("../controllers/prescription.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");


const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("doctor"), createPrescription)

router.get("/patient", authMiddleware, roleMiddleware("patient"), getPatientPrescriptions)

router.get("/doctor", authMiddleware, roleMiddleware("doctor"), getDoctorPrescriptions)

module.exports = router;