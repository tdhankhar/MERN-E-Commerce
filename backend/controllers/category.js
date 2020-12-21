const Category = require("../models/category");

exports.createCategory = (req, res) => {
  let category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(500).json({
        err: "Error in creating new category",
      });
    }
    res.json(category);
  });
};

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(500).json({
        err: "Error in searching DB",
      });
    }

    if (!category) {
      return res.status(404).json({
        err: "Category not found",
      });
    }

    req.category = category;
    next();
  });
};

exports.getCategory = (req, res) => {
  res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find((err, categories) => {
    if (err) {
      return res.status(500).json({
        err: "Error in searching DB",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  let category = req.category;
  category.name = req.body.name;
  category.save((err, category) => {
    if (err) {
      return res.status(500).json({
        err: "Error in updating category",
      });
    }
    res.json(category);
  });
};

exports.deleteCategory = (req, res) => {
  let category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(500).json({
        err: "Error in deleting category",
      });
    }
    res.json(category);
  });
};
