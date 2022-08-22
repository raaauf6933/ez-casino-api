const db = require("../../../models");
const { returnList } = require("../../common/returnResponse");
const Users = db.users;
const ClubPayouts = db.clubPayouts;
const ClubPayoutBatches = db.clubPayoutBatches;

const GetClubPayoutBatches = async (req, res) => {
  ClubPayoutBatches.hasMany(ClubPayouts, {
    foreignKey: "club_payout_batch_id",
  });

  ClubPayoutBatches.belongsTo(Users, {
    foreignKey: "added_by",
  });

  try {
    const result = await ClubPayoutBatches.findAll({
      attributes: { exclude: ["added_by"] },
      include: [
        {
          model: ClubPayouts,
        },
        {
          attributes: ["id", "first_name", "last_name"],
          model: Users,
        },
      ],
    });

    const payouts = result.map((e) => e.toJSON());

    res.send(returnList(payouts));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = GetClubPayoutBatches;
