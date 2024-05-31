const jwt = require("jsonwebtoken");
const User = require("../models/User");

verifyToken = (req, res, next) => {
  let accesstoken = req.headers["Authorization"];

  if (!accesstoken?.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No token provided!" });
  }

  const accessTokenParts = accesstoken.split(" ");
  const token = accessTokenParts[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).json({ err });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({ message: "Require Admin Role!" });
      return;
    }

    next();
    return;
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
};

module.exports = authJwt;
