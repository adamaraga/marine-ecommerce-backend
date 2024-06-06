const Order = require("../models/Order");
const Address = require("../models/Address");
const paypal = require("@paypal/checkout-server-sdk");

exports.addToOrderSameAddress = async (req, res) => {
  const newAddress = new Address(req.body.address);

  try {
    const address = await newAddress.save();

    let clientId = process.env.PAYPAL_CLIENT_ID;
    let clientSecret = process.env.PAYPAL_SECRECT_KRY;

    // This sample uses SandboxEnvironment. In production, use LiveEnvironment
    let environment = new paypal.core.SandboxEnvironment(
      clientId,
      clientSecret
    );
    let client = new paypal.core.PayPalHttpClient(environment);

    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: req.body.order.bill,
          },
        },
      ],
    });

    let createOrder = async function () {
      let response = await client.execute(request);
      return response.result.id;
    };
    const orderId = await createOrder();

    let initOrder = {
      ...req.body.order,
      billingAddress: address._id,
      shippingAddress: address._id,
      paymentStatus: "Initiated",
      paymentId: orderId,
    };

    const newOrder = new Order(initOrder);

    try {
      await newOrder.save();

      res.status(200).json({ orderId });
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// exports.addToOrderDiffAddress = async (req, res) => {
//   const newAddress = new Address(req.body.billingAddress);
//   const newAddress2 = new Address(req.body.shippingAddress);

//   try {
//     const address = await newAddress.save();
//     const address2 = await newAddress2.save();

//     let initOrder = req.body.order;
//     initOrder.billingAddress = address._id.toString();
//     initOrder.shippingAddress = address2._id.toString();
//     initOrder.paymentStatus = "Initiated";

//     const newOrder = new Order(initOrder);

//     try {
//       await newOrder.save();

//       res.status(200).json({ message: "Order initialized successfully" });
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

exports.orderSuccess = async (req, res) => {
  let captureOrder = async function (orderId) {
    request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    // Call API with your client and get a response for your call
    let response = await client.execute(request);

    // console.log(`Capture: ${JSON.stringify(response.result)}`);
    return response.result.status;
  };

  let capture = await captureOrder(req.params.orderId);

  if (capture === "COMPLETED") {
    try {
      const updatedOrder = await Order.findOneAndUpdate(
        {
          paymentId: req.params.orderId,
        },
        {
          $set: { paymentStatus: "Success" },
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
  } else {
    res.status(500).json({ message: "Order payment failed" });
  }
};

exports.getOrdersForUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });

    res.status(200).json(orders);
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

exports.getOrdersBySearch = async (req, res) => {
  const limit = 10;
  const page = req.params.page;

  const { query } = req.params;
  const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
  const searchRgx = rgx(query);

  try {
    const orders = await Order.paginate(
      {
        $or: [{ paymentId: { $regex: searchRgx, $options: "i" } }],
      },
      {
        limit,
        page,
      }
    );

    const { docs, totalPages } = orders;

    res.status(200).json({ orders: docs, totalPages, limit });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById({ _id: req.params.id }).populate(
      "billingAddress"
    );

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
};
