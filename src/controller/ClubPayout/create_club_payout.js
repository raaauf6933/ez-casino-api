const db = require("../../../models");
const { exceptions } = require("../../utils/exception");
const Club = db.club;
const ClubBatchPayout = db.clubPayoutBatches;
const ClubPayouts = db.clubPayouts;
const ClubSettlement = db.clubSettlement;

const getClubId = async (club_game_id) => {
  const result = await Club.findOne({
    attributes: ["id", "admin_rate"],
    where: {
      club_game_id,
    },
  });

  return result;
};

const getTotalClubFee = (forClubPayouts) => {
  this.total = 0;
  for (const clubData of forClubPayouts) {
    this.total += clubData.amount;
  }
  return this.total;
};

const CreateClubPayout = async (req, res) => {
  const { payouts } = req.body;

  try {
    let forClubPayouts = [];

    for (let club_data of payouts) {
      const club = await getClubId(club_data.club_id);
      let club_payout = {
        club_id: club.toJSON().id,
        amount: parseFloat(club_data.club_earn),
        status: "PENDING",
      };
      forClubPayouts.push(club_payout);
    }

    const total_club_fee = getTotalClubFee(forClubPayouts);

    const club_payout_batch = {
      total_club_fee: parseFloat(total_club_fee),
      status: "ONGOING",
      added_by: req.user._id,
    };

    const batchResult = await ClubBatchPayout.create(club_payout_batch);

    for await (const club of forClubPayouts) {
      club.club_payout_batch_id = batchResult.id;
    }

    await ClubPayouts.bulkCreate(forClubPayouts);
    console.log("success club payout");

    // Create New Club Settlement
    let club_settlement = [];
    for await (let club_data of payouts) {
      const club = await getClubId(club_data.club_id);

      const new_club_settlement = {
        club_id: club.toJSON().id,
        union_fee: parseFloat(
          club_data.club_earn * (club.toJSON().admin_rate / 100)
        ),
        union_rate: club.toJSON().admin_rate,
        club_earn: parseFloat(club_data.club_earn),
      };

      club_settlement.push(new_club_settlement);
    }

    await ClubSettlement.bulkCreate(club_settlement);

    res.send({ success: true });
  } catch (error) {
    if (error instanceof exceptions) {
      res.status(400).send({
        code: error.code,
        error: error.error,
        message: error.message,
      });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
};

module.exports = CreateClubPayout;
