const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");

const app = express();

console.log("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch(err => {
    console.log("error connecting to MongoDB:", err.message);
  });

mongoose.connection.on("error", err => {
  console.log("connection to MongoDB lost", err.message);
});

app.use(cors());
app.use(bodyParser.json());
app.use(middleware.morganLogger);

app.use("/api/blogs", blogsRouter);
app.use(middleware.unknownRouteHandler);

app.use(middleware.errorHandler);

module.exports = app;
