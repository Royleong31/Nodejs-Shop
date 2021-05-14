const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((prods) => {
      console.log(prods);
      res.render("shop/shop-product-list", {
        prods,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      console.log("++++++++++++++");
      console.log(product);

      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((prods) => {
      res.render("shop/index", {
        prods,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.error(err));
};

// !: Cart
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      cartProducts = user.cart.items;
      console.log(cartProducts);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        cartProducts,
      });
    })
    .catch((err) => console.error(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("Result of post cart");
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  console.log(`Product ID: ${productId}`);

  req.user
    .deleteItemFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};
// Cart

// !Orders
exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      console.log(user);
      const products = user.cart.items.map((item) => {
        return {
          productData: { ...item.productId._doc },
          quantity: item.quantity,
        };
      });
      console.log(products);

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },

        products,
      });

      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => res.redirect("/orders"))
    .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        path: "/orders",
        orders,
        pageTitle: "Your Orders",
      });
    })
    .catch((err) => console.error(err));
};
// Orders
