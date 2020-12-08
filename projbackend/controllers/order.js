const { Order, ProductInCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(500).json({
          err: "Error in finding order",
        });
      }
      req.order = order;
      next();
    });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "email")
    .exec((err, orders) => {
      if (err) {
        return res.status(500).json({
          err: "Error in fetching all the orders",
        });
      }
      res.json(orders);
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  let order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(500).json({
        err: "Error in saving order to the DB",
      });
    }
    res.json(order);
  });
};

// solve the ambiguity in this function from the course
exports.getOrderStatus = (req, res) => {
  res.json(req.order.status);
};

exports.updateOrderStatus = (req, res) => {
  let order = req.order;
  order.status = req.body.status;
  order.save((err, order) => {
    if (err) {
      return res.status(500).json({
        err: "Error in updating order status",
      });
    }
    res.json(order);
  });
};
