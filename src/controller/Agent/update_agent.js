const Joi = require("joi");
// const { returnError } = require("../../common/returnResponse");
// const { exceptions } = require("../../utils/exception");
const db = require("../../../models");
const ValidateAgentId = require("../../helpers/validate_agent_id");
const Agent = db.agent;

const Payloadvalidator = (body) => {
  const formBody = body;
  const schema = Joi.object({
    id: Joi.number().required(),
    update_game_id: Joi.boolean().required(),
    game_id: Joi.any().when("update_game_id", {
      is: true,
      then: Joi.string().min(6).max(255).required(),
      otherwise: Joi.string().min(6).max(255).allow(""),
    }),
    comms_rate: Joi.number().required(),
  });

  const { error } = schema.validate(formBody);

  if (error) {
    throw Error(error.details[0].message);
  }
};

const ValidateIfGameIdUsed = async (game_id) => {
  try {
    const result = await Agent.findOne({
      where: {
        game_code: game_id,
      },
    });

    if (result) {
      throw Error("Game ID already used");
    }
  } catch (error) {
    return error;
  }
};

const UpdateAgent = async (req, res) => {
  const data = req.body;
  try {
    Payloadvalidator(data);
    const error = await ValidateAgentId(data.id);
    if (error) {
      throw error;
    }

    if (data.update_game_id) {
      const error = await ValidateIfGameIdUsed(data.game_id);
      if (error) {
        throw error;
      }
      await Agent.update(
        { game_code: data.game_id, comms_rate: data.comms_rate },
        {
          where: {
            id: data.id,
          },
        }
      );
    } else {
      await Agent.update(
        { comms_rate: data.comms_rate },
        {
          where: {
            id: data.id,
          },
        }
      );
    }

    res.send(data);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = UpdateAgent;
