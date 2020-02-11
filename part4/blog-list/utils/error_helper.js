class ErrorHelper extends Error {
  constructor(statusCode, kind, messages = []) {
    super();
    this.statusCode = statusCode;
    this.kind = kind;
    this.messages = messages;
  }
}
const handleError = (err, res) => {
  const { statusCode, kind, messages } = err;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    kind,
    messages
  });
};

module.exports = {
  ErrorHelper,
  handleError
};
