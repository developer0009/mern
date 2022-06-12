import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = (props) => {
  const authReducer = useSelector((state) => state.authReducer);
  const isAuthenticated = authReducer.isAuthenticated;
  const { children } = props;

  return <>{isAuthenticated ? children : <Navigate to="/login" />}</>;
};

export default PrivateRoute;
