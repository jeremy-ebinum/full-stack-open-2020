const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch(err => {
    logger.error("error connecting to MongoDB:", err.message);
  });

mongoose.connection.on("error", err => {
  logger.error("connection to MongoDB lost", err.message);
});

app.use(cors());
app.use(bodyParser.json());
app.use(middleware.morganLogger);

app.use("/api/blogs", blogsRouter);
app.use(middleware.unknownRouteHandler);

app.use(middleware.errorHandler);

module.exports = app;
