import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "apollo-link-context";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBook } from "@fortawesome/free-solid-svg-icons/faBook";
import { faFeatherAlt } from "@fortawesome/free-solid-svg-icons/faFeatherAlt";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { resolvers, typeDefs } from "./resolvers";
import { ALL_NOTIFICATIONS } from "./queries";
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

const client = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
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

library.add(faBook, faFeatherAlt, faPlusCircle);

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
