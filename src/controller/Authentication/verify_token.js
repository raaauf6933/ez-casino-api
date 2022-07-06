const jwt = require("jsonwebtoken");
const { api_reponse, api_error_code } = require("./../../common/messages");
const { returnError } = require("./../../common/returnResponse");
require("dotenv").config();

const TOKEN_KEY = process.env.jwtPrivateKey;

const VerifyToken = async (req, res) => {
  const token = req.body.token;

  if (!token)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });

  try {
    jwt.verify(token, TOKEN_KEY);

    res.send({ token });
  } catch (ex) {
    if (ex instanceof jwt.TokenExpiredError) {
      returnError(
        res,
        400,
        api_error_code.TOKEN_EXPIRED,
        api_reponse.TOKEN_EXPIRED
      );
    } else {
      returnError(
        res,
        400,
        api_error_code.INVALID_TOKEN,
        api_reponse.INVALID_TOKEN
      );
    }
  }
};

module.exports = VerifyToken;
