const User = require("../models/User");
const Confirmation = require("../models/Confirmation");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const sendMail = require("../middlewares/SendMail");
const mongoose = require("mongoose");

exports.signup = async (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: "user",
    password: bcrypt.hashSync(req.body.password, 8),
  });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await newUser.save({ session });

    const newCon = new Confirmation({
      type: "email-validation",
      userId: user._id,
    });

    const confirmation = await newCon.save({ session });

    await sendMail.sendVerificationEmail(
      req.body.firstName,
      confirmation.token.toString(),
      req.body.email
    );

    await session.commitTransaction();
    res.status(200).json({
      message: "Signup Successful",
    });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    res.status(500).json(err);
  }
};

exports.emailVerification = async (req, res) => {
  try {
    const confirmation = await Confirmation.findOne({
      token: req.params.token,
      type: "email-validation",
    });

    if (!confirmation) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findByIdAndUpdate(
      { _id: confirmation.userId },
      {
        $set: { isLocked: false },
      },
      { new: true }
    );

    if (!user) {
      res
        .status(404)
        .json({ message: "User not found, email verification failed" });
    }

    await Confirmation.deleteOne({
      token: req.params.token,
    });

    res.status(200).json({ message: "Email verification successfull" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    if (user.isLocked) {
      return res.status(423).json({ message: "Verify email to login" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.SECRET_KEY,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    res.status(200).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.role,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({ message: "email not found" });
    }

    const newCon = new Confirmation({
      type: "reset-password",
      userId: user._id,
    });

    const confirmation = await newCon.save();

    await sendMail.sendForgotPasswordEmail(
      user.firstName,
      confirmation.token.toString(),
      user.email
    );

    res.status(200).json({
      message: "Forgot Password Initaited Successful",
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.resetPassordFromForgot = async (req, res) => {
  try {
    const confirmation = await Confirmation.findOne({
      token: req.body.token,
      type: "reset-password",
    });

    if (!confirmation) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!req.body.newPassword) {
      return res.status(500).json({ message: "New Password is required" });
    }

    const user = await User.findByIdAndUpdate(
      { _id: confirmation.userId },
      {
        $set: { password: bcrypt.hashSync(req.body.newPassword, 8) },
      },
      { new: true }
    );

    if (!user) {
      res
        .status(404)
        .json({ message: "User not found, password reset failed" });
    }

    await Confirmation.deleteOne({
      token: req.body.token,
    });

    res.status(200).json({ message: "Reset Password successfull" });
  } catch (err) {
    res.status(500).json(err);
  }
};
