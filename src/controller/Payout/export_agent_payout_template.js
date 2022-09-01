const Joi = require("joi");
const GenerateCsv = require("../../utils/generateCsv");
const db = require("./../../../models");
const Agents = db.agent;

const Payloadvalidator = (body) => {
  const formBody = body;
  const schema = Joi.object({
    club_id: Joi.number().required(),
  });

  const { error } = schema.validate(formBody);

  if (error) {
    throw Error(error.details[0].message);
  }
};

const ExportAgentPayoutTemplate = async (req, res) => {
  const { club_id } = req.body;

  try {
    Payloadvalidator(req.body);
    let data = [["game_id", "commission", "deduction", "admin_rate"]];
    const agents = await Agents.findAll({
      where: {
        club_id,
      },
    });

    for (const everyAgent of agents) {
      data.push([everyAgent.toJSON().game_code, 0, 0]);
    }

    const result = await GenerateCsv(
      data,
      "agent-payout",
      "AGENT_PAYOUT_TEMPLATES"
    );

    res.send({
      destination: result.destination,
      filename: result.filename,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = ExportAgentPayoutTemplate;
