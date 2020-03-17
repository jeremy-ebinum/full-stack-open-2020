const logger = require("../utils/logger");

class ErrorHelper extends Error {
  constructor(statusCode, kind, messages = []) {
    super();
    this.statusCode = statusCode;
    this.kind = kind;
    this.messages = messages;
    this.message = this.messages.join("\n");
  }
}
const handleError = (err, res) => {
  try {
    const { statusCode, kind, message, messages } = err;

    res.status(statusCode).json({
      statusCode,
      kind,
      message,
      messages,
    });
  } catch (exception) {
    logger.error("IN handleError helper\n", exception.message);
  }
};

module.exports = {
  ErrorHelper,
  handleError,
};
