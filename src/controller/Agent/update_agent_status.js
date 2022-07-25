const db = require("../../../models");
const { returnError } = require("../../common/returnResponse");
const Joi = require("joi");
const Agent = db.agent;

const Payloadvalidator = (body) => {
  const formBody = body;
  const schema = Joi.object({
    status: Joi.string().required(),
    id: Joi.number().required(),
  });

  const { error } = schema.validate(formBody);

  if (error) {
    throw Error(error.details[0].message);
  }
};

const UpdateAgentStatus = async (req, res) => {
  const agent = req.body;

  try {
    Payloadvalidator(agent);

    await Agent.update(
      {
        status: agent.status,
      },
      {
        where: {
          id: agent.id,
        },
      }
    );

    res.send({ success: true });
  } catch (error) {
    returnError(res, 400, "ERROR", error.message);
  }
};

module.exports = UpdateAgentStatus;
