const Product = require("../models/product");

// !: ADD PRODUCTS
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  req.user
    .createProduct({ price, title, description, imageUrl })
    .then((result) => res.redirect("/"))
    .catch((err) => console.error(err));
};
//  ADD PRODUCTS

// !: EDIT PRODUCTS
exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");

  // req.user.getProducts({ where: { id: productId } })
  Product.findByPk(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;

  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;

      return product.save();
    })
    .then(() => res.redirect("/"))
    .catch((err) => console.error(err));
};
// EDIT PRODUCTS

// !: GET PRODUCTS
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((prods) => {
      res.render("admin/admin-product-list", {
        prods,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.error(err));
};
// GET PRODUCTS

// !: DELETE PRODUCT
exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByPk(productId)
    .then((product) => {
      console.log(product);
      product.destroy();
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};
// DELETE PRODUCT
