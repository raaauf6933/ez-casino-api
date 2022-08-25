const { returnList } = require("../../common/returnResponse");
const db = require("./../../../models");
const ClubPayouts = db.clubPayouts;
const ClubPayoutBatches = db.clubPayoutBatches;

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

    res.send(returnList(my_transactions));
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = GetClubTransactions;
