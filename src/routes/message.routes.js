const {
  addMessage,
  getMessages,
  getMessage,
} = require("../controller/message.controller");
const authJwt = require("../middlewares/authJwt");

const router = require("express").Router();

router.post("/add", addMessage);

router.get("/all/:page", [authJwt.verifyToken, authJwt.isAdmin], getMessages);

router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], getMessage);

module.exports = router;
