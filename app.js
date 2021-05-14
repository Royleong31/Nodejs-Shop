require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/errors");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  User.findById("609d09f559d03b42a88aba2c")
    .then((user) => {
      req.user = user;
      console.log("Creating New User");
      next();
    })
    .catch((err) => console.error(err));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGO_ADDRESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Roy",
          email: "roy@3logytech.com",
          cart: { items: [] },
        });

        user.save(); // .save() automatically saves for you
      }
    });
  })
  .then(() => app.listen(3000))
  .catch((err) => console.error(err));
