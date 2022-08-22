const db = require("../../../models");
const ClubPayouts = db.clubPayouts;

const GetClubPayoutDetails = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await ClubPayouts.findAll({
      where: {
        club_payout_batch_id: id,
      },
    });

    res.send({
      club_payout_details: result,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = GetClubPayoutDetails;
