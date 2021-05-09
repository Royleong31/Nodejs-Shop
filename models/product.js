const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      console.log(`Error: ${err}`);
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

/*



*/

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((productArr) => {
      if (this.id) {
        const existingProductIndex = productArr.findIndex(
          (prod) => prod.id == this.id
        );
        const updatedProductsArr = [...productArr];
        updatedProductsArr[existingProductIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProductsArr), (err) => {
          if (err) console.log(`Error: ${err}`);
        });
      } else {
        this.id = Math.random().toString();
        productArr.push(this);

        fs.writeFile(p, JSON.stringify(productArr), (err) => {
          if (err) console.log(`Error: ${err}`);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((productArr) => {
      const product = productArr.find((p) => p.id === id);
      cb(product);
    });
  }

  static deleteById(id, cb) {
    getProductsFromFile((productsArr) => {
      const product = productsArr.find((prod) => prod.id === id);

      const updatedProductsArr = productsArr.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProductsArr), (err) => {
        if (err) return console.log(`Error: ${err}`);

        Cart.deleteProduct(id, product.price);
        cb();
      });
    });
  }
};
