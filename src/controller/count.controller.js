const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderTotalCount = await Order.countDocuments();
    const orderInitCount = await Order.where({
      paymentStatus: "Initiated",
    }).countDocuments();
    const orderSucCount = await Order.where({
      paymentStatus: "Success",
    }).countDocuments();

    const count = {
      user: userCount,
      product: productCount,
      order: orderTotalCount,
      orderInit: orderInitCount,
      orderSuc: orderSucCount,
    };

    res.status(200).json(count);
  } catch (err) {
    res.status(500).json(err);
  }
};
