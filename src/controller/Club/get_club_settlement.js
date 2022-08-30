const moment = require("moment-timezone");
const { Op } = require("sequelize");
const db = require("./../../../models");
const ClubSettlement = db.clubSettlement;
const ClubCashAdvances = db.clubCashAdvance;
const ClubPayoutBatches = db.clubPayoutBatches;

const GetClubSettlement = async (req, res) => {
  const { id } = req.query;
  try {
    let currentDate = moment();

    ClubSettlement.belongsTo(ClubPayoutBatches, {
      foreignKey: "club_payout_batch_id",
    });

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

    // const clubEarn = await ClubSettlement.findAll({
    //   where: {
    //     club_id: id,
    //     createdAt: {
    //       [Op.gte]: currentDate.clone().startOf("isoWeek").toDate(),
    //     },
    //   },
    // });

    const club_advances = await ClubCashAdvances.findAll({
      where: {
        club_id: id,
        status: "APPROVED",
        createdAt: {
          [Op.gte]: currentDate.clone().startOf("isoWeek").toDate(),
        },
      },
    });

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

    let club_settlement = {
      club_earn: getClubEarn(),
      union_fee: getUnion(),
      cash_advance: 0,
      expenses: 0,
      total_club_earn: getClubEarn() - getUnion() - getClubCashAdvances(),
      start_date: currentDate.clone().startOf("isoWeek"),
      end_date: currentDate,
    };

    res.send({ club_settlement });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = GetClubSettlement;
