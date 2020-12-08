const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getAvailableCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);
router.param("productId", getProductById);

router.get("/product/:productId", getProduct);
router.get("/products", getAllProducts);
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);
router.get("/products/categories", getAvailableCategories);

module.exports = router;
