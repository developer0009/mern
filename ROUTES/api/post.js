const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const { json } = require("express/lib/response");

//posting post
router.post(
  "/",
  [auth, [body("text", "text is required").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //getting login user
      //if it is required we can make it send through user details
      const user = await User.findById(req.user.id).select("-password");
      const newPost = {
        user: req.user.id, //refrence to the user object
        text: req.body.text,
        avatar: user.avatar,
        name: user.name,
      };
      const post = new Post(newPost);
      await post.save();
      console.log(post);
      res.json(post);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ msg: "server error" });
    }
  }
);
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort("-date");
    //-date will bring which one was created first
    //date-1 will bring  frit
    if (posts.length == 0) {
      return res.status(404).json({ msg: "there is no posts to display" });
    }
    res.json(posts);
  } catch (err) {
    res.status(404).json({ msg: "server error" });
  }
});
router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ msg: "post not found" });
    }
    res.json(post);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    res.status(500).json({ msg: "server error!!" });
  }
});

router.put("/like/:id", auth, async (req, res) => {
  const { id } = req.params;
  const print = console.log;
  try {
    const post = await Post.findById(id);
    if (!post) {
      print.error("post not found");
      return res.status(404).json({ msg: "post not found!!" });
    }
    // const len = post.likes.filter((like) => like._id == id).length;

    if (post.likes.filter((like) => like.user == req.user.id).length > 0) {
      //checking if the logined user has alredy liked the post...
      return res.status(400).json({ msg: "you have alredy like the post" });
    }

    post.likes.unshift({ user: req.user.id });
    //we are sending string but it will be cased into objectId i.e bson and when we are comparing it it will be casted to string
    await post.save();
    res.json(post);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    console.error(err.message);
    return res.status(500).json({ msg: "server error" });
  }
});
router.delete("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "there is no post" });
    }
    console.log(post);
    console.log(post.user + " " + req.user.id);
    // if (post.user != req.user.id) {
    //   return res.status(400).json({ msg: "u are not authorized.." });
    // }
    if (post.likes.filter((like) => like.user == req.user.id).length == 0) {
      //post must be liked to be unliked
      return res.status(400).json({ msg: "post has not been like" });
    }
    post.likes = post.likes.filter((like) => req.user.id != like.user);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    res.status(500).json({ msg: "server error" });
  }
});
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      //works when object id length is 16
      console.log(post);
      return res.status(404).json({ msg: "there is no post" });
    }
    if (post.user.toString() !== req.user.id) {
      //if post is not of the logined user
      return res.status(404).json({ msg: "u are not authorized" });
    }
    if (post.user == req.user.id) {
      //so when comparing ObjectId it becomes string
      console.log(typeof post.user);
      console.log("true");
    }
    await post.remove();
    res.json({ msg: "success deleting post!!" });
  } catch (err) {
    if (err.kind == "ObjectId") {
      //works when objectid length is 8
      return res.status(404).json({ msg: "post not found" });
    }
    console.error(err.message);
    res.status(500).json({ msg: "server error" });
  }
});
router.put(
  "/comments/:id",
  [auth, [body("text", "text is required!!").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.id);
      const user = await User.findById(req.user.id).select("-password"); //logined user
      if (!post) {
        return res.status(404).json({ msg: "there is no posts" });
      }
      post.comments.unshift({
        user: req.user.id, //the string will be converted into bson
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      });
      await post.save();
      res.json({ post });
    } catch (err) {
      console.log(err.message);
      if (err.kind == "ObjectId") {
        return res.status(404).json({ msg: "there is no posts" });
      }
      return res.status(500).json({ msg: "server error!!" });
    }
  }
);
//@route /removecomment/:id/:comment_id
//@desc  removing a single comment checking the comment id
//@access private
router.delete("/removecomment/:id/:comment_id", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const cmt_id = req.params.comment_id;
  try {
    const post = await Post.findById(req.params.id);
    console.log(post.comments);
    const comment = post.comments.find((comment) => comment.id == cmt_id);
    console.log(comment);
    if (!post) {
      console.error(post);
      return res.status(404).json({ msg: "post not found!!" });
    }
    if (comment.user != req.user.id) {
      res.status(401).json({ msg: "u are not authorized.." });
    }

    post.comments = post.comments.filter((comment) => comment._id != cmt_id);
    await post.save();
    res.json(post);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found!!" });
    }
    console.error(err.message);
    res.status(500).json({ msg: "server error!!" });
  }
});
// router.put("/comment/:id", [auth, [body("text", "text is required!!")]]);
module.exports = router;
