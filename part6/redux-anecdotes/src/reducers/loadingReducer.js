export const initialState = {
  isInitLoading: false,
  isAddLoading: false,
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_INIT_LOADING":
      return { ...state, isInitLoading: action.value };
    case "SET_ADD_LOADING":
      return { ...state, isAddLoading: action.value };
    default:
      return state;
  }
};

export const setInitLoading = (value) => {
  return { type: "SET_INIT_LOADING", value: Boolean(value) };
};

export const setAddLoading = (value) => {
  return { type: "SET_ADD_LOADING", value: Boolean(value) };
};

export default loadingReducer;
