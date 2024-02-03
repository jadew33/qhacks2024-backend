const mongoose = require("mongoose");

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
    type: [String],
    required: false,
  },
  closet: {
    type: [String],
    required: false,
  },
});

UserSchema.add({
  friends: [UserSchema],
});

const UserModel = mongoose.model("User", UserSchema, "Users");
module.exports = UserModel;
