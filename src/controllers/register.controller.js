const User = require("../model/user.model")
const Doctor = require("../model/doctor.model")
const bcrypt = require("bcrypt")

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone,
            role,
            specialization,
            experience,
            consultationFee
        } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role
        })

        // 🔥 If doctor → create doctor profile
        if (role === "doctor") {

            await Doctor.create({
                userId: user._id,
                specialization,
                experience,
                consultationFee
            })
        }

        res.status(201).json({
            message: "User registered successfully",
            user
        })

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        })

    }

}

module.exports = registerUser
