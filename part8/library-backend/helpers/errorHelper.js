const { ApolloError } = require("apollo-server");
const logger = require("../utils/logger");

module.exports.getAuthorValidationErrors = ({ errors }) => {
  const validationErrors = Object.values(errors).map((error) => {
    const path = error.path === "born" ? "birth year" : error.path;
    if (error.name === "CastError") {
      return `Invalid Author ${path}`;
    }
    return error.message;
  });

  return validationErrors;
};

module.exports.getBookValidationErrors = ({ errors }) => {
  const validationErrors = Object.values(errors).map((error) => {
    if (error.name === "CastError") {
      return `Invalid Book ${path}`;
    }

    return error.message;
  });

  return validationErrors;
};

module.exports.useFallbackErrorHandler = (error) => {
  throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
};
