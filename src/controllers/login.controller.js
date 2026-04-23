const User = require('../model/user.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
    
    try{

        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({
                message:"Invalid Credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d'}
        )
        
        res.cookie("token", token,{
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });


        res.json({
            message: "Login successfully",
            token,
            user
        })

    }catch(error){
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

module.exports =  loginUser 