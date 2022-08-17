const Joi = require("joi");
const { statusType } = require("../../enum");
const db = require("../../../models");
const AgentPayoutBatches = db.payOutBatch;
const { COMPLETED, CANCELLED } = statusType;

const Payloadvalidator = (body) => {
  const formBody = body;
  const schema = Joi.object({
    status: Joi.string().valid(COMPLETED, CANCELLED).required(),
    id: Joi.number().required(),
  });

  const { error } = schema.validate(formBody);

  if (error) {
    throw Error(error.details[0].message);
  }
};

const UpdateAgentPayoutBatch = async (req, res) => {
  const params = req.body;

  try {
    Payloadvalidator(params);

    const agentPayoutBatch = await AgentPayoutBatches.findOne({
      where: {
        id: params.id,
      },
    });

    if (!agentPayoutBatch) {
      throw Error("ID not found");
    }

    await AgentPayoutBatches.update(
      {
        status: params.status,
      },
      {
        where: {
          id: params.id,
        },
      }
    );

    res.send({
      message: "Agent Payout Batch Updated",
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = UpdateAgentPayoutBatch;
