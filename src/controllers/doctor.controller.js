const User = require("../model/user.model");
const Doctor = require("../model/doctor.model");
const bcrypt = require("bcrypt");


// create doctor

const createDoctor = async (req,res) => {
    
    try{

        const{
            name,
            email,
            password,
            phone,
            specialization,
            experience,
            consultationFee,
            availability
        } = req.body;

        //check user exist or not

        const existingUser = await User.findOne({
            email
        })

        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            })
        }

        //hash password

        const hashedPassword = await bcrypt.hash(password,10);

        // create user with role doctor

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            phone,
            role:"doctor"
        })

        // create doctor profile

        const doctor = await Doctor.create({
            userId: user._id,
            specialization,
            experience,
            consultationFee,
            availability
        })

        res.status(201).json({
            message: "Doctor created successfully",
            user,
            doctor
        })
    }catch(error){

        res.status(500).json({
            message:"Server error",
            error:error.message
        })
    }
}

// get all doctors

const getDoctors = async (req, res) => {
    
    try{

        const { status } = req.query

        const filter = status ? { status } : {};

        const doctors = await Doctor.find(filter).populate("userId", "-password")

        res.json({doctors})
    }catch(error){
        res.status(500).json({
            message: "Server error"
        })
    }
}

// approve doctor

const approveDoctor = async (req,res) => {
    
    try{

        const { id } = req.params;

        const doctor = await Doctor.findByIdAndUpdate(
            id,
            { status: "approved" },
            { new: true }
        )

        if(!doctor){
            return res.status(404).json({
                message: "Doctor not found"
            })
        }

        res.json({
            message: "Doctor approved",
            doctor
        })

    }catch(error){

        res.status(500).json({
            message: "Server error"
        })
    }

}

const rejectDoctor = async (req, res) => {
    
    try{

        const { id } = req.params

        const doctor = await Doctor.findByIdAndUpdate(
            id,
            { status: "rejected" },
            { new: true }
        )

        if(!doctor){
            return res.status(404).json({
                message: "Doctor not found"
            })
        }

        res.json({
            message: "Doctor rejected",
            doctor
        })
    }catch(error){

        res.status(500).json({
            message: "Server error"
        })
    }
}

//get approved doctors

const getApprovedDoctors = async (req, res) => {
    
    try{

        const doctors = await Doctor.find({ status: "approved" })
           .populate("userId", "-password")

           res.json(doctors)


    }catch(error){
        res.status(500).json({
            message: "Server error"
        })
    }
}

module.exports = { createDoctor,
    getDoctors,
    approveDoctor,
    rejectDoctor,
    getApprovedDoctors
}