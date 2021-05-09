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
  console.log(
    `Title: ${title}, Image URL: ${imageUrl}, Description: ${description}, Price: ${price}`
  );
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};
//  ADD PRODUCTS

// !: EDIT PRODUCTS
exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");

  Product.findById(productId, (product) => {
    if (!product) {
      console.log(`No product was found!`);
      // return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });

  console.log(`Product ID: ${productId}`);
  console.log(`Editing: ${editMode}`);
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;

  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  const product = new Product(productId, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};
// EDIT PRODUCTS

// !: GET PRODUCTS
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/admin-product-list", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
// GET PRODUCTS

// !: DELETE PRODUCT
exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  console.log(`Product ID: ${productId}`);
  Product.deleteById(productId, () => {
    res.redirect("/admin/products");
  });
};
// DELETE PRODUCT
