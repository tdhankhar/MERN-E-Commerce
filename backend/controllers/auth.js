const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("../models/user");

exports.signup = (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array()[0].msg,
    });
  }

  let user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array()[0].msg,
    });
  }

  let { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        err: "Error in searching DB",
      });
    }

    if (!user) {
      return res.status(404).json({
        msg: "User email not found",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        err: "Invalid email or Invalid password",
      });
    }

    let token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    res.cookie("token", token, { expire: new Date() + 9999 });

    let { _id, name, email, role } = user;
    res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    msg: "User signed out",
  });
};

// protection middlewares
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET_KEY,
  userProperty: "auth",
});

// custom middlewares
exports.isAuthenticated = (req, res, next) => {
  // check if token id matches the profile id or not
  let check = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!check) {
    return res.status(403).json({
      err: "ACCESS DENIED!",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      err: "ACCESS DENIED!",
    });
  }
  next();
};
