import React from "react";
import { API } from "../../backend";

const ImageHelper = ({ product }) => {
  return (
    <div>
      <img
        className="card-img-top"
        src={`${API}/product/image/${product._id}`}
        alt="product"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      />
    </div>
  );
};

export default ImageHelper;
