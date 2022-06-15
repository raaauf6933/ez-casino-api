const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateAuthToken = (data) => {
  const token = jwt.sign(data, process.env.jwtPrivateKey);

  return token;
};
