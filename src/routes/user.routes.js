const { getUser, getUsers } = require("../controller/user.controller");
const authJwt = require("../middlewares/authjwt");

const router = require("express").Router();

router.get("/all/:page", [authJwt.verifyToken, authJwt.isAdmin], getUsers);

router.get("/:userId", [authJwt.verifyToken, authJwt.isAdmin], getUser);

module.exports = router;
