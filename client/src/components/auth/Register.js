import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux"; //connect is present in react-redux
// import axios from "axios";
import { useNavigate, Route, Navigate } from "react-router-dom";
import { setAlert } from "../../action/alert";
import { setRegister } from "../../action/auth";
// import {  } from "react";
import { PropTypes } from "prop-types";
function Register(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  // const dispatch = useDispatch();
  console.log(props);
  if (props.isAuthenticated) {
    // return navigate("/");
    return <Navigate to="/dashboard" />;
  }
  const { name, email, password, password2 } = formData;
  //when ever it re render it adds the value to this form data
  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    //when ever setFormData is used it re render the page
  };
  // console.log(name);
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (password !== password2) {
      console.log(props);
      // props.setAlert("password doesnt match", "danger");
      props.setAlert("password doesnt match", "danger");
    } else {
      props.setRegister({ name, email, password });
    }
  };
  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fa fa-user"></i> Create Your Account
      </p>
      <form
        className="form"
        action="create-profile.html"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            // required
            value={name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            // minLength="6"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={handleChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
}
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
}); //this must return an object
export default connect(mapStateToProps, { setAlert, setRegister })(Register);
