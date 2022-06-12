const mongoose = require("mongoose");
const config = require("config");
const URL = config.get("mongoURL");
const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("mongodb connected successfull");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
