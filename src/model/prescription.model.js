const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({

    appointmentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        required: true
    },

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },

    medicines: [
        {
            name: String,
            dosage: String,
            duration:String
        }
    ],

    notes:{
        type:String
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Prescription", prescriptionSchema)