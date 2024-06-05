const {
  addMessage,
  getMessages,
  getMessage,
} = require("../controller/message.controller");

const router = require("express").Router();

router.post("/add", addMessage);

router.get("/all/:page", getMessages);

router.get("/:id", getMessage);

module.exports = router;
