import logger from "../utils/logger";

export const handleApolloErrors = ({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      logger.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) logger.error(`[Network error]: ${networkError}`);
};
