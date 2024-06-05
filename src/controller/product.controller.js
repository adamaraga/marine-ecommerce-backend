const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.discription ||
    !req.body.price ||
    !req.body.category ||
    !req.body.stock
  ) {
    res.status(400).json({ message: "Incomplete Product Data" });
    return;
  }

  const newProduct = new Product({
    img: req.file.path,
    name: req.body.name,
    discription: req.body.discription,
    price: req.body.price,
    oldPrice: req.body.oldPrice,
    category: req.body.category,
    stock: req.body.stock,
    weight: req.body.weight,
    bestSeller: req.body.bestSeller,
    wholeSale: req.body.wholeSale,
  });

  try {
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllProducts = async (req, res) => {
  const limit = 10;
  const page = req.params.page;

  //   const offset = (page - 1) * limit;

  try {
    const products = await Product.paginate(
      {},
      {
        limit,
        page,
        sort: {
          _id: -1,
        },
      }
    );

    const { docs, totalPages } = products;

    res.status(200).json({ products: docs, totalPages, limit });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProductsByCat = async (req, res) => {
  const limit = 10;
  const page = req.params.page;

  try {
    const products = await Product.paginate(
      { category: req.params.category },
      {
        limit,
        page,
        sort: {
          _id: -1,
        },
      }
    );

    const { docs, totalPages } = products;

    res.status(200).json({ products: docs, totalPages, limit });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProductsByBestSeller = async (req, res) => {
  const limit = 10;
  const page = req.params.page;

  try {
    const products = await Product.paginate(
      { bestSeller: true },
      {
        limit,
        page,
      }
    );

    const { docs, totalPages } = products;

    res.status(200).json({ products: docs, totalPages, limit });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProductsByWholeSale = async (req, res) => {
  const limit = 10;
  const page = req.params.page;

  try {
    const products = await Product.paginate(
      { wholeSale: true },
      {
        limit,
        page,
      }
    );

    const { docs, totalPages } = products;

    res.status(200).json({ products: docs, totalPages, limit });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProductsBySearch = async (req, res) => {
  const limit = 10;
  const page = req.params.page;

  const { query } = req.params;
  const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
  const searchRgx = rgx(query);

  try {
    const products = await Product.paginate(
      { name: { $regex: searchRgx, $options: "i" } },
      {
        limit,
        page,
      }
    );

    const { docs, totalPages } = products;

    res.status(200).json({ products: docs, totalPages, limit });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found, update failed" });
    } else {
      res.status(200).json(updatedProduct);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};
