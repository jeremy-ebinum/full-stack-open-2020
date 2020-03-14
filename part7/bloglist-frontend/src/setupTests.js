// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

/* Mocks
 *******************************************************************************/
// localStorage
let savedItems = {};

const localStorageMock = {
  setItem: (key, item) => {
    savedItems[key] = item;
  },
  getItem: (key) => savedItems[key],
  removeItem: (key) => delete savedItems[key],
  clear: () => {
    savedItems = {};
  },
};

global.localStorage = localStorageMock;

// window.confirm
window.confirm = () => true;
