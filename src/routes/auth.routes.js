const router = require("express").Router();
const { signup, signin } = require("../controller/auth.controller");

// To signup a user
router.post("/signup", signup);

// To login a user
router.post("/signin", signin);

module.exports = router;
