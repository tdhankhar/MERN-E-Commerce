const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productInCartSchema = new mongoose.Schema(
  {
    product: {
      type: ObjectId,
      ref: "Product",
    },
    name: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductInCart = mongoose.model("ProductInCart", productInCartSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [productInCartSchema],
    transactionId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "recieved",
      enum: ["processing", "recieved", "shipped", "delivered", "cancelled"],
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
    lastUpdate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductInCart };
