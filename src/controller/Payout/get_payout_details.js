const db = require("../../../models");
const Payout = db.payOutBatch;
const AgentPayout = db.agentPayout;
const Agent = db.agent;

const GetPayoutDetaills = async (req, res) => {
  const { id } = req.query;

  Payout.hasMany(AgentPayout, {
    foreignKey: "payout_batch_id",
  });

  AgentPayout.belongsTo(Agent, {
    foreignKey: "agent_id",
  });

  try {
    if (!id) {
      throw Error("ID is required");
    }

    const result = await Payout.findOne({
      include: {
        model: AgentPayout,
        include: [
          {
            model: Agent,
            attributes: ["id", "game_code", "first_name", "last_name"],
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
