const db = require("../../../models");
const _ = require("lodash");
const { userTypes } = require("./../../enum");
// const { api_reponse } = require("../../common/messages");
const { returnList } = require("../../common/returnResponse");
const Agent = db.agent;
const Club = db.club;

const getAgents = async (req, res) => {
  const user = req.user;

  Agent.belongsTo(Club, {
    foreignKey: "club_id",
  });

  const getAgentsParams = () => {
    if (user.usertype === userTypes.AGENT) {
      return {
        where: {
          club_id: user?.club_id,
          added_by_id: user?._id,
          added_by_usertype: user?.usertype,
        },
      };
    } else {
      // CLUB ADMIN
      if (user?.club_id) {
        return {
          where: {
            club_id: user?.club_id,
          },
        };

        // SUPER ADMIN
      } else {
        return;
      }
    }
  };

  try {
    // if (![userTypes.AGENT, userTypes.CLUB_ADMIN].includes(user.usertype)) {
    //   throw Error(api_reponse.NO_PERMISSION);
    // }

    const result = await Agent.findAll({ ...getAgentsParams(), include: Club });

    const filterResult = result
      ? result.map((e) => _.omit(e.toJSON(), ["password"]))
      : [];

    res.send(returnList(filterResult));
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

module.exports = getAgents;
