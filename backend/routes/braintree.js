const express = require("express");
const router = express.Router();

const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getToken, processPayment } = require("../controllers/braintree");

router.param("userId", getUserById);

router.get("/payment/token/:userId", isSignedIn, isAuthenticated, getToken);
router.post(
  "/payment/pay/:userId",
  isSignedIn,
  isAuthenticated,
  processPayment
);

module.exports = router;
