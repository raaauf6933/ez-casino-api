const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecretKey = process.env.jwtPrivateKey;

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ message: "invalid token" });
  }
};
