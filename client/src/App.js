import React, { Fragment, useEffect } from "react";
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Alert from "./components/layouts/Alert";
import { loadUser } from "./action/auth";
// import { Store } from "redux";
import store from "./store";
import { setAuthToken } from "./utils/setAuthToken";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import CreateProfile from "./components/profile-form/CreateProfile";
import EditProfile from "../../client/src/components/profile-form/EditProfile";
import AddExperience from "./components/profile-form/AddExperience";
import { useNavigate } from "react-router-dom";
// import Dashboard from "./components/Dashboard";
function App() {
  const navigate = useNavigate();
  // const history = useHistory();
  if (localStorage.token) {
    console.log("on app");
    setAuthToken(localStorage.token);
  }
  useEffect(() => {
    //if there is a token in a localstorage we are taking the information about that user
    if (!localStorage.token) {
      console.log("on app");
      setAuthToken(localStorage.token);
      store.dispatch(loadUser());
    } else {
      navigate("/dashboard");
    }
  }, []);

  return (
    <Fragment>
      <Navbar />
      {/* <Routes> */}
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>

      <section className="container">
        <Alert />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/create-profile"
            element={
              <PrivateRoute>
                <CreateProfile />
              </PrivateRoute>
            }
          />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-experience"
            element={
              <PrivateRoute>
                <AddExperience />
              </PrivateRoute>
            }
          />
        </Routes>
      </section>
    </Fragment>
  );
}
export default App;
