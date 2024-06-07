const {
  addProduct,
  getAllProducts,
  getProductsByCat,
  getProductsByBestSeller,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByWholeSale,
  getProductsBySearch,
} = require("../controller/product.controller");
const authJwt = require("../middlewares/authJwt");

const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/add",
  [authJwt.verifyToken, authJwt.isAdmin],
  upload.single("uploadedFile"),
  addProduct
);

router.get("/all/:page", getAllProducts);

router.get("/category/:category/:page", getProductsByCat);

router.get("/best-sellers/:page", getProductsByBestSeller);

router.get("/whole-sale/:page", getProductsByWholeSale);

router.get("/search/:query/:page", getProductsBySearch);

router.get("/:id", getProduct);

router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], updateProduct);

router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], deleteProduct);

module.exports = router;
