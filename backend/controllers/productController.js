import { productModel } from "../models/productModel.js";
import { uploadToCloudinary } from "../services/cloudinaryUpload.js";

export async function createProduct(req, res) {
  try {
    console.log("Created product start")
    let url = await uploadToCloudinary(req);

    let {
      name,
      brand,
      category,
      price,
      description,
      inStock,
      inventory, 
      addedBy, 
    } = req.body;

    console.log(name, brand, category, price, description, inStock, inventory, addedBy)

    const product = new productModel({
      name,
      url,
      brand,
      category,
      price,
      description,
      inStock,
      inventory,
      addedBy: req.user._id,
    });

    await product.save();
    res.status(201).json({ message: "product added" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

//FETCH ALL PRODCUCT
export async function getAllProducts(req, res) {
  let query = {};
  let sortArg = {};

  // db.products.find({}).sort({category: -1})
  // db.products.find({}).sort({category: 1})
  // db.products.find({}).sort({price: 1})
  // db.products.find({}).sort({price: -1})

  // db.product.find({price: {$eq: 10000}})
  // db.product.find({price: {$gt: 10000}})
  // db.product.find({price: {$lt: 10000}})
  // db.product.find({price: {$lte: 10000}})
  // db.product.find({price: {$gte: 10000}})

  if (req.query.brand) {
    query.brand = req.query.brand;
  }

  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.sortBy && req.query.sort) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sort.toLowerCase() === "asc" ? 1 : -1;

    sortArg[sortField] = sortOrder;
  }

  if (req.query.price) {
    const priceOperators = {
      "=": "$eq",
      "<": "$lt",
      ">": "$gt",
      "<=": "$lte",
      ">=": "$gte",
    };

    // [=, <, >, <=, >=]

    Object.keys(priceOperators).forEach((operator) => {
      if (req.query.price.startsWith(operator)) {
        query.price = {
          [priceOperators[operator]]: req.query.price.slice(operator.length),
        };
      }
    });
  }

  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: "i" }; //i: case insensitivity
  }

  const allProducts = await productModel.find(query).sort(sortArg);
  res.json(allProducts);
}

export async function deleteProduct(req, res) {
  try {
    const idToDelete = req.params.id;
    const productDeleted = await productModel.findByIdAndDelete(idToDelete);
    if (productDeleted) res.json({ message: "Product Deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

//FETCH A SINGLE PRODCUCT

export async function getSingleProduct(req, res) {
  const idToFind = req.params.id;
  const singleProduct = await productModel.findById({ _id: idToFind });
  res.json(singleProduct);
}
//SORTING BY PRICE / CATEGORY / BRAND