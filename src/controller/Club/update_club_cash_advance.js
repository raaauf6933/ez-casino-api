const Joi = require("joi");
const db = require("./../../../models");
const ClubCashAdvances = db.clubCashAdvance;

const Payloadvalidator = (body) => {
  const formBody = body;
  const schema = Joi.object({
    id: Joi.number().required(),
    status: Joi.string().valid("APPROVED", "REJECTED").required(),
  });

  const { error } = schema.validate(formBody);

  if (error) {
    throw Error(error.details[0].message);
  }
};

const UpdateClubCashAdvance = async (req, res) => {
  const { id, status } = req.body;

  try {
    Payloadvalidator(req.body);

    const result = await ClubCashAdvances.update(
      {
        status,
      },
      {
        where: {
          id,
        },
      }
    );

    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = UpdateClubCashAdvance;
