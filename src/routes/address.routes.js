const {
  addAddress,
  updateAddress,
  getUserAddress,
} = require("../controller/address.controller");
const authJwt = require("../middlewares/authjwt");

const router = require("express").Router();

router.post("/add", [authJwt.verifyToken], addAddress);

router.put("/:id", [authJwt.verifyToken], updateAddress);

router.get("/:userId", [authJwt.verifyToken], getUserAddress);

module.exports = router;
