const {
  getOrders,
  addToOrderSameAddress,
  addToOrderDiffAddress,
  orderSuccess,
  getOrdersForUser,
  getOrdersBySearch,
  getOrder,
} = require("../controller/order.controller");
const authJwt = require("../middlewares/authJwt");

const router = require("express").Router();

router.post("/add", addToOrderSameAddress);

// router.post("/address-diff/add", addToOrderDiffAddress);

router.put("/success/:orderId", orderSuccess);

router.get("/user/:userId", [authJwt.verifyToken], getOrdersForUser);

router.get("/all/:page", [authJwt.verifyToken, authJwt.isAdmin], getOrders);

router.get(
  "/search/:query/:page",
  [authJwt.verifyToken, authJwt.isAdmin],
  getOrdersBySearch
);

router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], getOrder);

module.exports = router;
