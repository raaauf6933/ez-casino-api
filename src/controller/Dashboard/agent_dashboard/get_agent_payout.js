const Joi = require("joi");
const ValidateAgentId = require("./../../../helpers/validate_agent_id");
const { statusType } = require("./../../../enum");
const db = require("./../../../../models");
const Agent = db.agent;
const AgentPayouts = db.agentPayout;
const AgentSubAgentPayout = db.agentSubAgentPayout;
const AgentPayoutBatch = db.payOutBatch;
const { COMPLETED } = statusType;

const Payloadvalidator = (body) => {
  const formBody = body;
  const schema = Joi.object({
    id: Joi.number().min(1).max(255).required().messages({
      "any.required": `"id" is required in GET params`,
    }),
  });

  const { error } = schema.validate(formBody);

  if (error) {
    throw Error(error.details[0].message);
  }
};

const GetAgentPayout = async (req, res) => {
  const body = req.query;

  AgentPayouts.belongsTo(AgentPayoutBatch, {
    foreignKey: "payout_batch_id",
  });

  AgentPayouts.hasMany(AgentSubAgentPayout, {
    foreignKey: "agent_payout_id",
  });

  AgentSubAgentPayout.belongsTo(Agent, {
    foreignKey: "agent_id",
  });

  try {
    Payloadvalidator(body);
    const error = await ValidateAgentId(body.id);
    if (error) {
      throw error;
    }

    const result = await AgentPayouts.findAll({
      where: {
        agent_id: body.id,
      },
      include: [
        {
          model: AgentSubAgentPayout,
          include: {
            model: Agent,
            attributes: ["id", "game_code", "first_name", "last_name"],
          },
        },
        {
          model: AgentPayoutBatch,
          attributes: ["id", "status"],
          where: {
            status: COMPLETED,
          },
        },
      ],
    });

    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = GetAgentPayout;
