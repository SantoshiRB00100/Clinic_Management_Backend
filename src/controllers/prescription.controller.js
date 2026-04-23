const Prescription = require('../model/prescription.model');
const Appointment = require('../model/appointment.model');
const Doctor = require('../model/doctor.model');


//Creating Prescription
const createPrescription = async (req, res) => {
    
    try{

        const { appointmentId, medicines, notes } = req.body;
        const patientId = req.user.id;

        //find doctor using logged-in user 
        
        const doctor = await Doctor.findOne({ userId: req.user.id })

        if(!doctor){
            return res.status(401).json({
                message: "Doctor not found"
            })
        }

        //find appointment

        const appointment = await Appointment.findById(appointmentId)

        if(!appointment){
            return res.status(404).json({
                message: "Appointment not found"
            })
        }

        // check if this doctor owns the appointment

        if(appointment.doctorId.toString() !== doctor._id.toString()){
            return res.status(403).json({
                message: "Not authorize"
            })
        }

        // check appointment is confirmed

        if(appointment.status !== "confirmed"){
            return res.status(400).json({
                message: "Appointment not confirmed"
            })
        }

        // create prescription

        const prescription = await Prescription.create({
            appointmentId,
            doctorId: doctor._id,
            patientId: appointment.patientId,
            medicines,
            notes
        })

        res.status(201).json({
            message:"Prescription created",
            prescription
        })
    }catch(error){

        console.log("ERROR:", error)
        res.status(500).json({
            message: "Server error"
        })
    }
}

// get patient prescriptions

const mongoose = require("mongoose");

const getPatientPrescriptions = async (req,res) => {
    
    try{

        const patientId = new mongoose.Types.ObjectId(req.user.id)  // ✅ FIX

        const prescriptions = await Prescription.find({ patientId })
            .populate("doctorId")
            .populate("appointmentId")

        console.log("Prescriptions:", prescriptions)

        res.json(prescriptions)    

    }catch(error){

        console.log("ERROR:", error)

        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

// get doctor prescriptions

const getDoctorPrescriptions = async (req, res) => {
    
    try{

        const userId = req.user.id

        const doctor = await Doctor.findOne({ userId })

        if(!doctor){
            return res.status(404).json({
                message: "Doctor not found"
            })
        }

        const prescriptions = await Prescription.find({ doctorId: doctor._id })
            .populate("patientId", "name email")
            .populate("appointmentId")

        res.json(prescriptions)    
    }catch(error){

        res.status(500).json({
            message: "Server error"
        })
    }
}


module.exports = { createPrescription, getPatientPrescriptions, getDoctorPrescriptions }