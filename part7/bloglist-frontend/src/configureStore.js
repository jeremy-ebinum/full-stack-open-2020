import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createRootReducer from "./reducers";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";

export const history = createBrowserHistory();

const configureStore = (preloadedState) => {
  let store;

  if (process.env.NODE_ENV === "development") {
    store = createStore(
      createRootReducer(history),
      preloadedState,
      composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
    );
  } else {
    store = createStore(
      createRootReducer(history),
      preloadedState,
      compose(applyMiddleware(routerMiddleware(history), thunk))
    );
  }

  return store;
};

export default configureStore;
