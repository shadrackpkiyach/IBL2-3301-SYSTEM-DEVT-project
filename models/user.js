const mongoose = require('mongoose');
const validator =require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
 
});
/*
userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
      user.password = await bcrypt.hash(user.password,8)
    }
})

userSchema.static.findByCredentials = async(phoneNumber,password)=> {
  const user = await User.findOne({phoneNumber})
  if(!user) {
    throw new error ({ error: "invalid login data"})

  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if(!isPasswordMatch) {
    throw new error ({ error: "invalid login password"})
  }
  return user
}
*/
const User = mongoose.model('User', userSchema)
module.exports =User