const {
  addToCart,
  getUserCarts,
  deleteFromCart,
  deleteUserCart,
} = require("../controller/cart.controller");
const authJwt = require("../middlewares/authjwt");

const router = require("express").Router();

router.post("/add", [authJwt.verifyToken], addToCart);

router.get("/:userId", [authJwt.verifyToken], getUserCarts);

router.delete("/:id", [authJwt.verifyToken], deleteFromCart);

router.delete("/user/:userId", [authJwt.verifyToken], deleteUserCart);

module.exports = router;
