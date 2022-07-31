const db = require("../../../models");
const { returnError } = require("../../common/returnResponse");
const { statusType } = require("../../enum");
const GetSubAgents = require("../../helpers/get_subAgents");
const ValidateAgentId = require("../../helpers/validate_agent_id");
const Joi = require("joi");
const Agent = db.agent;

const { ACTIVE, FOR_APPROVAL, INACTIVE, REJECT, DELETED } = statusType;

const Payloadvalidator = (body) => {
  const formBody = body;
  const schema = Joi.object({
    status: Joi.string()
      .valid(ACTIVE, FOR_APPROVAL, INACTIVE, REJECT, DELETED)
      .required(),
    id: Joi.number().required(),
  });

  const { error } = schema.validate(formBody);

  if (error) {
    throw Error(error.details[0].message);
  }
};

const UpdateDb = async (agent) => {
  const result = await Agent.update(
    {
      status: agent.status,
    },
    {
      where: {
        id: agent.id,
      },
    }
  );
  return result;
};

const UpdateAgentStatus = async (req, res) => {
  const agent = req.body;

  try {
    Payloadvalidator(agent);
    const error = await ValidateAgentId(agent.id);
    if (error) {
      throw error;
    }

    if (agent.status === DELETED) {
      const { total_count, error } = await GetSubAgents(agent.id);
      if (error) {
        throw error;
      }

      if (total_count === 0) {
        await UpdateDb(agent);
      } else {
        throw Error("Agent with Sub-agents cannot be deleted");
      }
    } else {
      await UpdateDb(agent);
    }

    res.send({ success: true, status: agent.status });
  } catch (error) {
    returnError(res, 400, "ERROR", error.message);
  }
};

module.exports = UpdateAgentStatus;
