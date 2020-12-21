import React, { useState, useEffect } from "react";
import ImageHelper from "./helper/ImageHelper";
import {
  addItemToCart,
  checkInCart,
  removeItemFromCart,
} from "./helper/cartHelper";

const Card = ({ product, setReload = (f) => f, reload = undefined }) => {
  const [showAddToCart, setShowAddToCart] = useState(true);

  const preload = () => {
    if (checkInCart(product._id)) {
      setShowAddToCart(false);
    }
  };
  useEffect(() => {
    preload();
  }, []);

  const addToCart = () => {
    addItemToCart(product, () => {
      setShowAddToCart(false);
    });
  };
  const removeFromCart = () => {
    removeItemFromCart(product._id, () => {
      setShowAddToCart(true);
      setReload(!reload);
    });
  };

  return (
    <div className="card text-dark">
      <ImageHelper product={product} />
      <div className="card-body">
        <div className="row">
          <div className="col-8">
            <h5 className="card-title">{product.name}</h5>
          </div>
          <div className="col-4">
            <h5 className="card-text text-success text-right">
              {product.price}$
            </h5>
          </div>
        </div>
        <p className="card-text">{product.description}</p>
        {showAddToCart && (
          <button className="btn btn-block btn-success" onClick={addToCart}>
            Add to Cart
          </button>
        )}
        {!showAddToCart && (
          <button className="btn btn-block btn-danger" onClick={removeFromCart}>
            Remove from Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
