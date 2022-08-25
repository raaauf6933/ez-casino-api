const db = require("./../../../models");
const ClubPayoutBatches = db.clubPayoutBatches;
const Joi = require("joi");
const { statusType } = require("../../enum");
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

const UpdateClubBatchPayout = async (req, res) => {
  const { id, status } = req.body;

  try {
    Payloadvalidator(req.body);

    const result = await ClubPayoutBatches.update(
      {
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = UpdateClubBatchPayout;
