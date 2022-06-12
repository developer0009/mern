import { SET_ALERT, REMOVE_ALERT } from "../action/types";
const initialState = [];
const alertReducer = (state = initialState, action) => {
  console.log(action.type);
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return state.filter((obj) => obj.id !== action.payload);
    default:
      return state;
  }
};
export default alertReducer;
