const express = require("express");
const app = express();
require("dotenv").config();
const User = require('../models/user')
const Otp = require('../models/otpModel')
const verifyRouter = express.Router()
var session = require('express-session')
const { notVerified  } = require('../middlewares/middleware');

require('dotenv').config()

app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true
  }))

/**
 * Verifies a user by phone number and OTP.
 *
 * @param {string} phoneNumber - The phone number of the user to be verified.
 * @param {string} otp - The OTP for verification.
 * @returns {Object} An object containing a message indicating the result of the verification.
 * @throws {Error} If the user is not found or the OTP is incorrect.
 */

verifyRouter.post("/verifyUser",notVerified, async (req, res) => {

const {phoneNumber,otp} =req.body


const otpModel = await Otp.findOne({
    phoneNumber,
  });
  userPhone = otpModel
  if (!otpModel) {
    return res.status(400).json({ message: "user not found" });
  }
  if (otpModel && otpModel.otp !== otp) {
    return res.status(400).json({ message: "Incorrect otp" });
  }
  const user = await User.findOne({
    phoneNumber,
  });
  const updatedUser = await User.findByIdAndUpdate(user._id, {
     
    $set: { verified: true },
   } );
  
  return res.status(200).json({ message: "verification successful" });



})



module.exports = verifyRouter