const morgan = require("morgan");

morgan.token("data", req => {
  const { body } = req;

  return JSON.stringify(body);
});

const morganLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :data"
);

module.exports = {
  morganLogger
};
