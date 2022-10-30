// IMPORTS FROM PACKAGES
const express = require("express");
const mongoose = require("mongoose");

// IMPORTS FROM OTHER FILES
const authRouter = require("./router/auth");
const postRouter = require("./router/post")
const profileRouter = require("./router/profile")
var cors = require('cors');
//sconst { post } = require("./router/auth");



// INIT
const PORT = process.env.PORT || 3000;
const app = express();
const DB =
'mongodb+srv://sentu:Kortome88@churchapp.hkepms4.mongodb.net/churchData?retryWrites=true&w=majority'
 // 'mongodb+srv://sentu:Kortome88@clustersentu.4ugfd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// middleware
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(postRouter);
app.use(profileRouter);


const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

// Connections
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
