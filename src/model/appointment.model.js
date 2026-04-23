const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "confirmed"],
        default: "pending"
    },

    reason: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);