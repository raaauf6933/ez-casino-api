const db = require("../../../models");
const Payout = db.payOutBatch;
const AgentPayout = db.agentPayout;
const Agent = db.agent;
const AgentSubAgentPayout = db.agentSubAgentPayout;
const { Op } = require("sequelize");

const GetPayoutDetaills = async (req, res) => {
  const { id, search } = req.query;

  Payout.hasMany(AgentPayout, {
    foreignKey: "payout_batch_id",
  });

  AgentPayout.belongsTo(Agent, {
    foreignKey: "agent_id",
  });

  AgentPayout.hasMany(AgentSubAgentPayout, {
    foreignKey: "agent_payout_id",
  });

  AgentSubAgentPayout.belongsTo(Agent, {
    foreignKey: "agent_id",
  });

  try {
    if (!id) {
      throw Error("ID is required");
    }

    let agentWhereStatement = {};
    if (search)
      agentWhereStatement.game_code = {
        [Op.like]: "%" + search + "%",
      };

    const result = await Payout.findOne({
      include: {
        model: AgentPayout,
        include: [
          {
            model: Agent,
            attributes: ["id", "game_code", "first_name", "last_name"],
            where: agentWhereStatement,
          },
          {
            model: AgentSubAgentPayout,
            include: {
              model: Agent,
              attributes: ["id", "game_code", "first_name", "last_name"],
            },
          },
        ],
      },
      where: {
        id,
      },
    });
    if (!result) {
      throw Error("Payout not found");
    }

    res.send({ payout: result.toJSON() });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
};

module.exports = GetPayoutDetaills;
