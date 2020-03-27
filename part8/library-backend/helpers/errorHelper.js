const { ApolloError } = require("apollo-server");

module.exports.getModelValidationErrors = ({ errors }, model) => {
  const validationErrors = Object.values(errors).map((error) => {
    const path = error.path === "born" ? "birth year" : error.path;
    if (error.name === "CastError") {
      return `Invalid ${model} ${path}`;
    }
    return error.message;
  });

  return validationErrors;
};

module.exports.useFallbackErrorHandler = (error) => {
  throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
};
