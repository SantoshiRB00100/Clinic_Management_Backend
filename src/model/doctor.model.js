const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    specialization:{
        type: String,
        required: true
    },

    experience: {
        type: Number,
        required: true,
    },

    consultationFee:{
        type: Number,
        required: true
    },

    availability: [
        {
            day: String,
            startTime: String,
            endTime: String
        }
    ],

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Doctor", doctorSchema)