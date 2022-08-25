const db = require("../../../models");
const ClubPayouts = db.clubPayouts;
const ClubPayoutBatches = db.clubPayoutBatches;
const Club = db.club;

const GetClubPayoutDetails = async (req, res) => {
  const { id } = req.query;

  ClubPayoutBatches.hasMany(ClubPayouts, {
    foreignKey: "club_payout_batch_id",
  });

  ClubPayouts.belongsTo(Club, {
    foreignKey: "club_id",
  });

  try {
    const result = await ClubPayoutBatches.findAll({
      include: {
        model: ClubPayouts,
        include: {
          model: Club,
          attributes: ["id", "club_game_id", "club_name"],
        },
      },
      where: {
        id,
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
