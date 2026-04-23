require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt   = require("bcrypt")

const userSchema = new mongoose.Schema({
  name:     String,
  email:    { type: String, unique: true },
  password: String,
  phone:    Number,
  role:     { type: String, default: "patient" }
})

const User = mongoose.model("User", userSchema)

const createAdmin = async () => {

  try {

    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    const hashed = await bcrypt.hash("vaishu@12", 10)

    const admin = await User.create({
      name:     "Vaishali",
      email:    "vaishali@clinic.com",
      password: hashed,
      phone:    1234567890,
      role:     "admin"
    })

    console.log("✅ Admin created:", admin.email)

  } catch (err) {

    if (err.code === 11000) {
      console.log("⚠️ Admin already exists!")
    } else {
      console.log("❌ Error:", err.message)
    }

  } finally {
    mongoose.disconnect()
    process.exit()
  }

}

createAdmin()