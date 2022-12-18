
/**

A module for creating and interacting with the Post model in the MongoDB database.
@module Post
@requires mongoose
*/

/**

A schema for storing information about a post in the database.
@constant
@type {mongoose.Schema}
@property {string} title - The title of the post. Required field. Trimmed.
@property {string} information - The information for the post. Required field. Trimmed.
*/



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
