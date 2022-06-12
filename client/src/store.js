// import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { applyMiddleware } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { configureStore } from "@reduxjs/toolkit";
// import { createStoreHook } from "react-redux";
// import { applyMiddleware } from "redux";

import thunk from "redux-thunk";
import logger from "redux-logger";

const middleware = [thunk];
const initialState = {}; // initial state is not given by
// const store = configureStore({ rootReducer });

const store = configureStore({
  reducer: rootReducer,
});
export default store;
