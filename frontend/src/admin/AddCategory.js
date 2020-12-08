import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper/index";
import { createCategory } from "./helper/adminAPIcalls";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user, token } = isAuthenticated();

  const handleChange = (event) => {
    setName(event.target.value);
    setError(false);
    setSuccess(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(false);
    createCategory(user._id, token, { name })
      .then((response) => {
        if (response.err) {
          setError(response.err);
          setSuccess(false);
        } else {
          setName("");
          setError(false);
          setSuccess(true);
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
            New category created successfully.
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

  const addCategoryForm = () => {
    return (
      <div className="row ">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Name of the Category</label>
              <input
                className="form-control"
                type="text"
                required
                value={name}
                onChange={handleChange}
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
    <Base title="Add Category" description="Create new categories here!">
      {success ? successMessage() : undefined}
      {error ? errorMessage() : undefined}
      {addCategoryForm()}
      <p className="text-center">{JSON.stringify({ name, error, success })}</p>
    </Base>
  );
};

export default AddCategory;
