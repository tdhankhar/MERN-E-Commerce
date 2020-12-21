import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCart, removeAllItemsFromCart } from "./helper/cartHelper";
import { getToken, processPayment } from "./helper/braintreeHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import DropIn from "braintree-web-drop-in-react";

const Braintree = ({ products, setReload = (f) => f, reload = undefined }) => {
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    error: false,
    success: false,
    paymentToken: null,
    instance: {},
  });

  const getPaymentToken = () => {
    getToken(user._id, token)
      .then((response) => {
        if (response.err) {
          setValues({
            ...values,
            error: response.err,
          });
        } else {
          setValues({
            ...values,
            paymentToken: response.clientToken,
          });
        }
      })
      .catch();
  };
  useEffect(() => {
    getPaymentToken();
  }, []);

  const checkout = () => {
    setValues({
      ...values,
      error: false,
    });
    values.instance.requestPaymentMethod().then((data) => {
      const payload = {
        payment_method_nonce: data.nonce,
        amount: getAmount(),
      };
      processPayment(user._id, token, payload)
        .then((response) => {
          if (!response.success) {
            setValues({
              ...values,
              error: true,
            });
          } else {
            setValues({
              ...values,
              success: true,
            });
            let order = {
              products: products,
              transactionId: response.transaction.id,
              amount: response.transaction.amount,
            };
            createOrder(user._id, token, order)
              .then((responseOrder) => {
                if (responseOrder.err) {
                  console.log("Error in order creation. Rollback Payment!");
                } else {
                  removeAllItemsFromCart(() => {
                    setReload(!reload);
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
    });
  };

  const getAmount = () => {
    let amount = 0;
    products.forEach((product) => {
      amount += product.price;
    });
    return amount;
  };

  const showDropIn = () => {
    return (
      <div>
        {values.paymentToken ? (
          <div>
            <DropIn
              options={{ authorization: values.paymentToken }}
              onInstance={(instance) => (values.instance = instance)}
            />
            <button className="btn btn-block btn-success" onClick={checkout}>
              Proceed to Checkout
            </button>
          </div>
        ) : (
          <h1>Setting up payment gateway</h1>
        )}
      </div>
    );
  };

  return (
    <div className="text-center">
      <h4>Your bill is {getAmount()}$</h4>
      <div>{showDropIn()}</div>
    </div>
  );
};

export default Braintree;
