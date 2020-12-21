import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { getAllProducts, deleteProduct } from "./helper/adminAPIcalls";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const { user, token } = isAuthenticated();

  const preload = () => {
    getAllProducts()
      .then((response) => {
        if (response.err) {
          console.log(response.err);
        } else {
          setProducts(response);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    preload();
  }, []);

  const handleDelete = (productId) => {
    deleteProduct(productId, user._id, token)
      .then((response) => {
        if (response.err) {
          console.log(response.err);
        } else {
          preload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Base
      title="Manage Products"
      description="Update or Delete your products here!"
    >
      <div className="row">
        <div className="col-12">
          <h2 className="text-center my-3">
            Total Products: {products.length}
          </h2>
          {products.map((product, index) => {
            return (
              <div key={index} className="container">
                <div className="row text-center">
                  <div className="col-4">
                    <h3 className="text-left">{product.name}</h3>
                  </div>
                  <div className="col-4">
                    <Link
                      className="btn btn-success"
                      to={`/admin/product/update/${product._id}`}
                    >
                      Update
                    </Link>
                  </div>
                  <div className="col-4">
                    <button
                      onClick={() => {
                        handleDelete(product._id);
                      }}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default ManageProducts;
