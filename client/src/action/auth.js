import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED, //for checking token
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";
//for checking if the user has registerd correctly
import { setAuthToken } from "../utils/setAuthToken";
import { setAlert } from "./alert";

export const loadUser = () => {
  //if there is a token in a localstorage we are taking the information about that user
  return async (dispatch) => {
    if (localStorage.token) {
      console.log("token is present!!!!");
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get("http://localhost:5000/api/auth");
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };
};
export const setRegister = ({ name, email, password }) => {
  return async (dispatch) => {
    const body = { name, email, password };
    try {
      const res = await axios.post("http://localhost:5000/api/user", body);
      console.log(res.data);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
      dispatch(setAlert("success login !!", "success"));
    } catch (err) {
      const errors = err.response.data.errors;
      for (let err of errors) {
        dispatch(setAlert(err.message, "danger"));
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
};
export const setLogout = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });
  };
};

export const setLogin = (email, password) => {
  return async (dispatch) => {
    const body = {
      email,
      password,
    };
    try {
      const res = await axios.post("http://localhost:5000/api/auth", body);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
      dispatch(setAlert("success login !!", "success"));
    } catch (err) {
      console.log(err);
      // console.log(err.response.dat);
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch(setAlert(err.response.data.error, "danger"));
    }
  };
};
