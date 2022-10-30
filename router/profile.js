const express = require("express");
const profileRouter = express.Router();
const auth = require("../middlewares/auth");
const { User } = require("../models/user");

profileRouter.get("/postProfileData",auth, async (req, res) => {
    try {
      const user = await User.find({ phoneNumber: req.query.phoneNumber });
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  module.exports = profileRouter;