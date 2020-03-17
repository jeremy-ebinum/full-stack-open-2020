const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
const { ErrorHelper } = require("../utils/error_helper");
const User = require("../models/user");

loginRouter.post("/", async (req, res, next) => {
  const { body } = req;

  try {
    const user = await User.findOne({ username: body.username });
    const isCorrectPassword =
      user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);

    if (!(user && isCorrectPassword)) {
      throw new ErrorHelper(401, "Authentication Error", [
        "Invalid username or password",
      ]);
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET_KEY);

    res.status(200).send({ token, username: user.username, name: user.name });
  } catch (err) {
    next(err);
  }
});

module.exports = loginRouter;
