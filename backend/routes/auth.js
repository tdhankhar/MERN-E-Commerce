const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signup, signin, signout, isSignedIn } = require("../controllers/auth");

router.post(
  "/auth/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("name should be atleast 3 char"),
    check("email")
      .isEmail()
      .withMessage("email is required"),
    check("password")
      .isLength({ min: 3 })
      .withMessage("password should be at least 3 char"),
  ],
  signup
);

router.post(
  "/auth/signin",
  [
    check("email")
      .isEmail()
      .withMessage("email is required"),
    check("password")
      .isLength({ min: 1 })
      .withMessage("password field is required"),
  ],
  signin
);

router.get("/auth/signout", isSignedIn, signout);

module.exports = router;
