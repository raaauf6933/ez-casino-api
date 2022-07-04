const jwt = require("jsonwebtoken");
require("dotenv").config();

const tokenKey = process.env.jwtPrivateKey;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;

exports.generateAuthToken = (data) => {
  const token = jwt.sign(data, tokenKey, {
    expiresIn: 9400,
  });

  const crfToken = jwt.sign(data, refreshTokenKey, {
    expiresIn: 86400,
  });

  return {
    token,
    crfToken,
  };
};
