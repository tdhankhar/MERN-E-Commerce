import React, { useState, useEffect } from "react";
import Base from "./Base";
import Card from "./Card";
import { getAllProducts } from "./helper/coreAPIcalls";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  const loadProducts = () => {
    getAllProducts()
      .then((response) => {
        if (response.err) {
          setError(response.err);
        } else {
          setProducts(response);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Base title="Home Page" description="Welcome to the online t-shirt store">
      <div className="container">
        <div className="row">
          {products.map((product, index) => {
            return (
              <div key={index} className="col-4 my-3">
                <Card product={product}></Card>
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default Home;
