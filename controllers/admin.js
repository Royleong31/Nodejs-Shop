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

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};
//  ADD PRODUCTS

// !: EDIT PRODUCTS
exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");

  // req.user.getProducts({ where: { id: productId } })
  Product.findById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
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

  Product.findById(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;

      return product.save();
    })
    .then(() => {
      console.log("UPDATED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};
// EDIT PRODUCTS

// !: GET PRODUCTS
exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('imageUrl') select can choose the fields that you want to get
    .populate("userId")
    .then((prods) => {
      console.log(prods);
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
  console.log(`Product ID of deleted product: ${productId}`);

  Product.findByIdAndRemove(productId)
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};
// DELETE PRODUCT
