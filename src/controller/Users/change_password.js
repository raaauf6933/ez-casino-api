const db = require("../../../models");
const { returnError } = require("../../common/returnResponse");
const { userTypes } = require("../../enum");
const Users = db.users;
const Agents = db.agent;
const bcrypt = require("bcrypt");
const { exceptions } = require("../../utils/exception");

const validatePassword = async (req, res, next) => {
  const user = req.user;
  const { oldPassword } = req.body;

  try {
    if (user?.usertype === userTypes.AGENT) {
      const resultAgent = await Agents.findOne({
        where: { id: user._id },
      });

      if (resultAgent) {
        const validAgentPassword = await bcrypt.compare(
          oldPassword,
          resultAgent.password
        );

        if (!validAgentPassword)
          throw new exceptions(
            false,
            "INVALID_PASSWORD",
            "",
            "Invalid or Password"
          );
      }
    } else {
      const resultUser = await Users.findOne({
        where: { id: user._id },
      });

      if (resultUser) {
        const validUserPassword = await bcrypt.compare(
          oldPassword,
          resultUser.password
        );

        if (!validUserPassword)
          throw new exceptions(
            false,
            "INVALID_USER",
            "",
            "Invalid Username or Password"
          );
      }
    }

    next();
  } catch (error) {
    if (error instanceof exceptions) {
      returnError(res, 400, error.code, error.message);
    } else {
      returnError(res, 400, "ERROR", error.message);
    }
  }
};

const ChangePassword = async (req, res) => {
  const user = req.user;
  const { newPassword } = req.body;

  // encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashNewPassword = await bcrypt.hash(newPassword, salt);

  try {
    if (user?.usertype === userTypes.AGENT) {
      const result = await Agents.update(
        {
          password: hashNewPassword,
        },
        {
          where: {
            id: user._id,
          },
        }
      );

      if (result.length > 0) {
        res.send({ message: "password changed" });
      }
    } else {
      const result = await Users.update(
        {
          password: hashNewPassword,
        },
        {
          where: {
            id: user._id,
          },
        }
      );

      if (result.length > 0) {
        res.send({ message: "password changed" });
      }
    }
  } catch (error) {
    returnError(res, 400, "ERROR", error.message);
  }
};

module.exports = {
  ChangePassword,
  validatePassword,
};
