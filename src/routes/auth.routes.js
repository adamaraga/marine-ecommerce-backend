const router = require("express").Router();
const {
  signup,
  signin,
  forgetPassword,
  emailVerification,
  resetPassordFromForgot,
} = require("../controller/auth.controller");

// To signup a user
router.post("/signup", signup);

// To login a user
router.post("/signin", signin);

// To verify email address
router.put("/email-verify/:token", emailVerification);

// To initiat forget password
router.post("/forget-password", forgetPassword);

// To reset password from forget password
router.put("/reset-password-fp", resetPassordFromForgot);

module.exports = router;
