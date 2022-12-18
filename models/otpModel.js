

/**

@module Otp
@description This module represents the OTP schema for a phone number.
*/


/**

@typedef {Object} OtpSchema
@property {string} phoneNumber - The phone number of the user.
@property {string} otp - The OTP generated for the user.
@property {Date} createdAt - The date when the OTP was created.
@property {Date} updatedAt - The date when the OTP was last updated.
@property {Object} index - The index object for the createdAt field.
@property {number} index.expires - The number of seconds after which the index will expire.
*/

const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    
  },
  otp: {
    type: String,
    required: true,
    
  },
 
  createdAt:{ 
    type:Date,
    default: Date.now,
    index:{
        expires: 50000
    }


  },
  
  
    
}, {timestamps:true,});

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp