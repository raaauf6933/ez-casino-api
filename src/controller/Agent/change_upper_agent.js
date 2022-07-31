const Joi = require("joi");
const { returnError } = require("../../common/returnResponse");
const { exceptions } = require("../../utils/exception");
const db = require("../../../models");
const Agent = db.agent;

const Payloadvalidator = (body) => {
  const formBody = body;
  const schema = Joi.object({
    agent: Joi.string().min(1).max(255).required(),
    subAgents: Joi.array().items(Joi.string()).min(1).required(),
  });

  const { error } = schema.validate(formBody);

  if (error) {
    throw Error(error.details[0].message);
  }
};

// validate downline agents
const ValidateSubAgents = async (body) => {
  const upperAgent = body.agent;
  const _subAgents = body.subAgents;

  for await (const subAgent of _subAgents) {
    const result = await Agent.findOne({
      where: {
        added_by_id: subAgent,
        id: upperAgent,
      },
    });

    if (result !== null) {
      return new exceptions(
        false,
        "INVALID_AGENT",
        "Upper agent cannot be assigned as sub agent to its sub agent",
        {
          game_id: result?.toJSON()?.game_code,
          name: `${result?.toJSON()?.first_name} ${
            result?.toJSON()?.last_name
          }`,
        }
      );
    }
  }
};

const ChangeUpperAgent = async (req, res) => {
  const body = req.body;
  try {
    Payloadvalidator(body);

    const error = await ValidateSubAgents(body);
    if (error) {
      throw error;
    }

    await Agent.update(
      {
        added_by_usertype: "AGENT",
        added_by_id: parseInt(body.agent),
      },
      {
        where: {
          id: body.subAgents,
        },
      }
    );

    res.send({ success: true });
  } catch (error) {
    if (error instanceof exceptions) {
      res.status(400).send(error);
    } else {
      returnError(res, 400, "INVALID", error.message);
    }
  }
};

module.exports = ChangeUpperAgent;
