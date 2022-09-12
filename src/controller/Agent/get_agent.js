const db = require("../../../models");
const _ = require("lodash");
const { api_reponse } = require("../../common/messages");
const { Op } = require("sequelize");
const { userTypes } = require("../../enum");
const Agent = db.agent;
const Clubs = db.club;
const Users = db.users;

const getAgent = async (req, res) => {
  const user = req.user;
  const params = req.query;

  Agent.belongsTo(Clubs, {
    foreignKey: "club_id",
  });

  Agent.belongsTo(Users, {
    foreignKey: "added_by_id",
  });

  try {
    const result = await Agent.findByPk(params.id, {
      include: [Clubs, Users],
    });
    if (!result) throw Error("Agent not found!");

    const subAgentsResult = await Agent.findAll({
      attributes: [
        "id",
        "game_code",
        "first_name",
        "last_name",
        "username",
        "email",
        "contact_number",
        "status",
      ],
      where: {
        added_by_id: params.id,
        added_by_usertype: "AGENT",
        status: {
          [Op.not]: "DELETED",
        },
      },
    });

    let added_by = {};

    const parseResult = await result.toJSON();
    if (
      user.usertype === userTypes.AGENT &&
      user._id !== parseResult.added_by_id
    ) {
      throw Error(api_reponse.NO_PERMISSION);
    } else if (
      user.usertype === userTypes.CLUB_ADMIN &&
      parseResult.club_id !== user.club_id
    ) {
      throw Error(api_reponse.NO_PERMISSION);
    }

    if (result.toJSON().added_by_usertype === userTypes.AGENT) {
      const resultUpperAgent = await Agent.findByPk(
        result.toJSON().added_by_id
      );
      added_by.id = resultUpperAgent.toJSON().id;
      added_by.name = `${resultUpperAgent.toJSON().first_name} ${
        resultUpperAgent.toJSON().last_name
      }`;
      added_by.game_id = resultUpperAgent.toJSON().game_code;
    } else {
      added_by.id = result.toJSON().user.id;
      added_by.name = `${result.toJSON().user.first_name} ${
        result.toJSON().user.last_name
      }`;
    }

    res.send(
      _.omit({ ...result.toJSON(), added_by, sub_agents: subAgentsResult }, [
        "password",
        "user",
      ])
    );
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = getAgent;
