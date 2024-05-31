const User = require("../models/User");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: "user",
    password: bcrypt.hashSync(req.body.password, 8),
  });

  try {
    const user = await newUser.save();
    res
      .status(201)
      .json({ message: "User was registered successfully!", success: true });
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
