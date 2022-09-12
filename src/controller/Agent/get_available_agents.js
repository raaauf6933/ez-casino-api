const { Op } = require("sequelize");
const { returnList } = require("./../../common/returnResponse");
const db = require("./../../../models");
const Agents = db.agent;

const GetAvailableAgents = async (req, res) => {
  const { id } = req.query;

  try {
    if (!id) {
      throw Error("ID is required");
    }

    const agent_result = await Agents.findAll({
      attributes: ["id", "game_code", "first_name", "last_name"],
      where: {
        id: {
          [Op.ne]: id,
        },
        added_by_id: {
          [Op.ne]: id,
        },
      },
    });

    res.send(
      returnList(
        agent_result.sort((a, b) => {
          return parseInt(a.game_code) - parseInt(b.game_code);
        })
      )
    );
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = GetAvailableAgents;
