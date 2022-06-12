const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator"); //used when there is post request
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const axios = require("axios");
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(401).json({ msg: "there is no profile " });
    }
    res.json(profile);
  } catch (err) {
    return res.status(500).send("Server Error..");
  }
});
router.post(
  "/",
  auth,
  [
    body("status", "status is required").not().isEmpty(),
    body("skills", "skills is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((st) => st.trim());
    }
    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    try {
      let getProfile = await Profile.findOne({ user: req.user.id });
      if (getProfile) {
        getProfile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).populate("user", ["email", "name"]);
        //$set will set the value
        //buut for this we are setting the whole value
        return res.json({ profile: getProfile });
      }
      getProfile = new Profile(profileFields);
      await getProfile.save();
      res.json(getProfile);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);
//getting all profiles
router.get("/", async (req, res) => {
  try {
    const profile = await Profile.find().populate("user", [
      "email",
      "name",
      "avatar",
    ]);
    if (!profile) {
      return res.status(401).json({ msg: "there is no profile" });
    }
    res.json(profile);
  } catch (err) {
    return res.status(500).json({ msg: "server error" });
  }
});
router.get("/user/:user_id", async (req, res) => {
  try {
    const userProfile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["email", "name", "avatar"]);
    if (!userProfile) {
      return res.status(401).json({ msg: "there is no profile" });
    }
    res.json(userProfile);
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(401).json({ msg: "there is no profile" });
    }
    return res.status(500).json({ msg: "server error.." });
  }
});
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user.id });
    await User.findByIdAndDelete(req.user.id);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "server error!!!" });
  }
});
//express validator is used in second parameter
router.put(
  "/experience",
  [auth, [body("title").not().isEmpty(), body("from").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, from, location, current, company, description, to } =
      req.body;
    const edu = {
      title,
      from,
      company,
      location,
      current,
      description,
      to,
    };
    try {
      console.log("hello");
      const profile = await Profile.findOne({ user: req.user.id });
      console.log(profile);
      profile.experience.unshift(edu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).json("server error!!");
    }
  }
);
//express validator is used in second parameter
//if we use express validator and dont specify value it will give error in json format
router.put(
  "/education",
  [
    auth,
    [
      body("social", "social is required").not().isEmpty(),
      body("degree", "degree is required").not().isEmpty(),
      body("from", "from is required!!").not().isEmpty(),
      body("fieldofstudy", "fieldofstudy is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, current, description, to } =
      req.body;
    const edu = {
      school,
      degree,
      fieldofstudy,
      from,
      current,
      description,
      to,
    };
    try {
      console.log("hello");
      const profile = await Profile.findOne({ user: req.user.id });
      console.log(profile);
      profile.education.unshift(edu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).json("server error!!");
    }
  }
);
//delete request education/:edu_id
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({ msg: "there is no profile for this user" });
    }
    const { edu_id } = req.params;
    profile.education = profile.education.filter((exp_obj) => {
      edu_id != exp_obj._id;
    });
    await profile.save();
    res.json(profile);
  } catch (err) {
    //error.kind method check for what type of error
    if (error.kind == "ObjectId") {
      return res.status(401).json({ msg: "some thing went wrong" });
    }
    res.status(500).json({ err: err.message });
  }
});

//delete request experience/:exp_id same like what we did in react
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({ msg: "there is no profile for this user" });
    }
    const { exp_id } = req.params;
    profile.experience = profile.experience.filter(
      (exp_obj) => exp_id != exp_obj._id
    );
    await profile.save();
    res.json(profile);
  } catch (err) {
    //error.kind method check for what type of error
    if (error.kind == "ObjectId") {
      return res.status(401).json({ msg: "some thing went wrong" });
    }
    res.status(500).json({ err: err.message });
  }
});

router.get("/github/:username", async (req, res) => {
  let { username } = req.params;
  username = username.trim();
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );
    const repoName = response.data.map(
      (data) => "github.com/" + data.full_name
    );
    const first = repoName[0];
    res.redirect(first);
    res.json({ git_profile: repoName });
  } catch (err) {
    res.status(404).json({ msg: "there is no users profile!!" });
  }
});
module.exports = router;
