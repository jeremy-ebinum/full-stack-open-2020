const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Books must have a title"],
    unique: true,
    uniqueCaseInsensitive: true,
    minlength: [2, "Book title must be at least 2 characters long"],
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  genres: [{ type: String }],
});

schema.plugin(uniqueValidator, {
  message: "A Book with that {PATH} already exists",
});

module.exports = mongoose.model("Book", schema);
