const {
  addProduct,
  getAllProducts,
  getProductsByCat,
  getProductsByBestSeller,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product.controller");
const authJwt = require("../middlewares/authjwt");

const router = require("express").Router();

router.post("/add", [authJwt.verifyToken, authJwt.isAdmin], addProduct);

router.get("/all/:page", getAllProducts);

router.get("/category/:category/:page", getProductsByCat);

router.get("/best-sellers/:page", getProductsByBestSeller);

router.get("/:id", getProduct);

router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], updateProduct);

router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], deleteProduct);

module.exports = router;
