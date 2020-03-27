import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  split,
  InMemoryCache,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/link-ws";
import { setContext } from "apollo-link-context";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faBook } from "@fortawesome/free-solid-svg-icons/faBook";
import { faFeatherAlt } from "@fortawesome/free-solid-svg-icons/faFeatherAlt";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";

import { resolvers, typeDefs } from "./graphql/resolvers";
import { ALL_NOTIFICATIONS } from "./graphql/queries";
import App from "./App";

const cache = new InMemoryCache();

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("fso20-gqlLibrary-user-token");

  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  };
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache,
  link: splitLink,
  typeDefs,
  resolvers,
});

const writeInitialData = () => {
  cache.writeQuery({
    query: ALL_NOTIFICATIONS,
    data: {
      allNotifications: [],
    },
  });
};

writeInitialData();

client.onResetStore(writeInitialData);

library.add(faBook, faFeatherAlt, faPlusCircle, faStar);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
