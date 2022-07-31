const db = require("../../../models");
const _ = require("lodash");
const { userTypes } = require("./../../enum");
// const { api_reponse } = require("../../common/messages");
const { returnList } = require("../../common/returnResponse");
const { Op } = require("sequelize");
const Agent = db.agent;
const Club = db.club;

const getAgents = async (req, res) => {
  const user = req.user;
  const params = req.query;

  Agent.belongsTo(Club, {
    foreignKey: "club_id",
  });

  const getStatus = () => {
    if (params.status) {
      return { status: params.status };
    } else {
      return {};
    }
  };

  const searchId = () => {
    if (params.search) {
      return {
        game_code: {
          [Op.like]: "%" + params.search + "%",
        },
      };
    } else {
      return {};
    }
  };

  const getAgentsParams = () => {
    if (user.usertype === userTypes.AGENT) {
      return {
        where: {
          club_id: user?.club_id,
          added_by_id: user?._id,
          added_by_usertype: user?.usertype,
          ...searchId(),
          ...getStatus(),
        },
      };
    } else {
      // CLUB ADMIN
      if (user?.club_id) {
        return {
          where: {
            club_id: user?.club_id,
            ...getStatus(),
            ...searchId(),
          },
        };

        // SUPER ADMIN
      } else {
        return {
          where: {
            ...searchId(),
            ...getStatus(),
          },
        };
      }
    }
  };

  try {
    // if (![userTypes.AGENT, userTypes.CLUB_ADMIN].includes(user.usertype)) {
    //   throw Error(api_reponse.NO_PERMISSION);
    // }

    const result = await Agent.findAll({ ...getAgentsParams(), include: Club });

    const filterResult = result
      ? result
          .map((e) => _.omit(e.toJSON(), ["password"]))
          .filter((e) => e.status !== "DELETED")
      : [];

    res.send(returnList(filterResult));
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

module.exports = getAgents;
