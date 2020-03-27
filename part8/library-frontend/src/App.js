import React, { useCallback } from "react";
import _debounce from "lodash.debounce";
import { useSubscription } from "@apollo/client";
import { Switch, Route, useLocation } from "react-router-dom";

import useUpdateCache from "./hooks/useUpdateCache";
import useAuthUser from "./hooks/useAuthUser";
import useNotification from "./hooks/useNotification";

import { ON_BOOK_ADDED } from "./graphql/queries";

import ModalSpinner from "./components/ModalSpinner";
import Authors from "./components/Authors";
import Books from "./components/Books";
import RecommendedBooks from "./components/RecommendedBooks";
import NewBook from "./components/NewBook";
import Login from "./components/Login";

const App = () => {
  const { hasSyncAuth } = useAuthUser();
  const notificationHelper = useNotification();
  const updateCache = useUpdateCache();
  const { pathname } = useLocation();

  const notifyOnBookAdded = useCallback(
    _debounce(
      () => {
        notificationHelper.add("A new book has been added", "info");
      },
      180000,
      { leading: true, trailing: false }
    ),
    []
  );

  useSubscription(ON_BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      updateCache.withBook(addedBook);
      if (pathname !== "/new") {
        notifyOnBookAdded();
      }
    },
  });

  if (!hasSyncAuth) return <ModalSpinner />;

  return (
    <Switch>
      <Route path="/" exact>
        <Authors />
      </Route>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Route path="/books" exact>
        <Books />
      </Route>
      <Route path="/recommended" exact>
        <RecommendedBooks />
      </Route>
      <Route path="/new" exact>
        <NewBook />
      </Route>
    </Switch>
  );
};

export default App;
