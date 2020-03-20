import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBook } from "@fortawesome/free-solid-svg-icons/faBook";
import { faFeatherAlt } from "@fortawesome/free-solid-svg-icons/faFeatherAlt";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import App from "./App";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

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
