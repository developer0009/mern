const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  name: String, //name of the user who is posting
  avatar: {
    type: String,
    required: true,
  }, //image of the post
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      //user:id
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
        required: true,
      },
      name: String,
      avatar: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Post = mongoose.model("Post", postSchema);
