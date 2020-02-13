const morgan = require("morgan");
const logger = require("./logger");
const { ErrorHelper, handleError } = require("./error_helper");

morgan.token("data", req => {
  const { body } = req;

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

const unknownRouteHandler = req => {
  const messages = [`There is no resource at ${req.url}`];
  throw new ErrorHelper(404, "Not Found", messages);
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
  const messages = Object.keys(err.errors).map(e => {
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
  if (err instanceof ErrorHelper) {
    return handleError(err, res);
  }

  logger.error("IN errorHandler middleware\n", err.message);
  return next(err);
};

module.exports = {
  morganLogger,
  unknownRouteHandler,
  errorHandler
};
