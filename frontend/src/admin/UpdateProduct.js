import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import {
  getAllCategories,
  getProduct,
  updateProduct,
} from "./helper/adminAPIcalls";
import { isAuthenticated } from "../auth/helper";

const UpdateProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    categories: [],
    category: "",
    stock: "",
    error: false,
    success: false,
    formData: "",
  });
  const {
    name,
    description,
    image,
    price,
    categories,
    category,
    stock,
    error,
    success,
    formData,
  } = values;

  const { user, token } = isAuthenticated();

  const preload = () => {
    getAllCategories()
      .then((responseCategories) => {
        if (responseCategories.err) {
          console.log(responseCategories.err);
        } else {
          getProduct(match.params.productId)
            .then((responseProduct) => {
              if (responseProduct.err) {
                setValues({
                  ...values,
                  error: responseProduct.err,
                });
              } else {
                setValues({
                  ...values,
                  name: responseProduct.name,
                  category: responseProduct.category._id,
                  price: responseProduct.price,
                  stock: responseProduct.stock,
                  description: responseProduct.description,
                  categories: responseCategories,
                  formData: new FormData(),
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    preload();
  }, []);

  const handleChange = (key) => (event) => {
    const value = key === "image" ? event.target.files[0] : event.target.value;
    formData.set(key, value);
    setValues({
      ...values,
      error: false,
      success: false,
      [key]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({
      ...values,
      error: false,
      success: false,
    });
    updateProduct(match.params.productId, user._id, token, formData)
      .then((response) => {
        if (response.err) {
          setValues({
            ...values,
            error: response.err,
          });
        } else {
          setValues({
            ...values,
            error: false,
            success: true,
            formData: new FormData(),
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
            Product updated successfully.
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

  const updateProductForm = () => {
    return (
      <div className="row ">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Image of the Product</label>
              <input
                className="form-control bg-dark text-white border-0"
                type="file"
                accept="image"
                onChange={handleChange("image")}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Name of the Product</label>
              <input
                className="form-control"
                type="text"
                required
                value={name}
                onChange={handleChange("name")}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Category</label>
              <select
                className="form-control"
                required
                value={category}
                onChange={handleChange("category")}
              >
                <option>Select Category</option>
                {categories &&
                  categories.map((category, index) => {
                    return (
                      <option key={index} value={category._id}>
                        {category.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="form-group">
              <label className="text-light">Price</label>
              <input
                className="form-control"
                type="number"
                required
                value={price}
                onChange={handleChange("price")}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Stock</label>
              <input
                className="form-control"
                type="number"
                required
                value={stock}
                onChange={handleChange("stock")}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={handleChange("description")}
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
    <Base title="Update Product" description="Update products here!">
      {success ? successMessage() : undefined}
      {error ? errorMessage() : undefined}
      {updateProductForm()}
      <p className="text-center">
        {JSON.stringify({
          image,
          name,
          category,
          price,
          stock,
          description,
          error,
          success,
        })}
      </p>
    </Base>
  );
};

export default UpdateProduct;
