/**

A schema for representing a user in a database.
@module user
@param {Object} mongoose - The mongoose object.
@param {Object} userSchema - The user schema.
@param {String} name - The name of the user.
@param {String} email - The email of the user.
@param {String} password - The password of the user.
@param {String} phoneNumber - The phone number of the user.
@param {String} address - The address of the user.
@param {String} type - The type of user (user or admin).
@param {Boolean} verified - Whether or not the user has been verified.
@param {Object} User - The User model.
@param {Object} exports - The exports object.
*/




const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    required: true,
    type: String,
  },
  phoneNumber: {
    required: true,
    type: String,
  },
  address: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "user",
  },
  verified: {
    type: Boolean,
    default:"false"
  
  },
 
});




const User = mongoose.model('User', userSchema)
module.exports =User