const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { body, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
//user registration route
router.post(
  "/",
  [
    //it automatically takes values from req.body
    //not isEmpty checking if it is not empty
    body("name", "name is required").notEmpty(),
    body("email", "email is required").isEmail(),
    body("password", "password must be atleast 6 charachters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, password, email } = req.body;
    try {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        throw new Error("username already exists");
      }
      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
      const createUser = new User({ name, password, email, avatar });
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(password, salt);
      createUser.password = hashPassword;
      await createUser.save();
      const payload = {
        user: {
          id: createUser.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token: token });
        }
      );
      //when we define the values in json in config folder we can access values like this from anywheere
    } catch (err) {
      console.error(err.message);
      return res.status(400).json({ errors: [{ msg: err.message }] });
    }
    //when using try and catch try to write all the code in try and catch block
  }
);
//its like creating new id card
module.exports = router;
