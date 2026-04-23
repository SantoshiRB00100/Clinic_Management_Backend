const express = require('express');

const { createDoctor, getDoctors, approveDoctor, rejectDoctor, getApprovedDoctors } = require('../controllers/doctor.controller')

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("admin"), createDoctor)

//Admin: get all doctors

router.get("/", authMiddleware, roleMiddleware("admin"), getDoctors)

// admin: approve doctor

router.patch("/:id/approve", authMiddleware, roleMiddleware("admin"), approveDoctor)

// admin: reject doctor

router.patch("/:id/reject", authMiddleware, roleMiddleware("admin"), rejectDoctor)

// Public / Patient: view approved doctors
router.get("/approved", getApprovedDoctors)


module.exports = router;