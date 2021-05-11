const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((prods) => {
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

  // Product.findAll({where: {id: productId}})
  Product.findByPk(productId)
    .then((product) => {
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
  Product.findAll()
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
  console.log(`Cart BELOW ======================`);
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts().then((cartProducts) => {
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          cartProducts,
        });
      });
    })
    .catch((err) => console.log(err));
  // Cart.getCart((cart) => {
  //   Product.fetchAll((productsArr) => {
  //     const cartProducts = [];

  //     for (product of productsArr) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );

  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qnt: cartProductData.qnt });
  //       }
  //     }

  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //       cartProducts,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } }); // goes through cartItems table
    })
    .then((products) => {
      let product;

      if (products.length > 0) {
        product = products[0];
        const oldQuantity = product.cartItems.quantity;
        console.log(`Old Quantity: ${oldQuantity}`);
        newQuantity = oldQuantity + 1;

        return product;
      }

      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id: productId } }))
    .then((products) => {
      return products[0].cartItems.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};
// Cart

// !Orders
exports.postOrder = (req, res, next) => {
  let products, fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((cartProducts) => {
      products = cartProducts;
      console.log("++++++++++++");
      console.log(cartProducts);
      return req.user.createOrder();
    })
    .then((order) => {
      return order.addProducts(
        products.map((product) => {
          product.orderItem = {
            quantity: product.cartItems.quantity,
          };
          return product;
        })
      );
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      return res.redirect("/orders");
    })
    .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        orders,
        pageTitle: "Your Orders",
      });
    })
    .catch((err) => console.error(err));
};
// Orders
