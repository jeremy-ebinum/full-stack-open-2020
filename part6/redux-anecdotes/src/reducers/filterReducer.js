export const initialState = "";

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return action.filter;
    case "CLEAR_FILTER":
      return initialState;
    default:
      return state;
  }
};

export const setFilter = (filter) => {
  return (dispatch) => {
    dispatch({ type: "SET_FILTER", filter });
  };
};

export const clearFilter = () => {
  return (dispatch) => {
    dispatch({ type: "CLEAR_FILTER" });
  };
};

export default filterReducer;
