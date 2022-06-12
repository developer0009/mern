import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../action/profile";
import spinner from "../../spinner";
import { Link } from "react-router-dom";
import DashboardActions from "./DashboardActions";
const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const userProfile = useSelector((state) => state.profileReducer);
  useEffect(() => {
    dispatch(getUserProfile());
  }, []);
  return userProfile.profile == null && userProfile.loading ? (
    <spinner />
  ) : (
    <>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fa fa-user"> </i> Welcome {user && user.name}
      </p>
      {userProfile.profile === null ? (
        <>
          <p>You have not setup a profile, please add some info </p>
          <Link to="/create-profile" className="btn btn-primary my-1 btn-sm">
            Create Profile
          </Link>
        </>
      ) : (
        <DashboardActions />
      )}
    </>
  );
};

export default Dashboard;
