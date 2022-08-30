const { returnList } = require("../../common/returnResponse");
const db = require("./../../../models");
const ClubPayouts = db.clubPayouts;
const ClubPayoutBatches = db.clubPayoutBatches;
const ClubCashAdvances = db.clubCashAdvance;

const GetClubTransactions = async (req, res) => {
  const { id } = req.query;

  ClubPayouts.belongsTo(ClubPayoutBatches, {
    foreignKey: "club_payout_batch_id",
  });

  try {
    let my_transactions = [];
    const club_payot_result = await ClubPayouts.findAll({
      include: {
        model: ClubPayoutBatches,
      },
      where: {
        club_id: id,
      },
    });

    const club_cash_advances = await ClubCashAdvances.findAll({
      where: {
        club_id: id,
      },
    });

    if (club_payot_result.length !== 0) {
      for (const payout of club_payot_result) {
        if (
          !["ONGOING", "CANCELLED"].includes(payout.club_payout_batch.status)
        ) {
          my_transactions.push({
            id: payout.id,
            amount: payout.amount,
            status: payout.status,
            createdAt: payout.createdAt,
            updatedAt: payout.updatedAt,
            type: "PAYOUT",
          });
        }
      }
    }

    if (club_cash_advances.length !== 0) {
      for (const cash_advances of club_cash_advances) {
        my_transactions.push({
          id: cash_advances.id,
          amount: cash_advances.amount,
          status: cash_advances.status,
          createdAt: cash_advances.createdAt,
          updatedAt: cash_advances.updatedAt,
          type: "CASH_ADVANCE",
        });
      }
    }

    res.send(returnList(my_transactions.reverse()));
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = GetClubTransactions;
