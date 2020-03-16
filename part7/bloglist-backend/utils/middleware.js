const fs = require("fs");
const nodePath = require("path");
const morgan = require("morgan");
const logger = require("./logger");
const { ErrorHelper, handleError } = require("./error_helper");

morgan.token("data", (req) => {
  const { body } = req;

  if (body.password) {
    body.password = "*".repeat(8);
  }

  if (body.token) {
    body.token = "*".repeat(5);
  }

  return JSON.stringify(body);
});

const morganLogger = () => {
  if (process.env.NODE_ENV === "test") {
    return (req, res, next) => next();
  }

  return morgan(
    ":method :url :status :res[content-length] - :response-time ms :data"
  );
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  req.token = null;
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  }
  next();
};

const unknownRouteHandler = (req, res) => {
  const documentPath = nodePath.join(__dirname, "../build", "index.html");
  const documentExists = fs.existsSync(documentPath);

  if (documentExists) {
    res.sendFile(documentPath);
  } else {
    const messages = [`There is no resource at ${req.url}`];
    throw new ErrorHelper(404, "Not Found", messages);
  }
};

const handleExpressCastErrors = (err, res) => {
  switch (err.kind) {
    case "ObjectId":
      handleError(new ErrorHelper(400, "CastError", ["Malformatted Id"]), res);
      break;

    default:
      break;
  }
};

const handleValidationErrors = (err, res) => {
  let isBadRequest = true;
  const messages = Object.keys(err.errors).map((e) => {
    const error = err.errors[e];

    if (error.kind === "required") {
      return `${error.path.toUpperCase()} is missing`;
    }
    if (error.kind === "unique") {
      isBadRequest = false;
      return `${error.path.toUpperCase()} must be unique`;
    }
    return `Error validation ${error.path.toUpperCase()}`;
  });

  if (isBadRequest) {
    handleError(new ErrorHelper(400, "Bad Request", messages), res);
  } else {
    handleError(new ErrorHelper(422, "Validation Error", messages), res);
  }
};

const errorHandler = (err, req, res, next) => {
  if (!err) next();

  if (err.name === "CastError") {
    return handleExpressCastErrors(err, res);
  }
  if (err.name === "ValidationError") {
    return handleValidationErrors(err, res);
  }
  if (err.name === "JsonWebTokenError") {
    return handleError(
      new ErrorHelper(401, "Authentication Error", ["Invalid Token"]),
      res
    );
  }
  if (err instanceof ErrorHelper) {
    return handleError(err, res);
  }

  logger.error(err);
  return next(err);
};

module.exports = {
  morganLogger,
  tokenExtractor,
  unknownRouteHandler,
  errorHandler,
};
