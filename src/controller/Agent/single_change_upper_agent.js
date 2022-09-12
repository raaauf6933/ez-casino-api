const Joi = require("joi");
const db = require("../../../models");
const Agents = db.agent;

const Payloadvalidator = (body) => {
  const formBody = body;
  const schema = Joi.object({
    agent_id: Joi.number().allow(null).required(),
    transfer_to_club_admin: Joi.boolean(),
    id: Joi.number().required(),
  });

  const { error } = schema.validate(formBody);

  if (error) {
    throw Error(error.details[0].message);
  }
};

const SingleChangeUpperAgent = async (req, res) => {
  const { id, transfer_to_club_admin, agent_id } = req.body;
  const user = req.user;
  try {
    Payloadvalidator(req.body);

    if (transfer_to_club_admin) {
      await Agents.update(
        {
          added_by_id: user._id,
          added_by_usertype: "CLUB_ADMIN",
        },
        {
          where: { id },
        }
      );
      res.send({ message: "success" });
      return;
    }

    // transfer to agent
    await Agents.update(
      {
        added_by_id: agent_id,
        added_by_usertype: "AGENT",
      },
      {
        where: { id },
      }
    );

    res.send({ message: "success" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = SingleChangeUpperAgent;
