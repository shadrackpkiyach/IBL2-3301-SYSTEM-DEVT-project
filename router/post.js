const express = require("express");
const postRouter = express.Router();
const auth = require("../middlewares/auth");
const { Post } = require("../models/postModel");


/**
 * Route handler for GET requests to '/postInformation'.
 *
 * @route GET /postInformation
 * @param {string} category - The category of the post to retrieve.
 * @returns {object} An array of posts with the specified category.
 */
postRouter.get("/postInformation", async (req, res) => {
  try {
    const post = await Post.find({ category: req.query.category });
    res.status(200).json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
/**
 * Handles an HTTP POST request to add a new post.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
postRouter.post("/addPost", async (req, res) => {
    try {
      const { title, information } = req.body;
      let post = new Post({
        title,
        information,
        
      });
      post = await post.save();
      res.status(200).json(post);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  module.exports = postRouter;