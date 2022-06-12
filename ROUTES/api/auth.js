const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const config = require("config");
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.json({ error: "internal sever error.." });
  }
});
router.post(
  "/",
  [
    body("email", "email is required").isEmail(),
    body("password").exists(),
    //.exists check if the password exists or not
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "invalid credentials" });
      }
      const isPassword = await bcrypt.compare(password, user.password);
      console.log(isPassword);
      if (!isPassword) {
        return res.status(400).json({ error: "invalid credentials" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      //it encrypt the data just like jwt.io
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw new err();
          }
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }
);
module.exports = router;
//its like bringing id card from home
/*
when we use protected routes we need to have tokens
so there are 2 options for that tokens by login or registrating...
*/
