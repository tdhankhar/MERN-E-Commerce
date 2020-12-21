const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
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

    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.securePassword = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  req.profile.__v = undefined;
  res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(404).json({
          err: "User not found",
        });
      }
      req.profile = user;
      next();
    }
  );
};

// NOT TESTED

// return the list of orders of user-id: req.profile._id
// DOUBT: why are we not just simply returning the user purchase list?
// DOUBT: when to query the order schema and when to use user purchase list?
exports.getUserPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "email")
    .exec((err, orders) => {
      if (err) {
        return res.status(500).json({
          err: "Error in searching DB",
        });
      }

      if (!orders) {
        return res.status(404).json({
          msg: "Orders not found",
        });
      }

      res.json(orders);
    });
};

// middleware to push order in user-purchase-list
exports.pushOrderInPurchaseList = (req, res, next) => {
  let products = [];
  req.body.order.products.forEach((product) => {
    products.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
    });
  });

  let purchase = {
    products,
    amount: req.body.order.amount,
    transaction_id: req.body.order.transactionId,
  };

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchase } },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(404).json({
          err: "User not found",
        });
      }
      next();
    }
  );
};
