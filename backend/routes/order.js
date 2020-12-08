const express = require("express");
const router = express.Router();

const {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateOrderStatus,
} = require("../controllers/order");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateInventory } = require("../controllers/product");

router.param("userId", getUserById);
router.param("orderId", getOrderById);

// if the user is authenticated to place an order
// then push order in user purchase list, update inventory and finally create an order
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateInventory,
  createOrder
);
// for testing if we want to see all the orders in the DB
router.get(
  "/orders/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);
router.get(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  getOrderStatus
);
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateOrderStatus
);

module.exports = router;
