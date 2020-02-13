const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String },
  passwordHash: { type: String },
  name: { type: String }
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.passwordHash;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("User", userSchema);
