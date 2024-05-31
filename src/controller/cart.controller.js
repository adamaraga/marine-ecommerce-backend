const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  const newCart = new Cart({
    userId: req.body.userId,
    product: req.body.product,
    bill: req.body.bill,
  });

  try {
    const cart = await newCart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getUserCarts = async (req, res) => {
  try {
    const carts = await Cart.find({ userId: req.params.userId }).sort({
      _id: -1,
    });

    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteUserCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.params.userId });

    res.status(200).json({ message: "Cart emptied successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};
