const db = require("../../../models");
const { userTypes } = require("./../../enum");
const { api_reponse } = require("../../common/messages");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Agent = db.agent;

const createAgent = async (req, res) => {
  const user = req.user;
  const agent = req.body;

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(agent.game_code, salt);

  const new_agent = {
    ...agent,
    club_id: user.club_id,
    added_by_id: user._id,
    added_by_usertype: user.usertype,
    password,
  };

  try {
    if (![userTypes.AGENT, userTypes.CLUB_ADMIN].includes(user.usertype)) {
      throw Error(api_reponse.NO_PERMISSION);
    }

    const result = await Agent.create(new_agent);

    res.send(
      _.pick(
        result,
        "id",
        "username",
        "first_name",
        "last_name",
        "contact_number",
        "email",
        "status",
        "createdAt",
        "updatedAt"
      )
    );
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = createAgent;
