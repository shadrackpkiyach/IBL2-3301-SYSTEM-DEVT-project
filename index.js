// IMPORTS FROM PACKAGES
 require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// IMPORTS FROM OTHER FILES
const authRouter = require("./router/auth");
const postRouter = require("./router/post")
const verifyRouter = require("./router/verifyUser")
var session = require('express-session')



// INIT
const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

/**
 * Middleware that parses incoming requests with JSON payloads.
 */
app.use(express.json());

/**
 * Mounts the auth router at the /auth path.
 */
app.use(authRouter);

/**
 * Mounts the post router at the /post path.
 */
app.use(postRouter);


/**
 * Mounts the verify router at the /verify path.
 */
app.use(verifyRouter);


/**
 * Connects to a MongoDB database using Mongoose.
 *
 * @param {string} url - The URL of the MongoDB database to connect to.
 * @param {Object} options - Additional options for the connection.
 * @param {boolean} options.useNewUrlParser - If true, uses the new URL parser.
 * @param {boolean} options.useUnifiedTopology - If true, uses the new unified topology engine.

 * Connects to a database and logs a message on success or failure.
 */

// Connections
mongoose
.connect(process.env.ConnectDB,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
})
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });
  const port = process.env.PORT || 3000;

  /**
   * Start the HTTP server and listen for incoming connections.
   *
   * @param {number} port - The port number on which the server will listen for connections.
   * @param {string} hostname - The hostname or IP address on which the server will listen for connections.
   * @param {function} callback - A callback function to be executed when the server has started and is listening for connections.
   */
app.listen(port, "0.0.0.0", () => {
  console.log(`connected at port ${port}`);
});
