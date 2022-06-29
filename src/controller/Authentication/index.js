const db = require("../../../models");
const bcrypt = require("bcrypt");
const Users = db.users;
const Agent = db.agent;
const { generateAuthToken } = require("./../../utils/generateToken");
const { userTypes } = require("./../../enum");

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

      if (!validUserPassword) throw Error("Invalid Username or Password");

      const token = generateAuthToken({
        _id: resultUser.id,
        club_id: resultUser.club_id,
        usertype: resultUser.usertype,
        username: resultUser.username,
        first_name: resultUser.first_name,
        last_name: resultUser.last_name,
      });

      res.status(200).send({
        token,
      });
    } else {
      const resultAgent = await Agent.findOne({
        where: { username: user.username },
      });

      if (!resultAgent) {
        throw Error("Invalid Username or Password");
      }

      const validAgentPassword = await bcrypt.compare(
        user.password,
        resultAgent?.password
      );

      if (!validAgentPassword) throw Error("Invalid Username or Password");

      const token = generateAuthToken({
        _id: resultAgent.id,
        club_id: resultAgent.club_id,
        usertype: userTypes.AGENT,
        username: resultAgent.username,
        first_name: resultAgent.first_name,
        last_name: resultAgent.last_name,
      });

      res.status(200).send({ token });
    }

    // return if username is not exist
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = {
  login,
};
