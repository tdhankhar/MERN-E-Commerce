import React, { useState, useEffect } from "react";
import Base from "./Base";
import Card from "./Card";
import { getCart } from "./helper/cartHelper";
import Braintree from "./Braintree";
import { isAuthenticated } from "../auth/helper";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);
  const { user, token } = isAuthenticated();
  const preload = () => {
    setProducts(getCart());
  };
  useEffect(() => {
    preload();
  }, [reload]);

  // DOUBT: issue created using index
  // does div with a particular index store states or some properties
  // associated to the component inside the div?

  // EXAMPLE: when i delete a card from the cart then the card
  // below the deleted one takes the properties of the deleted one
  // because it is not taking the index of the deleted card

  // POST-DEBUGGING-THEORY: div of a particular index retains the state of the card
  // so when we update the cart list, we are redering the div with same indices
  // just with new values to fill in (this is why state of the deleted card is visible)
  // EXAMPLE: suppose we have key=0 key=1 key=2 divs and we try delete 0th one.
  // then in real we are just rendering key=0 & key=1 divs with values of key=1 & key=2 divs

  // SOLUTION: use product._id, time_stamp etc.
  // (something which stays unique to the product/div even on reloading the cart)
  // as indices rather than using 0, 1, 2 etc.
  const loadProducts = () => {
    return (
      <div>
        <h4 className="text-center">Total Items: {products.length}</h4>
        {products.map((product) => {
          return (
            <div key={product._id} className="my-3">
              <Card
                product={product}
                setReload={setReload}
                reload={reload}
              ></Card>
            </div>
          );
        })}
      </div>
    );
  };
  const loadCheckOut = () => {
    return (
      <Braintree
        products={products}
        setReload={setReload}
        reload={reload}
      ></Braintree>
    );
  };
  return (
    <Base title="Cart Page" description="Cart for all your favorite items">
      <div className="container-fluid">
        <div className="row">
          <div className="col-4">{loadProducts()}</div>
          <div className="col-8">
            {user ? (
              products.length ? (
                loadCheckOut()
              ) : (
                <h1>Cart is empty</h1>
              )
            ) : (
              <h1>Please login to checkout</h1>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Cart;
