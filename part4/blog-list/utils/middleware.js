const morgan = require("morgan");
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

const errorHandler = (err, req, res, next) => {
  if (!err) next();

  if (err instanceof ErrorHelper) {
    handleError(err, res);
  } else {
    next(err);
  }
};

module.exports = {
  morganLogger,
  unknownRouteHandler,
  errorHandler
};
