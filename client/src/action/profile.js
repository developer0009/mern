import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from "./types";
export const getUserProfile = () => {
  return async (dispatch) => {
    try {
      const profile = await axios.get("http://localhost:5000/api/profile/me");
      dispatch({
        type: GET_PROFILE,
        payload: profile.data,
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.data.msg, status: err.response.status },
      });
    }
  };
};
export const createProfile = (formData, navigate, edit = false) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/profile",
        formData
      );
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
      dispatch(
        edit
          ? setAlert("successfully updated profile!!", "success")
          : setAlert("successfully created profile!!", "success")
      );
      if (!edit) {
        navigate("/dashboard");
      }
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
};
export const addExperience = (formData, navigate) => {
  return (dispatch) => {
    try {
      const res = axios.put(
        "http://localhost:5000/api/profile/experience",
        formData
      );

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("experience added !!!", "success"));
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
};
export const addEducation = (formData, navigate) => {
  return (dispatch) => {
    try {
      const res = axios.put(
        "http://localhost:5000/api/profile/education",
        formData
      );

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("education added !!!", "success"));
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
};
