const express = require("express")

const registerUser = require("../controllers/register.controller")
const loginUser = require("../controllers/login.controller")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)

module.exports = router