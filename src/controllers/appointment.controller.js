const Appointment = require("../model/appointment.model")
const Doctor = require("../model/doctor.model")

// book an appointment only for patients

const bookAppointment = async (req, res) => {
    
    try{

        const { doctorId, date, time, reason } = req.body
        const patientId = req.user.id

        // ✅ check doctor
        const doctor = await Doctor.findById(doctorId)

        if(!doctor || doctor.status !== "approved"){
            return res.status(400).json({
                message:"Doctor not available"
            })
        }

        // 🔥 GET DAY (Monday, Tuesday...)
        const day = new Date(date).toLocaleString("en-US", { weekday: "long" })

        // 🔥 FIND DOCTOR AVAILABILITY FOR THAT DAY
        const availableDay = doctor.availability.find(d => d.day === day)

        if(!availableDay){
            return res.status(400).json({
                message: "Doctor not available on this day or time plz checkout timings"
            })
        }

        // 🔥 CHECK TIME RANGE
        if(time < availableDay.startTime || time >= availableDay.endTime){
            return res.status(400).json({
                message: "Time outside doctor availability"
            })
        }

        // 🔥 CHECK IF SLOT ALREADY BOOKED
        const existing = await Appointment.findOne({
            doctorId,
            date,
            time,
            status: { $ne: "rejected" }
        })

        if(existing){
            return res.status(400).json({
                message: "This time slot is already booked"
            })
        }

        // 🔥 CREATE APPOINTMENT
        const appointment = await Appointment.create({
            patientId,
            doctorId,
            date,
            time,
            reason
        })

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment
        })

    }catch(error){

        console.log(error)

        res.status(500).json({
            message: "Server error"
        })
    }
}


// Get Doctor Appointment

const getDoctorAppointments = async (req, res) => {
    
    try{

        const userId = req.user.id

        // find doctor using userId
        const doctor = await Doctor.findOne({ userId })

        if(!doctor){
            return res.status(404).json({
                message: "Doctor not found"
            })
        }

        const appointments = await Appointment.find({ doctorId: doctor._id })
            .populate("patientId", "-password")

            res.json(appointments)

    }catch(error){

        res.status(500).json({
            message: "Server error"
        })
    }

}

// update appointment status 

const updateAppointmentStatus = async (req, res) => {
    
    try{

        const { id } = req.params
        const { status } = req.body

        const userId = req.user.id

        // find doctor
        const doctor = await Doctor.findOne({ userId })

        if(!doctor){
            return res.status(404).json({
                message: "Doctor not found"
            })
        }

        // find appointment belonging to this doctor
        const appointment = await Appointment.findOne({
            _id: id,
            doctorId: doctor._id
        })

        if(!appointment){
            return res.status(404).json({
                message: "Appointment not found or not yours"
            })
        }

        appointment.status = status
        await appointment.save()

        res.json({
            message:"Status updated successfully",
            appointment
        })

    }catch(error){
        console.log("ERROR:", error)   // 👈 ADD THIS

        res.status(500).json({
            message: "Server error",
            error: error.message       // 👈 ADD THIS
    })
}
}


// get patient appoints

const getPatientAppointments = async (req, res) => {
    
    try{

        const patientId = req.user.id

        const appointments = await Appointment.find({ patientId })
            .populate({
                path: "doctorId",
                populate: {
                    path: "userId",
                    select: "name email"
                }
            })

        res.json(appointments)
    }catch(error){

        res.status(500).json({
            message: "Server error"
        })
    }
}

module.exports = { bookAppointment, getDoctorAppointments, updateAppointmentStatus, getPatientAppointments }