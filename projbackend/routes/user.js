const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  getUserPurchaseList,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/profile/:userId", isSignedIn, isAuthenticated, getUser);
router.put(
  "/user/profile/:userId",
  isSignedIn,
  isAuthenticated,
  updateUser,
  getUser
);
// Not tested yet
router.get("/user/orders/:userId", getUserPurchaseList);

module.exports = router;
