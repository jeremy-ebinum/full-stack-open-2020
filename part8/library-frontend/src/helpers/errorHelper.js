import logger from "../utils/logger";

export const resolveApolloErrors = ({ graphQLErrors, networkError }) => {
  let errors;

  if (networkError) {
    logger.error(`[Network error]: ${networkError}`);
    errors = ["Something went wrong..."];
  } else if (graphQLErrors) {
    errors = graphQLErrors.reduce((result, error) => {
      const { message, locations, path, extensions } = error;
      logger.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      );

      const { code, errorMessages } = extensions;

      switch (code) {
        case "BAD_USER_INPUT":
          return result.concat(errorMessages);
        case "NOT_FOUND":
          result.push(message);
          return result;
        default:
          result.push(message);
          return result;
      }
    }, []);
  }

  return errors;
};
