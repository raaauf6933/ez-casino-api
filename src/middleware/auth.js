const jwt = require("jsonwebtoken");
const { api_reponse, api_error_code } = require("./../common/messages");
const { returnError } = require("./../common/returnResponse");
const { permissionExceptions } = require("../utils/exception");
require("dotenv").config();

const jwtSecretKey = process.env.jwtPrivateKey;

module.exports = (req, res, next) => {
  const usertypes = req?.usertypes;
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    req.user = decoded;

    if (usertypes && !usertypes.includes(decoded.usertype)) {
      throw new permissionExceptions(
        400,
        "PERMISSION",
        api_reponse.NO_PERMISSION
      );
    }

    next();
  } catch (ex) {
    if (ex instanceof permissionExceptions) {
      returnError(res, 400, "PERMISSION", api_reponse.NO_PERMISSION);
    } else {
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
  }
};
