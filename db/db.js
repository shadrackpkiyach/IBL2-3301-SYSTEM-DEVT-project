const mongoose = require('mongoose')

mongooose.connect(process.env.MONGODB_URL,{
  useNewUrlParser: true,
  useCreateIndex:true,
  useUnifiedTopology:true

})