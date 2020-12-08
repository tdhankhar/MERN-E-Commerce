import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/helper/index";

const SignIn = () => {
  const [values, setValues] = useState({
    email: "test@gmail.com",
    password: "12345",
    error: false,
    loading: false,
    redirecting: false,
  });

  const { email, password, error, loading, redirecting } = values;
  const { user } = isAuthenticated();

  const handleChange = (key) => (event) => {
    setValues({
      ...values,
      error: false,
      loading: false,
      redirecting: false,
      [key]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((response) => {
        if (response.err) {
          setValues({ ...values, error: response.err, loading: false });
        } else {
          // set the jwt and get a callback to redirect and update state
          authenticate(response, () => {
            setValues({
              ...values,
              error: false,
              redirecting: true,
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRedirect = () => {
    if (user) {
      if (user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
  };

  const errorMessage = () => {
    return (
      <div className="row ">
        <div className="col-md-6 offset-sm-3 text-left">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  };

  const signInForm = () => {
    return (
      <div className="row ">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={handleChange("email")}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={handleChange("password")}
              />
            </div>
            <button
              className="btn btn-success btn-block"
              onClick={handleSubmit}
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base title="Sign-In" description="A page for users to sign in">
      {error ? errorMessage() : undefined}
      {signInForm()}
      {handleRedirect()}
      <p className="text-center">{JSON.stringify(values)}</p>
    </Base>
  );
};

export default SignIn;
