const {
  getUser,
  getUsers,
  getUsersBySearch,
} = require("../controller/user.controller");
const authJwt = require("../middlewares/authjwt");

const router = require("express").Router();

router.get("/all/:page", [authJwt.verifyToken, authJwt.isAdmin], getUsers);

router.get("/:userId", [authJwt.verifyToken, authJwt.isAdmin], getUser);

router.get(
  "/search/:query/:page",
  [authJwt.verifyToken, authJwt.isAdmin],
  getUsersBySearch
);

module.exports = router;
