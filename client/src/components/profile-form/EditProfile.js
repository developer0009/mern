import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createProfile } from "../../action/profile";
import { getUserProfile } from "../../action/profile";
//navigate is like an history
const EditProfile = () => {
  const initialState = {
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubusername: "",
    bio: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: "",
  };
  const [formData, setFormData] = useState(initialState);
  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram,
  } = formData;
  const profile = useSelector((state) => state.profileReducer.profile);
  const loading = useSelector((state) => state.profileReducer.isLoading);
  const [show, toggleShow] = useState(false);
  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };
  console.log(profile);
  console.log(profile);
  useEffect(() => {
    // if there is no profile, attempt to fetch one
    if (!profile) getUserProfile();

    // if we finished loading and we do have a profile
    // then build our formData
    if (!profile.isloading && profile) {
      const formData = { ...initialState };
      for (const key in profile) {
        if (key in formData) formData[key] = profile[key];
      }
      for (const key in profile.social) {
        if (key in formData) formData[key] = profile.social[key];
      }
      // the skills may be an array from our API response
      if (Array.isArray(formData.skills))
        formData.skills = formData.skills.join(", ");
      // set local state with the formData
      setFormData(formData);
    }
  }, [loading, getUserProfile, profile]);
  //if getUserProfile is also updated it runs
  //profile is also updated it runs
  //loading also updated it runs
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (evt) => {
    evt.preventDefault();
    dispatch(createProfile(formData, navigate, true));
  };
  return (
    <div>
      {" "}
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fa fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <select name="status" value={status} onChange={handleChange}>
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={company}
            onChange={handleChange}
          />
          <small className="form-text">
            Could be your own company or one you work for
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={handleChange}
          />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={handleChange}
          />
          <small className="form-text">
            City & state suggested (eg. Secunderabad, Telangana)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            name="skills"
            value={skills}
            onChange={handleChange}
          />
          <small className="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            value={githubusername}
            onChange={handleChange}
          />
          <small className="form-text">
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>
        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={bio}
            onChange={handleChange}
          ></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => {
              toggleShow(!show);
            }}
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>
        {show && (
          <>
            <div className="form-group social-input">
              <i className="fa fa-twitter fa-2x"></i>
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={twitter}
                onChange={handleChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fa fa-facebook fa-2x"></i>
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={handleChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fa fa-youtube fa-2x"></i>
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={youtube}
                onChange={handleChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fa fa-linkedin fa-2x"></i>
              <input
                type="text"
                placeholder="Linkedin URL"
                name="linkedin"
                value={linkedin}
                onChange={handleChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fa fa-instagram fa-2x"></i>
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </div>
  );
};
export default EditProfile;
