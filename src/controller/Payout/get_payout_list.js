const db = require("../../../models");
const { returnList } = require("../../common/returnResponse");
const Payout = db.payOutBatch;
const User = db.users;

const GetPayoutList = async (req, res) => {
  const user = req.user;

  Payout.belongsTo(User, {
    foreignKey: "added_by",
  });

  try {
    const result = await Payout.findAll({
      include: {
        model: User,
        attributes: ["id", "club_id", "first_name", "last_name"],
      },
      where: {
        club_id: user.club_id,
      },
    });

    const payouts = result.map((e) => e.toJSON());

    res.send(returnList(payouts));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = GetPayoutList;
