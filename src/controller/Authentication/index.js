const db = require("../../../models");
const bcrypt = require("bcrypt");
const Users = db.users;
const Agent = db.agent;
const { generateAuthToken } = require("./../../utils/generateToken");
const { userTypes, statusType } = require("./../../enum");
const { exceptions } = require("../../utils/exception");

const login = async (req, res) => {
  const user = req.body;

  try {
    const resultUser = await Users.findOne({
      where: { username: user.username },
    });

    if (resultUser) {
      // compare password if valid
      const validUserPassword = await bcrypt.compare(
        user.password,
        resultUser.password
      );

      if (!validUserPassword)
        throw new exceptions(
          false,
          "INVALID_USER",
          "",
          "Invalid Username or Password"
        );

      if (resultUser.status !== statusType.ACTIVE) {
        throw new exceptions(
          false,
          "USER_INACTIVE",
          "",
          "Account status is In-Active"
        );
      }

      const token = generateAuthToken({
        _id: resultUser.id,
        club_id: resultUser.club_id,
        usertype: resultUser.usertype,
        username: resultUser.username,
        first_name: resultUser.first_name,
        last_name: resultUser.last_name,
      });

      res.status(200).send({
        token: token.token,
        refreshToken: token.crfToken,
      });
    } else {
      const resultAgent = await Agent.findOne({
        where: { username: user.username },
      });

      if (!resultAgent) {
        throw new exceptions(
          false,
          "INVALID_USER",
          "",
          "Invalid Username or Password"
        );
      }

      const validAgentPassword = await bcrypt.compare(
        user.password,
        resultAgent?.password
      );

      if (!validAgentPassword)
        throw new exceptions(
          false,
          "INVALID_USER",
          "",
          "Invalid Username or Password"
        );

      if (
        [statusType.FOR_APPROVAL, statusType.INACTIVE].includes(
          resultAgent.status
        )
      ) {
        throw new exceptions(
          false,
          "USER_INACTIVE",
          "",
          "Account status is either For Approval or In-Active"
        );
      }

      if (
        resultAgent.status === statusType.REJECT ||
        resultAgent.status === statusType.DELETED
      ) {
        throw new exceptions(
          false,
          "INVALID_USER",
          "",
          "Invalid Username or Password"
        );
      }

      const token = generateAuthToken({
        _id: resultAgent.id,
        club_id: resultAgent.club_id,
        usertype: userTypes.AGENT,
        username: resultAgent.username,
        first_name: resultAgent.first_name,
        last_name: resultAgent.last_name,
      });

      res
        .status(200)
        .send({ token: token.token, refreshToken: token.crfToken });
    }

    // return if username is not exist
  } catch (error) {
    if (error instanceof exceptions) {
      res.status(404).send({ code: error.code, message: error.message });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
};

module.exports = {
  login,
};
