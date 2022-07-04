const jwt = require("jsonwebtoken");
const { api_reponse, api_error_code } = require("./../../common/messages");
const { returnError } = require("./../../common/returnResponse");
require("dotenv").config();

const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;

const VerifyToken = async (req, res) => {
  const refresh_token = req.body.refreshToken;

  if (!refresh_token)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });

  try {
    jwt.verify(refresh_token, REFRESH_TOKEN_KEY);

    res.send({ refresh_token });
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
