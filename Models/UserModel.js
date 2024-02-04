const mongoose = require("mongoose");

const timesSchema = new mongoose.Schema({
  weekDay: String,
  startTime: String,
  endTime: Number,
});

const classesSchema = new mongoose.Schema({
  courseName: String,
  location: String,
  time: [timesSchema],
});

const friendsSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
});

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  classes: {
    type: [classesSchema],
    required: false,
  },
  closet: {
    type: [String],
    required: false,
  },
  friends: {
    type: [friendsSchema],
    required: false,
  },
});

const UserModel = mongoose.model("User", UserSchema, "Users");
module.exports = UserModel;
