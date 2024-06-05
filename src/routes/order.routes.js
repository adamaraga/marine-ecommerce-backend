const {
  getOrders,
  addToOrderSameAddress,
  addToOrderDiffAddress,
  orderSuccess,
  getOrdersForUser,
} = require("../controller/order.controller");
const authJwt = require("../middlewares/authjwt");

const router = require("express").Router();

router.post("/add", addToOrderSameAddress);

// router.post("/address-diff/add", addToOrderDiffAddress);

router.put("/success/:orderId", orderSuccess);

router.get("/user/:userId", [authJwt.verifyToken], getOrdersForUser);

router.get("/:page", [authJwt.verifyToken, authJwt.isAdmin], getOrders);

module.exports = router;
