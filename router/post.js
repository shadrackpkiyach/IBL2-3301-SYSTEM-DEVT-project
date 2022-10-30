const express = require("express");
const postRouter = express.Router();
const auth = require("../middlewares/auth");
const { Post } = require("../models/postModel");

postRouter.get("/postInformation", async (req, res) => {
  try {
    const post = await Post.find({ category: req.query.category });
    res.status(200).json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

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