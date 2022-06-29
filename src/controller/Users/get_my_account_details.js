const db = require("../../../models");
const { userTypes } = require("../../enum");
const _ = require("lodash");
const Users = db.users;
const Agents = db.agent;
const Club = db.club;

const getMyAccountDetails = async (req, res) => {
  const user = req.user;

  Users.belongsTo(Club, {
    foreignKey: "club_id",
  });

  Agents.belongsTo(Club, {
    foreignKey: "club_id",
  });

  Agents.belongsTo(Users, {
    foreignKey: "added_by_id",
  });

  try {
    if (user.usertype === userTypes.AGENT) {
      const result = await Agents.findByPk(user._id, {
        include: [Club, Users],
      });

      let added_by = {};

      if (result.toJSON().added_by_usertype === userTypes.AGENT) {
        const resultUpperAgent = await Agents.findByPk(
          result.toJSON().added_by_id
        );
        added_by.id = resultUpperAgent.toJSON().id;
        added_by.name = `${resultUpperAgent.toJSON().first_name} ${
          resultUpperAgent.toJSON().last_name
        }`;
      } else {
        added_by.id = result.toJSON().user.id;
        added_by.name = `${result.toJSON().user.first_name} ${
          result.toJSON().user.last_name
        }`;
      }

      res.send(_.omit({ ...result.toJSON(), added_by }, ["password", "user"]));
    } else {
      const result = await Users.findByPk(user._id, {
        include: Club,
      });

      res.send(_.omit(result.toJSON(), ["password"]));
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = getMyAccountDetails;
