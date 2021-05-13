const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const User = require("./models/user");
const { mongoConnect } = require("./util/databases");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/errors");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  User.findById("609c92524e154172b2ebafe4")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      console.log('Creating New User');
      next();
    })
    .catch((err) => console.error(err));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect((_) => {
  app.listen(3000);
});
