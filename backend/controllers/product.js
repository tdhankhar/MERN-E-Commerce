const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category", "name")
    .exec((err, product) => {
      if (err) {
        return res.status(500).json({
          err: "Error in searching DB",
        });
      }
      if (!product) {
        return res.status(404).json({
          msg: "Product not found",
        });
      }

      req.product = product;
      next();
    });
};

exports.getProductImage = (req, res) => {
  if (req.product.image.data) {
    res.set("Content-Type", req.product.image.contentType);
    // DOUBT: return or not?
    res.send(req.product.image.data);
  }
};

exports.getProduct = (req, res) => {
  req.product.image = undefined;
  res.json(req.product);
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-image")
    .populate("category", "name")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(500).json({
          err: "Problem in fetching all the products",
        });
      }
      res.json(products);
    });
};

exports.createProduct = (req, res) => {
  // creating a form parser
  let form = new formidable.IncomingForm();
  // keeping extensions like .png, .pdf etc
  form.keepExtensions = true;
  // specifying directory to upload files (this is temporary)
  // NOTE: find the best way to upload files
  form.uploadDir = "../uploads";
  // parsing the req which contains the form data
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        err: "Problem with the files",
      });
    }

    let product = new Product(fields);

    if (files.image) {
      if (files.image.size > 3000000) {
        return res.status(400).json({
          err: "File size too big",
        });
      }
      // formidable stores file at a default path with a unique name (this path can be changed using uploadDir)
      // fs can be used to read image from that path to put it into the database
      product.image.data = fs.readFileSync(files.image.path);
      product.image.contentType = files.image.type;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(500).json({
          err: "Error in saving product to the DB",
        });
      }
      res.json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, product) => {
    if (err) {
      return res.status(500).json({
        err: "Error in deleting product",
      });
    }
    res.json(product);
  });
};

exports.updateProduct = (req, res) => {
  // creating a form parser
  let form = new formidable.IncomingForm();
  // keeping extensions like .png, .pdf etc
  form.keepExtensions = true;
  // specifying directory to upload files (this is temporary)
  // NOTE: find the best way to upload files
  form.uploadDir = "../uploads";
  // parsing the req which contains the form data
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        err: "Problem with the files",
      });
    }

    // updating the existing product instead of creating a new one
    let product = req.product;
    product = _.extend(product, fields);

    if (files.image) {
      if (files.image.size > 3000000) {
        return res.status(400).json({
          err: "File size too big",
        });
      }
      // formidable stores file at a default path with a unique name (this path can be changed using uploadDir)
      // fs can be used to read image from that path to put it into the database
      product.image.data = fs.readFileSync(files.image.path);
      product.image.contentType = files.image.type;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(500).json({
          err: "Error in updating product",
        });
      }
      res.json(product);
    });
  });
};

exports.updateInventory = (req, res, next) => {
  // interesting approach to club multiple operations together (try to explore such methods)
  let updateOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });
  Product.bulkWrite(updateOperations, {}, (err, products) => {
    if (err) {
      return res.status(500).json({
        err: "Error in updating inventory",
      });
    }
    next();
  });
};

exports.getAvailableCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(500).json({
        err: "Error in fetching available categories",
      });
    }
    res.json(categories);
  });
};
