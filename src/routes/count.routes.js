const { getCount } = require("../controller/count.controller");
const authJwt = require("../middlewares/authjwt");

const router = require("express").Router();

router.get("/dashboard", [authJwt.verifyToken, authJwt.isAdmin], getCount);

module.exports = router;
