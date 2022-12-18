const express = require("express");
const app = express();
const twilio = require("twilio");
require('dotenv').config()
const User = require("../models/user");
const Otp = require("../models/otpModel");
const bcryptjs = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { notLoggedIn } = require("../middlewares/middleware");

var session = require('express-session')
const randomstring = require("randomstring");

/**
 * A client for interacting with the Twilio API.
 *
 * @type {Object}
 */

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


// SIGN UP


/**
 * Registers a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.phoneNumber - The phone number of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @returns {Object} A response object indicating the result of the registration.
 */
authRouter.post("/registerUser",notLoggedIn, async (req, res) => {
  try {
    const { name, phoneNumber, email, password} = req.body;
/**
 * generate random otp code
 *
 * 
 */
    const code =  randomstring.generate({
      length: 6,
      charset: "numeric",
    });



/**
 * Check if a user with the same phone number or email already exists.
 *
 * @param {string} phoneNumber - The phone number to check.
 * @param {Object} res - The response object.
 * @returns {Object} A JSON object with a message indicating that a user with the same phone number or email already exists.
 */

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email or phone number already exists!" });
    }
   /**
 * Hash the password using bcrypt.
 *
 * @param {string} password - The password to hash.
 * @param {number} saltRounds - The number of salt rounds to use.
 * @returns {string} The hashed password.
 */
     const hashedPassword = await bcryptjs.hash(password, 8);

  /**
 * Create a new user object.
 *
 * @param {string} name - The name of the user.
 * @param {string} phoneNumber - The phone number of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The hashed password of the user.
 */
        let user = new User({
       
          name,
          phoneNumber,
          email,
          password: hashedPassword,
    
   });
 /**
 * Create a new otp object.
 *
 * @param {string} otp - The otp to be sent to user.
 * @param {string} phoneNumber - The phone number of the user.

 */

         let otp = new Otp({
          phoneNumber,
          otp : code,
  });

  /**
 * Sends an SMS message containing the OTP code to the given phone number using the Twilio API.
 *
 * @param {string} phoneNumber - The phone number to send the SMS to.
 * @param {string} code - The OTP code to include in the SMS message.
 */

   client.messages
   .create({
     to: phoneNumber,
     from: process.env.TWILIO_PHONE_NUMBER,
     body: `Your OTP code is: ${code}`,
   })
   .then((message) => {
     console.log(`SMS sent successfully: ${message.sid}`);
    
   })
 
     user = await user.save(
      /*
      *saving the details
      */
     );

     /*
      *saving the details
      */
     otp = await otp.save();

     return res.status(200).json("registration successful verify you phone number")
    

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Sign In Route
// Exercise

/**
 * Handles a login request from a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.phoneNumber - The phone number of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.type - The type of user.
 * @returns {Object} A JSON object with a message indicating the result of the login request.
 */
authRouter.post("/loginUser", async (req, res) => {
  try {
    const { phoneNumber, password, type } = req.body;
   
    const user = await User.findOne({ phoneNumber ,type });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Wrong credentials check details!" });
    }
    
    /**
 * Validates a user's login credentials and checks if their account is verified.
 *
 * @param {string} password - The user's input password.
 * @param {Object} user - The user object from the database.
 * @param {Object} res - The response object from the server.
 * @returns {Object} An object with a status and a message, depending on the result of the validation.
 */

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect details or password" });
    }

    if(user.verified===false){
      return res
        .status(401)
        .json({ msg: "you are yet to be verified!" });
    }
    /**
 * Generates a JSON web token and sends it as a response along with the user object.
 *
 * @param {Object} user - The user object.
 * @param {Object} res - The response object.
 * @throws {Error} If there is an error generating the token or sending the response.
 */ 
    
    const token = jwt.sign({ id: user._id }, "passwordKey");

    res.status(200).json({ token, ...user._doc });


    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
/**
 * Validates a JSON Web Token (JWT) and returns a response indicating whether the token is valid.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} A JSON object indicating whether the token is valid.
 */
authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
/**
 * Gets the authenticated user's information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The authenticated user's information.
 */
// get user data
authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});
/**
 * Route handler for retrieving a list of users based on their category.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function in the route handler chain.
 * @route GET /postMembers
 * @returns {Object} An object with the success status and the list of users.
 */
authRouter.get("/postMembers", async (req, res , next) => {
  try {

    
    const user = await User.find({category: req.query.category });
    res.status(200).json({success: true,
      total: user.length,
      user:user
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
/**
 * Handles a GET request to the "/postProfileData" route.
 * Finds a user by phone number and returns the user's data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
authRouter.get("/postProfileData", async (req, res) => {
  try {

    
    const user = await User.findById({ phoneNumber });
    res.status(200).json({success:true,
      user:user});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = authRouter;
