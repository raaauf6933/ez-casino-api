const { Op } = require("sequelize");
const Joi = require("joi");
const db = require("./../../../models");
const CashAdvances = db.clubCashAdvance;
const ClubSettlement = db.clubSettlement;
const ClubCashAdvances = db.clubCashAdvance;
const ClubPayoutBatches = db.clubPayoutBatches;
const Clubs = db.club;
const moment = require("moment-timezone");

const Payloadvalidator = (body) => {
  const formBody = body;
  const schema = Joi.object({
    id: Joi.number().required(),
    amount: Joi.number().required(),
  });

  const { error } = schema.validate(formBody);

  if (error) {
    throw Error(error.details[0].message);
  }
};

const CreateClubCashAdvance = async (req, res) => {
  const { id, amount } = req.body;

  ClubSettlement.belongsTo(ClubPayoutBatches, {
    foreignKey: "club_payout_batch_id",
  });

  try {
    Payloadvalidator(req.body);
    let currentDate = moment();

    const club = await Clubs.findAll({
      where: id,
    });

    if (club.length === 0) {
      throw Error("ID not found");
    }

    const result = await ClubSettlement.findAll({
      where: {
        club_id: id,
        createdAt: {
          [Op.gte]: currentDate.clone().startOf("isoWeek").toDate(),
        },
      },
      include: {
        model: ClubPayoutBatches,
        where: {
          status: "COMPLETED",
        },
      },
    });

    const cash_advances = await CashAdvances.findAll({
      where: {
        club_id: id,
        status: "PENDING",
        createdAt: {
          [Op.gte]: currentDate.clone().startOf("isoWeek").toDate(),
        },
      },
    });

    const club_advances = await ClubCashAdvances.findAll({
      where: {
        club_id: id,
        status: "APPROVED",
        createdAt: {
          [Op.gte]: currentDate.clone().startOf("isoWeek").toDate(),
        },
      },
    });

    if (cash_advances.length > 0) {
      throw Error("You still have pending cash advance");
    }

    const getClubEarn = () => {
      this.total = 0;

      for (let club of result) {
        this.total += club.club_earn;
      }
      return this.total;
    };

    const getUnion = () => {
      this.total = 0;

      for (let club of result) {
        this.total += club.union_fee;
      }
      return this.total;
    };

    const getClubCashAdvances = () => {
      this.total = 0;

      for (let club of club_advances) {
        this.total += club.amount;
      }
      return this.total;
    };

    const total_club_earn = getClubEarn() - getUnion() - getClubCashAdvances();

    if (parseFloat(amount) > total_club_earn) {
      throw Error(
        "Cash Advance amount must be less than total remaning club earn"
      );
    }

    const resultCashAdvance = await CashAdvances.create({
      club_id: id,
      amount: parseFloat(amount),
      status: "PENDING",
    });

    res.send(resultCashAdvance);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = CreateClubCashAdvance;
