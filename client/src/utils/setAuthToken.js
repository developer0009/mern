import axios from "axios";
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-token"] = token;
    //setting global header
  } else {
    delete axios.defaults.headers.common["x-token"];
  }
};
