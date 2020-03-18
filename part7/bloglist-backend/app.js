const express = require("express");
const expressStaticGzip = require("express-static-gzip");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("./utils/logger");
const db = require("./utils/db_helper");
const mockDb = require("./tests/mockDb_helper");
const middleware = require("./utils/middleware");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const blogsRouter = require("./controllers/blogs");
const testingRouter = require("./controllers/testing");

const app = express();

if (process.env.NODE_ENV === "test") {
  mockDb.connect().catch((err) => {
    logger.error(err);
  });
  app.use("/api/testing", testingRouter);
} else {
  db.connect().catch((err) => {
    logger.error(err);
  });
}

app.use(cors());
app.use(bodyParser.json());
app.use(middleware.morganLogger());
app.use(middleware.tokenExtractor);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/blogs", blogsRouter);

app.use(
  "/",
  expressStaticGzip("build/", {
    enableBrotli: true,
    orderPreference: ["br", "gz"],
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    },
  })
);

app.use(middleware.unknownRouteHandler);
app.use(middleware.errorHandler);

module.exports = app;
