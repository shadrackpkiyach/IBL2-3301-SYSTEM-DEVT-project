const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  information: {
    type: String,
    required: true,
    trim: true,
  },
 

});

const Post = mongoose.model("Post", postSchema);
module.exports = { Post, postSchema };
