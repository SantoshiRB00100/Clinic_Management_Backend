const express = require("express")

const { bookAppointment, getDoctorAppointments, updateAppointmentStatus, getPatientAppointments } = require("../controllers/appointment.controller")

const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")

const router = express.Router();

// patient booking

router.post("/", authMiddleware,
    roleMiddleware("patient"),
    bookAppointment
)

// doctor : view appointments

router.get("/doctor", authMiddleware, roleMiddleware("doctor"), getDoctorAppointments)

// doctor update status

router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("doctor"),
    updateAppointmentStatus
)


// Patient: view their appointments
router.get(
    "/patient",
    authMiddleware,
    roleMiddleware("patient"),
    getPatientAppointments
)


module.exports = router