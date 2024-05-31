const {
  getOrders,
  addToOrderSameAddress,
  addToOrderDiffAddress,
  orderSuccess,
} = require("../controller/order.controller");
const authJwt = require("../middlewares/authjwt");

const router = require("express").Router();

router.post("/address-same/add", addToOrderSameAddress);

router.post("/address-diff/add", addToOrderDiffAddress);

router.put("/success/:id/:orderId", orderSuccess);

router.get("/:page", [authJwt.verifyToken, authJwt.isAdmin], getOrders);

module.exports = router;
