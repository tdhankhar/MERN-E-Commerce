import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper/index";

const SignUp = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: false,
    success: false,
  });

  const { name, email, password, error, success } = values;

  const handleChange = (key) => (event) => {
    setValues({
      ...values,
      error: false,
      success: false,
      [key]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ name, email, password })
      .then((response) => {
        if (response.err) {
          setValues({ ...values, error: response.err, success: false });
        } else {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            error: false,
            success: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const successMessage = () => {
    return (
      <div className="row ">
        <div className="col-md-6 offset-sm-3 text-left">
          <div className="alert alert-success">
            New account created successfully. Please{" "}
            <Link to="/signin">Login</Link>
          </div>
        </div>
      </div>
    );
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

  const signUpForm = () => {
    return (
      <div className="row ">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Name</label>
              <input
                className="form-control"
                type="text"
                value={name}
                onChange={handleChange("name")}
              />
            </div>
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
    <Base title="Sign-Up" description="A page for users to sign up">
      {success ? successMessage() : undefined}
      {error ? errorMessage() : undefined}
      {signUpForm()}
      <p className="text-center">{JSON.stringify(values)}</p>
    </Base>
  );
};

export default SignUp;
