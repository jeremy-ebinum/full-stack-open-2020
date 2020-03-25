const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "User must have a username"],
    unique: true,
    minlength: [3, "Username must be at least 3 characters long"],
  },
  favoriteGenre: {
    type: String,
    required: [true, "User must have a favorite genre"],
    minlength: [3, "User favorite genre must be at least 3 characters long"],
  },
});

schema.plugin(uniqueValidator, {
  message: "A User with that {PATH} already exists",
});

module.exports = mongoose.model("User", schema);
