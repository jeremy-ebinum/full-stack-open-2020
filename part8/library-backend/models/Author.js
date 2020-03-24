const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Authors must have a name"],
    unique: true,
    uniqueCaseInsensitive: true,
    minlength: [4, "Author name must be at least 4 characters long"],
  },
  born: {
    type: Number,
  },
});

schema.plugin(uniqueValidator, {
  message: "An Author with that {PATH} already exists",
});

module.exports = mongoose.model("Author", schema);
