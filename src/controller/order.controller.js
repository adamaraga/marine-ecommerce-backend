const Order = require("../models/Order");
const Address = require("../models/Address");

exports.addToOrderSameAddress = async (req, res) => {
  const newAddress = new Address(req.body.address);

  try {
    const address = await newAddress.save();

    let initOrder = req.body.order;
    initOrder.billingAddress = address._id.toString();
    initOrder.shippingAddress = address._id.toString();
    initOrder.paymentStatus = "Initiated";

    const newOrder = new Order(initOrder);

    try {
      await newOrder.save();

      res.status(200).json({ message: "Order initialized successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addToOrderDiffAddress = async (req, res) => {
  const newAddress = new Address(req.body.billingAddress);
  const newAddress2 = new Address(req.body.shippingAddress);

  try {
    const address = await newAddress.save();
    const address2 = await newAddress2.save();

    let initOrder = req.body.order;
    initOrder.billingAddress = address._id.toString();
    initOrder.shippingAddress = address2._id.toString();
    initOrder.paymentStatus = "Initiated";

    const newOrder = new Order(initOrder);

    try {
      await newOrder.save();

      res.status(200).json({ message: "Order initialized successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.orderSuccess = async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: { paymentStatus: "Success", paymentId: req.params.orderId },
      },
      { new: true }
    );

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found, update failed" });
    } else {
      res.status(200).json({ message: "Order payment successfull" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getOrders = async (req, res) => {
  const limit = 10;
  const page = req.params.page;

  //   const offset = (page - 1) * limit;

  try {
    const orders = await Order.paginate(
      {},
      {
        limit,
        page,
        sort: {
          _id: -1,
        },
      }
    );

    const { docs, totalPages } = orders;

    res.status(200).json({ orders: docs, totalPages, limit });
  } catch (err) {
    res.status(500).json(err);
  }
};
