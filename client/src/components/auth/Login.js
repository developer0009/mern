import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setLogin } from "../../action/auth";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
function Login(props) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  if (props.isAuthenticated) {
    return <Navigate to="/dashboard" replace={true} />;
  }
  const { email, password } = formData;
  //when ever it re render it adds the value to this form data
  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    //when ever setFormData is used it re render the page
  };
  // console.log(name);
  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.setLogin(email, password);
  };
  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fa fa-user"></i> Login To Your Account
      </p>
      <form
        className="form"
        action="create-profile.html"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </Fragment>
  );
}
Login.propTypes = {
  setLogin: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});
//mapStateToProps must always return state
//in connect both must be props
export default connect(mapStateToProps, { setLogin })(Login);
