const { getDb } = require("../util/databases");
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    //id is optional
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      // update the product
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp;
  }

  static fetchAll() {
    const db = getDb();

    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log("Products");
        console.log(products);
        return products;
      })
      .catch((err) => console.error(err));
  }

  static findById(productId) {
    const db = getDb();

    return db
      .collection("products")
      .find({ _id: mongodb.ObjectId(productId) }) // ?: mongodb stores id as _id and the type is ObjectId
      .next()
      .catch((err) => console.error(err));
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({
        _id: new mongodb.ObjectId(productId),
      })
      .catch((err) => console.error(err));
  }
}

module.exports = Product;
